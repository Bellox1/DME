<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;

use App\Models\Connexion;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Services\TwilioService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class AuthController extends Controller
{
    public function register(Request $request)
    {
        // On formate les numéros avant la validation pour vérifier l'unicité réelle (+229 etc)
        if ($request->has('tel')) {
            $request->merge(['tel' => \App\Helpers\PhoneHelper::formatBeninTel($request->tel)]);
        }
        if ($request->has('whatsapp')) {
            $request->merge(['whatsapp' => \App\Helpers\PhoneHelper::formatBeninWhatsApp($request->whatsapp)]);
        }

        $request->validate([
            'nom' => 'required|string|max:50',
            'prenom' => 'required|string|max:50',
            'tel' => 'nullable|string|max:20|unique:utilisateurs,tel',
            'whatsapp' => 'nullable|string|max:20|unique:utilisateurs,whatsapp',
            'mot_de_passe' => 'required|string|min:6',
            'sexe' => 'required|in:Homme,Femme',
            'date_naissance' => 'nullable|date',
            'ville' => 'nullable|string|max:100',
        ], [
            'tel.unique' => 'Ce numéro de téléphone est déjà utilisé.',
            'whatsapp.unique' => 'Ce numéro WhatsApp est déjà utilisé.',
            'nom.required' => 'Le nom est obligatoire.',
            'prenom.required' => 'Le prénom est obligatoire.',
            'mot_de_passe.min' => 'Le mot de passe doit faire au moins 6 caractères.',
            'sexe.required' => 'Le sexe est obligatoire.',
        ]);

        if (empty($request->tel) && empty($request->whatsapp)) {
            return response()->json(['error' => 'Le numéro de téléphone ou WhatsApp est requis.'], 422);
        }

        try {
            DB::beginTransaction();

            $tel = $request->tel;
            $whatsapp = $request->whatsapp;

            // 1. Création Utilisateur
            $user = Utilisateur::create([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'tel' => $tel,
                'whatsapp' => $whatsapp,
                'mot_de_passe' => Hash::make($request->mot_de_passe),
                'sexe' => $request->sexe,
                'role' => 'patient',
                'date_naissance' => $request->date_naissance,
                'ville' => $request->ville,
            ]);

            // 2. Create Patient Record
            $patient = Patient::create([
                'utilisateur_id' => $user->id,
            ]);

            // 3. Mark as first connection pending
            Connexion::create([
                'utilisateur_id' => $user->id,
                'premiere_connexion' => true
            ]);

            DB::commit();

            // 4. Génération du lien d'activation
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            $activationLink = rtrim($frontendUrl, '/') . "/first-login?connexion=" . ($whatsapp ?? $tel);

            // 5. Envoi des Notifications (SMS et/ou WhatsApp)
            $twilio = new \App\Services\TwilioService();
            $message = "Bienvenue sur DME.\nCliquez ici pour activer votre compte :\n$activationLink";
            $canaux = [];

            if ($whatsapp) {
                if ($twilio->sendWhatsApp($whatsapp, $message)) {
                    $canaux[] = 'WhatsApp';
                }
            }

            if ($tel) {
                if ($twilio->sendSMS($tel, $message)) {
                    $canaux[] = 'SMS';
                }
            }

            $messageRetour = "Compte créé. ";
            if (count($canaux) > 0) {
                $messageRetour .= "Message d'activation envoyé par : " . implode(' et ', $canaux) . ".";
            } else {
                $messageRetour .= "Échec de l'envoi de la notification d'activation.";
                Log::error("Impossible d'envoyer la notification Twilio pour l'utilisateur " . $user->id);
            }

            return response()->json([
                'message' => $messageRetour,
                'user' => $user,
                'patient_id' => $patient->id
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Erreur lors de l\'inscription: ' . $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required|string',
            'mot_de_passe' => 'required|string',
        ]);

        $loginStandard = \App\Helpers\PhoneHelper::formatGeneric($request->login);

        $user = Utilisateur::where('tel', $loginStandard)
            ->orWhere('whatsapp', $loginStandard)
            ->first();

        if (!$user || !Hash::check($request->mot_de_passe, $user->mot_de_passe)) {
            return response()->json(['message' => 'Identifiants ou mot de passe invalides'], 401);
        }

        $connexion = Connexion::firstOrCreate(
            ['utilisateur_id' => $user->id],
            ['premiere_connexion' => false] 
        );

        // Generate Sanctum Token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'token' => $token,
            'user' => $user,
            'premiere_connexion' => (bool) $connexion->premiere_connexion
        ]);
    }

    // Refresh token method removed as it's not needed with standard Sanctum tokens usually,
    // unless you want rotating tokens. For now, we simplified login.

    public function updatePassword(Request $request)
    {
        Log::info("Update Password Request", $request->all());

        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'login' => 'nullable|string',
            'nouveau_mot_de_passe' => 'required|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            Log::error("Validation failed", $validator->errors()->toArray());
            return response()->json(['message' => 'Données invalides', 'errors' => $validator->errors()], 422);
        }

        $user = $request->user();
        Log::info("Utilisateur de la requête : " . ($user ? $user->id : 'aucun'));

        if (!$user && $request->login) {
            $loginStandard = \App\Helpers\PhoneHelper::formatGeneric($request->login);
            $user = Utilisateur::where('tel', $loginStandard)
                ->orWhere('whatsapp', $loginStandard)
                ->first();
            Log::info("Utilisateur trouvé par login ($request->login -> $loginStandard) : " . ($user ? $user->id : 'aucun'));
        }

        if (!$user && $request->user_id) {
            $user = Utilisateur::find($request->user_id);
        }

        if (!$user) {
            Log::error("Utilisateur non trouvé");
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        // Chargement explicite de la connexion
        $connexion = Connexion::where('utilisateur_id', $user->id)->first();
        Log::info("Connexion chargée manuellement : " . json_encode($connexion));

        // Sécurité : si non authentifié, n'autoriser que si c'est la première connexion
        if (!$request->user()) {
            if (!$connexion) {
                Log::warning("Aucun enregistrement de connexion trouvé pour l'utilisateur " . $user->id);
                return response()->json(['message' => 'Action non autorisée (Pas d\'enregistrement de connexion).'], 403);
            }

            $isFirst = $connexion->premiere_connexion == 1 || $connexion->premiere_connexion === true;
            Log::info("Valeur première connexion : " . $connexion->premiere_connexion . " (estPremiere : " . ($isFirst ? 'oui' : 'non') . ")");

            if (!$isFirst) {
                Log::warning("Première connexion déjà effectuée pour l'utilisateur " . $user->id);
                return response()->json(['message' => 'Ce compte a déjà été activé. Veuillez vous connecter.'], 403);
            }
        }

        try {
            $user->update([
                'mot_de_passe' => Hash::make($request->nouveau_mot_de_passe)
            ]);
            Log::info("Mot de passe mis à jour pour l'utilisateur " . $user->id);

            if ($connexion) {
                $connexion->update(['premiere_connexion' => false]);
            } else {
                Connexion::create([
                    'utilisateur_id' => $user->id,
                    'premiere_connexion' => false
                ]);
            }

            return response()->json([
                'message' => 'Mot de passe mis à jour.',
                'premiere_connexion' => false
            ]);
        } catch (\Exception $e) {
            Log::error("Error updating password: " . $e->getMessage());
            return response()->json(['message' => 'Erreur serveur interne'], 500);
        }
    }

    public function checkActivation(Request $request)
    {
        $request->validate(['login' => 'required']);

        $loginStandard = \App\Helpers\PhoneHelper::formatGeneric($request->login);

        $user = Utilisateur::where('tel', $loginStandard)
            ->orWhere('whatsapp', $loginStandard)
            ->first();

        Log::info("Demande checkActivation reçue pour : " . $request->login . " (Standardisé : $loginStandard)");

        if (!$user) {
            Log::warning("Utilisateur non trouvé pour l'activation : $loginStandard");
            return response()->json(['status' => 'not_found']);
        }

        $connexion = Connexion::where('utilisateur_id', $user->id)->first();

        if ($connexion) {
            $isFirst = $connexion->premiere_connexion == 1 || $connexion->premiere_connexion === true;
            if (!$isFirst) {
                Log::info("Compte déjà activé pour : $loginStandard");
                return response()->json(['status' => 'activated']);
            }
        } else {
            Log::error("Enregistrement de connexion manquant pour l'utilisateur ID: " . $user->id);
            return response()->json(['status' => 'not_found']);
        }

        Log::info("Compte prêt pour activation : $loginStandard");
        return response()->json(['status' => 'pending']);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['login' => 'required']);
        $loginStandard = \App\Helpers\PhoneHelper::formatGeneric($request->login);

        $user = Utilisateur::where('tel', $loginStandard)
            ->orWhere('whatsapp', $loginStandard)
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        // Marquer dans la table connexion qu'un reset est en cours (optionnel mais bon pour le "principe")
        $connexion = Connexion::firstOrCreate(['utilisateur_id' => $user->id]);
        $connexion->update(['premiere_connexion' => true]); // On réactive temporairement le droit de changer sans auth

        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        $resetLink = rtrim($frontendUrl, '/') . "/reset-password?number=" . $request->login;

        $twilio = new \App\Services\TwilioService();
        $message = "Vous avez demandé la réinitialisation de votre mot de passe DME.\nCliquez ici :\n$resetLink";

        $sentCount = 0;
        if ($user->whatsapp) {
            if ($twilio->sendWhatsApp($user->whatsapp, $message))
                $sentCount++;
        }
        if ($user->tel) {
            if ($twilio->sendSMS($user->tel, $message))
                $sentCount++;
        }

        if ($sentCount > 0) {
            return response()->json(['message' => 'Lien de réinitialisation envoyé.']);
        }

        return response()->json(['message' => 'Erreur lors de l\'envoi du message.'], 500);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'login' => 'required',
            'nouveau_mot_de_passe' => 'required|min:8|confirmed',
        ]);

        $loginStandard = \App\Helpers\PhoneHelper::formatGeneric($request->login);
        $user = Utilisateur::where('tel', $loginStandard)
            ->orWhere('whatsapp', $loginStandard)
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        $user->update([
            'mot_de_passe' => Hash::make($request->nouveau_mot_de_passe)
        ]);

        $connexion = Connexion::where('utilisateur_id', $user->id)->first();
        if ($connexion) {
            $connexion->update(['premiere_connexion' => false]);
        }

        return response()->json(['message' => 'Mot de passe réinitialisé avec succès.']);
    }


    public function resendActivation(Request $request)
    {
        try {
            // Validation simple
            $request->validate(['utilisateur_id' => 'required']);

            $user = \App\Models\Utilisateur::findOrFail($request->utilisateur_id);

            // TEST : Si on arrive ici, l'utilisateur existe
            // On prépare le service
            $twilio = new \App\Services\TwilioService();

            $login = $user->whatsapp ?? $user->tel;
            $message = "Lien d'activation DME : " . env('FRONTEND_URL') . "/first-login?connexion=" . $login;

            // On tente l'envoi
            if ($user->whatsapp) {
                $twilio->sendWhatsApp($user->whatsapp, $message);
            } else {
                $twilio->sendSMS($user->tel, $message);
            }

            return response()->json(['success' => true, 'message' => 'Lien envoyé']);
        } catch (\Exception $e) {
            // CETTE LIGNE VA T'AFFICHER LE VRAI PROBLÈME DANS LA CONSOLE
            return response()->json([
                'message' => 'Erreur détectée : ' . $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }
}
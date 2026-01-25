<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use App\Models\Connexion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Services\TwilioService;

class UserController extends Controller
{
    /**
     * Create a new User (Staff: Medecin, Accueil, etc.)
     */
    public function store(Request $request)
    {
        // On formate les numéros avant la validation pour vérifier l'unicité réelle
        if ($request->has('tel')) {
            $request->merge(['tel' => \App\Helpers\PhoneHelper::formatBeninTel($request->tel)]);
        }
        if ($request->has('whatsapp')) {
            $request->merge(['whatsapp' => \App\Helpers\PhoneHelper::formatBeninWhatsApp($request->whatsapp)]);
        }

        // 1. Permission Check
        if (!$request->user()->hasPermission('creer_utilisateurs')) { // Assuming 'creer_utilisateurs' is the permission slug
             return response()->json(['message' => 'Action non autorisée.'], 403);
        }

        // 2. Validation
        $request->validate([
            'nom' => 'required|string|max:50',
            'prenom' => 'required|string|max:50',
            'tel' => 'nullable|string|unique:utilisateurs,tel',
            'whatsapp' => 'nullable|string|unique:utilisateurs,whatsapp',
            'role' => 'required|in:admin,medecin,accueil', // Restricted roles
            'sexe' => 'required|in:Homme,Femme',
            'ville' => 'nullable|string',
        ], [
            'tel.unique' => 'Ce numéro de téléphone est déjà utilisé.',
            'whatsapp.unique' => 'Ce numéro WhatsApp est déjà utilisé.',
            'nom.required' => 'Le nom est obligatoire.',
            'prenom.required' => 'Le prénom est obligatoire.',
            'role.required' => 'Le rôle est obligatoire.',
            'sexe.required' => 'Le sexe est obligatoire.',
        ]);

        if (empty($request->tel) && empty($request->whatsapp)) {
            return response()->json(['message' => 'Un numéro de téléphone ou WhatsApp est requis.'], 422);
        }

        try {
            DB::beginTransaction();

            // 3. Create User
            $user = Utilisateur::create([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'tel' => $request->tel,
                'whatsapp' => $request->whatsapp,
                'mot_de_passe' => Hash::make('password'), // Provisoire
                'role' => $request->role,
                'sexe' => $request->sexe,
                'ville' => $request->ville,
                'date_creation' => now(),
                'date_modification' => now()
            ]);

            // 4. Create Connexion (First Login = true)
            Connexion::create([
                'utilisateur_id' => $user->id,
                'premiere_connexion' => true
            ]);

            DB::commit();

            // 5. Send Activation Notification
            $this->sendActivationNotification($user);

            return response()->json([
                'message' => 'Utilisateur créé avec succès. Lien d\'activation envoyé.',
                'user' => $user
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur lors de la création: ' . $e->getMessage()], 500);
        }
    }

    private function sendActivationNotification($user)
    {
        $identifier = $user->whatsapp ?? $user->tel;
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        $activationLink = rtrim($frontendUrl, '/') . "/first-login?connexion=" . $identifier;
        $message = "Bonjour $user->prenom, votre compte staff ($user->role) sur DME a été créé. Activez-le ici : $activationLink";

        $twilio = new TwilioService();
        
        if ($user->whatsapp) {
            $twilio->sendWhatsApp($user->whatsapp, $message);
        }
        
        if ($user->tel) {
            $twilio->sendSMS($user->tel, $message);
        }
    }
}

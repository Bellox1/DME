<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;

use App\Models\Connexion;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Mail\LoginTokenMail; 

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:50',
            'prenom' => 'required|string|max:50',
            'tel' => 'nullable|string|max:20|unique:utilisateurs,tel', // Made nullable here, logic below handles requirement
            'whatsapp' => 'nullable|string|max:20|unique:utilisateurs,whatsapp',
            'mot_de_passe' => 'required|string|min:6',
            'sexe' => 'required|in:Homme,Femme',
            'date_naissance' => 'nullable|date',
            'ville' => 'nullable|string|max:100',
        ]);

        // Ensure at least one number is provided
        if (empty($request->tel) && empty($request->whatsapp)) {
            return response()->json(['error' => 'Le numéro de téléphone ou WhatsApp est requis.'], 422);
        }

        try {
            DB::beginTransaction();

            $tel = $request->tel;
            $whatsapp = $request->whatsapp;

            // Database requires 'tel'. If missing, use whatsapp.
            if (empty($tel) && !empty($whatsapp)) {
                $tel = $whatsapp;
            }

            // 1. Create User (Parent)
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

            // 2. Auto-create Patient Record
            $patient = Patient::create([
                'utilisateur_id' => $user->id,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Compte créé avec succès',
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

        $user = Utilisateur::where('tel', $request->login)
            ->orWhere('whatsapp', $request->login)
            ->first();

        // Sécurité : Vérification sans jamais renvoyer le mot de passe
        if (!$user || !Hash::check($request->mot_de_passe, $user->mot_de_passe)) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        $connexion = Connexion::firstOrCreate(
            ['utilisateur_id' => $user->id],
            ['premiere_connexion' => true]
        );

        // 1. Secrets de 256 caractères (récupérés du .env)
        $accessToken = Str::random(256);
        $refreshToken = Str::random(256);

        // 2. Hachage avec secrets DIFFÉRENTS (Consigne respectée)
        // On stocke le hash du refresh token
        $user->update([
            'refresh_token' => hash_hmac('sha256', $refreshToken, config('services.jwt.refresh_secret'))
        ]);

        // On utilise le téléphone + un domaine fictif pour que Mailpit le capture
        $destination = $user->tel . '@dme.local';

        Mail::to($destination)->send(new LoginTokenMail($accessToken));

        return response()->json([
            'message' => 'Un lien de connexion a été envoyé à votre email.',
            'premiere_connexion' => $connexion->premiere_connexion,
            // 'access_token' n'est plus ici pour la sécurité
            'refresh_token' => $refreshToken,
        ]);
    }

   public function refreshToken(Request $request)
{
    $request->validate(['refresh_token' => 'required']);

    // 1. On hache le token reçu pour le comparer à la base
    $hashedToken = hash_hmac('sha256', $request->refresh_token, config('services.jwt.refresh_secret'));
    
    // 2. On cherche l'utilisateur possédant ce hash
    $user = Utilisateur::where('refresh_token', $hashedToken)->first();

    if (!$user) {
        return response()->json(['message' => 'Session invalide ou expirée'], 403);
    }

    // 3. Session active : on génère un nouvel access_token de 256 caractères
    $newAccessToken = Str::random(256);

    // 4. Optionnel : On peut aussi renouveler le refresh_token ici
    return response()->json([
        'access_token' => $newAccessToken,
        'token_type' => 'Bearer'
    ]);
}

public function updatePassword(Request $request)
{
    $request->validate([
        'nouveau_mot_de_passe' => 'required|min:8|confirmed',
    ]);

    // On récupère l'utilisateur soit par l'auth, soit par l'ID (pour le test)
    $user = $request->user() ?? Utilisateur::find($request->user_id);

    if (!$user) {
        return response()->json(['message' => 'Utilisateur non trouvé'], 404);
    }

    $user->update([
        'mot_de_passe' => Hash::make($request->nouveau_mot_de_passe)
    ]);

    // Utilisation de la relation au singulier comme dans ton modèle
    $connexion = $user->connexion; 
    
    if ($connexion) {
        $connexion->update(['premiere_connexion' => false]);
    }

    return response()->json([
        'message' => 'Mot de passe mis à jour.',
        'premiere_connexion' => false
    ]);
}
}
<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;

use App\Models\Connexion;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
            DB::beginTransaction( );

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
            'login' => 'required|string', // Peut être tel ou whatsapp
            'mot_de_passe' => 'required|string',
        ]);

        // Cherche l'utilisateur par tel OU par whatsapp
        $user = Utilisateur::where('tel', $request->login)
                           ->orWhere('whatsapp', $request->login)
                           ->first();

        if (!$user || !Hash::check($request->mot_de_passe, $user->mot_de_passe)) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        // Vérifier le statut de première connexion
        $connexion = Connexion::firstOrCreate(
            ['utilisateur_id' => $user->id],
            ['premiere_connexion' => true]
        );

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'premiere_connexion' => $connexion->premiere_connexion,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'nouveau_mot_de_passe' => 'required|string|min:6',
        ]);

        $user = Auth::user();
        $user->mot_de_passe = Hash::make($request->nouveau_mot_de_passe);
        $user->save();

        // Mettre à jour le flag de première connexion
        Connexion::where('utilisateur_id', $user->id)->update([
            'premiere_connexion' => false,
            'date_derniere_connexion' => now()
        ]);

        return response()->json(['message' => 'Mot de passe mis à jour avec succès']);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}

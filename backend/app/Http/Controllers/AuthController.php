<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use App\Models\Connexion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
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

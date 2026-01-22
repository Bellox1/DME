<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:50',
            'prenom' => 'required|string|max:50',
            'email' => 'nullable|email|max:255', // Not in migration but good to have? distinct from tel? Migration only has tel.
            'tel' => 'required|string|max:20|unique:utilisateurs,tel',
            'mot_de_passe' => 'required|string|min:6',
            'sexe' => 'required|in:Homme,Femme',
            'date_naissance' => 'nullable|date',
            'ville' => 'nullable|string|max:100',
        ]);

        try {
            DB::beginTransaction();

            // 1. Create User (Parent)
            $user = Utilisateur::create([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'tel' => $request->tel,
                'mot_de_passe' => Hash::make($request->mot_de_passe),
                'sexe' => $request->sexe,
                'role' => 'patient', // Default role for parents registering via this endpoint
                'date_naissance' => $request->date_naissance,
                'ville' => $request->ville,
            ]);

            // 2. Auto-create Patient Record (Dossier Médical)
            $patient = Patient::create([
                'utilisateur_id' => $user->id,
                // Other fields like taille/poids can be updated later
            ]);

            DB::commit();

            // 3. Return Token (if using Sanctum) or Success Message
            // Assuming Sanctum is installed via install:api
            // $token = $user->createToken('auth_token')->plainTextToken;

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
}

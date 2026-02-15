<?php

namespace App\Http\Controllers\Api\Medecin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Models\Utilisateur;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'nom' => 'required|string|max:50',
            'prenom' => 'required|string|max:50',
            'tel' => 'nullable|string|max:20|unique:utilisateurs,tel,' . $user->id,
            'whatsapp' => 'nullable|string|max:20|unique:utilisateurs,whatsapp,' . $user->id,
            'sexe' => 'required|in:Homme,Femme,M,F',
            'ville' => 'nullable|string|max:100',
        ]);

        $sexe = $request->sexe;
        if ($sexe === 'M') $sexe = 'Homme';
        if ($sexe === 'F') $sexe = 'Femme';

        $user->update([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'tel' => $request->tel,
            'whatsapp' => $request->whatsapp,
            'sexe' => $sexe,
            'ville' => $request->ville,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profil mis à jour avec succès',
            'user' => $user
        ]);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'mot_de_passe_actuel' => 'required',
            'nouveau_mot_de_passe' => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->mot_de_passe_actuel, $user->mot_de_passe)) {
            return response()->json([
                'success' => false,
                'message' => 'Le mot de passe actuel est incorrect.'
            ], 422);
        }

        $user->update([
            'mot_de_passe' => Hash::make($request->nouveau_mot_de_passe)
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe mis à jour avec succès'
        ]);
    }

    public function updatePhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();

        if ($request->hasFile('photo')) {
            // Supprimer l'ancienne photo si elle existe
            if ($user->photo) {
                Storage::disk('public')->delete($user->photo);
            }

            $path = $request->file('photo')->store('profile_photos', 'public');
            $user->update(['photo' => $path]);

            return response()->json([
                'success' => true,
                'message' => 'Photo de profil mise à jour',
                'photo_url' => asset('storage/' . $path),
                'user' => $user
            ]);
        }

        return response()->json(['success' => false, 'message' => 'Fichier non trouvé'], 400);
    }
}

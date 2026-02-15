<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    /**
     * Get the authenticated user's profile.
     */
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Update the authenticated user's profile.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'nom' => 'required|string|max:50',
            'prenom' => 'required|string|max:50',
            'sexe' => 'required|in:Homme,Femme,M,F',
            'tel' => 'nullable|string|max:20|unique:utilisateurs,tel,' . $user->id,
            'whatsapp' => 'nullable|string|max:20|unique:utilisateurs,whatsapp,' . $user->id,
            'photo' => 'nullable|image|max:2048', // 2MB Max
        ]);

        // Normalize Sex if needed (M/F vs Homme/Femme)
        // Controller validation says Homme,Femme,M,F.
        // User model likely expects M or F (char 1) or string. 
        // AdminProfil.jsx sends 'M' or 'F'.

        $data = $request->only(['nom', 'prenom', 'sexe', 'tel', 'whatsapp', 'ville']);

        // Handle Photo Upload
        if ($request->hasFile('photo')) {
            // Use the 'public' disk explicitly to store in storage/app/public/photos
            $path = $request->file('photo')->store('photos', 'public');
            $data['photo'] = $path; // Path is already relative to the disk root (storage/app/public)
        }

        if ($request->has('tel')) {
            $data['tel'] = \App\Helpers\PhoneHelper::formatBeninTel($request->tel);
        }
        if ($request->has('whatsapp')) {
            $data['whatsapp'] = \App\Helpers\PhoneHelper::formatBeninWhatsApp($request->whatsapp);
        }

        // Map M/F to Homme/Femme if needed by DB constraint
        if (isset($data['sexe'])) {
            if ($data['sexe'] === 'M')
                $data['sexe'] = 'Homme';
            if ($data['sexe'] === 'F')
                $data['sexe'] = 'Femme';
        }


        $user->update($data);

        return response()->json([
            'message' => 'Profil mis à jour avec succès.',
            'user' => $user
        ]);
    }
}

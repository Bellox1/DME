<?php

namespace App\Http\Controllers\Api\Patient;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Utilisateur;

class CompteController extends Controller
{
    /**
     * Voir les infos du compte utilisateur (Profil global).
     */
    public function show(Request $request)
    {
        if (!$request->user()->hasPermission('voir_utilisateurs')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }
        return response()->json($request->user());
    }

    /**
     * Mettre à jour les infos personnelles (non médicales).
     */
    public function update(Request $request)
    {
        if (!$request->user()->hasPermission('modifier_utilisateurs')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $user = $request->user();

        $request->validate([
            'ville' => 'nullable|string|max:100',
            'tel' => [
                'nullable', 
                'string', 
                'max:20', 
                'regex:/^\+?[0-9]+$/',
                \Illuminate\Validation\Rule::unique('utilisateurs', 'tel')->ignore($user->id)
            ],
            'whatsapp' => [
                'nullable', 
                'string', 
                'max:20', 
                'regex:/^\+?[0-9]+$/',
                \Illuminate\Validation\Rule::unique('utilisateurs', 'whatsapp')->ignore($user->id)
            ],
        ], [
            'tel.unique' => 'Ce numéro de téléphone est déjà utilisé par un autre compte.',
            'whatsapp.unique' => 'Ce numéro WhatsApp est déjà utilisé par un autre compte.',
            'tel.max' => 'Le numéro de téléphone ne doit pas dépasser 20 caractères.',
            'whatsapp.max' => 'Le numéro WhatsApp ne doit pas dépasser 20 caractères.',
            'tel.regex' => 'Le numéro de téléphone ne doit contenir que des chiffres et peut commencer par +.',
            'whatsapp.regex' => 'Le numéro WhatsApp ne doit contenir que des chiffres et peut commencer par +.',
            'ville.max' => 'La ville ne doit pas dépasser 100 caractères.',
        ]);

        if ($request->has('ville')) $user->ville = $request->ville;
        if ($request->has('tel')) $user->tel = $request->tel;
        if ($request->has('whatsapp')) $user->whatsapp = $request->whatsapp;
        
        $user->save();

        return response()->json(['message' => 'Profil mis à jour avec succès.', 'user' => $user]);
    }

    /**
     * Changer le mot de passe.
     */
    public function updatePassword(Request $request)
    {
        if (!$request->user()->hasPermission('modifier_utilisateurs')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $request->validate([
            'current_password' => 'required',
            'password' => 'required|min:8|confirmed',
        ], [
            'current_password.required' => 'Le mot de passe actuel est requis.',
            'password.required' => 'Le nouveau mot de passe est requis.',
            'password.min' => 'Le nouveau mot de passe doit faire au moins 8 caractères.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->mot_de_passe)) {
            return response()->json(['message' => 'Le mot de passe actuel est incorrect.'], 400);
        }

        $user->mot_de_passe = Hash::make($request->password);
        $user->save();

        return response()->json(['message' => 'Mot de passe modifié avec succès.']);
    }
}

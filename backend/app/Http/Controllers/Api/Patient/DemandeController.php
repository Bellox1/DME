<?php

namespace App\Http\Controllers\Api\Patient;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Demande;
use Illuminate\Support\Facades\Validator;

class DemandeController extends Controller
{
    /**
     * Store a newly created request in storage.
     */
    public function store(Request $request)
    {
        if (!$request->user()->hasPermission('creer_demandes')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'type' => 'required|in:rendez-vous,modification_profil,autre',
            'objet' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $demande = Demande::create([
            'utilisateur_id' => $request->user()->id,
            'type' => $request->type,
            'objet' => $request->objet,
            'description' => $request->description,
            'statut' => 'en_attente',
        ]);

        return response()->json([
            'message' => 'Votre demande a été envoyée avec succès.',
            'demande' => $demande
        ], 201);
    }
}

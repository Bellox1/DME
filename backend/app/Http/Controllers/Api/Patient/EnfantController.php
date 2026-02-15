<?php

namespace App\Http\Controllers\Api\Patient;

use App\Http\Controllers\Controller;
use App\Models\Enfant;
use App\Models\Patient;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EnfantController extends Controller
{
    public function store(Request $request)
    {
        if (!$request->user()->hasPermission('creer_enfants')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $request->validate([
            'parent_id' => 'required|exists:utilisateurs,id',
            'nom' => 'required|string|max:50',
            'prenom' => 'required|string|max:50',
            'sexe' => 'required|in:Homme,Femme',
            'date_naissance' => 'nullable|date',
        ]);

        try {
            DB::beginTransaction();

            // 1. Create Enfant
            $enfant = Enfant::create($request->all());

            // 2. Auto-create Patient Record
            $patient = Patient::create([
                'enfant_id' => $enfant->id,
                // Parent link is indirect via Enfant->parent, but Patient table has utilisateur_id nullable.
                // Should we link the parent here? The schema says utilisateur_id is for the patient themselves if they are an adult.
                // For a child, utilisateur_id is null, and enfant_id is set.
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Enfant enregistré avec succès',
                'enfant' => $enfant,
                'patient_id' => $patient->id
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Erreur lors de l\'enregistrement de l\'enfant: ' . $e->getMessage()], 500);
        }
    }



  public function update(Request $request, $id) 
{
    // On récupère l'enfant
    $enfant = Enfant::findOrFail($id);
    
    // Validation souple mais sécurisée
    $validated = $request->validate([
        'nom'            => 'sometimes|string|max:50',
        'prenom'         => 'sometimes|string|max:50',
        'sexe'           => 'sometimes|in:Homme,Femme,Masculin,Féminin', // On élargit pour éviter les erreurs de saisie
        'date_naissance' => 'sometimes|date'
    ]);

    // Mise à jour
    $enfant->update($validated);

    // Réponse propre sans données sensibles
    return response()->json([
        'status'  => 'success',
        'message' => 'Dossier enfant mis à jour avec succès',
        'data'    => [
            'id'     => $enfant->id,
            'nom'    => $enfant->nom,
            'prenom' => $enfant->prenom
        ]
    ]);
}
}

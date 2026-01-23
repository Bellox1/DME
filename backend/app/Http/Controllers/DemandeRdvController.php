<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DemandeRdvController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(\App\Models\DemandeRdv::orderBy('created_at', 'desc')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'type' => 'required|string',
            'motif' => 'nullable|string',
        ]);

        $demande = new \App\Models\DemandeRdv();
        $demande->patient_id = $validated['patient_id'];
        $demande->type = $validated['type'];
        $demande->motif = $request->motif;
        $demande->statut = 'en_attente';
        $demande->date_demande = $request->date_demande ?? now();
        $demande->save();

        return response()->json(['message' => 'Demande créée', 'demande' => $demande], 201);
    }

    /**
     * Valider une demande de rendez-vous (Accueil)
     */
    public function valider($id)
    {
        $demande = \App\Models\DemandeRdv::findOrFail($id);
        if ($demande->statut !== 'en_attente') {
            return response()->json(['error' => 'Demande déjà traitée'], 400);
        }
        $demande->statut = 'approuve';
        $demande->save();

        // Conversion en RDV réel
        $rdv = new \App\Models\Rdv();
        $rdv->patient_id = $demande->patient_id;
        $rdv->motif = $demande->motif;
        $rdv->dateH_rdv = now(); // À adapter si une date spécifique est prévue
        $rdv->statut = 'programmé';
        $rdv->medecin_id = null; // À renseigner selon le workflow
        $rdv->save();

        return response()->json([
            'message' => 'Demande approuvée et RDV créé',
            'demande' => $demande,
            'rdv' => $rdv
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

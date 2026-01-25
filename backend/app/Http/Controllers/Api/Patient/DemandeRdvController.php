<?php

namespace App\Http\Controllers\Api\Patient;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DemandeRdvController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Récupérer l'utilisateur connecté
        $user = $request->user();

        // Vérifier les permissions
        if (!$user->hasPermission('voir_demandes')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        // Filtrer les demandes de l'utilisateur connecté
        $demandes = \App\Models\DemandeRdv::where('utilisateur_id', $user->id)
            ->where('type', 'rendez-vous')
            ->orderBy('date_creation', 'desc')
            ->get();

        return response()->json($demandes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!$request->user()->hasPermission('creer_demandes')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }
        $validated = $request->validate([
            'objet' => 'required|string|max:255',
            'description' => 'required|string',
            'date_souhaitee' => 'nullable|date',
            'time' => 'nullable|string',
        ]);

        $user = auth()->user();

        $dateTimeSouhaitee = null;
        if ($validated['date_souhaitee']) {
            $dateTimeSouhaitee = $validated['date_souhaitee'];
            if ($validated['time']) {
                $dateTimeSouhaitee .= ' ' . $validated['time'];
            }
        }

        $demande = new \App\Models\DemandeRdv();
        $demande->utilisateur_id = $user->id;
        $demande->type = 'rendez-vous';
        $demande->objet = $validated['objet'];
        $demande->description = $validated['description'] . ($dateTimeSouhaitee ? ' (Date/heure souhaitée: ' . $dateTimeSouhaitee . ')' : '');
        $demande->statut = 'en_attente';
        $demande->save();

        return response()->json(['message' => 'Demande de rendez-vous créée avec succès', 'demande' => $demande], 201);
    }

    /**
     * Valider une demande de rendez-vous (Accueil)
     */
    public function valider(Request $request, $id)
    {
        if (!$request->user()->hasPermission('modifier_demandes')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }
        $demande = \App\Models\DemandeRdv::findOrFail($id);
        if ($demande->statut !== 'en_attente') {
            return response()->json(['error' => 'Demande déjà traitée'], 400);
        }
        $demande->statut = 'approuvé';
        $demande->save();

        // Conversion en RDV réel
        $rdv = new \App\Models\Rdv();
        $rdv->patient_id = $demande->utilisateur_id; // Adapter selon votre logique patient/utilisateur
        $rdv->motif = $demande->objet;
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
     * Rejeter une demande de rendez-vous (Accueil)
     */
    public function rejeter($id, Request $request)
    {
        $validated = $request->validate([
            'motif_rejet' => 'required|string'
        ]);

        $demande = \App\Models\DemandeRdv::findOrFail($id);
        if ($demande->statut !== 'en_attente') {
            return response()->json(['error' => 'Demande déjà traitée'], 400);
        }
        $demande->statut = 'rejeté';
        $demande->description .= ' [REJETÉ: ' . $validated['motif_rejet'] . ']';
        $demande->save();

        return response()->json([
            'message' => 'Demande rejetée',
            'demande' => $demande
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

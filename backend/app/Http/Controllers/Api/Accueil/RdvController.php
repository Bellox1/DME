<?php

namespace App\Http\Controllers\Api\Accueil;

use App\Http\Controllers\Controller;
use App\Models\Rdv;
use Illuminate\Http\Request;

class RdvController extends Controller
{

    public function index(Request $request)
    {
        $query = Rdv::query();

        if ($request->has('medecin_id')) {
            $query->where('medecin_id', $request->medecin_id);
        }

        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->patient_id);
        }

        if ($request->has('date')) {
            $query->whereDate('dateH_rdv', $request->date);
        }

        return response()->json($query->get());
    }

   

    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'medecin_id' => 'required|exists:utilisateurs,id',
            'dateH_rdv' => 'required|date',
            'motif' => 'nullable|string',
        ]);

        $dateH = $request->dateH_rdv;
        $dateJour = date('Y-m-d', strtotime($dateH));

        // 1. VÉRIFICATION MÉDECIN (Même heure exacte)
        $medecinOccupe = Rdv::where('medecin_id', $request->medecin_id)
            ->where('dateH_rdv', $dateH)
            ->where('statut', '!=', 'annulé')
            ->exists();

        if ($medecinOccupe) {
            return response()->json([
                'message' => 'Ce médecin a déjà un rendez-vous à cette heure précise.'
            ], 422);
        }

        // 2. VÉRIFICATION PATIENT (Même jour)
        // On vérifie si le patient a déjà un RDV "programmé" ou "passé" ce jour-là
        $patientDejaPris = Rdv::where('patient_id', $request->patient_id)
            ->whereDate('dateH_rdv', $dateJour)
            ->whereIn('statut', ['programmé', 'passé'])
            ->exists();

        if ($patientDejaPris) {
            return response()->json([
                'message' => 'Ce patient a déjà un rendez-vous prévu pour cette journée.'
            ], 422);
        }

        // Si tout est OK, on crée
        $rdv = Rdv::create([
            'patient_id' => $request->patient_id,
            'medecin_id' => $request->medecin_id,
            'dateH_rdv' => $dateH,
            'motif' => $request->motif,
            'statut' => 'programmé',
        ]);

        return response()->json([
            'message' => 'Rendez-vous enregistré avec succès.',
            'rdv' => $rdv
        ], 201);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rdv;
use Illuminate\Http\Request;

class RdvController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'medecin_id' => 'required|exists:utilisateurs,id', // Ensure role is medecin?
            'dateH_rdv' => 'required|date',
            'motif' => 'nullable|string',
            'statut' => 'in:programmé,annulé,passé'
        ]);

        $rdv = Rdv::create([
            'patient_id' => $request->patient_id,
            'medecin_id' => $request->medecin_id,
            'dateH_rdv' => $request->dateH_rdv,
            'motif' => $request->motif,
            'statut' => $request->statut ?? 'programmé',
        ]);

        return response()->json([
            'message' => 'RDV créé avec succès',
            'rdv' => $rdv
        ], 201);
    }
}

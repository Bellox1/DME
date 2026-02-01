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

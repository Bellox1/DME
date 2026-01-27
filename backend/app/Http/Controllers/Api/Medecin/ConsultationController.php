<?php

namespace App\Http\Controllers\Api\Medecin;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use App\Models\Rdv;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ConsultationController extends Controller
{
    /**
     * Créer une nouvelle consultation.
     */
    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'medecin_id' => 'required|exists:utilisateurs,id', // ou auth()->id()
            'rdv_id' => 'nullable|exists:rdvs,id',
            'dateH_visite' => 'required|date',
            'motif' => 'nullable|string',
            'diagnostic' => 'nullable|string',
            'signature' => 'nullable|string',
        ]);

        $consultation = DB::transaction(function () use ($request) {
            $consultation = Consultation::create($request->all());

            // Si lié à un RDV, mettre à jour le statut du RDV
            if ($request->rdv_id) {
                $rdv = Rdv::find($request->rdv_id);
                if ($rdv) {
                    $rdv->statut = 'passé'; // Marqué comme effectué
                    $rdv->save();
                }
            }

            return $consultation;
        });

        return response()->json([
            'success' => true,
            'message' => 'Consultation créée avec succès',
            'data' => $consultation
        ], 201);
    }

    /**
     * Afficher les détails d'une consultation (avec prescriptions).
     */
    public function show($id)
    {
        $consultation = Consultation::with(['patient', 'medecin', 'prescriptions'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $consultation
        ]);
    }

    /**
     * Mettre à jour une consultation.
     */
    public function update(Request $request, $id)
    {
        $consultation = Consultation::findOrFail($id);

        $request->validate([
            'motif' => 'nullable|string',
            'diagnostic' => 'nullable|string',
            'examen_physique' => 'nullable|string',
            'traitement' => 'nullable|string',
            // ... autres champs
        ]);

        $consultation->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Consultation mise à jour',
            'data' => $consultation
        ]);
    }
}

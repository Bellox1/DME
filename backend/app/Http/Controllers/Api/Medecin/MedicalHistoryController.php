<?php

namespace App\Http\Controllers\Api\Medecin;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use App\Models\Patient;
use Illuminate\Http\Request;

class MedicalHistoryController extends Controller
{
    /**
     * Récupérer l'historique médical complet d'un patient.
     */
    public function index($patientId)
    {
        // Vérifier si le patient existe
        $patient = Patient::findOrFail($patientId);

        // Récupérer les consultations avec les prescriptions et le médecin
        $consultations = Consultation::with(['medecin', 'prescriptions', 'patient'])
            ->where('patient_id', $patientId)
            ->orderBy('dateH_visite', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'patient' => $patient, // Basic info
                'consultations' => $consultations
            ]
        ]);
    }

    /**
     * Récupérer toutes les consultations du médecin connecté
     */
    public function getAllForDoctor(Request $request)
    {
        $medecinId = $request->user()->id;

        $consultations = Consultation::with(['patient', 'prescriptions'])
            ->where('medecin_id', $medecinId)
            ->orderBy('dateH_visite', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $consultations
        ]);
    }
}

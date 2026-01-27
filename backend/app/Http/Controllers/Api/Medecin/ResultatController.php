<?php

namespace App\Http\Controllers\Api\Medecin;

use App\Http\Controllers\Controller;
use App\Models\Resultat;
use Illuminate\Http\Request;

class ResultatController extends Controller
{
    /**
     * Récupérer tous les résultats pour un médecin (ses patients)
     */
    public function index(Request $request)
    {
        $medecinId = $request->user()->id;
        
        // Récupérer les résultats des patients du médecin
        $resultats = Resultat::with(['patient'])
            ->where('medecin_id', $medecinId)
            ->orWhereHas('patient.rdvs', function($query) use ($medecinId) {
                $query->where('medecin_id', $medecinId);
            })
            ->orderBy('date_examen', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $resultats
        ]);
    }

    /**
     * Récupérer les résultats d'un patient spécifique
     */
    public function getByPatient($patientId)
    {
        $resultats = Resultat::where('patient_id', $patientId)
            ->orderBy('date_examen', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $resultats
        ]);
    }
}

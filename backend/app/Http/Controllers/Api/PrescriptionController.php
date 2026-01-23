<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prescription;
use Illuminate\Http\Request;

class PrescriptionController extends Controller
{
    /**
     * Ajouter un médicament à une consultation.
     */
    public function store(Request $request, $consultation_id)
    {
        $request->validate([
            'nom_medicament' => 'required|string',
            'dosage' => 'required|string',
            'instructions' => 'nullable|string',
            // 'medecin_id' peut être pris de l'auth
        ]);

        $prescription = new Prescription($request->all());
        $prescription->consultation_id = $consultation_id;
        // $prescription->medecin_id = auth()->id(); // Si authentifié
        if ($request->has('medecin_id')) {
             $prescription->medecin_id = $request->medecin_id;
        }
        $prescription->save();

        return response()->json([
            'success' => true,
            'message' => 'Médicament ajouté',
            'data' => $prescription
        ], 201);
    }

    /**
     * Supprimer un médicament.
     */
    public function destroy($id)
    {
        $prescription = Prescription::findOrFail($id);
        $prescription->delete();

        return response()->json([
            'success' => true,
            'message' => 'Médicament supprimé'
        ]);
    }
}

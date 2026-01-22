<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function index()
    {
        // Fetch specific columns to avoid N+1 issue or too much data?
        // Requirement: "List Global Patients : qui fusionne les informations d'identité"
        
        $patients = Patient::with(['utilisateur', 'enfant'])->get()->map(function ($patient) {
            // Determine identity source
            $identity = $patient->utilisateur ?? $patient->enfant;
            
            return [
                'id' => $patient->id, // Patient ID (used for RDVs)
                'nom' => $identity ? $identity->nom : 'Inconnu',
                'prenom' => $identity ? $identity->prenom : 'Inconnu',
                'tel' => $patient->utilisateur ? $patient->utilisateur->tel : ($patient->enfant && $patient->enfant->parent ? $patient->enfant->parent->tel : null), // Contact info
                'type' => $patient->utilisateur ? 'Adulte' : 'Enfant',
                'age' => $identity && $identity->date_naissance ? \Carbon\Carbon::parse($identity->date_naissance)->age : null,
                'sexe' => $identity ? $identity->sexe : null,
            ];
        });

        return response()->json($patients);
    }
}

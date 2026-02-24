<?php

namespace App\Http\Controllers\Api\Medecin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Transfert;
use App\Models\Utilisateur;
use App\Models\Patient;
use App\Notifications\MedicalActivityNotification;
use Illuminate\Support\Facades\DB;

class TransfertController extends Controller
{
    /**
     * Liste des transferts reçus par le médecin connecté.
     */
    public function index(Request $request)
    {
        $transfers = Transfert::with(['patient.utilisateur', 'patient.enfant', 'expediteur'])
            ->where('medecin_destinataire_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $transfers
        ]);
    }

    /**
     * Liste des transferts envoyés par le médecin connecté.
     */
    public function sent(Request $request)
    {
        $transfers = Transfert::with(['patient.utilisateur', 'patient.enfant', 'destinataire'])
            ->where('medecin_expediteur_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $transfers
        ]);
    }

    /**
     * Liste des médecins disponibles pour un transfert (exclut soi-même).
     */
    public function doctors(Request $request)
    {
        $doctors = Utilisateur::where('role', 'medecin')
            ->where('id', '!=', $request->user()->id)
            ->select('id', 'nom', 'prenom')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $doctors
        ]);
    }

    /**
     * Initier un nouveau transfert de dossier.
     */
    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'medecin_destinataire_id' => 'required|exists:utilisateurs,id',
            'motif' => 'nullable|string|max:500',
        ]);

        $expediteur = $request->user();
        $patient = Patient::findOrFail($request->patient_id);
        $destinataire = Utilisateur::findOrFail($request->medecin_destinataire_id);

        if ($destinataire->role !== 'medecin') {
            return response()->json([
                'success' => false,
                'message' => 'Le destinataire doit être un médecin.'
            ], 422);
        }

        $transfer = Transfert::create([
            'patient_id' => $request->patient_id,
            'medecin_expediteur_id' => $expediteur->id,
            'medecin_destinataire_id' => $request->medecin_destinataire_id,
            'motif' => $request->motif,
            'statut' => 'en_attente',
            'date_transfert' => now(),
        ]);

        // Envoyer une notification au destinataire
        $destinataire->notify(new MedicalActivityNotification([
            'type' => 'transfert',
            'title' => 'Nouveau transfert de dossier',
            'desc' => "Le Dr {$expediteur->nom} vous a transféré le dossier de {$patient->nom_complet}.",
            'patient_id' => $patient->id
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Dossier transféré avec succès',
            'data' => $transfer
        ], 201);
    }
}

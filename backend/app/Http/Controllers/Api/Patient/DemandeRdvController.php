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
        $user = Auth::user();

        // --- Récupération des dossiers accessibles ---
        $dossierPrincipal = \App\Models\Patient::where('utilisateur_id', $user->id)->first();
        $enfantsIds = \App\Models\Enfant::where('parent_id', $user->id)->pluck('id');
        $dossiersEnfants = \App\Models\Patient::whereIn('enfant_id', $enfantsIds)->get();

        $allPatientsIds = collect([]);
        if ($dossierPrincipal) $allPatientsIds->push($dossierPrincipal->id);
        foreach ($dossiersEnfants as $d) $allPatientsIds->push($d->id);

        // --- Filtrage par Patient Spécifique (Optionnel) ---
        $requestedPatientId = $request->query('patient_id');
        $patientsIds = collect([]);

        if ($requestedPatientId && $requestedPatientId !== 'all') {
            // Sécurité : Vérifier que l'utilisateur a le droit d'accéder à ce patient précis
            if ($allPatientsIds->contains($requestedPatientId)) {
                $patientsIds->push($requestedPatientId);
            } else {
                return response()->json(['message' => 'Accès non autorisé à ce profil.'], 403);
            }
        } elseif ($requestedPatientId === 'all') {
            // Vue Globale (Optionnelle)
            $patientsIds = $allPatientsIds;
        } else {
            // Vue Par Défaut : Titulaire uniquement
            if ($dossierPrincipal) {
                $patientsIds->push($dossierPrincipal->id);
            } else if ($allPatientsIds->isNotEmpty()) {
                $patientsIds->push($allPatientsIds->first());
            }
        }

        if ($patientsIds->isEmpty()) {
            return response()->json(['message' => 'Aucun dossier patient associé.'], 200);
        }

        // Récupérer les patients correspondants pour obtenir les utilisateur_id
        $patients = \App\Models\Patient::whereIn('id', $patientsIds)->get();

        // Filtrer les demandes par patient_id si spécifié
        if ($requestedPatientId) {
            if ($requestedPatientId === 'all') {
                // Vue globale : toutes les demandes du parent et des enfants
                $demandes = \App\Models\DemandeRdv::where('utilisateur_id', $user->id)
                    ->where('type', 'rendez-vous')
                    ->orderBy('date_creation', 'desc')
                    ->get();
            } else {
                // Récupérer le patient pour vérifier l'accès
                $patient = \App\Models\Patient::find($requestedPatientId);
                if (!$patient || !$this->userCanAccessPatient($user, $patient, $dossierPrincipal, $dossiersEnfants)) {
                    return response()->json(['message' => 'Accès non autorisé à ce profil.'], 403);
                }

                // Filtrer les demandes en cherchant le PATIENT_ID dans la description
                $demandes = \App\Models\DemandeRdv::where('utilisateur_id', $user->id)
                    ->where('type', 'rendez-vous')
                    ->where('description', 'LIKE', '%[PATIENT_ID:' . $requestedPatientId . ']%')
                    ->orderBy('date_creation', 'desc')
                    ->get();
            }
        } else {
            // Vue par défaut : demandes du titulaire
            // Récupérer le dossier principal du titulaire
            $dossierPrincipal = \App\Models\Patient::where('utilisateur_id', $user->id)->first();
            if ($dossierPrincipal) {
                $demandes = \App\Models\DemandeRdv::where('utilisateur_id', $user->id)
                    ->where('type', 'rendez-vous')
                    ->where(function($query) use ($dossierPrincipal) {
                        // Inclure les demandes avec PATIENT_ID du titulaire
                        $query->where('description', 'LIKE', '%[PATIENT_ID:' . $dossierPrincipal->id . ']%')
                              // Inclure les anciennes demandes sans PATIENT_ID (compatibilité)
                              ->orWhere('description', 'NOT LIKE', '%[PATIENT_ID:%');
                    })
                    ->orderBy('date_creation', 'desc')
                    ->get();
            } else {
                // Si pas de dossier principal, retourner les demandes sans PATIENT_ID
                $demandes = \App\Models\DemandeRdv::where('utilisateur_id', $user->id)
                    ->where('type', 'rendez-vous')
                    ->where('description', 'NOT LIKE', '%[PATIENT_ID:%')
                    ->orderBy('date_creation', 'desc')
                    ->get();
            }
        }

        return response()->json($demandes);
    }

    /**
     * Vérifier si l'utilisateur peut accéder à un patient
     */
    private function userCanAccessPatient($user, $patient, $dossierPrincipal, $dossiersEnfants)
    {
        // Vérifier si c'est le dossier principal du titulaire
        if ($dossierPrincipal && $patient->id === $dossierPrincipal->id) {
            return true;
        }

        // Vérifier si c'est un des enfants
        foreach ($dossiersEnfants as $enfant) {
            if ($patient->id === $enfant->id) {
                return true;
            }
        }

        return false;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'objet' => 'required|string|max:255',
            'description' => 'required|string',
            'date_souhaitee' => 'nullable|date',
            'time' => 'nullable|string',
            'patient_id' => 'nullable|exists:patients,id',
        ]);

        $user = $request->user();

        // --- Validation du patient_id si fourni ---
        $patientId = $validated['patient_id'] ?? null;
        if ($patientId) {
            // Récupérer les dossiers accessibles
            $dossierPrincipal = \App\Models\Patient::where('utilisateur_id', $user->id)->first();
            $enfantsIds = \App\Models\Enfant::where('parent_id', $user->id)->pluck('id');
            $dossiersEnfants = \App\Models\Patient::whereIn('enfant_id', $enfantsIds)->get();

            $allPatientsIds = collect([]);
            if ($dossierPrincipal) $allPatientsIds->push($dossierPrincipal->id);
            foreach ($dossiersEnfants as $d) $allPatientsIds->push($d->id);

            if (!$allPatientsIds->contains($patientId)) {
                return response()->json(['message' => 'Accès non autorisé à ce profil.'], 403);
            }

            // Récupérer le patient pour obtenir l'utilisateur_id correspondant
            $patient = \App\Models\Patient::find($patientId);
            if ($patient && $patient->utilisateur_id) {
                $utilisateurId = $patient->utilisateur_id;
            } else {
                // Pour les enfants (utilisateur_id null), utiliser l'utilisateur connecté (le parent)
                $utilisateurId = $user->id;
            }
        } else {
            // Par défaut, utiliser l'utilisateur connecté
            $utilisateurId = $user->id;
        }

        $dateTimeSouhaitee = null;
        if (isset($validated['date_souhaitee']) && $validated['date_souhaitee']) {
            $dateTimeSouhaitee = $validated['date_souhaitee'];
            if (isset($validated['time']) && $validated['time']) {
                $dateTimeSouhaitee .= ' ' . $validated['time'];
            }
        }

        $demande = new \App\Models\DemandeRdv();
        $demande->utilisateur_id = $utilisateurId;
        $demande->type = 'rendez-vous';
        $demande->objet = $validated['objet'];
        $demande->description = $validated['description'] . ($dateTimeSouhaitee ? ' (Date/heure souhaitée: ' . $dateTimeSouhaitee . ')' : '');
        $demande->statut = 'en_attente';
        $demande->save();

        // Ajouter le PATIENT_ID pour le filtrage
        if ($patientId) {
            // Pour un enfant spécifique
            $demande->description .= ' [PATIENT_ID:' . $patientId . ']';
        } else {
            // Pour le titulaire, récupérer son patient_id
            $dossierPrincipal = \App\Models\Patient::where('utilisateur_id', $user->id)->first();
            if ($dossierPrincipal) {
                $demande->description .= ' [PATIENT_ID:' . $dossierPrincipal->id . ']';
            }
        }
        $demande->save();

        return response()->json(['message' => 'Demande de rendez-vous créée avec succès', 'demande' => $demande], 201);
    }

    /**
     * Valider une demande de rendez-vous (Accueil)
     */
    public function valider(Request $request, $id)
    {
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

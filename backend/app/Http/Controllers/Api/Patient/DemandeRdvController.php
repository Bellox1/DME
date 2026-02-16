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

        // --- Si l'utilisateur est de l'accueil, il voit TOUT ---
        if ($user->role === 'accueil' || $user->role === 'admin') {
            // On récupère tout, en chargeant la relation patient si elle existe
            $demandes = \App\Models\DemandeRdv::orderBy('date_creation', 'desc')->get();
            return response()->json($demandes);
        }

        // --- Récupération des dossiers accessibles ---
        $dossierPrincipal = \App\Models\Patient::where('utilisateur_id', $user->id)->first();
        $enfantsIds = \App\Models\Enfant::where('parent_id', $user->id)->pluck('id');
        $dossiersEnfants = \App\Models\Patient::whereIn('enfant_id', $enfantsIds)->get();

        $allPatientsIds = collect([]);
        if ($dossierPrincipal)
            $allPatientsIds->push($dossierPrincipal->id);
        foreach ($dossiersEnfants as $d)
            $allPatientsIds->push($d->id);

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
                    ->where(function ($query) use ($dossierPrincipal) {
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

        $demandes->transform(function ($demande) {
            // On cherche [PATIENT_ID:X] dans la description
            if (preg_match('/\[PATIENT_ID:(\d+)\]/', $demande->description, $matches)) {
                $demande->patient_id = $matches[1]; // On crée dynamiquement la propriété
            }
            return $demande;
        });

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
        'patient_id' => 'required|exists:patients,id', // Requis pour identifier le patient
    ]);

    $user = $request->user();
    $patientId = $validated['patient_id'];
    $patient = \App\Models\Patient::findOrFail($patientId);

    // --- LOGIQUE D'AUTORISATION ---
    if ($user->role === 'accueil' || $user->role === 'admin') {
        // L'accueil peut créer pour n'importe qui. 
        // On lie la demande à l'utilisateur propriétaire du dossier patient.
        $utilisateurId = $patient->utilisateur_id ?? $user->id;
    } else {
        // Logique Restreinte pour les Patients (Ton code original)
        $dossierPrincipal = \App\Models\Patient::where('utilisateur_id', $user->id)->first();
        $enfantsIds = \App\Models\Enfant::where('parent_id', $user->id)->pluck('id');
        $dossiersEnfants = \App\Models\Patient::whereIn('enfant_id', $enfantsIds)->get();

        $allPatientsIds = collect([]);
        if ($dossierPrincipal) $allPatientsIds->push($dossierPrincipal->id);
        foreach ($dossiersEnfants as $d) $allPatientsIds->push($d->id);

        if (!$allPatientsIds->contains($patientId)) {
            return response()->json(['message' => 'Accès non autorisé à ce profil.'], 403);
        }
        $utilisateurId = $patient->utilisateur_id ?? $user->id;
    }

    // --- GESTION DE LA DATE ---
    $dateTimeSouhaitee = $validated['date_souhaitee'] ?? null;
    if ($dateTimeSouhaitee && !empty($validated['time'])) {
        $dateTimeSouhaitee .= ' ' . $validated['time'];
    }

    // --- CRÉATION DE LA DEMANDE ---
    $demande = new \App\Models\DemandeRdv();
    $demande->utilisateur_id = $utilisateurId;
    $demande->type = 'rendez-vous';
    $demande->objet = $validated['objet'];
    
    // On ajoute une note si c'est l'accueil qui a saisi
    $noteAccueil = ($user->role === 'accueil') ? "[Saisi par l'accueil] " : "";
    $desc = $noteAccueil . $validated['description'];
    if ($dateTimeSouhaitee) $desc .= ' (Date/heure souhaitée: ' . $dateTimeSouhaitee . ')';
    
    // Tag technique indispensable pour ton filtrage actuel
    $desc .= ' [PATIENT_ID:' . $patientId . ']';

    $demande->description = $desc;
    $demande->statut = 'en_attente';
    $demande->save();

    return response()->json([
        'message' => 'Demande créée avec succès',
        'demande' => $demande
    ], 201);
}





    // /**
    //  * Valider une demande de rendez-vous (Accueil)
    //  */


    public function valider(Request $request, $id)
    {
        $demande = \App\Models\DemandeRdv::findOrFail($id);

        // Extraire le vrai patient_id depuis la description tagguée
        $realPatientId = null;
        if (preg_match('/\[PATIENT_ID:(\d+)\]/', $demande->description, $matches)) {
            $realPatientId = $matches[1];
        }

        $demande->statut = 'approuvé';
        $demande->save();

        $rdv = new \App\Models\Rdv();
        // Utilise le patient_id extrait, sinon repli sur le dossier du titulaire
        $rdv->patient_id = $realPatientId ?? \App\Models\Patient::where('utilisateur_id', $demande->utilisateur_id)->value('id');
        $rdv->motif = $demande->objet;
        $rdv->dateH_rdv = now();
        $rdv->statut = 'programmé';
        $rdv->save();

        return response()->json(['message' => 'RDV créé', 'rdv' => $rdv]);
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
     * Met à jour le statut d'une demande (Route générique utilisée par le frontend)
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|in:approuvé,rejeté,en_attente,annulé',
            'motif_rejet' => 'required_if:statut,rejeté|string|nullable'
        ]);

        $demande = \App\Models\DemandeRdv::findOrFail($id);
        $nouveauStatut = $request->statut;

        // --- LOGIQUE D'APPROBATION ---
        if ($nouveauStatut === 'approuvé') {
            // On réutilise ton extraction de PATIENT_ID
            $realPatientId = null;
            if (preg_match('/\[PATIENT_ID:(\d+)\]/', $demande->description, $matches)) {
                $realPatientId = $matches[1];
            }

            $demande->statut = 'approuvé';
            $demande->save();

            // Création du RDV réel dans le planning
            $rdv = new \App\Models\Rdv();
            $rdv->patient_id = $realPatientId ?? \App\Models\Patient::where('utilisateur_id', $demande->utilisateur_id)->value('id');
            $rdv->motif = $demande->objet;
            $rdv->dateH_rdv = now(); // Idéalement, extraire la date souhaitée de la description ici
            $rdv->statut = 'programmé';
            $rdv->save();

            return response()->json([
                'message' => 'Demande approuvée et rendez-vous créé.',
                'demande' => $demande,
                'rdv' => $rdv
            ]);
        }

        // --- LOGIQUE DE REJET ---
        if ($nouveauStatut === 'rejeté') {
            $demande->statut = 'rejeté';
            if ($request->motif_rejet) {
                $demande->description .= ' [REJETÉ: ' . $request->motif_rejet . ']';
            }
            $demande->save();

            return response()->json([
                'message' => 'Demande rejetée avec succès.',
                'demande' => $demande
            ]);
        }

        // Mise à jour simple pour les autres cas
        $demande->statut = $nouveauStatut;
        $demande->save();

        return response()->json(['message' => 'Statut mis à jour.', 'demande' => $demande]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

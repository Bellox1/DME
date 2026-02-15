<?php

namespace App\Http\Controllers\Api\Patient;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Patient;
use App\Models\Consultation;
use App\Models\Prescription;
use Illuminate\Support\Facades\DB;

class DossierMedicalController extends Controller
{
    /**
     * Récupérer le dossier médical complet d'un profil spécifique (Soi-même ou un enfant)
     */
    public function show(Request $request, $patientId)
    {
        if (!$request->user()->hasPermission('voir_consultations')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $user = $request->user();

        // Sécurité : Vérifier que ce patientId appartient bien à l'utilisateur (Soi-même ou son Enfant)
        $patient = Patient::where('id', $patientId)
            ->where(function ($query) use ($user) {
                $query->where('utilisateur_id', $user->id) // Cas Adulte
                      ->orWhereHas('enfant', function ($q) use ($user) {
                          $q->where('parent_id', $user->id); // Cas Enfant
                      });
            })
            ->with(['utilisateur', 'enfant'])
            ->first();

        if (!$patient) {
            return response()->json(['message' => 'Dossier non trouvé ou accès non autorisé.'], 403);
        }

        // Récupérer l'historique des consultations
        $consultations = Consultation::where('patient_id', $patient->id)
            ->with(['medecin:id,nom,prenom,role', 'prescriptions'])
            ->orderBy('dateH_visite', 'desc')
            ->get();

        // Extraire les infos clés pour le résumé "Antécédents / Allergies"
        // (On suppose ici que c'est stocké dans chaque consultation, on prend les valeurs non nulles uniques)
        $antecedents = $consultations->pluck('antecedents')->filter()->unique()->values();
        $allergies = $consultations->pluck('allergies')->filter()->unique()->values();

        // Récupérer les "Analyses" (Pour l'instant simulé avec les consultations qui ont un "diagnostic" riche ou des fichiers joints futurs)
        // TODO: Créer une table `analyses` ou `documents` si besoin plus tard. Pour l'instant on retourne les consultations.

        return response()->json([
            'infos_patient' => $patient,
            'constantes' => [
                'poids' => $patient->poids,
                'taille' => $patient->taille,
                'bmi' => ($patient->taille > 0) ? round($patient->poids / (($patient->taille/100) ** 2), 2) : null,
                'groupe_sanguin' => $patient->groupe_sanguin,
            ],
            'resume_medical' => [
                'antecedents' => $antecedents,
                'allergies' => $allergies,
            ],
            'consultations' => $consultations,
            // 'examens' => ... (A implémenter quand table documents/examens dispo)
        ]);
    }

    /**
     * Liste tous les profils (Dossiers) accessibles par cet utilisateur pour le sélecteur de dossier.
     */
    public function listerProfils(Request $request)
    {
        if (!$request->user()->hasPermission('voir_consultations')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $user = $request->user();

        // Dossier Principal
        $principal = Patient::where('utilisateur_id', $user->id)->first();
        
        // Dossiers Enfants
        $enfants = Patient::whereHas('enfant', function($q) use ($user) {
            $q->where('parent_id', $user->id);
        })->with('enfant')->get();

        $liste = [];
        if ($principal) {
            $liste[] = [
                'id' => $principal->id,
                'nom_affichage' => $user->prenom . ' ' . $user->nom . ' (Moi)',
                'type' => 'Titulaire'
            ];
        }

        foreach ($enfants as $e) {
            $liste[] = [
                'id' => $e->id,
                'nom_affichage' => $e->enfant->prenom . ' ' . $e->enfant->nom . ' (Enfant)',
                'type' => 'Enfant'
            ];
        }

        return response()->json($liste);
    }
    /**
     * Liste les examens (Basé sur les consultations pour l'instant)
     */
    public function getExamens(Request $request)
    {
        if (!$request->user()->hasPermission('voir_consultations')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }
        
        $user = $request->user();
        $requestedPatientId = $request->query('patient_id');

        // Récupération des dossiers accessibles pour validation
        $dossierPrincipal = Patient::where('utilisateur_id', $user->id)->first();
        $enfants = \App\Models\Enfant::where('parent_id', $user->id)->get();
        $dossiersEnfants = Patient::whereIn('enfant_id', $enfants->pluck('id'))->get();

        $allPatientsIds = collect([]);
        if ($dossierPrincipal) $allPatientsIds->push($dossierPrincipal->id);
        foreach ($dossiersEnfants as $d) $allPatientsIds->push($d->id);

        $patientsIds = collect([]);
        if ($requestedPatientId && $requestedPatientId !== 'all') {
            if ($allPatientsIds->contains((int)$requestedPatientId)) {
                $patientsIds->push((int)$requestedPatientId);
            } else {
                return response()->json(['message' => 'Accès non autorisé.'], 403);
            }
        } else {
            $patientsIds = $allPatientsIds;
        }

        if ($patientsIds->isEmpty()) {
            return response()->json([]);
        }

        $consultations = Consultation::whereIn('patient_id', $patientsIds)
            ->with(['medecin', 'patient.enfant', 'patient.utilisateur'])
            ->orderBy('dateH_visite', 'desc')
            ->get();

        $examens = $consultations->map(function ($c) {
            // Détection simple du type basé sur des mots clés
            $motif = strtolower($c->motif ?? '');
            $type = 'biologie';
            if (str_contains($motif, 'radio') || str_contains($motif, 'echo') || str_contains($motif, 'irm') || str_contains($motif, 'scan')) {
                $type = 'imagerie';
            }

            return [
                'id' => 'CONS-' . $c->id,
                'type' => $type,
                'title' => $c->motif ?: 'Consultation Standard',
                'lab' => $c->medecin ? ('Dr. ' . $c->medecin->nom) : 'Cabinet Médical',
                'date' => $c->dateH_visite,
                'status' => 'disponible',
                'conclusion' => $c->diagnostic ?: 'Aucun diagnostic enregistré',
                'patient_nom' => $c->patient->nom_complet
            ];
        });

        return response()->json($examens);
    }
}

<?php

namespace App\Http\Controllers\Api\Patient;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Patient;
use App\Models\Enfant;
use App\Models\Rdv;
use App\Models\Consultation;
use App\Models\Prescription;
use App\Models\Demande;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Récupère les statistiques et informations résumées pour le tableau de bord.
     */
    public function index(Request $request)
    {
        if (!$request->user()->hasPermission('voir_rdvs')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $user = $request->user();
        
        // Identifier le profil actif (Soit l'utilisateur lui-même, soit un enfant qu'il gère)
        // Par défaut, on charge tout pour l'utilisateur principal, mais l'interface pourra filtrer
        
        // 1. Récupérer l'ID du dossier patient principal (si existe)
        $dossierPrincipal = Patient::where('utilisateur_id', $user->id)->first();
        
        // 2. Récupérer les IDs des dossiers enfants
        $enfantsIds = Enfant::where('parent_id', $user->id)->pluck('id');
        $dossiersEnfants = Patient::whereIn('enfant_id', $enfantsIds)->get();

        // On fusionne tous les IDs de patients gérés par cet utilisateur pour des stats globales
        $patientsIds = collect([]);
        if ($dossierPrincipal) $patientsIds->push($dossierPrincipal->id);
        foreach ($dossiersEnfants as $d) $patientsIds->push($d->id);

        if ($patientsIds->isEmpty()) {
            return response()->json(['message' => 'Aucun dossier patient associé.'], 200);
        }

        // --- STATISTIQUES ---
        
        // Prochain RDV
        $prochainRdv = Rdv::whereIn('patient_id', $patientsIds)
            ->where('dateH_rdv', '>=', Carbon::now())
            ->where('statut', 'programmé')
            ->orderBy('dateH_rdv', 'asc')
            ->with(['medecin:id,nom,prenom,role', 'patient.enfant', 'patient.utilisateur']) // Pour savoir pour qui c'est
            ->first();

        // Ordonnances Actives (Estimé par date < 1 mois pour l'instant)
        // Idéalement, on vérifierait la durée du traitement
        $ordonnancesActives = Prescription::whereHas('consultation', function($q) use ($patientsIds) {
            $q->whereIn('patient_id', $patientsIds);
        })
        ->where('date_creation', '>=', Carbon::now()->subDays(30))
        ->count();

        // Dernières Activités (Fusion RDVs passés, Consultations et Demandes)
        
        // 1. Les RDVs passés
        $rdvsPasses = Rdv::whereIn('patient_id', $patientsIds)
            ->where('dateH_rdv', '<', Carbon::now())
            ->orderBy('dateH_rdv', 'desc')
            ->take(5)
            ->get()
            ->map(function($item) {
                return [
                    'type' => 'rdv',
                    'date' => $item->dateH_rdv,
                    'medecin' => $item->medecin ? "Dr. " . $item->medecin->nom : 'Inconnu',
                    'motif' => $item->motif,
                    'statut' => $item->statut
                ];
            });

        // 2. Les Consultations passées
        $consultationsPassees = Consultation::whereIn('patient_id', $patientsIds)
            ->orderBy('dateH_visite', 'desc')
            ->take(5)
            ->get()
            ->map(function($item) {
                return [
                    'type' => 'consultation',
                    'date' => $item->dateH_visite,
                    'medecin' => $item->medecin ? "Dr. " . $item->medecin->nom : 'Inconnu',
                    'motif' => $item->motif, // "Consultation (Motif)"
                    'statut' => 'Terminé'
                ];
            });

        // 3. Les Demandes (Requêtes administratives)
        $demandesPassees = Demande::where('utilisateur_id', $user->id)
            ->orderBy('date_creation', 'desc')
            ->take(5)
            ->get()
            ->map(function($item) {
                return [
                    'type' => 'demande',
                    'date' => $item->date_creation,
                    'medecin' => 'Service Client',
                    'motif' => ucfirst($item->type) . ' : ' . $item->objet,
                    'statut' => $item->statut
                ];
            });

        // 4. Fusion et Tri
        $activites = $rdvsPasses->merge($consultationsPassees)
            ->merge($demandesPassees)
            ->sortByDesc('date')
            ->take(7) // On prend un peu plus pour avoir de la variété
            ->values();

        return response()->json([
            'prochain_rdv' => $prochainRdv,
            'stats' => [
                'ordonnances_actives' => $ordonnancesActives,
                'total_dossiers_geres' => $patientsIds->count(),
                'nom_principal' => $user->prenom,
            ],
            'activites_recentes' => $activites
        ]);
    }
    /**
     * Récupère TOUTES les activités pour la page d'historique complet.
     */
    public function toutesActivites(Request $request) {
        if (!$request->user()->hasPermission('voir_rdvs')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $user = $request->user();
        
        // --- Récupération des IDs de patients (Même logique que index) ---
        $dossierPrincipal = Patient::where('utilisateur_id', $user->id)->first();
        $enfantsIds = Enfant::where('parent_id', $user->id)->pluck('id');
        $dossiersEnfants = Patient::whereIn('enfant_id', $enfantsIds)->get();

        $patientsIds = collect([]);
        if ($dossierPrincipal) $patientsIds->push($dossierPrincipal->id);
        foreach ($dossiersEnfants as $d) $patientsIds->push($d->id);

        if ($patientsIds->isEmpty()) {
            return response()->json([]);
        }

        // 1. Tous les RDVs (Futurs et Passés)
        $rdvs = Rdv::whereIn('patient_id', $patientsIds)
            ->orderBy('dateH_rdv', 'desc')
            ->get()
            ->map(function($item) {
                return [
                    'type' => 'rdv',
                    'date' => $item->dateH_rdv,
                    'medecin' => $item->medecin ? "Dr. " . $item->medecin->nom : 'Inconnu',
                    'motif' => $item->motif,
                    'statut' => $item->statut
                ];
            });

        // 2. Toutes les Consultations
        $consultations = Consultation::whereIn('patient_id', $patientsIds)
            ->orderBy('dateH_visite', 'desc')
            ->get()
            ->map(function($item) {
                return [
                    'type' => 'consultation',
                    'date' => $item->dateH_visite,
                    'medecin' => $item->medecin ? "Dr. " . $item->medecin->nom : 'Inconnu',
                    'motif' => $item->motif ?: 'Consultation',
                    'statut' => 'Terminé'
                ];
            });

        // 3. Toutes les Demandes
        $demandes = Demande::where('utilisateur_id', $user->id)
            ->orderBy('date_creation', 'desc')
            ->get()
            ->map(function($item) {
                return [
                    'type' => 'demande',
                    'date' => $item->date_creation,
                    'medecin' => 'Service Client',
                    'motif' => ucfirst($item->type) . ' : ' . $item->objet,
                    'statut' => $item->statut
                ];
            });

        // Fusion et Tri Global
        $activites = $rdvs->merge($consultations)
            ->merge($demandes)
            ->sortByDesc('date')
            ->values();

        return response()->json($activites);
    }
}

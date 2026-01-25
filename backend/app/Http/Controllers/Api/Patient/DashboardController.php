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
        
        // --- Récupération des dossiers accessibles ---
        $dossierPrincipal = Patient::where('utilisateur_id', $user->id)->first();
        $enfantsIds = Enfant::where('parent_id', $user->id)->pluck('id');
        $dossiersEnfants = Patient::whereIn('enfant_id', $enfantsIds)->get();

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

        // --- STATISTIQUES ---
        
        $prochainRdv = Rdv::whereIn('patient_id', $patientsIds)
            ->where('dateH_rdv', '>=', Carbon::now())
            ->where('statut', 'programmé')
            ->orderBy('dateH_rdv', 'asc')
            ->with(['medecin:id,nom,prenom,role', 'patient.enfant', 'patient.utilisateur'])
            ->first();

        if ($prochainRdv) {
            $prochainRdv->patient_nom = $prochainRdv->patient->nom_complet;
        }

        // Ordonnances Actives (Estimé par date < 1 mois pour l'instant)
        // Idéalement, on vérifierait la durée du traitement
        $ordonnancesActives = Prescription::whereHas('consultation', function($q) use ($patientsIds) {
            $q->whereIn('patient_id', $patientsIds);
        })
        ->where('date_creation', '>=', Carbon::now()->subDays(30))
        ->count();

        // Dernières Activités (Fusion RDVs passés, Consultations et Demandes)
        
        $rdvsPasses = Rdv::whereIn('patient_id', $patientsIds)
            ->where('dateH_rdv', '<', Carbon::now())
            ->with(['medecin:id,nom', 'patient.enfant', 'patient.utilisateur'])
            ->orderBy('dateH_rdv', 'desc')
            ->take(5)
            ->get()
            ->map(function($item) {
                return [
                    'type' => 'rdv',
                    'date' => $item->dateH_rdv,
                    'medecin' => $item->medecin ? "Dr. " . $item->medecin->nom : 'Inconnu',
                    'motif' => $item->motif,
                    'statut' => $item->statut,
                    'patient_nom' => $item->patient->nom_complet
                ];
            });

        $consultationsPassees = Consultation::whereIn('patient_id', $patientsIds)
            ->with(['medecin:id,nom', 'patient.enfant', 'patient.utilisateur'])
            ->orderBy('dateH_visite', 'desc')
            ->take(5)
            ->get()
            ->map(function($item) {
                return [
                    'type' => 'consultation',
                    'date' => $item->dateH_visite,
                    'medecin' => $item->medecin ? "Dr. " . $item->medecin->nom : 'Inconnu',
                    'motif' => $item->motif,
                    'statut' => 'Terminé',
                    'patient_nom' => $item->patient->nom_complet
                ];
            });

        // 3. Les Demandes (Uniquement si on regarde le dossier du titulaire ou la vue globale)
        $isTitulaire = $dossierPrincipal && $patientsIds->contains($dossierPrincipal->id);
        $demandesPassees = collect([]);

        if ($requestedPatientId === 'all' || $isTitulaire) {
            $demandesPassees = Demande::where('utilisateur_id', $user->id)
                ->orderBy('date_creation', 'desc')
                ->take(5)
                ->get()
                ->map(function($item) use ($user) {
                    return [
                        'type' => 'demande',
                        'date' => $item->date_creation,
                        'medecin' => 'Service Client',
                        'motif' => ucfirst($item->type) . ' : ' . $item->objet,
                        'statut' => $item->statut,
                        'patient_nom' => $user->prenom
                    ];
                });
        }

        // 4. Fusion et Tri
        $activites = $rdvsPasses->merge($consultationsPassees)
            ->merge($demandesPassees)
            ->sortByDesc('date')
            ->take(7) // On prend un peu plus pour avoir de la variété
            ->values();

        // 5. Données pour le Graphique (6 derniers mois)
        $chartData = [];
        $originalLocale = Carbon::getLocale();
        Carbon::setLocale('fr');
        
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $start = $month->copy()->startOfMonth();
            $end = $month->copy()->endOfMonth();

            $count = Rdv::whereIn('patient_id', $patientsIds)
                ->whereBetween('dateH_rdv', [$start, $end])
                ->count();
            
            $count += Consultation::whereIn('patient_id', $patientsIds)
                ->whereBetween('dateH_visite', [$start, $end])
                ->count();

            $chartData[] = [
                'name' => $month->translatedFormat('M'),
                'visites' => $count
            ];
        }
        Carbon::setLocale($originalLocale);

        return response()->json([
            'prochain_rdv' => $prochainRdv,
            'stats' => [
                'ordonnances_actives' => $ordonnancesActives,
                'total_dossiers_geres' => $allPatientsIds->count(), // Toujours le total des dossiers accessibles
                'nom_principal' => $requestedPatientId 
                    ? (Patient::find($requestedPatientId)->enfant->prenom ?? $user->prenom) 
                    : $user->prenom,
            ],
            'chart_data' => $chartData,
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
        
        // --- Récupération des IDs de patients ---
        $dossierPrincipal = Patient::where('utilisateur_id', $user->id)->first();
        $enfantsIds = Enfant::where('parent_id', $user->id)->pluck('id');
        $allPatientsIds = collect([]);
        if ($dossierPrincipal) $allPatientsIds->push($dossierPrincipal->id);
        $dossiersEnfants = Patient::whereIn('enfant_id', $enfantsIds)->get();
        foreach ($dossiersEnfants as $d) $allPatientsIds->push($d->id);

        // --- Filtrage ---
        $requestedPatientId = $request->query('patient_id');
        $patientsIds = collect([]);

        if ($requestedPatientId && $requestedPatientId !== 'all') {
            if ($allPatientsIds->contains($requestedPatientId)) {
                $patientsIds->push($requestedPatientId);
            } else {
                return response()->json(['message' => 'Accès non autorisé.'], 403);
            }
        } elseif ($requestedPatientId === 'all') {
            $patientsIds = $allPatientsIds;
        } else {
            // Par défaut : Titulaire
            if ($dossierPrincipal) {
                $patientsIds->push($dossierPrincipal->id);
            } else if ($allPatientsIds->isNotEmpty()) {
                $patientsIds->push($allPatientsIds->first());
            }
        }

        if ($patientsIds->isEmpty()) {
            return response()->json([]);
        }

        $rdvs = Rdv::whereIn('patient_id', $patientsIds)
            ->with(['medecin:id,nom', 'patient.enfant', 'patient.utilisateur'])
            ->orderBy('dateH_rdv', 'desc')
            ->get()
            ->map(function($item) {
                return [
                    'type' => 'rdv',
                    'date' => $item->dateH_rdv,
                    'medecin' => $item->medecin ? "Dr. " . $item->medecin->nom : 'Inconnu',
                    'motif' => $item->motif,
                    'statut' => $item->statut,
                    'patient_nom' => $item->patient->nom_complet
                ];
            });

        // 2. Toutes les Consultations
        $consultations = Consultation::whereIn('patient_id', $patientsIds)
            ->with(['medecin:id,nom', 'patient.enfant', 'patient.utilisateur'])
            ->orderBy('dateH_visite', 'desc')
            ->get()
            ->map(function($item) {
                return [
                    'type' => 'consultation',
                    'date' => $item->dateH_visite,
                    'medecin' => $item->medecin ? "Dr. " . $item->medecin->nom : 'Inconnu',
                    'motif' => $item->motif ?: 'Consultation',
                    'statut' => 'Terminé',
                    'patient_nom' => $item->patient->nom_complet
                ];
            });

        // 3. Toutes les Demandes (Uniquement pour le titulaire)
        $isTitulaire = $dossierPrincipal && $patientsIds->contains($dossierPrincipal->id);
        $demandes = collect([]);

        if ($requestedPatientId === 'all' || $isTitulaire) {
            $demandes = Demande::where('utilisateur_id', $user->id)
                ->orderBy('date_creation', 'desc')
                ->get()
                ->map(function($item) use ($user) {
                    return [
                        'type' => 'demande',
                        'date' => $item->date_creation,
                        'medecin' => 'Service Client',
                        'motif' => ucfirst($item->type) . ' : ' . $item->objet,
                        'statut' => $item->statut,
                        'patient_nom' => $user->prenom
                    ];
                });
        }

        // Fusion et Tri Global
        $activites = $rdvs->merge($consultations)
            ->merge($demandes)
            ->sortByDesc('date')
            ->values();

        return response()->json($activites);
    }
}

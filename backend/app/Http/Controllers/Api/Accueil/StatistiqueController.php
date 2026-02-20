<?php

namespace App\Http\Controllers\Api\Accueil;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Rdv;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class StatistiqueController extends Controller
{
    public function getGlobalStats(): JsonResponse
    {
        // 1. Initialisation des variables par défaut (évite l'erreur Undefined variable)
        $chartData = [0, 0, 0, 0, 0, 0, 0];
        $statsStatuts = ['programmé' => 0, 'passé' => 0, 'annulé' => 0];

        try {
            // 1. Total Patients (Global)
            $totalPatients = Patient::count();
            $totalAutonomes = Patient::whereNull('enfant_id')->count();
            $totalEnfants = Patient::whereNotNull('enfant_id')->count();

            // 2. Rendez-vous d'AUJOURD'HUI (tous sauf annulés)
            $totalRdvsToday = Rdv::whereDate('dateH_rdv', Carbon::today())
                ->where('statut', '!=', 'annulé')
                ->count();

            // 3. Rendez-vous déjà PASSÉS aujourd'hui
            $rdvsPassesToday = Rdv::whereDate('dateH_rdv', Carbon::today())
                ->where('statut', 'passé')
                ->count();

            // 3. Répartition des statuts
            $repartition = Rdv::select('statut', DB::raw('count(*) as total'))
                ->groupBy('statut')
                ->get()
                ->pluck('total', 'statut')
                ->toArray();

            $statsStatuts = [
                'programmé' => $repartition['programmé'] ?? 0,
                'passé' => $repartition['passé'] ?? 0,
                'annulé' => $repartition['annulé'] ?? 0,
            ];

            // 4. Calcul de l'activité (7 derniers jours)
            $lastSevenDays = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i)->format('Y-m-d');
                $lastSevenDays[$date] = 0;
            }

            $activities = Rdv::select(
                DB::raw('DATE(dateH_rdv) as date'),
                DB::raw('count(*) as aggregate')
            )
                ->where('dateH_rdv', '>=', Carbon::now()->subDays(6)->startOfDay())
                ->groupBy('date')
                ->get()
                ->pluck('aggregate', 'date');

            // On réinitialise chartData avec les vraies valeurs
            $chartData = [];
            foreach ($lastSevenDays as $date => $count) {
                $chartData[] = $activities[$date] ?? 0;
            }

            return response()->json([
                'total_patients' => $totalPatients,
                'total_autonomes' => $totalAutonomes,
                'total_enfants' => $totalEnfants,
                'total_rdv_today' => $totalRdvsToday,
                'rdvs_passes_today' => $rdvsPassesToday,
                'avg_time' => 15,
                'activity' => $chartData,
                'statuts' => $statsStatuts,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur technique',
                'activity' => [0, 0, 0, 0, 0, 0, 0],
                'statuts' => ['programmé' => 0, 'passé' => 0, 'annulé' => 0],
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
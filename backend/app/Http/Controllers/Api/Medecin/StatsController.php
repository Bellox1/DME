<?php

namespace App\Http\Controllers\Api\Medecin;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use App\Models\Rdv;
use App\Models\Patient;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function index(Request $request)
    {
        $medecinId = $request->user()->id;
        $now = Carbon::now();
        // 1. Consultations (Mois en cours vs Mois précédent)
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        $currentMonthConsultations = Consultation::where('medecin_id', $medecinId)
            ->whereBetween('dateH_visite', [$startOfMonth, $now])
            ->count();

        $lastMonthConsultations = Consultation::where('medecin_id', $medecinId)
            ->whereBetween('dateH_visite', [$startOfLastMonth, $endOfLastMonth])
            ->count();

        $consultationTrend = 0;
        if ($lastMonthConsultations > 0) {
            $consultationTrend = round((($currentMonthConsultations - $lastMonthConsultations) / $lastMonthConsultations) * 100);
        }

        // 2. Patients Totaux (Nombre de patients uniques ayant consulté ce médecin)
        $totalPatientsCount = Consultation::where('medecin_id', $medecinId)
            ->distinct('patient_id')
            ->count('patient_id');

        // 3. Taux de Présence (RDV Honorés)
        $totalRdvs = Rdv::where('medecin_id', $medecinId)
            ->whereIn('statut', ['passé', 'programmé'])
            ->count();
        
        $honoredRdvs = Rdv::where('medecin_id', $medecinId)
            ->where('statut', 'passé')
            ->count();

        $presenceRate = $totalRdvs > 0 ? round(($honoredRdvs / $totalRdvs) * 100) : 0;

        // 4. Activité Mensuelle (12 derniers mois)
        $monthlyActivity = [];
        for ($i = 11; $i >= 0; $i--) {
            $monthStart = $now->copy()->subMonths($i)->startOfMonth();
            $monthEnd = $now->copy()->subMonths($i)->endOfMonth();
            
            $count = Consultation::where('medecin_id', $medecinId)
                ->whereBetween('dateH_visite', [$monthStart, $monthEnd])
                ->count();
                
            $monthlyActivity[] = [
                'label' => $monthStart->format('M'),
                'value' => $count
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'cards' => [
                    [
                        'label' => 'Consultations (Mois)',
                        'value' => (string)$currentMonthConsultations,
                        'trend' => ($consultationTrend >= 0 ? '+' : '') . $consultationTrend . '%',
                        'icon' => 'summarize',
                        'color' => 'bg-primary'
                    ],
                    [
                        'label' => 'Patients Totaux',
                        'value' => (string)$totalPatientsCount,
                        'trend' => 'Global',
                        'icon' => 'group',
                        'color' => 'bg-indigo-500'
                    ],
                    [
                        'label' => 'Rendez-vous Honorés',
                        'value' => $presenceRate . '%',
                        'trend' => 'Taux global',
                        'icon' => 'event_available',
                        'color' => 'bg-emerald-500'
                    ],
                ],
                'chart' => $monthlyActivity
            ]
        ]);
    }
}

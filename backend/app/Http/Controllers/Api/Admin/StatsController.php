<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use App\Models\Consultation;
use App\Models\Rdv;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function index(Request $request)
    {
        // 1. Utilisateurs par rôle
        $usersByRole = Utilisateur::select('role', DB::raw('count(*) as count'))
            ->groupBy('role')
            ->pluck('count', 'role')
            ->toArray();

        $totalUsers = Utilisateur::count();
        $patients = $usersByRole['patient'] ?? 0;
        $medecins = $usersByRole['medecin'] ?? 0;
        $accueil = $usersByRole['accueil'] ?? 0;
        $admins = $usersByRole['admin'] ?? 0;

        // 2. Consultations
        $totalConsultations = Consultation::count();
        $consultationsPaid = Consultation::where('paye', true)->count();
        $consultationsUnpaid = Consultation::where('paye', false)->count();

        // Chiffre d'affaires (somme des consultations payées)
        $revenue = Consultation::where('paye', true)->sum('prix');

        // 3. Rendez-vous par statut
        $rdvsByStatus = Rdv::select('statut', DB::raw('count(*) as count'))
            ->groupBy('statut')
            ->pluck('count', 'statut')
            ->toArray();

        $totalRdvs = Rdv::count();
        $rdvsProgrammes = $rdvsByStatus['programmé'] ?? 0;
        $rdvsAnnules = $rdvsByStatus['annulé'] ?? 0;
        $rdvsPasses = $rdvsByStatus['passé'] ?? 0;

        // 4. Activité mensuelle (12 derniers mois)
        $monthlyActivity = [];
        for ($i = 11; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $count = Consultation::whereYear('date_creation', $month->year)
                ->whereMonth('date_creation', $month->month)
                ->count();

            $monthlyActivity[] = [
                'month' => $month->format('M'),
                'year' => $month->year,
                'count' => $count,
                'percentage' => $totalConsultations > 0 ? round(($count / $totalConsultations) * 100, 1) : 0
            ];
        }

        // 5. Dernières inscriptions (5 derniers utilisateurs)
        $recentUsers = Utilisateur::orderBy('date_creation', 'desc')
            ->take(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'role' => $user->role,
                    'created_at' => $user->date_creation,
                    'time_ago' => $user->date_creation->diffForHumans()
                ];
            });

        // 6. Calcul du taux d'occupation (basé sur les consultations du mois)
        $consultationsThisMonth = Consultation::whereYear('date_creation', now()->year)
            ->whereMonth('date_creation', now()->month)
            ->count();

        $consultationsLastMonth = Consultation::whereYear('date_creation', now()->subMonth()->year)
            ->whereMonth('date_creation', now()->subMonth()->month)
            ->count();

        $occupancyRate = $medecins > 0 ? round(($consultationsThisMonth / ($medecins * 30)) * 100, 1) : 0;

        // 7. Calcul des variations (pourcentages de changement)
        $userGrowth = $this->calculateGrowth(Utilisateur::class);
        $revenueGrowth = $this->calculateRevenueGrowth();
        $consultationGrowth = $consultationsLastMonth > 0
            ? round((($consultationsThisMonth - $consultationsLastMonth) / $consultationsLastMonth) * 100, 1)
            : 0;

        return response()->json([
            'users' => [
                'total' => $totalUsers,
                'patients' => $patients,
                'medecins' => $medecins,
                'accueil' => $accueil,
                'admins' => $admins,
                'growth' => $userGrowth
            ],
            'consultations' => [
                'total' => $totalConsultations,
                'paid' => $consultationsPaid,
                'unpaid' => $consultationsUnpaid,
                'this_month' => $consultationsThisMonth,
                'growth' => $consultationGrowth
            ],
            'revenue' => [
                'total' => $revenue,
                'growth' => $revenueGrowth
            ],
            'rdvs' => [
                'total' => $totalRdvs,
                'programmes' => $rdvsProgrammes,
                'annules' => $rdvsAnnules,
                'passes' => $rdvsPasses
            ],
            'monthly_activity' => $monthlyActivity,
            'recent_users' => $recentUsers,
            'occupancy_rate' => $occupancyRate
        ]);
    }

    private function calculateGrowth($model)
    {
        $thisMonth = $model::whereYear('date_creation', now()->year)
            ->whereMonth('date_creation', now()->month)
            ->count();

        $lastMonth = $model::whereYear('date_creation', now()->subMonth()->year)
            ->whereMonth('date_creation', now()->subMonth()->month)
            ->count();

        if ($lastMonth == 0) {
            return $thisMonth > 0 ? 100 : 0;
        }

        return round((($thisMonth - $lastMonth) / $lastMonth) * 100, 1);
    }

    private function calculateRevenueGrowth()
    {
        $thisMonth = Consultation::where('paye', true)
            ->whereYear('date_creation', now()->year)
            ->whereMonth('date_creation', now()->month)
            ->sum('prix');

        $lastMonth = Consultation::where('paye', true)
            ->whereYear('date_creation', now()->subMonth()->year)
            ->whereMonth('date_creation', now()->subMonth()->month)
            ->sum('prix');

        if ($lastMonth == 0) {
            return $thisMonth > 0 ? 100 : 0;
        }

        return round((($thisMonth - $lastMonth) / $lastMonth) * 100, 1);
    }
}

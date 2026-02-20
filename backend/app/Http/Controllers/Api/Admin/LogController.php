<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tracabilite;
use Illuminate\Http\Request;

class LogController extends Controller
{
    /**
     * List system logs (tracabilites)
     */
    public function index()
    {
        // 50 derniers logs, avec l'utilisateur associé
        $logs = Tracabilite::with('utilisateur')
            ->orderBy('dateH', 'desc')
            ->take(50)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'time' => $log->dateH, // Format will be handled by frontend or cast
                    'user' => $log->utilisateur ? $log->utilisateur->nom . ' ' . $log->utilisateur->prenom : 'Système/Inconnu',
                    'action' => $log->action . ' - ' . $log->nouvelle_valeur,
                    'table' => $log->nom_table
                ];
            });

        return response()->json($logs);
    }
}

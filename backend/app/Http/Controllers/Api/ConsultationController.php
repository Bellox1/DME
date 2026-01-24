<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Consultation;

class ConsultationController extends Controller
{
    /**
     * Met à jour le paiement d'une consultation.
     */
    public function updatePaiement(Request $request, $id)
    {
        $validated = $request->validate([
            'paye' => 'required|boolean',
            'mode_paiement' => 'required|string|max:50',
        ]);

        $consultation = Consultation::findOrFail($id);
        $consultation->paye = $validated['paye'];
        $consultation->mode_paiement = $validated['mode_paiement'];
        $consultation->save();

        return response()->json(['message' => 'Paiement mis à jour', 'consultation' => $consultation]);
    }

    /**
     * Statistiques journalières des paiements par mode de paiement.
     */
    public function statsJournalieres()
    {
        $today = now()->toDateString();
        $stats = Consultation::whereDate('dateH_visite', $today)
            ->where('paye', true)
            ->selectRaw('mode_paiement, COUNT(*) as nb, SUM(prix) as total')
            ->groupBy('mode_paiement')
            ->get();
        return response()->json($stats);
    }
}

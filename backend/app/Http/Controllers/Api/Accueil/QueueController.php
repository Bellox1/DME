<?php

namespace App\Http\Controllers\Api\Accueil;

use App\Http\Controllers\Controller;
use App\Models\Rdv;
use Illuminate\Http\Request;
use Carbon\Carbon;

class QueueController extends Controller
{
    /**
     * Liste la file d'attente du jour.
     */
    public function index(Request $request)
    {
        // Déterminer la date de filtrage
        $date = $request->query('date') ? Carbon::parse($request->query('date')) : Carbon::today();

        $query = Rdv::with(['patient', 'medecin'])
            ->whereDate('dateH_rdv', $date)
            ->orderBy('dateH_rdv', 'asc');

        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        } else {
            // Par défaut, on filtre toujours par statut (on évite de tout mélanger)
            // L'accueil veut surtout voir les programmés pour aujourd'hui
            $query->whereIn('statut', ['programmé', 'passé', 'annulé']);
        }

        $rdvs = $query->get();

        return response()->json([
            'success' => true,
            'data' => $rdvs
        ]);
    }

    /**
     * Change le statut d'un RDV (Gestion du flux patient).
     */

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            // Strictement conforme à votre migration
            'statut' => 'required|in:programmé,annulé,passé',
        ]);

        try {
            $rdv = Rdv::findOrFail($id);
            $rdv->statut = $request->statut;
            $rdv->save();

            return response()->json([
                'success' => true,
                'message' => 'Statut mis à jour avec succès',
                'data' => $rdv
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de la mise à jour'], 404);
        }
    }
}

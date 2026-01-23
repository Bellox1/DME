<?php

namespace App\Http\Controllers\Api;

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
        // Récupérer les RDVs du jour
        // On peut filtrer par medecin si l'utilisateur connecté est un médecin
        // On exclut les RDVs annulés ? Ou on les garde pour historique ?
        // Pour la file d'attente "active", on veut ceux qui ne sont pas encore passés ou qui sont arrivés.
        
        $query = Rdv::with(['patient', 'medecin'])
            ->whereDate('dateH_rdv', Carbon::today())
            ->orderBy('dateH_rdv', 'asc');

        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        } else {
            // Par défaut, on ne montre pas les annulés ?
             $query->where('statut', '!=', 'annulé');
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
            'statut' => 'required|in:programmé,annulé,passé',
        ]);

        $rdv = Rdv::findOrFail($id);
        $rdv->statut = $request->statut;
        $rdv->save();

        return response()->json([
            'success' => true,
            'message' => 'Statut mis à jour avec succès',
            'data' => $rdv
        ]);
    }
}

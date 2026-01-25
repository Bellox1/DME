<?php

namespace App\Http\Controllers\Api\Patient;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Demande;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->user()->hasPermission('voir_demandes')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $user = $request->user();
        \Carbon\Carbon::setLocale('fr');
        
        // On récupère les demandes traitées (approuvé ou rejeté) liées au compte
        $demandesTraitees = Demande::where('utilisateur_id', $user->id)
            ->whereIn('statut', ['approuvé', 'rejeté'])
            ->orderBy('date_modification', 'desc')
            ->get()
            ->map(function($demande) use ($user) {
                return [
                    'id' => 'DEM-' . $demande->id,
                    'type' => 'assignment', 
                    'title' => 'Demande traitée',
                    'desc' => "Votre demande \"" . $demande->objet . "\" a été " . $demande->statut . ".",
                    'time' => $demande->date_modification->diffForHumans(),
                    'isUnread' => $demande->date_modification->gt(now()->subDays(1)),
                    'statut' => $demande->statut,
                    'patient_nom' => $user->prenom
                ];
            });

        return response()->json($demandesTraitees);
    }
}

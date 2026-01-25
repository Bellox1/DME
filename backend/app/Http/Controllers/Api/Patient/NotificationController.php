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
        
        // On récupère les demandes traitées (approuvé ou rejeté)
        // On les trie par date de modification (date du traitement)
        $demandesTraitees = Demande::where('utilisateur_id', $user->id)
            ->whereIn('statut', ['approuvé', 'rejeté'])
            ->orderBy('date_modification', 'desc')
            ->get()
            ->map(function($demande) {
                return [
                    'id' => 'DEM-' . $demande->id,
                    'type' => 'assignment', // Icône pour les demandes
                    'title' => 'Demande traitée',
                    'desc' => "Votre demande \"" . $demande->objet . "\" a été " . $demande->statut . ".",
                    'time' => $demande->date_modification->diffForHumans(),
                    'isUnread' => $demande->date_modification->gt(now()->subDays(1)), // Simulé : considéré comme non lu si traité il y a moins de 24h
                    'statut' => $demande->statut
                ];
            });

        return response()->json($demandesTraitees);
    }
}

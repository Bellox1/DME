<?php

use App\Models\Utilisateur;
use App\Models\Patient;

// Récupérer l'utilisateur AUTONOME
$user = Utilisateur::where('tel', '+22997000001')->first();

if (!$user) {
    echo "Utilisateur NON TROUVÉ.\n";
    exit;
}

echo "Utilisateur trouvé : {$user->prenom} {$user->nom} (ID: {$user->id})\n";

// Chercher son dossier patient
$patient = Patient::where('utilisateur_id', $user->id)->first();

if ($patient) {
    echo "Dossier Patient TROUVÉ (ID: {$patient->id})\n";
    echo "Taille: {$patient->taille}, Poids: {$patient->poids}\n";
} else {
    echo "Dossier Patient NON TROUVÉ pour cet utilisateur.\n";
    // Listons tous les patients pour voir
    echo "Total patients en base: " . Patient::count() . "\n";
}

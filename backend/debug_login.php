<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Utilisateur;

$login = "0158067394";
$standardized = \App\Helpers\PhoneHelper::formatGeneric($login);

echo "Recherche pour le numéro : $login\n";
echo "Format standardisé attendu : $standardized\n";

$user = Utilisateur::where('tel', $standardized)
    ->orWhere('whatsapp', $standardized)
    ->first();

if ($user) {
    echo "UTILISATEUR TROUVÉ !\n";
    echo "ID: " . $user->id . "\n";
    echo "Nom: " . $user->nom . "\n";
    echo "Rôle: " . $user->role . "\n";
    echo "Tel stocké: " . $user->tel . "\n";
    echo "WhatsApp stocké: " . $user->whatsapp . "\n";
} else {
    echo "UTILISATEUR NON TROUVÉ EN BDD.\n";
    echo "\nListe de TOUS les utilisateurs inscrits :\n";
    $all = Utilisateur::all();
    foreach ($all as $r) {
        echo "- ID: {$r->id} | Role: {$r->role} | Nom: {$r->nom} | Tel: '{$r->tel}' | WA: '{$r->whatsapp}'\n";
    }
}

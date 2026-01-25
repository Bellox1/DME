<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- COMPTES DISPONIBLES ---\n";
foreach(\App\Models\Utilisateur::all() as $u) {
    echo "- Role: [{$u->role}] | Nom: {$u->nom} | Login (Tel): " . ($u->tel ?? $u->whatsapp) . "\n";
}
echo "---------------------------\n";
echo "Note: Le mot de passe par défaut pour les comptes de test est 'password'.\n";

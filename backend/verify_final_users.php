<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- LISTE FINALE DES UTILISATEURS ---\n";
foreach(\App\Models\Utilisateur::all() as $u) {
    echo "ROLE: {$u->role} | NOM: {$u->nom} | TEL: {$u->tel}\n";
}
echo "--- FIN ---\n";

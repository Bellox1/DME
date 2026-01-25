<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$medics = \App\Models\Utilisateur::where('role', 'medecin')->get();
echo "--- LISTE DES MÉDECINS ---\n";
foreach($medics as $u) {
    echo "ID: {$u->id} | Nom: {$u->nom} | Tel: [{$u->tel}] | WA: [{$u->whatsapp}]\n";
}
echo "--- FIN ---\n";

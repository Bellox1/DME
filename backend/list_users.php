<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = \App\Models\Utilisateur::all();
echo "--- LISTE DES UTILISATEURS ---\n";
foreach($users as $u) {
    echo "ID: {$u->id} | Role: {$u->role} | Nom: {$u->nom} | Tel: [{$u->tel}] | WA: [{$u->whatsapp}]\n";
}
echo "--- FIN ---\n";

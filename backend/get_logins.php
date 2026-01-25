<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = \App\Models\Utilisateur::all();
foreach($users as $u) {
    echo "ROLE: {$u->role} | LOGIN: " . ($u->tel ?? $u->whatsapp) . " | NOM: {$u->nom}\n";
}

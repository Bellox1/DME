<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\Utilisateur::where('role', 'medecin')->first();
if ($user) {
    echo "ID: {$user->id}\n";
    echo "NOM: {$user->nom}\n";
    echo "TEL_BDD: [" . $user->tel . "]\n";
    echo "WA_BDD: [" . $user->whatsapp . "]\n";
} else {
    echo "AUCUN MEDECIN\n";
}

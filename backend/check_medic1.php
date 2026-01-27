<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Utilisateur;

$u = Utilisateur::where('nom', 'LIKE', 'Medecin1%')->first();
if ($u) {
    echo "TROUVE\n";
    echo "NOM: {$u->nom}\n";
    echo "TEL_BDD: {$u->tel}\n";
} else {
    echo "MEDECIN 1 NON TROUVE\n";
}

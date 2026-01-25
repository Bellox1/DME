<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\Utilisateur::where('role', 'medecin')->first();
if ($user) {
    echo "FMT_LOGIN: " . ($user->tel ?? $user->whatsapp) . "\n";
    echo "FMT_TEL: [" . $user->tel . "]\n";
    echo "FMT_WA: [" . $user->whatsapp . "]\n";
} else {
    echo "NO_MEDIC_FOUND\n";
}

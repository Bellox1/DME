<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$u = \App\Models\Utilisateur::where('role', 'medecin')->first();
if ($u) {
    echo "--- CREDENTIALS MEDECIN ---\n";
    echo "Nom: {$u->nom} {$u->prenom}\n";
    echo "Login (Tel): " . ($u->tel ?? $u->whatsapp) . "\n";
    echo "Note: Utilisez le mot de passe habituel (ex: password) utilisé lors des tests.\n";
} else {
    echo "Aucun médecin trouvé.\n";
}

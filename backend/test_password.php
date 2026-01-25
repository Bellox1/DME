<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Utilisateur;
use Illuminate\Support\Facades\Hash;
use App\Helpers\PhoneHelper;

$search = "0646462897";
$standardized = PhoneHelper::formatGeneric($search);
$password = "password";

$user = Utilisateur::where('tel', $standardized)
    ->orWhere('whatsapp', $standardized)
    ->first();

echo "Recherche: $search -> Standardisé: $standardized\n";

if ($user) {
    echo "Utilisateur trouvé: #{$user->id} {$user->nom}\n";
    echo "Hachage BDD: " . $user->mot_de_passe . "\n";
    $match = Hash::check($password, $user->mot_de_passe);
    echo "Match 'password' : " . ($match ? "OUI" : "NON") . "\n";
} else {
    echo "Utilisateur NON trouvé.\n";
}

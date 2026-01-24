<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Utilisateur;
use Illuminate\Support\Facades\Hash; // Add Import

try {
    echo "Creating Medecin...\n";
    $medecin = Utilisateur::create([
        'nom' => 'Docteur',
        'prenom' => 'House',
        'role' => 'medecin',
        'mot_de_passe' => Hash::make('password'),
        'tel' => '06' . rand(10000000, 99999999), // Unique phone
        'sexe' => 'Homme'
    ]);
    echo "Medecin created: " . $medecin->id . "\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}

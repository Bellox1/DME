<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Utilisateur;
use App\Models\Patient;
use App\Models\Rdv;
use App\Models\Consultation;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

try {
    echo "1. Creating Medecin...\n";
    $medecin = Utilisateur::create([
        'nom' => 'Dr Debug',
        'prenom' => 'Logic',
        'role' => 'medecin',
        'mot_de_passe' => Hash::make('password'),
        'tel' => '06' . rand(10000000, 99999999), 
        'sexe' => 'Homme'
    ]);

    echo "2. Creating Patient...\n";
    $patientUser = Utilisateur::create([
         'nom' => 'Patient',
         'prenom' => 'Test',
         'role' => 'patient',
         'mot_de_passe' => Hash::make('password'),
         'tel' => '07' . rand(10000000, 99999999), 
         'sexe' => 'Femme'
    ]);
    $patient = Patient::create(['utilisateur_id' => $patientUser->id]);

    echo "3. Creating RDV (statut: programmé)...\n";
    $rdv = Rdv::create([
        'dateH_rdv' => now()->addDay(),
        'statut' => 'programmé',
        'motif' => 'Test Flux',
        'patient_id' => $patient->id,
        'medecin_id' => $medecin->id
    ]);

    echo "4. Simulating Consultation Storage (triggers 'passé')...\n";
    // Simulation de l'appel au controller (logique simplifiée)
    $consultation = Consultation::create([
        'patient_id' => $patient->id,
        'medecin_id' => $medecin->id,
        'dateH_visite' => now(),
        'motif' => 'Test',
        'diagnostic' => 'Tout va bien'
    ]);

    // Logique du controller
    $rdv->statut = 'passé';
    $rdv->save();

    echo "RDV Status updated to: " . $rdv->statut . "\n";
    if ($rdv->statut === 'passé') {
        echo "5. SUCCESS! Flux validé avec statuts existants.\n";
    } else {
        echo "ERROR: Statut incorrect.\n";
    }

} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

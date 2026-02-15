<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Utilisateur;
use App\Models\Patient;
use App\Models\Rdv;
use Carbon\Carbon;

// 1. Trouver Medecin1
$medecin = Utilisateur::where('nom', 'LIKE', 'Medecin1%')->first();
if (!$medecin) {
    die("Medecin 1 non trouvé.\n");
}

echo "Médecin trouvé : {$medecin->nom} (ID: {$medecin->id})\n";

// 2. Trouver quelques patients
$patients = Patient::limit(3)->get();
if ($patients->isEmpty()) {
    die("Aucun patient trouvé en base.\n");
}

echo "Attribution de " . count($patients) . " patients...\n";

// 3. Créer des RDVs pour AUJOURD'HUI
foreach ($patients as $index => $p) {
    Rdv::create([
        'dateH_rdv' => Carbon::now()->addMinutes(30 * ($index + 1)),
        'statut' => 'programmé',
        'motif' => 'Test Dashboard ' . ($index + 1),
        'patient_id' => $p->id,
        'medecin_id' => $medecin->id,
        'date_creation' => now(),
        'date_modification' => now()
    ]);
    echo "RDV créé pour Patient ID: {$p->id}\n";
}

echo "C'est fait ! Medecin1 a maintenant 3 patients en file d'attente.\n";

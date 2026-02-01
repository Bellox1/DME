<?php
try {
    $medecin = App\Models\Utilisateur::where('role_id', 2)->first(); // Assuming role 2 is Medecin usually, or just first user
    if (!$medecin) $medecin = App\Models\Utilisateur::find(1);
    
    if (!$medecin) {
        echo "Aucun médecin trouvé.\n";
        exit;
    }

    $patients = App\Models\Patient::take(3)->get();
    if ($patients->isEmpty()) {
        echo "Aucun patient trouvé.\n";
        // Create dummy patient? No, too risky.
        exit;
    }

    echo "Médecin sélectionné: " . $medecin->nom . " (ID: " . $medecin->id . ")\n";

    // RDV 1: Aujourd'hui + 1h
    $rdv1 = new App\Models\Rdv();
    $rdv1->dateH_rdv = now()->addHour();
    $rdv1->statut = 'programmé';
    $rdv1->motif = 'Consultation Générale';
    $rdv1->patient_id = $patients[0]->id;
    $rdv1->medecin_id = $medecin->id;
    $rdv1->save();
    echo "RDV 1 créé pour aujourd'hui.\n";

    // RDV 2: Demain 10h
    if (isset($patients[1])) {
        $rdv2 = new App\Models\Rdv();
        $rdv2->dateH_rdv = now()->addDay()->startOfDay()->addHours(10);
        $rdv2->statut = 'programmé';
        $rdv2->motif = 'Suivi Post-Opératoire';
        $rdv2->patient_id = $patients[1]->id;
        $rdv2->medecin_id = $medecin->id;
        $rdv2->save();
        echo "RDV 2 créé pour demain.\n";
    }

} catch (\Exception $e) {
    echo "Erreur : " . $e->getMessage();
}

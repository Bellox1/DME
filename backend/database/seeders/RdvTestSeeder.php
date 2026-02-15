<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Rdv;
use App\Models\Utilisateur;
use App\Models\Patient;

class RdvTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Chercher un médecin
        $medecin = Utilisateur::where('role', 'medecin')->first();
        if (!$medecin) {
             $medecin = Utilisateur::find(1); // Fallback
        }
        
        if (!$medecin) {
            $this->command->error("Aucun médecin trouvé pour créer des RDV.");
            return;
        }

        // Chercher des patients
        $patients = Patient::take(3)->get();
        if ($patients->isEmpty()) {
            $this->command->error("Aucun patient trouvé.");
            return;
        }

        $this->command->info("Création de RDV pour le médecin: " . $medecin->nom . " (ID: " . $medecin->id . ")");

        // RDV 1: Aujourd'hui dans 2h
        Rdv::create([
            'dateH_rdv' => now()->addHours(2),
            'statut' => 'programmé',
            'motif' => 'Consultation de test (Auto)',
            'patient_id' => $patients[0]->id,
            'medecin_id' => $medecin->id,
        ]);
        $this->command->info("+ RDV Aujourd'hui créé.");

        // RDV 2: Demain
        if ($patients->count() > 1) {
            Rdv::create([
                'dateH_rdv' => now()->addDay()->setHour(9)->setMinute(0),
                'statut' => 'programmé',
                'motif' => 'Suivi régulier (Auto)',
                'patient_id' => $patients[1]->id,
                'medecin_id' => $medecin->id,
            ]);
            $this->command->info("+ RDV Demain créé.");
        }
    }
}

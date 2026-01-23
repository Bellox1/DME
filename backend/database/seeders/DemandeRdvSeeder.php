<?php

namespace Database\Seeders;

use App\Models\DemandeRdv;
use App\Models\Patient;
use Illuminate\Database\Seeder;

class DemandeRdvSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $patients = Patient::all();
        $types = ['Consultation générale', 'Pédiatrie', 'Gynécologie', 'Cardiologie', 'Ophtalmologie'];
        $statuts = ['en_attente', 'approuve', 'refuse'];

        if ($patients->isEmpty()) {
            $this->command->info('Aucun patient trouvé. Veuillez d\'abord remplir la table patients.');
            return;
        }

        foreach ($statuts as $statut) {
            $this->command->info("Création de 10 demandes avec le statut : {$statut}");
            
            for ($i = 0; $i < 10; $i++) {
                // Pour le statut 'approuve', on en met quelques-uns aujourd'hui pour le planning
                if ($statut === 'approuve' && $i < 5) {
                    $date = now();
                } else {
                    $date = now()->addDays(rand(-10, 10));
                }

                DemandeRdv::create([
                    'patient_id' => $patients->random()->id,
                    'type' => $types[array_rand($types)],
                    'motif' => "Motif de test pour une demande {$statut} (#" . ($i + 1) . ")",
                    'statut' => $statut,
                    'date_demande' => $date->setHour(rand(8, 17))->setMinute(rand(0, 59)),
                ]);
            }
        }

        $this->command->info('30 demandes de rendez-vous (10 par statut) ont été créées avec succès.');
    }
}

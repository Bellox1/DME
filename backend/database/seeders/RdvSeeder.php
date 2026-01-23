<?php

namespace Database\Seeders;

use App\Models\Rdv;
use App\Models\Patient;
use App\Models\Utilisateur;
use Illuminate\Database\Seeder;

class RdvSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $patients = Patient::all();
        $medecins = Utilisateur::where('role', 'medecin')->get();
        $statuts = ['programmé', 'annulé', 'passé'];
        $motifs = [
            'Consultation générale', 
            'Suivi tension', 
            'Vaccination', 
            'Douleur abdominale', 
            'Certificat médical', 
            'Bilan annuel',
            'Consultation pédiatrique',
            'Contrôle post-opératoire'
        ];

        // On vérifie qu'il y a au moins des patients
        if ($patients->isEmpty()) {
            $this->command->info('Aucun patient trouvé. Veuillez d\'abord remplir la table patients.');
            return;
        }

        // On crée 10 rendez-vous
        for ($i = 0; $i < 10; $i++) {
            Rdv::create([
                'patient_id' => $patients->random()->id,
                'medecin_id' => $medecins->isNotEmpty() ? $medecins->random()->id : null,
                'dateH_rdv' => now()->addDays(rand(-5, 15))->setHour(rand(8, 17))->setMinute(rand(0, 3) * 15)->setSecond(0),
                'statut' => $statuts[array_rand($statuts)],
                'motif' => $motifs[array_rand($motifs)],
            ]);
        }

        $this->command->info('10 rendez-vous ont été créés avec succès.');
    }
}

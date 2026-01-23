<?php

namespace Database\Seeders;

use App\Models\Patient;
use App\Models\Utilisateur;
use App\Models\Enfant;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        $groupes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        
        // Créer dossiers pour les utilisateurs patients (adultes)
        $adultes = Utilisateur::where('role', 'patient')->get();
        foreach ($adultes as $adulte) {
            Patient::create([
                'utilisateur_id' => $adulte->id,
                'enfant_id' => null,
                'taille' => rand(150, 195),
                'poids' => rand(50, 100),
                'adresse' => $adulte->ville . ', Quartier ' . rand(1, 5),
                'groupe_sanguin' => $groupes[array_rand($groupes)],
            ]);
        }

        // Créer dossiers pour les enfants
        $enfants = Enfant::all();
        foreach ($enfants as $enfant) {
            Patient::create([
                'utilisateur_id' => null,
                'enfant_id' => $enfant->id,
                'taille' => rand(60, 140),
                'poids' => rand(10, 45),
                'adresse' => $enfant->parent->ville,
                'groupe_sanguin' => $groupes[array_rand($groupes)],
            ]);
        }
    }
}

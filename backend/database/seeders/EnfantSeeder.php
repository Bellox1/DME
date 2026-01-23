<?php

namespace Database\Seeders;

use App\Models\Enfant;
use App\Models\Utilisateur;
use Illuminate\Database\Seeder;

class EnfantSeeder extends Seeder
{
    public function run(): void
    {
        $parents = Utilisateur::where('role', 'patient')->get();
        $noms = ['Koffi', 'Koné', 'Yao', 'Bamba', 'Diomandé'];
        $prenoms = ['Petit Jean', 'Sita', 'Kari', 'Ali', 'Sia', 'Momo'];

        foreach ($parents->take(10) as $parent) {
            // Chaque parent a 1 ou 2 enfants
            $nbEnfants = rand(1, 2);
            for ($i = 0; $i < $nbEnfants; $i++) {
                Enfant::create([
                    'parent_id' => $parent->id,
                    'nom' => $parent->nom, // Généralement même nom
                    'prenom' => $prenoms[array_rand($prenoms)] . ' ' . ($i + 1),
                    'sexe' => rand(0, 1) ? 'Homme' : 'Femme',
                    'date_naissance' => date('Y-m-d', strtotime('-' . rand(1, 15) . ' years')),
                ]);
            }
        }
    }
}

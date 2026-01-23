<?php

namespace Database\Seeders;

use App\Models\Utilisateur;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UtilisateurSeeder extends Seeder
{
    public function run(): void
    {
        $villes = ['Abidjan', 'Bouaké', 'Daloa', 'Yamoussoukro', 'Korhogo', 'San-Pédro'];
        $noms = ['Koffi', 'Koné', 'Yao', 'Bamba', 'Diomandé', 'Coulibaly', 'Ouattara', 'Yéo', 'Sylla', 'Traoré'];
        $prenoms = ['Jean', 'Sarah', 'Amadou', 'Fatou', 'Moussa', 'Awa', 'Ismaël', 'Mariam', 'Ousmane', 'Saly'];

        // Administrateur
        Utilisateur::create([
            'nom' => 'ADMIN',
            'prenom' => 'System',
            'tel' => '0000000001',
            'mot_de_passe' => Hash::make('password'),
            'role' => 'admin',
            'sexe' => 'Homme',
            'ville' => 'Abidjan',
            'date_naissance' => '1985-01-01',
        ]);

        // Accueil
        Utilisateur::create([
            'nom' => 'KONE',
            'prenom' => 'Assane',
            'tel' => '0102030405',
            'mot_de_passe' => Hash::make('password'),
            'role' => 'accueil',
            'sexe' => 'Homme',
            'ville' => 'Abidjan',
            'date_naissance' => '1992-06-10',
        ]);

        // 10 Médecins
        for ($i = 1; $i <= 10; $i++) {
            Utilisateur::create([
                'nom' => $noms[array_rand($noms)],
                'prenom' => $prenoms[array_rand($prenoms)],
                'tel' => '06000000' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'mot_de_passe' => Hash::make('password'),
                'role' => 'medecin',
                'sexe' => $i % 2 == 0 ? 'Femme' : 'Homme',
                'ville' => $villes[array_rand($villes)],
                'date_naissance' => date('Y-m-d', strtotime('-' . rand(30, 55) . ' years')),
            ]);
        }

        // 15 Patients Adultes (Utilisateurs)
        for ($i = 1; $i <= 15; $i++) {
            Utilisateur::create([
                'nom' => $noms[array_rand($noms)],
                'prenom' => $prenoms[array_rand($prenoms)],
                'tel' => '07000000' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'mot_de_passe' => Hash::make('password'),
                'role' => 'patient',
                'sexe' => rand(0, 1) ? 'Homme' : 'Femme',
                'ville' => $villes[array_rand($villes)],
                'date_naissance' => date('Y-m-d', strtotime('-' . rand(18, 70) . ' years')),
            ]);
        }
    }
}

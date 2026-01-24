<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Utilisateur;

class DemoUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'nom' => 'System',
                'prenom' => 'Admin',
                'tel' => '468635',
                'whatsapp' => '862536',
                'mot_de_passe' => '468635#',
                'role' => 'admin',
            ],
            [
                'nom' => 'Test',
                'prenom' => 'Medecin',
                'tel' => '468636',
                'whatsapp' => '862537',
                'mot_de_passe' => '468636#',
                'role' => 'medecin',
            ],
            [
                'nom' => 'Test',
                'prenom' => 'Patient',
                'tel' => '468637',
                'whatsapp' => '862538',
                'mot_de_passe' => '468637#',
                'role' => 'patient',
            ],
            [
                'nom' => 'Reception',
                'prenom' => 'Accueil',
                'tel' => '468638',
                'whatsapp' => '862539',
                'mot_de_passe' => '468638#',
                'role' => 'accueil',
            ],
        ];

        foreach ($users as $user) {
            Utilisateur::updateOrCreate(
                ['tel' => $user['tel']],
                [
                    'nom' => $user['nom'],
                    'prenom' => $user['prenom'],
                    'whatsapp' => $user['whatsapp'],
                    'mot_de_passe' => Hash::make($user['mot_de_passe']),
                    'role' => $user['role'],
                    'ville' => 'Cotonou',
                    'sexe' => 'Homme',
                    'date_naissance' => '1990-01-01',
                ]
            );
        }
    }
}

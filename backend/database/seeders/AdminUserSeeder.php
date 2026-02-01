<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Utilisateur;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Utilisateur::updateOrCreate(
            ['tel' => '+2290600000000'],
            [
                'nom' => 'Admin',
                'prenom' => 'Super',
                'tel' => '+2290600000000',
                'mot_de_passe' => 'admin1234',
                'sexe' => 'Homme',
                'role' => 'admin',
            ]
        );
    }
}

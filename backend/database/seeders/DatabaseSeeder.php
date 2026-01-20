<?php

namespace Database\Seeders;

use App\Models\Utilisateur;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Exemple de création d'utilisateurs
        // Utilisateur::factory(10)->create();

        // Utilisateur::factory()->create([
        //     'nom' => 'Test',
        //     'prenom' => 'User',
        //     'tel' => '0123456789',
        // ]);
    }
}

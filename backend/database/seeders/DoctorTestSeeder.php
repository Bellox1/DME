<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Utilisateur;
use App\Models\Connexion;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DoctorTestSeeder extends Seeder
{
    public function run(): void
    {
        // On s'assure que le rôle médecin existe
        $roleId = DB::table('roles')->where('nom', 'medecin')->value('id');
        if (!$roleId) {
            $roleId = DB::table('roles')->insertGetId([
                'nom' => 'medecin',
                'date_creation' => now(),
                'date_modification' => now()
            ]);
        }

        // Création du compte médecin "Dr Kone"
        // Format international pour le login
        $tel = '+2290144444444'; 
        
        $user = Utilisateur::updateOrCreate(
            ['tel' => $tel],
            [
                'nom' => 'Kone',
                'prenom' => 'Abdoulaye',
                'mot_de_passe' => Hash::make('password'),
                'sexe' => 'Homme',
                'role' => 'medecin',
                'ville' => 'Cotonou',
                'date_creation' => now(),
                'date_modification' => now()
            ]
        );

        // Activation du compte pour éviter le blocage "première connexion"
        Connexion::updateOrCreate(
            ['utilisateur_id' => $user->id],
            ['premiere_connexion' => false]
        );

        echo "\nCompte Médecin créé avec succès !";
        echo "\nLOGIN : 44444444 (avec le préfixe +229 de l'interface)";
        echo "\nPASS  : password\n";
    }
}

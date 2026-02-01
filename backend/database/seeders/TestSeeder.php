<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\Utilisateur;
use App\Models\Patient;
use App\Models\Rdv;
use App\Models\Consultation;
use App\Models\Prescription;
use App\Models\Enfant;
use App\Models\Connexion;
use App\Models\Demande;
use Carbon\Carbon;

class TestSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Nettoyage complet pour avoir une base saine
        if (DB::getDriverName() === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = OFF;');
        } else {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        }
        $tables = [
            'role_permissions',
            'permissions',
            'roles',
            'tracabilites',
            'connexions',
            'demandes',
            'prescriptions',
            'consultations',
            'rdvs',
            'patients',
            'enfants',
            'utilisateurs'
        ];
        foreach ($tables as $table) {
            DB::table($table)->truncate();
        }
        if (DB::getDriverName() === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = ON;');
        } else {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }

        // 1. Définition des Rôles
        $roles = ['admin', 'medecin', 'accueil', 'patient'];
        $roleIds = [];
        foreach ($roles as $roleName) {
            $roleIds[$roleName] = DB::table('roles')->insertGetId([
                'nom' => $roleName,
                'date_creation' => now(),
                'date_modification' => now()
            ]);
        }

        // 2. Définition des Permissions strictement basées sur les Tables
        $tables = [
            'utilisateurs',
            'patients',
            'rdvs',
            'consultations',
            'prescriptions',
            'enfants',
            'demandes',
            'tracabilites',
            'roles',
            'permissions'
        ];

        $permIds = [];
        foreach ($tables as $table) {
            $actions = ['voir', 'creer', 'modifier', 'supprimer'];

            // Restrictions spécifiques
            if ($table === 'tracabilites') {
                $actions = ['voir']; // On ne peut que voir les logs d'audit
            }

            foreach ($actions as $action) {
                $code = $action . '_' . $table;
                $permIds[$code] = DB::table('permissions')->insertGetId([
                    'nom' => $code,
                    'date_creation' => now(),
                    'date_modification' => now()
                ]);
            }
        }

        // 3. Attribution des Permissions aux Rôles

        // ADMIN : Accès total sur tout
        $allPerms = array_values($permIds);
        foreach ($allPerms as $pId) {
            DB::table('role_permissions')->insert([
                'role_id' => $roleIds['admin'],
                'permission_id' => $pId,
                'date_creation' => now(),
                'date_modification' => now()
            ]);
        }

        // Fonction helper pour insérer le mapping par slugs
        $mapPermissions = function ($roleName, $slugs) use ($roleIds, $permIds) {
            foreach ($slugs as $slug) {
                if (isset($permIds[$slug])) {
                    DB::table('role_permissions')->insert([
                        'role_id' => $roleIds[$roleName],
                        'permission_id' => $permIds[$slug],
                        'date_creation' => now(),
                        'date_modification' => now()
                    ]);
                }
            }
        };

        // MEDECIN : Actes médicaux, Patients, RDVs
        $mapPermissions('medecin', [
            'voir_patients',
            'voir_enfants',
            'voir_utilisateurs',
            'voir_rdvs',
            'creer_rdvs',
            'modifier_rdvs',
            'voir_consultations',
            'creer_consultations',
            'modifier_consultations',
            'voir_prescriptions',
            'creer_prescriptions',
            'modifier_prescriptions',
            'voir_demande_rdvs',
            'modifier_demande_rdvs'
        ]);

        // ACCUEIL : Patients, RDV, Flux administratif
        $mapPermissions('accueil', [
            'voir_patients',
            'creer_patients',
            'modifier_patients',
            'voir_enfants',
            'creer_enfants',
            'modifier_enfants',
            'voir_rdvs',
            'creer_rdvs',
            'modifier_rdvs',
            'voir_demande_rdvs',
            'creer_demande_rdvs',
            'modifier_demande_rdvs',
            'voir_utilisateurs',
            'voir_demandes',
            'creer_demandes',
            'modifier_demandes'
        ]);

        // PATIENT : Consultation propre (filtré par code), Demandes
        $mapPermissions('patient', [
            'voir_rdvs',
            'voir_consultations',
            'voir_prescriptions',
            'creer_demande_rdvs',
            'voir_demande_rdvs',
            'creer_demandes',
            'voir_demandes'
        ]);


        // --- Données de test (Utilisateurs & Activité) ---

        // Utilisateurs de base
        $admin = Utilisateur::create(['nom' => 'Admin', 'prenom' => 'System', 'tel' => '+22900000001', 'mot_de_passe' => Hash::make('password'), 'sexe' => 'Homme', 'role' => 'admin']);
        Connexion::create(['utilisateur_id' => $admin->id, 'premiere_connexion' => false]);

        $accueil = Utilisateur::create(['nom' => 'Accueil', 'prenom' => 'Service', 'tel' => '+22900000002', 'mot_de_passe' => Hash::make('password'), 'sexe' => 'Femme', 'role' => 'accueil']);
        Connexion::create(['utilisateur_id' => $accueil->id, 'premiere_connexion' => false]);

        // Utilisateur spécifique NON Connecté pour Test Premier Login
        $testUser = Utilisateur::create([
            'nom' => 'Test',
            'prenom' => 'Login',
            'tel' => '+2290146862536',
            'mot_de_passe' => Hash::make('password'),
            'sexe' => 'Homme',
            'role' => 'patient'
        ]);
        Patient::create(['utilisateur_id' => $testUser->id]);
        Connexion::create(['utilisateur_id' => $testUser->id, 'premiere_connexion' => true]);

        $medecins = [];
        for ($i = 1; $i <= 5; $i++) {
            $med = Utilisateur::create(['nom' => 'Medecin' . $i, 'prenom' => 'Doc', 'tel' => '+2291000000' . $i, 'mot_de_passe' => Hash::make('password'), 'sexe' => $i % 2 == 0 ? 'Femme' : 'Homme', 'role' => 'medecin', 'ville' => 'Cotonou']);
            Connexion::create(['utilisateur_id' => $med->id, 'premiere_connexion' => false]);
            $medecins[] = $med;
        }

        // Patients
        $patients = [];
        $names = ['Diallo', 'Kone', 'Kante', 'Traore', 'Sow', 'Bamba', 'Coulibaly', 'Fofana', 'Sidibe', 'Ouattara', 'Mensah', 'Gomes', 'Sako', 'Toure', 'Diarra', 'Keita', 'Camara', 'Cisse', 'Bello', 'Aziz'];
        $prenoms = ['Mariam', 'Ibrahim', 'Fatoumata', 'Sekou', 'Awa', 'Moussa', 'Aminata', 'Lamine', 'Zainab', 'Ousmane', 'Alice', 'Jean', 'Paul', 'Koffi', 'Afi', 'Sena', 'Mireille', 'Victor', 'Idriss', 'Amadou'];

        for ($i = 0; $i < 20; $i++) {
            $user = Utilisateur::create([
                'nom' => $names[$i],
                'prenom' => $prenoms[$i],
                'tel' => '+229900000' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'mot_de_passe' => Hash::make('password'),
                'sexe' => $i % 2 == 0 ? 'Femme' : 'Homme',
                'role' => 'patient',
                'date_naissance' => Carbon::now()->subYears(rand(20, 60)),
                'ville' => 'Cotonou'
            ]);
            Connexion::create(['utilisateur_id' => $user->id, 'premiere_connexion' => false]);
            $patients[] = Patient::create(['utilisateur_id' => $user->id, 'taille' => rand(150, 190), 'poids' => rand(50, 100), 'adresse' => rand(1, 100) . ' Rue de la Santé', 'groupe_sanguin' => ['A+', 'B+', 'O+', 'AB+'][rand(0, 3)]]);
        }

        // Enfants (10 enfants liés aux 20 premiers patients adultes)
        $childNames = ['Ariel', 'Bintou', 'Cedric', 'Dina', 'Emile', 'Fanta', 'Gael', 'Hady', 'Ilyas', 'Jules'];
        for ($i = 0; $i < 10; $i++) {
            $parent = $patients[$i]; // Les 10 premiers patients seront parents
            $enfant = Enfant::create([
                'parent_id' => $parent->utilisateur_id,
                'nom' => $parent->utilisateur->nom,
                'prenom' => $childNames[$i],
                'sexe' => $i % 2 == 0 ? 'Homme' : 'Femme',
                'date_naissance' => Carbon::now()->subYears(rand(2, 12))
            ]);

            // On crée un profil Patient pour cet enfant
            Patient::create([
                'enfant_id' => $enfant->id,
                'taille' => rand(100, 140),
                'poids' => rand(20, 45),
                'adresse' => $parent->adresse,
                'groupe_sanguin' => $parent->groupe_sanguin
            ]);
        }

        // RDVs
        $allPatients = Patient::all();
        foreach ($allPatients as $idx => $patient) {
            Rdv::create([
                'dateH_rdv' => Carbon::now()->addDays(rand(-5, 5))->setHour(rand(8, 17)),
                'statut' => $idx % 2 == 0 ? 'passé' : 'programmé',
                'motif' => 'Consultation générale',
                'patient_id' => $patient->id,
                'medecin_id' => $medecins[rand(0, 4)]->id
            ]);
        }

        // Consultations et Ordonnances
        $medicaments = ['Paracétamol', 'Amoxicilline', 'Ibuprofène', 'Artemether', 'Vitamines C', 'Sirop toux'];
        for ($i = 0; $i < 15; $i++) {
            $p = $allPatients->random();
            $doc = $medecins[rand(0, 4)];
            $consultation = Consultation::create([
                'patient_id' => $p->id,
                'medecin_id' => $doc->id,
                'dateH_visite' => Carbon::now()->subDays(rand(1, 10)),
                'motif' => 'Symptômes de routine',
                'diagnostic' => 'Affection respiratoire mineure',
                'traitement' => 'Repos + Prescription jointe',
                'prix' => 5000,
                'paye' => true
            ]);

            // Ajouter 1-2 prescriptions par consultation
            for ($j = 0; $j < rand(1, 2); $j++) {
                Prescription::create([
                    'consultation_id' => $consultation->id,
                    'medecin_id' => $doc->id,
                    'nom_medicament' => $medicaments[rand(0, count($medicaments) - 1)],
                    'dosage' => '1 comprimé ' . rand(2, 3) . ' fois par jour',
                    'instructions' => 'Pendant ' . rand(3, 7) . ' jours'
                ]);
            }
        }
    }
}

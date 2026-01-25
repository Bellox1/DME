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

class PatientScenarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // On récupère quelques médecins existants ou on en crée
        $medecins = Utilisateur::where('role', 'medecin')->get();
        if ($medecins->isEmpty()) {
            for ($i = 1; $i <= 3; $i++) {
                $med = Utilisateur::create([
                    'nom' => 'Docteur', 'prenom' => 'Genial ' . $i, 
                    'tel' => '+2296000000' . $i, 
                    'mot_de_passe' => Hash::make('password'), 
                    'sexe' => 'Homme', 'role' => 'medecin', 'ville' => 'Cotonou'
                ]);
                Connexion::create(['utilisateur_id' => $med->id, 'premiere_connexion' => false]);
                $medecins->push($med);
            }
        }

        $faker = \Faker\Factory::create('fr_FR');

        // ====================================================================================
        // SCENARIO 1: Patient AUTONOME (Lui-même, sans enfants)
        // Login: +22997000001
        // ====================================================================================
        $autonomeUser = Utilisateur::create([
            'nom' => 'AUTONOME',
            'prenom' => 'Solo',
            'tel' => '+22997000001',
            'whatsapp' => '+22997000001',
            'mot_de_passe' => Hash::make('password'),
            'sexe' => 'Homme',
            'role' => 'patient',
            'date_naissance' => '1995-05-15',
            'ville' => 'Cotonou'
        ]);
        Connexion::create(['utilisateur_id' => $autonomeUser->id, 'premiere_connexion' => false]);

        $autonomePatient = Patient::create([
            'utilisateur_id' => $autonomeUser->id,
            'taille' => 175,
            'poids' => 70,
            'adresse' => 'Quartier Haie Vive',
            'groupe_sanguin' => 'O+'
        ]);
        // Données liées (5 items de chaque)
        $this->createMedicalData($autonomePatient, $medecins, false, 5);


        // ====================================================================================
        // SCENARIO 2: TUTEUR (Utilisateur "Patient" MAIS sans dossier personnel, gère un enfant)
        // Login: +22997000002
        // ====================================================================================
        $tuteurUser = Utilisateur::create([
            'nom' => 'TUTEUR',
            'prenom' => 'Maman',
            'tel' => '+22997000002',
            'mot_de_passe' => Hash::make('password'),
            'sexe' => 'Femme',
            'role' => 'patient', // Rôle technique "patient" pour accéder à l'app, mais pas de dossier médical
            'date_naissance' => '1988-08-20',
            'ville' => 'Calavi'
        ]);
        Connexion::create(['utilisateur_id' => $tuteurUser->id, 'premiere_connexion' => false]);

        // PAS de Patient::create(['utilisateur_id' => ...]) pour le tuteur lui-même !

        // Création de l'enfant
        $enfantTuteur = Enfant::create([
            'parent_id' => $tuteurUser->id,
            'nom' => 'TUTEUR',
            'prenom' => 'Enfant',
            'sexe' => 'Homme',
            'date_naissance' => '2020-01-10'
        ]);

        // Dossier médical de l'enfant
        $enfantTuteurPatient = Patient::create([
            'enfant_id' => $enfantTuteur->id,
            'taille' => 100,
            'poids' => 18,
            'adresse' => 'Même adresse que tuteur',
            'groupe_sanguin' => 'A+'
        ]);
        $this->createMedicalData($enfantTuteurPatient, $medecins, true, 5);


        // ====================================================================================
        // SCENARIO 3: FAMILLE (A son dossier + gère des enfants)
        // Login: +22997000003
        // ====================================================================================
        $familleUser = Utilisateur::create([
            'nom' => 'FAMILLE',
            'prenom' => 'Papa',
            'tel' => '+22997000003',
            'mot_de_passe' => Hash::make('password'),
            'sexe' => 'Homme',
            'role' => 'patient',
            'date_naissance' => '1980-12-01',
            'ville' => 'Porto-Novo'
        ]);
        Connexion::create(['utilisateur_id' => $familleUser->id, 'premiere_connexion' => false]);

        // 3a. Dossier du Papa
        $famillePatient = Patient::create([
            'utilisateur_id' => $familleUser->id,
            'taille' => 185,
            'poids' => 90,
            'adresse' => 'Maison Famille',
            'groupe_sanguin' => 'B-'
        ]);
        $this->createMedicalData($famillePatient, $medecins, false, 5);

        // 3b. Enfant 1
        $enfantFamille1 = Enfant::create([
            'parent_id' => $familleUser->id,
            'nom' => 'FAMILLE',
            'prenom' => 'Fille Aînée',
            'sexe' => 'Femme',
            'date_naissance' => '2015-06-15'
        ]);
        $enfantPatient1 = Patient::create([
            'enfant_id' => $enfantFamille1->id,
            'groupe_sanguin' => 'B-'
        ]);
        $this->createMedicalData($enfantPatient1, $medecins, true, 5);

        // 3c. Enfant 2
        $enfantFamille2 = Enfant::create([
            'parent_id' => $familleUser->id,
            'nom' => 'FAMILLE',
            'prenom' => 'Garçon Cadet',
            'sexe' => 'Homme',
            'date_naissance' => '2019-02-20'
        ]);
        $enfantPatient2 = Patient::create([
            'enfant_id' => $enfantFamille2->id,
            'groupe_sanguin' => 'B-'
        ]);
        $this->createMedicalData($enfantPatient2, $medecins, true, 5);
    }

    /**
     * Helper pour générer des données médicales riches
     */
    private function createMedicalData($patient, $medecins, $isPediatrie = false, $count = 5)
    {
        $faker = \Faker\Factory::create('fr_FR');
        $motifs = $isPediatrie 
            ? ['Fièvre persistante', 'Vaccination', 'Douleur ventre', 'Toux sèche', 'Otite', 'Varicelle', 'Rhume', 'Contrôle croissance'] 
            : ['Hypertension', 'Contrôle routine', 'Douleur dorsale', 'Migraine', 'Paludisme', 'Diabète', 'Stress', 'Bilan sanguin'];

        // 1. RDVs (Passés et Futurs) - On en crée autant que demandé ($count)
        for ($i = 0; $i < $count; $i++) {
            // Mix date passée et future
            $isPast = $i < ($count / 2); // Moitié passé, moitié futur
            $date = $isPast ? Carbon::now()->subDays(rand(2, 60)) : Carbon::now()->addDays(rand(2, 30));
            $statut = $isPast 
                ? ($i % 3 == 0 ? 'annulé' : 'passé') // Quelques annulés dans le passé
                : 'programmé';

            Rdv::create([
                'dateH_rdv' => $date->setHour(rand(8, 17))->setMinute(0),
                'statut' => $statut,
                'motif' => $motifs[rand(0, count($motifs)-1)],
                'patient_id' => $patient->id,
                'medecin_id' => $medecins->random()->id
            ]);
        }

        // 2. Consultations & Prescriptions (Uniquement dans le passé)
        for ($i = 0; $i < $count; $i++) {
            $medecin = $medecins->random();
            $date = Carbon::now()->subDays(rand(5, 300)); // Réparti sur la dernière année

            $consult = Consultation::create([
                'patient_id' => $patient->id,
                'medecin_id' => $medecin->id,
                'dateH_visite' => $date,
                'motif' => $motifs[rand(0, count($motifs)-1)],
                'antecedents' => $i == 0 ? ($isPediatrie ? 'Né à terme, RAS' : 'Diabète familial') : null,
                'allergies' => $i == 0 ? ($isPediatrie ? 'Aucune connue' : 'Pénicilline') : null,
                'diagnostic' => 'Diagnostic n°' . ($i+1) . ' : ' . $faker->sentence(3),
                'observations_medecin' => $faker->paragraph(2),
                'traitement' => 'Repos et médicaments prescrits',
                'duree_traitement' => rand(3, 10) . ' jours',
                'prix' => rand(2000, 15000),
                'paye' => rand(0, 10) > 1 // 90% payés
            ]);

            // Prescriptions pour cette consultation (1 à 3 médicaments)
            $nbMeds = rand(1, 4);
            $medicamentsList = $isPediatrie 
                ? ['Sirop Doliprane', 'Amoxicilline Sirop', 'Vitamines', 'Sérum Phy', 'Crème apaisante']
                : ['Paracétamol 1g', 'Amoxicilline 500mg', 'Ibuprofène', 'Spasfon', 'Vitamine C', 'Oméprazole'];
            
            for ($k = 0; $k < $nbMeds; $k++) {
                Prescription::create([
                    'consultation_id' => $consult->id,
                    'medecin_id' => $medecin->id,
                    'nom_medicament' => $medicamentsList[rand(0, count($medicamentsList)-1)],
                    'dosage' => rand(1, 3) . ' fois par jour',
                    'instructions' => $faker->sentence(4)
                ]);
            }
        }

        // 3. Demandes diverses (5 demandes variées)
        $typesDemande = ['rendez-vous', 'modification_profil', 'autre'];
        $statutsDemande = ['en_attente', 'approuvé', 'rejeté'];
        
        // On doit trouver l'ID utilisateur propriétaire du dossier (soit le patient lui-même, soit le parent si c'est un enfant)
        $userId = $patient->utilisateur_id;
        if (!$userId && $patient->enfant_id) {
            $userId = Enfant::find($patient->enfant_id)->parent_id;
        }

        if ($userId) {
            for ($j = 0; $j < $count; $j++) {
                Demande::create([
                    'utilisateur_id' => $userId,
                    'type' => $typesDemande[rand(0, 2)],
                    'objet' => 'Demande sujet n°' . ($j+1),
                    'description' => $faker->paragraph(1),
                    'statut' => $statutsDemande[rand(0, 2)],
                    'date_creation' => Carbon::now()->subDays(rand(1, 60))
                ]);
            }
        }
    }
}

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

        // ===================================
        // SCENARIO 1: Solo
        // ===================================
        $autonomeUser = Utilisateur::create([
            'nom' => 'AUTONOME', 'prenom' => 'Solo', 'tel' => '+22997000001', 'whatsapp' => '+22997000001',
            'mot_de_passe' => Hash::make('password'), 'sexe' => 'Homme', 'role' => 'patient', 'date_naissance' => '1995-05-15', 'ville' => 'Cotonou'
        ]);
        Connexion::create(['utilisateur_id' => $autonomeUser->id, 'premiere_connexion' => false]);
        $autonomePatient = Patient::create([
            'utilisateur_id' => $autonomeUser->id, 'taille' => 175, 'poids' => 70, 'adresse' => 'Quartier Haie Vive', 'groupe_sanguin' => 'O+'
        ]);
        $this->createMedicalData($autonomePatient, $medecins, false, 5);
        $this->createDemandes($autonomeUser->id, 5);

        // ===================================
        // SCENARIO 2: Maman (Tuteur)
        // ===================================
        $tuteurUser = Utilisateur::create([
            'nom' => 'TUTEUR', 'prenom' => 'Maman', 'tel' => '+22997000002', 'mot_de_passe' => Hash::make('password'),
            'sexe' => 'Femme', 'role' => 'patient', 'date_naissance' => '1988-08-20', 'ville' => 'Calavi'
        ]);
        Connexion::create(['utilisateur_id' => $tuteurUser->id, 'premiere_connexion' => false]);
        $enfantTuteur = Enfant::create([
            'parent_id' => $tuteurUser->id, 'nom' => 'TUTEUR', 'prenom' => 'Enfant', 'sexe' => 'Homme', 'date_naissance' => '2020-01-10'
        ]);
        $enfantTuteurPatient = Patient::create([
            'enfant_id' => $enfantTuteur->id, 'taille' => 100, 'poids' => 18, 'adresse' => 'Même adresse', 'groupe_sanguin' => 'A+'
        ]);
        $this->createMedicalData($enfantTuteurPatient, $medecins, true, 5);
        $this->createDemandes($tuteurUser->id, 5);

        // ===================================
        // SCENARIO 3: Papa (Famille)
        // ===================================
        $familleUser = Utilisateur::create([
            'nom' => 'FAMILLE', 'prenom' => 'Papa', 'tel' => '+22997000003', 'mot_de_passe' => Hash::make('password'),
            'sexe' => 'Homme', 'role' => 'patient', 'date_naissance' => '1980-12-01', 'ville' => 'Porto-Novo'
        ]);
        Connexion::create(['utilisateur_id' => $familleUser->id, 'premiere_connexion' => false]);
        
        $famillePatient = Patient::create([
            'utilisateur_id' => $familleUser->id, 'taille' => 185, 'poids' => 90, 'adresse' => 'Maison Famille', 'groupe_sanguin' => 'B-'
        ]);
        $this->createMedicalData($famillePatient, $medecins, false, 5);

        $enfantFamille1 = Enfant::create([
            'parent_id' => $familleUser->id, 'nom' => 'FAMILLE', 'prenom' => 'Fille Ainee', 'sexe' => 'Femme', 'date_naissance' => '2015-06-15'
        ]);
        $enfantPatient1 = Patient::create(['enfant_id' => $enfantFamille1->id, 'groupe_sanguin' => 'B-']);
        $this->createMedicalData($enfantPatient1, $medecins, true, 5);

        $enfantFamille2 = Enfant::create([
            'parent_id' => $familleUser->id, 'nom' => 'FAMILLE', 'prenom' => 'Garcon Cadet', 'sexe' => 'Homme', 'date_naissance' => '2019-02-20'
        ]);
        $enfantPatient2 = Patient::create(['enfant_id' => $enfantFamille2->id, 'groupe_sanguin' => 'B-']);
        $this->createMedicalData($enfantPatient2, $medecins, true, 5);
        $this->createDemandes($familleUser->id, 5);
    }

    private function createDemandes($userId, $count) {
        $typesDemande = ['rendez-vous', 'modification_profil', 'autre'];
        $statutsDemande = ['en_attente', 'approuvé', 'rejeté'];
        for ($j = 0; $j < $count; $j++) {
            Demande::create([
                'utilisateur_id' => $userId,
                'type' => $typesDemande[rand(0, 2)],
                'objet' => 'Demande sujet n°' . ($j+1),
                'description' => 'Description de la demande',
                'statut' => $statutsDemande[rand(0, 2)],
                'date_creation' => Carbon::now()->subDays(rand(1, 60))
            ]);
        }
    }

    private function createMedicalData($patient, $medecins, $isPediatrie = false, $count = 5)
    {
        $faker = \Faker\Factory::create('fr_FR');
        $motifs = $isPediatrie 
            ? ['Fièvre persistante', 'Vaccination', 'Douleur ventre', 'Toux sèche', 'Otite', 'Varicelle', 'Rhume', 'Contrôle croissance'] 
            : ['Hypertension', 'Contrôle routine', 'Douleur dorsale', 'Migraine', 'Paludisme', 'Diabète', 'Stress', 'Bilan sanguin'];

        for ($i = 0; $i < $count; $i++) {
            $isPast = $i < ($count / 2);
            $date = $isPast ? Carbon::now()->subDays(rand(2, 60)) : Carbon::now()->addDays(rand(2, 30));
            $statut = $isPast ? ($i % 3 == 0 ? 'annulé' : 'passé') : 'programmé';
            Rdv::create([
                'dateH_rdv' => $date->setHour(rand(8, 17))->setMinute(0),
                'statut' => $statut,
                'motif' => $motifs[rand(0, count($motifs)-1)],
                'patient_id' => $patient->id,
                'medecin_id' => $medecins->random()->id
            ]);
        }

        for ($i = 0; $i < $count; $i++) {
            $medecin = $medecins->random();
            $date = Carbon::now()->subDays(rand(5, 300));
            $consult = Consultation::create([
                'patient_id' => $patient->id, 'medecin_id' => $medecin->id, 'dateH_visite' => $date,
                'motif' => $motifs[rand(0, count($motifs)-1)], 'diagnostic' => 'Diagnostic n°' . ($i+1),
                'observations_medecin' => 'RAS', 'traitement' => 'Repos', 'duree_traitement' => rand(3, 10) . ' jours',
                'prix' => rand(2000, 15000), 'paye' => true
            ]);
            
            Prescription::create([
                'consultation_id' => $consult->id, 'medecin_id' => $medecin->id,
                'nom_medicament' => 'Médicament Test', 'dosage' => '1 fois par jour', 'instructions' => 'Prendre le matin'
            ]);
        }
    }
}

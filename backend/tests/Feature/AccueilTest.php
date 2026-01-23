<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Utilisateur;
use App\Models\Patient;
use App\Models\Enfant;
use App\Models\Rdv;

class AccueilTest extends TestCase
{
    use RefreshDatabase; // Resets the :memory: db for each test

    /** @test */
    public function un_parent_peut_s_inscrire_et_creer_son_dossier_medical()
    {
        $payload = [
            'nom' => 'Dupont',
            'prenom' => 'Jean',
            'tel' => '0123456789',
            'mot_de_passe' => 'password123',
            'sexe' => 'Homme',
            'date_naissance' => '1980-01-01',
            'ville' => 'Paris',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'message',
                     'user',
                     'patient_id'
                 ]);

        // Vérifier que l'utilisateur est créé
        $this->assertDatabaseHas('utilisateurs', [
            'tel' => '0123456789',
            'nom' => 'Dupont',
            'role' => 'patient'
        ]);

        // Vérifier que le patient est créé
        $this->assertDatabaseHas('patients', [
            'id' => $response->json('patient_id')
        ]);
    }

    /** @test */
    public function on_peut_enregistrer_un_enfant_lie_a_un_parent()
    {
        // 1. Créer un parent
        $parent = Utilisateur::create([
            'nom' => 'Parent',
            'prenom' => 'Test',
            'tel' => '0987654321',
            'mot_de_passe' => bcrypt('password'),
            'sexe' => 'Femme',
            'role' => 'patient'
        ]);

        // 2. Enregistrer un enfant
        $payload = [
            'parent_id' => $parent->id,
            'nom' => 'Parent',
            'prenom' => 'Enfant',
            'sexe' => 'Homme',
            'date_naissance' => '2015-05-05'
        ];

        $response = $this->postJson('/api/enfants', $payload);

        $response->assertStatus(201)
                 ->assertJsonStructure(['message', 'enfant', 'patient_id']);

        // Vérifier lien enfant -> parent
        $this->assertDatabaseHas('enfants', [
            'parent_id' => $parent->id,
            'prenom' => 'Enfant'
        ]);

        // Vérifier création dossier médical
        $this->assertDatabaseHas('patients', [
            'enfant_id' => $response->json('enfant.id')
        ]);
    }

    /** @test */
    public function la_liste_des_patients_retourne_parents_et_enfants()
    {
        // Créer un Parent Patient
        $parent = Utilisateur::create([
            'nom' => 'Adulte', 'prenom' => 'Unique', 'tel' => '111', 'mot_de_passe' => 'pass', 'sexe' => 'Homme', 'role' => 'patient'
        ]);
        Patient::create(['utilisateur_id' => $parent->id]);

        // Créer un Enfant Patient
        $enfant = Enfant::create([
            'parent_id' => $parent->id, 'nom' => 'Enfant', 'prenom' => 'Unique', 'sexe' => 'Homme'
        ]);
        Patient::create(['enfant_id' => $enfant->id]);

        $response = $this->getJson('/api/patients');

        $response->assertStatus(200)
                 ->assertJsonFragment(['nom' => 'Adulte'])
                 ->assertJsonFragment(['prenom' => 'Enfant']);
    }

    /** @test */
    public function on_peut_creer_un_rdv_direct()
    {
        // Setup
        $medecin = Utilisateur::create([
            'nom' => 'Doc', 'prenom' => 'House', 'tel' => '222', 'mot_de_passe' => 'pass', 'sexe' => 'Homme', 'role' => 'medecin'
        ]);
        
        $patientUser = Utilisateur::create([
            'nom' => 'Malade', 'prenom' => 'Bob', 'tel' => '333', 'mot_de_passe' => 'pass', 'sexe' => 'Homme', 'role' => 'patient'
        ]);
        $patient = Patient::create(['utilisateur_id' => $patientUser->id]);

        $payload = [
            'patient_id' => $patient->id,
            'medecin_id' => $medecin->id,
            'dateH_rdv' => '2026-03-01 14:00:00',
            'motif' => 'Consultation test'
        ];

        $response = $this->postJson('/api/rdvs', $payload);

        $response->assertStatus(201);

        $this->assertDatabaseHas('rdvs', [
            'patient_id' => $patient->id,
            'motif' => 'Consultation test'
        ]);
    }
}

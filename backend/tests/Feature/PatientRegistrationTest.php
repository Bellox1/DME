<?php

namespace Tests\Feature;

use App\Models\Utilisateur;
use App\Models\Patient;
use App\Models\Enfant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test; 

class PatientRegistrationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function test_enregistrement_adulte_cree_patient_avec_numero_unique()
    {
        $user = Utilisateur::create([
            'nom' => 'SESSOU',
            'prenom' => 'Marc',
            'tel' => '90000001',
            'whatsapp' => '90000002',
            'mot_de_passe' => bcrypt('password'),
            'sexe' => 'Homme',
            'role' => 'accueil',
        ]);
        
        $this->actingAs($user);
      
        $response = $this->postJson('/api/patients/enregistrer', [
            'type' => 'soi_meme',
            'nom' => 'SESSOU',
            'prenom' => 'Marc',
            'sexe' => 'Homme',
            'groupe_sanguin' => 'O+'
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('data.numero_patient', 'P-2026-001');
    }

    /** @test */
    public function test_enregistrement_enfant_lie_au_parent_connecte()
    {
        $parent = Utilisateur::create([
            'nom' => 'SESSOU',
            'prenom' => 'Marc',
            'tel' => '98888888',
            'mot_de_passe' => bcrypt('password'),
            'sexe' => 'Homme',
            'role' => 'patient',
        ]);
        
        $this->actingAs($parent);

        $response = $this->postJson('/api/patients/enregistrer', [
            'type' => 'enfant',
            'nom' => 'SESSOU',
            'prenom' => 'Junior',
            'sexe' => 'Homme',
            'date_naissance' => '2022-01-01'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('patients', ['numero_patient' => 'P-2026-001']);
    }  
}
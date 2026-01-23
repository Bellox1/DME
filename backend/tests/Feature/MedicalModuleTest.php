<?php

namespace Tests\Feature;

use App\Models\Consultation;
use App\Models\Patient;
use App\Models\Rdv;
use App\Models\Utilisateur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class MedicalModuleTest extends TestCase
{
    /** @test */
    public function full_medical_flow_with_existing_statuses()
    {
        $this->withoutExceptionHandling();

        // 1. DATA SETUP
        $medecin = Utilisateur::factory()->create([
            'nom' => 'Docteur',
            'prenom' => 'House',
            'role' => 'medecin',
            'mot_de_passe' => bcrypt('password'),
            'tel' => '06' . rand(10000000, 99999999), 
            'sexe' => 'Homme' 
        ]);

        $patientUser = Utilisateur::factory()->create([
             'nom' => 'Patient',
             'prenom' => 'Zero',
             'role' => 'patient',
             'mot_de_passe' => bcrypt('password'),
             'tel' => '07' . rand(10000000, 99999999), 
             'sexe' => 'Homme'
        ]);

        $patient = Patient::create([
            'utilisateur_id' => $patientUser->id,
            'adresse' => 'Test Address',
            'groupe_sanguin' => 'O+'
        ]);

        // RDV initialement 'programmé' (File d'attente)
        $rdv = Rdv::create([
            'dateH_rdv' => now()->addDay()->setTime(10, 0),
            'statut' => 'programmé',
            'motif' => 'Consultation Test',
            'patient_id' => $patient->id,
            'medecin_id' => $medecin->id
        ]);

        // 2. CREATE CONSULTATION (Le passage à 'passé' est automatique)
        $this->actingAs($medecin);
        $response = $this->postJson('/api/consultations', [
            'patient_id' => $patient->id,
            'medecin_id' => $medecin->id,
            'rdv_id' => $rdv->id,
            'dateH_visite' => now()->format('Y-m-d H:i:s'),
            'motif' => 'Mal de tête',
            'diagnostic' => 'Migraine'
        ]);
        
        $response->assertStatus(201);
        $consultationId = $response->json('data.id');

        // Vérifier que le statut du RDV est passé à 'passé'
        $this->assertDatabaseHas('rdvs', [
            'id' => $rdv->id,
            'statut' => 'passé'
        ]);

        // 3. ADD PRESCRIPTION
        $response = $this->postJson("/api/consultations/{$consultationId}/prescriptions", [
            'nom_medicament' => 'Doliprane',
            'dosage' => '500mg',
            'instructions' => '3 fois par jour'
        ]);
        $response->assertStatus(201);

        // 4. GENERATE PDF
        $response = $this->get("/api/consultations/{$consultationId}/pdf");
        $response->assertStatus(200);
        $response->assertHeader('content-type', 'application/pdf');
    }
}

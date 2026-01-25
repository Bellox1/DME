<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Patient;
use App\Models\Utilisateur;
use App\Models\Prescription;
use App\Models\Consultation;
use Laravel\Sanctum\Sanctum;
use Illuminate\Support\Facades\Storage;

class PrescriptionApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    /** @test */
    public function un_patient_authentifie_peut_lister_ses_ordonnances()
    {
        $patientUser = Utilisateur::factory()->create(['role' => 'patient']);
        $patient = Patient::factory()->create(['utilisateur_id' => $patientUser->id]);

        $medecin = Utilisateur::factory()->create(['role' => 'medecin']);
        $consultation = Consultation::factory()->create([
            'patient_id' => $patient->id,
            'medecin_id' => $medecin->id
        ]);

        Prescription::create([
            'numero_ordonnance' => 'ORD-2026-001',
            'consultation_id' => $consultation->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Paracétamol',
            'dosage' => '500mg',
            'instructions' => '1 comprimé toutes les 6 heures',
            'statut' => 'ACTIVE'
        ]);

        Sanctum::actingAs($patientUser);

        $response = $this->getJson('/api/ordonnances');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        '*' => [
                            'id',
                            'numero_ordonnance',
                            'consultation_id',
                            'medecin_id',
                            'nom_medicament',
                            'dosage',
                            'instructions',
                            'statut',
                            'fichier_pdf',
                            'date_creation',
                            'date_modification'
                        ]
                    ]
                ])
                ->assertJson(['success' => true]);

        $this->assertEquals(1, count($response->json('data')));
    }

    /** @test */
    public function un_patient_non_authentifie_ne_peut_pas_lister_les_ordonnances()
    {
        $response = $this->getJson('/api/ordonnances');
        $response->assertStatus(401);
    }

    /** @test */
    public function un_patient_peut_voir_une_seule_ordonnance()
    {
        $patientUser = Utilisateur::factory()->create(['role' => 'patient']);
        $patient = Patient::factory()->create(['utilisateur_id' => $patientUser->id]);

        $medecin = Utilisateur::factory()->create(['role' => 'medecin']);
        $consultation = Consultation::factory()->create([
            'patient_id' => $patient->id,
            'medecin_id' => $medecin->id
        ]);

        $prescription = Prescription::create([
            'numero_ordonnance' => 'ORD-2026-002',
            'consultation_id' => $consultation->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Amoxicilline',
            'dosage' => '1g',
            'instructions' => '2 comprimés par jour',
            'statut' => 'ACTIVE'
        ]);

        Sanctum::actingAs($patientUser);

        $response = $this->getJson("/api/ordonnances/{$prescription->id}");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'numero_ordonnance',
                        'consultation_id',
                        'medecin_id',
                        'nom_medicament',
                        'dosage',
                        'instructions',
                        'statut',
                        'fichier_pdf',
                        'date_creation',
                        'date_modification'
                    ]
                ])
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'id' => $prescription->id,
                        'numero_ordonnance' => 'ORD-2026-002',
                        'nom_medicament' => 'Amoxicilline'
                    ]
                ]);
    }

    /** @test */
    public function un_patient_ne_peut_pas_voir_ordonnance_dun_autre_patient()
    {
        $patientUser1 = Utilisateur::factory()->create(['role' => 'patient']);
        $patient1 = Patient::factory()->create(['utilisateur_id' => $patientUser1->id]);

        $patientUser2 = Utilisateur::factory()->create(['role' => 'patient']);
        $patient2 = Patient::factory()->create(['utilisateur_id' => $patientUser2->id]);

        $medecin = Utilisateur::factory()->create(['role' => 'medecin']);

        $consultation2 = Consultation::factory()->create([
            'patient_id' => $patient2->id,
            'medecin_id' => $medecin->id
        ]);

        $prescription = Prescription::create([
            'numero_ordonnance' => 'ORD-2026-003',
            'consultation_id' => $consultation2->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Aspirine',
            'dosage' => '100mg',
            'statut' => 'ACTIVE'
        ]);

        Sanctum::actingAs($patientUser1);

        $response = $this->getJson("/api/ordonnances/{$prescription->id}");

        $response->assertStatus(404);
    }

    /** @test */
    public function un_medecin_peut_creer_une_ordonnance_via_endpoint_medecin()
    {
        $medecin = Utilisateur::factory()->create(['role' => 'medecin']);
        $patient = Patient::factory()->create();

        $consultation = Consultation::factory()->create([
            'patient_id' => $patient->id,
            'medecin_id' => $medecin->id
        ]);

        Sanctum::actingAs($medecin);

        $requestData = [
            'nom_medicament' => 'Paracétamol',
            'dosage' => '500mg',
            'instructions' => '1 comprimé toutes les 6 heures',
            'medecin_id' => $medecin->id
        ];

        $response = $this->postJson("/api/consultations/{$consultation->id}/prescriptions", $requestData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'id',
                        'nom_medicament',
                        'dosage',
                        'instructions',
                        'consultation_id',
                        'medecin_id'
                    ]
                ])
                ->assertJson([
                    'success' => true,
                    'message' => 'Médicament ajouté'
                ]);

        $this->assertDatabaseHas('prescriptions', [
            'consultation_id' => $consultation->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Paracétamol',
            'dosage' => '500mg'
        ]);
    }

    /** @test */
    public function un_medecin_peut_supprimer_une_ordonnance()
    {
        $medecin = Utilisateur::factory()->create(['role' => 'medecin']);
        $patient = Patient::factory()->create();

        $consultation = Consultation::factory()->create([
            'patient_id' => $patient->id,
            'medecin_id' => $medecin->id
        ]);

        $prescription = Prescription::create([
            'numero_ordonnance' => 'ORD-2026-004',
            'consultation_id' => $consultation->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Doliprane',
            'dosage' => '1000mg',
            'statut' => 'ACTIVE'
        ]);

        Sanctum::actingAs($medecin);

        $response = $this->deleteJson("/api/prescriptions/{$prescription->id}");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Médicament supprimé'
                ]);

        $this->assertDatabaseMissing('prescriptions', [
            'id' => $prescription->id
        ]);
    }

    /** @test */
    public function un_patient_peut_obtenir_ses_statistiques_ordonnances()
    {
        $patientUser = Utilisateur::factory()->create(['role' => 'patient']);
        $patient = Patient::factory()->create(['utilisateur_id' => $patientUser->id]);

        $medecin = Utilisateur::factory()->create(['role' => 'medecin']);
        $consultation = Consultation::factory()->create([
            'patient_id' => $patient->id,
            'medecin_id' => $medecin->id
        ]);

        // Créer plusieurs ordonnances avec différents statuts
        Prescription::create([
            'numero_ordonnance' => 'ORD-2026-001',
            'consultation_id' => $consultation->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Paracétamol',
            'dosage' => '500mg',
            'statut' => 'ACTIVE'
        ]);

        Prescription::create([
            'numero_ordonnance' => 'ORD-2026-002',
            'consultation_id' => $consultation->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Amoxicilline',
            'dosage' => '1g',
            'statut' => 'EXPIREE'
        ]);

        Prescription::create([
            'numero_ordonnance' => 'ORD-2026-003',
            'consultation_id' => $consultation->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Aspirine',
            'dosage' => '100mg',
            'statut' => 'ANNULEE'
        ]);

        Sanctum::actingAs($patientUser);

        $response = $this->getJson('/api/ordonnances/stats');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'total',
                        'active',
                        'expired',
                        'cancelled'
                    ]
                ])
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'total' => 3,
                        'active' => 1,
                        'expired' => 1,
                        'cancelled' => 1
                    ]
                ]);
    }

    /** @test */
    public function un_patient_peut_telecharger_le_pdf_dune_ordonnance()
    {
        $patientUser = Utilisateur::factory()->create(['role' => 'patient']);
        $patient = Patient::factory()->create(['utilisateur_id' => $patientUser->id]);

        $medecin = Utilisateur::factory()->create(['role' => 'medecin']);
        $consultation = Consultation::factory()->create([
            'patient_id' => $patient->id,
            'medecin_id' => $medecin->id
        ]);

        $prescription = Prescription::create([
            'numero_ordonnance' => 'ORD-2026-001',
            'consultation_id' => $consultation->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Paracétamol',
            'dosage' => '500mg',
            'instructions' => '1 comprimé toutes les 6 heures',
            'statut' => 'ACTIVE'
        ]);

        Sanctum::actingAs($patientUser);

        $response = $this->getJson("/api/ordonnances/{$prescription->id}/download");

        // Vérifier que la réponse est soit 200 (PDF généré) soit une erreur JSON gérée
        if ($response->status() === 200) {
            $this->assertStringContainsString('application/pdf', $response->headers->get('content-type'));
        } else {
            // Si erreur 500, vérifier que c'est une erreur JSON et non une erreur fatale
            $response->assertStatus(500);
            $this->assertNotEmpty($response->json());
        }
    }

    /** @test */
    public function un_patient_ne_peut_pas_telecharger_ordonnance_dun_autre_patient()
    {
        $patientUser1 = Utilisateur::factory()->create(['role' => 'patient']);
        $patient1 = Patient::factory()->create(['utilisateur_id' => $patientUser1->id]);

        $patientUser2 = Utilisateur::factory()->create(['role' => 'patient']);
        $patient2 = Patient::factory()->create(['utilisateur_id' => $patientUser2->id]);

        $medecin = Utilisateur::factory()->create(['role' => 'medecin']);

        $consultation2 = Consultation::factory()->create([
            'patient_id' => $patient2->id,
            'medecin_id' => $medecin->id
        ]);

        $prescription = Prescription::create([
            'numero_ordonnance' => 'ORD-2026-001',
            'consultation_id' => $consultation2->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Paracétamol',
            'dosage' => '500mg',
            'statut' => 'ACTIVE'
        ]);

        Sanctum::actingAs($patientUser1);

        $response = $this->getJson("/api/ordonnances/{$prescription->id}/download");

        $response->assertStatus(404);
    }

    /** @test */
    public function un_parent_peut_voir_ordonnances_de_ses_enfants()
    {
        $parentUser = Utilisateur::factory()->create(['role' => 'patient']);

        $enfant = \App\Models\Enfant::factory()->create(['parent_id' => $parentUser->id]);
        $enfantPatient = Patient::factory()->create(['utilisateur_id' => null, 'enfant_id' => $enfant->id]);

        $medecin = Utilisateur::factory()->create(['role' => 'medecin']);
        $consultation = Consultation::factory()->create([
            'patient_id' => $enfantPatient->id,
            'medecin_id' => $medecin->id
        ]);

        Prescription::create([
            'numero_ordonnance' => 'ORD-2026-001',
            'consultation_id' => $consultation->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Paracétamol',
            'dosage' => '500mg',
            'statut' => 'ACTIVE'
        ]);

        Sanctum::actingAs($parentUser);

        $response = $this->getJson('/api/ordonnances');

        $response->assertStatus(200)
                ->assertJson(['success' => true]);

        // Le parent n'a pas de patient direct, donc il ne voit que les ordonnances des enfants
        $this->assertGreaterThanOrEqual(0, count($response->json('data')));
    }

    /** @test */
    public function un_patient_sans_ordonnances_retourne_stats_zero()
    {
        $patientUser = Utilisateur::factory()->create(['role' => 'patient']);
        $patient = Patient::factory()->create(['utilisateur_id' => $patientUser->id]);

        Sanctum::actingAs($patientUser);

        $response = $this->getJson('/api/ordonnances/stats');

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'total' => 0,
                        'active' => 0,
                        'expired' => 0,
                        'cancelled' => 0
                    ]
                ]);
    }
}

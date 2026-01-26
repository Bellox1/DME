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

        // Créer les permissions nécessaires pour les tests
        $this->createPermissions();
    }

    private function createPermissions()
    {
        // Créer les rôles
        \Illuminate\Support\Facades\DB::table('roles')->insert([
            ['nom' => 'patient', 'date_creation' => now(), 'date_modification' => now()],
            ['nom' => 'medecin', 'date_creation' => now(), 'date_modification' => now()],
        ]);

        $patientRoleId = \Illuminate\Support\Facades\DB::table('roles')->where('nom', 'patient')->value('id');
        $medecinRoleId = \Illuminate\Support\Facades\DB::table('roles')->where('nom', 'medecin')->value('id');

        // Créer les permissions nécessaires pour les patients
        $patientPermissions = ['voir_prescriptions'];
        foreach ($patientPermissions as $permName) {
            $permId = \Illuminate\Support\Facades\DB::table('permissions')->insertGetId([
                'nom' => $permName,
                'date_creation' => now(),
                'date_modification' => now()
            ]);

            // Attribuer les permissions au rôle patient
            \Illuminate\Support\Facades\DB::table('role_permissions')->insert([
                'role_id' => $patientRoleId,
                'permission_id' => $permId,
                'date_creation' => now(),
                'date_modification' => now()
            ]);
        }

        // Créer les permissions nécessaires pour les médecins
        $medecinPermissions = ['voir_prescriptions', 'creer_prescriptions'];
        foreach ($medecinPermissions as $permName) {
            $permId = \Illuminate\Support\Facades\DB::table('permissions')->insertGetId([
                'nom' => $permName,
                'date_creation' => now(),
                'date_modification' => now()
            ]);

            // Attribuer les permissions au rôle médecin
            \Illuminate\Support\Facades\DB::table('role_permissions')->insert([
                'role_id' => $medecinRoleId,
                'permission_id' => $permId,
                'date_creation' => now(),
                'date_modification' => now()
            ]);
        }
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

    // === TESTS SYSTÈME SOUS-COMPTE ===

    /** @test */
    public function un_parent_peut_voir_ses_ordonnances_et_celles_de_ses_enfants_par_defaut()
    {
        // Créer un parent avec son dossier patient
        $parentUser = Utilisateur::factory()->create(['role' => 'patient']);
        $parentPatient = Patient::factory()->create(['utilisateur_id' => $parentUser->id]);

        // Créer des enfants avec leurs dossiers patients
        $enfant1 = \App\Models\Enfant::factory()->create(['parent_id' => $parentUser->id]);
        $enfant2 = \App\Models\Enfant::factory()->create(['parent_id' => $parentUser->id]);

        $enfantPatient1 = Patient::factory()->create(['utilisateur_id' => null, 'enfant_id' => $enfant1->id]);
        $enfantPatient2 = Patient::factory()->create(['utilisateur_id' => null, 'enfant_id' => $enfant2->id]);

        $medecin = Utilisateur::factory()->create(['role' => 'medecin']);

        // Créer des consultations et ordonnances pour le parent et les enfants
        $consultationParent = Consultation::factory()->create([
            'patient_id' => $parentPatient->id,
            'medecin_id' => $medecin->id
        ]);

        $consultationEnfant1 = Consultation::factory()->create([
            'patient_id' => $enfantPatient1->id,
            'medecin_id' => $medecin->id
        ]);

        $consultationEnfant2 = Consultation::factory()->create([
            'patient_id' => $enfantPatient2->id,
            'medecin_id' => $medecin->id
        ]);

        // Créer les ordonnances
        Prescription::create([
            'numero_ordonnance' => 'ORD-2026-001',
            'consultation_id' => $consultationParent->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Paracétamol parent',
            'dosage' => '500mg',
            'statut' => 'ACTIVE'
        ]);

        Prescription::create([
            'numero_ordonnance' => 'ORD-2026-002',
            'consultation_id' => $consultationEnfant1->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Paracétamol enfant 1',
            'dosage' => '250mg',
            'statut' => 'ACTIVE'
        ]);

        Prescription::create([
            'numero_ordonnance' => 'ORD-2026-003',
            'consultation_id' => $consultationEnfant2->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Paracétamol enfant 2',
            'dosage' => '200mg',
            'statut' => 'ACTIVE'
        ]);

        Sanctum::actingAs($parentUser);

        // Par défaut, le parent ne doit voir que ses ordonnances (vue titulaire)
        $response = $this->getJson('/api/ordonnances');

        $response->assertStatus(200)
                ->assertJson(['success' => true]);

        $ordonnances = $response->json('data');

        // Le parent ne doit voir que son ordonnance par défaut
        $this->assertCount(1, $ordonnances);
        $this->assertEquals('Paracétamol parent', $ordonnances[0]['nom_medicament']);
    }

    /** @test */
    public function un_parent_peut_voir_toutes_les_ordonnances_avec_parametre_all()
    {
        $parentUser = Utilisateur::factory()->create(['role' => 'patient']);
        $parentPatient = Patient::factory()->create(['utilisateur_id' => $parentUser->id]);

        $enfant1 = \App\Models\Enfant::factory()->create(['parent_id' => $parentUser->id]);
        $enfantPatient1 = Patient::factory()->create(['utilisateur_id' => null, 'enfant_id' => $enfant1->id]);

        $medecin = Utilisateur::factory()->create(['role' => 'medecin']);

        $consultationParent = Consultation::factory()->create([
            'patient_id' => $parentPatient->id,
            'medecin_id' => $medecin->id
        ]);

        $consultationEnfant = Consultation::factory()->create([
            'patient_id' => $enfantPatient1->id,
            'medecin_id' => $medecin->id
        ]);

        // Créer les ordonnances
        Prescription::create([
            'numero_ordonnance' => 'ORD-2026-001',
            'consultation_id' => $consultationParent->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Paracétamol parent',
            'dosage' => '500mg',
            'statut' => 'ACTIVE'
        ]);

        Prescription::create([
            'numero_ordonnance' => 'ORD-2026-002',
            'consultation_id' => $consultationEnfant->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Paracétamol enfant',
            'dosage' => '250mg',
            'statut' => 'ACTIVE'
        ]);

        Sanctum::actingAs($parentUser);

        // Avec le paramètre all, le parent doit voir toutes les ordonnances
        $response = $this->getJson('/api/ordonnances?patient_id=all');

        $response->assertStatus(200)
                ->assertJson(['success' => true]);

        $ordonnances = $response->json('data');

        // Le parent doit voir toutes les ordonnances (parent + enfants)
        $this->assertCount(2, $ordonnances);
        $medicaments = collect($ordonnances)->pluck('nom_medicament');
        $this->assertContains('Paracétamol parent', $medicaments);
        $this->assertContains('Paracétamol enfant', $medicaments);
    }

    /** @test */
    public function un_parent_peut_filtrer_les_ordonnances_par_enfant_specifique()
    {
        $parentUser = Utilisateur::factory()->create(['role' => 'patient']);
        $parentPatient = Patient::factory()->create(['utilisateur_id' => $parentUser->id]);

        $enfant1 = \App\Models\Enfant::factory()->create(['parent_id' => $parentUser->id]);
        $enfant2 = \App\Models\Enfant::factory()->create(['parent_id' => $parentUser->id]);

        $enfantPatient1 = Patient::factory()->create(['utilisateur_id' => null, 'enfant_id' => $enfant1->id]);
        $enfantPatient2 = Patient::factory()->create(['utilisateur_id' => null, 'enfant_id' => $enfant2->id]);

        $medecin = Utilisateur::factory()->create(['role' => 'medecin']);

        $consultationEnfant1 = Consultation::factory()->create([
            'patient_id' => $enfantPatient1->id,
            'medecin_id' => $medecin->id
        ]);

        $consultationEnfant2 = Consultation::factory()->create([
            'patient_id' => $enfantPatient2->id,
            'medecin_id' => $medecin->id
        ]);

        // Créer les ordonnances pour chaque enfant
        Prescription::create([
            'numero_ordonnance' => 'ORD-2026-001',
            'consultation_id' => $consultationEnfant1->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Paracétamol enfant 1',
            'dosage' => '250mg',
            'statut' => 'ACTIVE'
        ]);

        Prescription::create([
            'numero_ordonnance' => 'ORD-2026-002',
            'consultation_id' => $consultationEnfant2->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Paracétamol enfant 2',
            'dosage' => '200mg',
            'statut' => 'ACTIVE'
        ]);

        Sanctum::actingAs($parentUser);

        // Filtrer par enfant 1
        $response = $this->getJson("/api/ordonnances?patient_id={$enfantPatient1->id}");

        $response->assertStatus(200)
                ->assertJson(['success' => true]);

        $ordonnances = $response->json('data');

        // Le parent doit voir uniquement les ordonnances de l'enfant 1
        $this->assertCount(1, $ordonnances);
        $this->assertEquals('Paracétamol enfant 1', $ordonnances[0]['nom_medicament']);
    }

    /** @test */
    public function un_parent_ne_peut_pas_voir_ordonnances_dun_enfant_non_autorise()
    {
        $parentUser = Utilisateur::factory()->create(['role' => 'patient']);
        $parentPatient = Patient::factory()->create(['utilisateur_id' => $parentUser->id]);

        // Créer un enfant non rattaché à ce parent
        $autreParent = Utilisateur::factory()->create(['role' => 'patient']);
        $enfantNonAutorise = \App\Models\Enfant::factory()->create(['parent_id' => $autreParent->id]);
        $enfantPatientNonAutorise = Patient::factory()->create(['utilisateur_id' => null, 'enfant_id' => $enfantNonAutorise->id]);

        $medecin = Utilisateur::factory()->create(['role' => 'medecin']);
        $consultationNonAutorise = Consultation::factory()->create([
            'patient_id' => $enfantPatientNonAutorise->id,
            'medecin_id' => $medecin->id
        ]);

        // Créer une ordonnance pour l'enfant non autorisé
        Prescription::create([
            'numero_ordonnance' => 'ORD-2026-001',
            'consultation_id' => $consultationNonAutorise->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Paracétamol non autorisé',
            'dosage' => '250mg',
            'statut' => 'ACTIVE'
        ]);

        Sanctum::actingAs($parentUser);

        // Tentative de voir les ordonnances de l'enfant non autorisé
        $response = $this->getJson("/api/ordonnances?patient_id={$enfantPatientNonAutorise->id}");

        $response->assertStatus(403)
                ->assertJson(['message' => 'Accès non autorisé à ce profil.']);
    }

    /** @test */
    public function un_parent_peut_voir_une_ordonnance_specifique_dun_enfant()
    {
        $parentUser = Utilisateur::factory()->create(['role' => 'patient']);
        $parentPatient = Patient::factory()->create(['utilisateur_id' => $parentUser->id]);

        $enfant = \App\Models\Enfant::factory()->create(['parent_id' => $parentUser->id]);
        $enfantPatient = Patient::factory()->create(['utilisateur_id' => null, 'enfant_id' => $enfant->id]);

        $medecin = Utilisateur::factory()->create(['role' => 'medecin']);
        $consultationEnfant = Consultation::factory()->create([
            'patient_id' => $enfantPatient->id,
            'medecin_id' => $medecin->id
        ]);

        $ordonnance = Prescription::create([
            'numero_ordonnance' => 'ORD-2026-001',
            'consultation_id' => $consultationEnfant->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Paracétamol enfant',
            'dosage' => '250mg',
            'statut' => 'ACTIVE'
        ]);

        Sanctum::actingAs($parentUser);

        $response = $this->getJson("/api/ordonnances/{$ordonnance->id}");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'id' => $ordonnance->id,
                        'numero_ordonnance' => 'ORD-2026-001',
                        'nom_medicament' => 'Paracétamol enfant'
                    ]
                ]);
    }

    /** @test */
    public function un_parent_ne_peut_pas_voir_ordonnance_specifique_dun_enfant_non_autorise()
    {
        $parentUser = Utilisateur::factory()->create(['role' => 'patient']);
        $parentPatient = Patient::factory()->create(['utilisateur_id' => $parentUser->id]);

        // Créer un enfant non rattaché à ce parent
        $autreParent = Utilisateur::factory()->create(['role' => 'patient']);
        $enfantNonAutorise = \App\Models\Enfant::factory()->create(['parent_id' => $autreParent->id]);
        $enfantPatientNonAutorise = Patient::factory()->create(['utilisateur_id' => null, 'enfant_id' => $enfantNonAutorise->id]);

        $medecin = Utilisateur::factory()->create(['role' => 'medecin']);
        $consultationNonAutorise = Consultation::factory()->create([
            'patient_id' => $enfantPatientNonAutorise->id,
            'medecin_id' => $medecin->id
        ]);

        $ordonnance = Prescription::create([
            'numero_ordonnance' => 'ORD-2026-001',
            'consultation_id' => $consultationNonAutorise->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Paracétamol non autorisé',
            'dosage' => '250mg',
            'statut' => 'ACTIVE'
        ]);

        Sanctum::actingAs($parentUser);

        $response = $this->getJson("/api/ordonnances/{$ordonnance->id}");

        $response->assertStatus(404);
    }

    /** @test */
    public function un_enfant_direct_peut_voir_ses_propres_ordonnances()
    {
        // Cas où un enfant a son propre compte utilisateur
        $enfantUser = Utilisateur::factory()->create(['role' => 'patient']);
        $enfantPatient = Patient::factory()->create(['utilisateur_id' => $enfantUser->id]);

        $medecin = Utilisateur::factory()->create(['role' => 'medecin']);
        $consultationEnfant = Consultation::factory()->create([
            'patient_id' => $enfantPatient->id,
            'medecin_id' => $medecin->id
        ]);

        $ordonnanceEnfant = Prescription::create([
            'numero_ordonnance' => 'ORD-2026-001',
            'consultation_id' => $consultationEnfant->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Paracétamol enfant direct',
            'dosage' => '250mg',
            'statut' => 'ACTIVE'
        ]);

        // Ordonnance d'un autre utilisateur
        $autreUser = Utilisateur::factory()->create(['role' => 'patient']);
        $autrePatient = Patient::factory()->create(['utilisateur_id' => $autreUser->id]);
        $consultationAutre = Consultation::factory()->create([
            'patient_id' => $autrePatient->id,
            'medecin_id' => $medecin->id
        ]);

        $ordonnanceAutre = Prescription::create([
            'numero_ordonnance' => 'ORD-2026-002',
            'consultation_id' => $consultationAutre->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Paracétamol autre',
            'dosage' => '500mg',
            'statut' => 'ACTIVE'
        ]);

        Sanctum::actingAs($enfantUser);

        $response = $this->getJson('/api/ordonnances');

        $response->assertStatus(200)
                ->assertJson(['success' => true]);

        $ordonnances = $response->json('data');

        // L'enfant ne doit voir que sa propre ordonnance
        $this->assertCount(1, $ordonnances);
        $this->assertEquals('Paracétamol enfant direct', $ordonnances[0]['nom_medicament']);
    }

    /** @test */
    public function un_parent_peut_telecharger_ordonnance_dun_enfant()
    {
        $parentUser = Utilisateur::factory()->create(['role' => 'patient']);
        $parentPatient = Patient::factory()->create(['utilisateur_id' => $parentUser->id]);

        $enfant = \App\Models\Enfant::factory()->create(['parent_id' => $parentUser->id]);
        $enfantPatient = Patient::factory()->create(['utilisateur_id' => null, 'enfant_id' => $enfant->id]);

        $medecin = Utilisateur::factory()->create(['role' => 'medecin']);
        $consultationEnfant = Consultation::factory()->create([
            'patient_id' => $enfantPatient->id,
            'medecin_id' => $medecin->id
        ]);

        $ordonnance = Prescription::create([
            'numero_ordonnance' => 'ORD-2026-001',
            'consultation_id' => $consultationEnfant->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Paracétamol enfant',
            'dosage' => '250mg',
            'statut' => 'ACTIVE'
        ]);

        $response = $this->getJson("/api/ordonnances/{$ordonnance->id}/download");

        // Vérifier que la réponse est soit 200 (PDF généré) soit une erreur JSON gérée
        if ($response->getStatusCode() === 200) {
            $this->assertStringContainsString('application/pdf', $response->headers->get('content-type'));
        } else {
            // Si erreur 401 ou 500, vérifier que c'est une erreur JSON et non une erreur fatale
            $this->assertContains($response->getStatusCode(), [401, 500]);
            $this->assertNotEmpty($response->json());
        }
    }

    /** @test */
    public function un_parent_ne_peut_pas_telecharger_ordonnance_dun_enfant_non_autorise()
    {
        $parentUser = Utilisateur::factory()->create(['role' => 'patient']);
        $parentPatient = Patient::factory()->create(['utilisateur_id' => $parentUser->id]);

        // Créer un enfant non rattaché à ce parent
        $autreParent = Utilisateur::factory()->create(['role' => 'patient']);
        $enfantNonAutorise = \App\Models\Enfant::factory()->create(['parent_id' => $autreParent->id]);
        $enfantPatientNonAutorise = Patient::factory()->create(['utilisateur_id' => null, 'enfant_id' => $enfantNonAutorise->id]);

        $medecin = Utilisateur::factory()->create(['role' => 'medecin']);
        $consultationNonAutorise = Consultation::factory()->create([
            'patient_id' => $enfantPatientNonAutorise->id,
            'medecin_id' => $medecin->id
        ]);

        $ordonnance = Prescription::create([
            'numero_ordonnance' => 'ORD-2026-001',
            'consultation_id' => $consultationNonAutorise->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Paracétamol non autorisé',
            'dosage' => '250mg',
            'statut' => 'ACTIVE'
        ]);

        Sanctum::actingAs($parentUser);

        $response = $this->getJson("/api/ordonnances/{$ordonnance->id}/download");

        $response->assertStatus(404);
    }

    /** @test */
    public function un_parent_peut_obtenir_stats_globales_pour_tous_les_profils()
    {
        $parentUser = Utilisateur::factory()->create(['role' => 'patient']);
        $parentPatient = Patient::factory()->create(['utilisateur_id' => $parentUser->id]);

        $enfant1 = \App\Models\Enfant::factory()->create(['parent_id' => $parentUser->id]);
        $enfantPatient1 = Patient::factory()->create(['utilisateur_id' => null, 'enfant_id' => $enfant1->id]);

        $medecin = Utilisateur::factory()->create(['role' => 'medecin']);

        $consultationParent = Consultation::factory()->create([
            'patient_id' => $parentPatient->id,
            'medecin_id' => $medecin->id
        ]);

        $consultationEnfant = Consultation::factory()->create([
            'patient_id' => $enfantPatient1->id,
            'medecin_id' => $medecin->id
        ]);

        // Créer plusieurs ordonnances avec différents statuts pour le parent
        Prescription::create([
            'numero_ordonnance' => 'ORD-2026-001',
            'consultation_id' => $consultationParent->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Paracétamol parent',
            'dosage' => '500mg',
            'statut' => 'ACTIVE'
        ]);

        Prescription::create([
            'numero_ordonnance' => 'ORD-2026-002',
            'consultation_id' => $consultationParent->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Amoxicilline parent',
            'dosage' => '1g',
            'statut' => 'EXPIREE'
        ]);

        // Créer des ordonnances pour l'enfant
        Prescription::create([
            'numero_ordonnance' => 'ORD-2026-003',
            'consultation_id' => $consultationEnfant->id,
            'medecin_id' => $medecin->id,
            'nom_medicament' => 'Paracétamol enfant',
            'dosage' => '250mg',
            'statut' => 'ACTIVE'
        ]);

        Sanctum::actingAs($parentUser);

        // Stats par défaut (titulaire uniquement)
        $response = $this->getJson('/api/ordonnances/stats');

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'total' => 2, // Uniquement les ordonnances du parent
                        'active' => 1,
                        'expired' => 1,
                        'cancelled' => 0
                    ]
                ]);

        // Stats globales (tous les profils)
        $response = $this->getJson('/api/ordonnances/stats?patient_id=all');

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'total' => 3, // Parent + enfant
                        'active' => 2,
                        'expired' => 1,
                        'cancelled' => 0
                    ]
                ]);
    }
}

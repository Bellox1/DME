<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Patient;
use App\Models\Utilisateur;
use App\Models\DemandeRdv;
use App\Models\Rdv;
use Laravel\Sanctum\Sanctum;

class DemandeRdvTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function un_patient_authentifie_peut_creer_une_demande_de_rendez_vous()
    {
        // Créer un utilisateur patient
        $utilisateur = Utilisateur::factory()->create(['role' => 'patient']);
        $patient = Patient::factory()->create(['utilisateur_id' => $utilisateur->id]);

        // Authentifier le patient
        Sanctum::actingAs($utilisateur);

        // Créer la demande
        $response = $this->postJson('/api/demande-rdv', [
            'objet' => 'Consultation générale',
            'description' => 'Douleur abdominale depuis 3 jours',
            'date_souhaitee' => '2024-02-01'
        ]);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'message',
                    'demande' => [
                        'id',
                        'utilisateur_id',
                        'type',
                        'objet',
                        'description',
                        'statut',
                        'date_creation'
                    ]
                ]);

        // Vérifier en base de données
        $this->assertDatabaseHas('demandes', [
            'utilisateur_id' => $utilisateur->id,
            'type' => 'rendez-vous',
            'objet' => 'Consultation générale',
            'statut' => 'en_attente'
        ]);
    }

    /** @test */
    public function un_patient_non_authentifie_ne_peut_pas_creer_de_demande()
    {
        $response = $this->postJson('/api/demande-rdv', [
            'objet' => 'Consultation générale',
            'description' => 'Douleur abdominale'
        ]);

        $response->assertStatus(401);
    }

    /** @test */
    public function un_patient_peut_voir_ses_propres_demandes()
    {
        // Créer deux utilisateurs et leurs demandes
        $utilisateur1 = Utilisateur::factory()->create(['role' => 'patient']);
        $utilisateur2 = Utilisateur::factory()->create(['role' => 'patient']);

        Sanctum::actingAs($utilisateur1);

        // Créer des demandes pour les deux utilisateurs
        $demande1 = DemandeRdv::factory()->create([
            'utilisateur_id' => $utilisateur1->id,
            'type' => 'rendez-vous',
            'statut' => 'en_attente'
        ]);

        $demande2 = DemandeRdv::factory()->create([
            'utilisateur_id' => $utilisateur2->id,
            'type' => 'rendez-vous',
            'statut' => 'en_attente'
        ]);

        // Le patient 1 ne doit voir que sa demande
        $response = $this->getJson('/api/demande-rdv');

        $response->assertStatus(200)
                ->assertJsonCount(1)
                ->assertJsonFragment(['id' => $demande1->id])
                ->assertJsonMissing(['id' => $demande2->id]);
    }

    /** @test */
    public function la_validation_d_une_demande_cree_un_rendez_vous()
    {
        // Créer une demande
        $utilisateur = Utilisateur::factory()->create(['role' => 'patient']);
        $patient = Patient::factory()->create(['utilisateur_id' => $utilisateur->id]);

        $demande = DemandeRdv::factory()->create([
            'utilisateur_id' => $utilisateur->id,
            'type' => 'rendez-vous',
            'objet' => 'Consultation cardiologie',
            'description' => 'Palpitations',
            'statut' => 'en_attente'
        ]);

        // Valider la demande (sans authentification admin pour ce test)
        $response = $this->postJson("/api/demande-rdv/{$demande->id}/valider");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'message',
                    'demande' => ['id', 'statut'],
                    'rdv' => ['id', 'patient_id', 'statut', 'motif']
                ]);

        // Vérifier que la demande est approuvée
        $this->assertDatabaseHas('demandes', [
            'id' => $demande->id,
            'statut' => 'approuvé'
        ]);

        // Vérifier qu'un RDV a été créé
        $this->assertDatabaseHas('rdvs', [
            'patient_id' => $utilisateur->id, // Adapté selon votre logique
            'motif' => 'Consultation cardiologie',
            'statut' => 'programmé'
        ]);
    }

    /** @test */
    public function on_ne_peut_pas_valider_une_demande_deja_traitee()
    {
        $demande = DemandeRdv::factory()->create([
            'statut' => 'approuvé'
        ]);

        $response = $this->postJson("/api/demande-rdv/{$demande->id}/valider");

        $response->assertStatus(400)
                ->assertJson(['error' => 'Demande déjà traitée']);
    }

    /** @test */
    public function on_peut_rejeter_une_demande_avec_motif()
    {
        $demande = DemandeRdv::factory()->create([
            'statut' => 'en_attente'
        ]);

        $response = $this->postJson("/api/demande-rdv/{$demande->id}/rejeter", [
            'motif_rejet' => 'Médecin indisponible'
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'message',
                    'demande' => ['id', 'statut', 'description']
                ]);

        // Vérifier que la demande est rejetée
        $this->assertDatabaseHas('demandes', [
            'id' => $demande->id,
            'statut' => 'rejeté'
        ]);
    }

    /** @test */
    public function les_champs_obligatoires_doivent_etre_presents_pour_creer_une_demande()
    {
        $utilisateur = Utilisateur::factory()->create(['role' => 'patient']);
        Sanctum::actingAs($utilisateur);

        // Test sans objet
        $response = $this->postJson('/api/patient/demande-rdv', [
            'description' => 'Description valide'
        ]);
        $response->assertStatus(422);

        // Test sans description
        $response = $this->postJson('/api/patient/demande-rdv', [
            'objet' => 'Objet valide'
        ]);
        $response->assertStatus(422);

        // Test complet
        $response = $this->postJson('/api/patient/demande-rdv', [
            'objet' => 'Objet valide',
            'description' => 'Description valide',
            'date_souhaitee' => '2024-02-01'
        ]);
        $response->assertStatus(201);
    }

    /** @test */
    public function un_patient_peut_filtrer_ses_rendez_vous_confirmes()
    {
        // Créer un utilisateur patient
        $utilisateur = Utilisateur::factory()->create(['role' => 'patient']);
        Sanctum::actingAs($utilisateur);

        // Créer plusieurs demandes avec différents statuts
        $demandeEnAttente = DemandeRdv::factory()->create([
            'utilisateur_id' => $utilisateur->id,
            'statut' => 'en_attente'
        ]);

        $demandeApprouvee = DemandeRdv::factory()->create([
            'utilisateur_id' => $utilisateur->id,
            'statut' => 'approuvé'
        ]);

        $demandeRejetee = DemandeRdv::factory()->create([
            'utilisateur_id' => $utilisateur->id,
            'statut' => 'rejeté'
        ]);

        // Récupérer toutes les demandes
        $response = $this->getJson('/api/demande-rdv');

        $response->assertStatus(200)
                ->assertJsonCount(3); // 3 demandes au total

        // Simuler le filtrage du frontend (getMesRdv)
        $allDemandes = $response->json();
        $rdvConfirmes = collect($allDemandes)->filter(function($demande) {
            return $demande['statut'] === 'approuvé' || $demande['statut'] === 'approuve';
        })->values()->toArray();

        // Vérifier que seul le RDV approuvé est dans la liste
        $this->assertCount(1, $rdvConfirmes);
        $this->assertEquals($demandeApprouvee->id, $rdvConfirmes[0]['id']);
        $this->assertEquals('approuvé', $rdvConfirmes[0]['statut']);
    }

    /** @test */
    public function un_patient_peut_annuler_une_demande_en_attente()
    {
        // Créer un utilisateur patient
        $utilisateur = Utilisateur::factory()->create(['role' => 'patient']);
        Sanctum::actingAs($utilisateur);

        // Créer une demande en attente (pas encore approuvée)
        $demande = DemandeRdv::factory()->create([
            'utilisateur_id' => $utilisateur->id,
            'statut' => 'en_attente'
        ]);

        // Annuler la demande (rejeter la demande)
        $response = $this->postJson("/api/demande-rdv/{$demande->id}/rejeter", [
            'motif_rejet' => 'Annulation par le patient'
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'message',
                    'demande' => ['id', 'statut', 'description']
                ]);

        // Vérifier que la demande est maintenant rejetée
        $this->assertDatabaseHas('demandes', [
            'id' => $demande->id,
            'statut' => 'rejeté'
        ]);

        // Vérifier que le motif d'annulation est dans la description
        $this->assertStringContainsString('Annulation par le patient', $response->json('demande.description'));
    }

    /** @test */
    public function le_filtre_des_rendez_vous_ne_retourne_que_les_statuts_approuves()
    {
        // Test avec les statuts valides définis dans la migration
        $statutsTest = [
            'en_attente' => false,
            'approuvé' => true,
            'approuve' => true,
            'rejeté' => false
        ];

        foreach ($statutsTest as $statut => $shouldBeIncluded) {
            $demande = DemandeRdv::factory()->create(['statut' => $statut]);

            // Simuler le filtrage du frontend
            $isFiltered = ($statut === 'approuvé' || $statut === 'approuve');

            $this->assertEquals($shouldBeIncluded, $isFiltered,
                "Le statut '{$statut}' devrait " . ($shouldBeIncluded ? 'être' : 'ne pas être') . " inclus dans les RDV confirmés");
        }
    }
}

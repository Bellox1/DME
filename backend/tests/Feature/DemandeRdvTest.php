<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Patient;
use App\Models\DemandeRdv;
use App\Models\Rdv;

class DemandeRdvTest extends TestCase
{
    use RefreshDatabase;

    public function test_patient_can_create_and_valider_demande_rdv()
    {
        $patient = Patient::factory()->create();

        // Création de la demande
        $response = $this->postJson('/api/demande-rdv', [
            'patient_id' => $patient->id,
            'type' => 'consultation',
            'motif' => 'Besoin de consultation',
        ]);
        $response->assertStatus(201);
        $demandeId = $response->json('demande.id');

        // Validation de la demande
        $responseValide = $this->patchJson("/api/demande-rdv/{$demandeId}/valider");
        $responseValide->assertStatus(200);
        $responseValide->assertJsonStructure([
            'message',
            'demande' => ['id', 'statut'],
            'rdv' => ['id', 'patient_id', 'statut']
        ]);

        // Vérification en base
        $this->assertDatabaseHas('demande_rdvs', [
            'id' => $demandeId,
            'statut' => 'approuve',
        ]);
        $this->assertDatabaseHas('rdvs', [
            'patient_id' => $patient->id,
            'statut' => 'programmé',
        ]);
    }
}

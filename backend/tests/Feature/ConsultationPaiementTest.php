<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Consultation;
use Carbon\Carbon;

class ConsultationPaiementTest extends TestCase
{
    use RefreshDatabase;

    public function test_paiement_consultation_et_stats_journalieres()
    {
        // Création d'une consultation non payée
        $consult = Consultation::factory()->create([
            'paye' => false,
            'mode_paiement' => null,
            'prix' => 10000,
            'dateH_visite' => Carbon::now(),
        ]);

        // Paiement via API
        $response = $this->patchJson("/api/consultations/{$consult->id}/paiement", [
            'paye' => true,
            'mode_paiement' => 'Momo',
        ]);
        $response->assertStatus(200);
        $this->assertDatabaseHas('consultations', [
            'id' => $consult->id,
            'paye' => true,
            'mode_paiement' => 'Momo',
        ]);

        // Ajout d'une autre consultation payée en espèces
        Consultation::factory()->create([
            'paye' => true,
            'mode_paiement' => 'Espèces',
            'prix' => 5000,
            'dateH_visite' => Carbon::now(),
        ]);

        // Vérification des stats journalières
        $stats = $this->getJson('/api/stats/paiements/jour');
        $stats->assertStatus(200);
        $stats->assertJsonFragment(['mode_paiement' => 'Momo', 'total' => 10000]);
        $stats->assertJsonFragment(['mode_paiement' => 'Espèces', 'total' => 5000]);
    }
}

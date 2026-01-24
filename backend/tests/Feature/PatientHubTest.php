<?php

namespace Tests\Feature;

use App\Models\Utilisateur;
use App\Models\Patient;
use App\Models\Enfant;
use App\Models\Connexion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Facades\Hash;

class PatientHubTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function test_connexion_via_whatsapp_et_consultation_du_hub()
    {
        // 1. Création de l'utilisateur avec Tel et WhatsApp
        $user = Utilisateur::create([
            'nom' => 'SESSOU',
            'prenom' => 'Marc',
            'tel' => '90000001',
            'whatsapp' => '90000002',
            'sexe' => 'Homme',
            'role' => 'patient',
            'mot_de_passe' => Hash::make('password123'),
        ]);

        Connexion::create(['utilisateur_id' => $user->id, 'premiere_connexion' => true]);
        
        // Création des dossiers (Lui + 1 Enfant)
        Patient::create(['utilisateur_id' => $user->id]);
        $enfant = Enfant::create([
            'parent_id' => $user->id, 'nom' => 'SESSOU', 'prenom' => 'Junior', 'sexe' => 'Homme'
        ]);
        Patient::create(['enfant_id' => $enfant->id]);

        // 2. TEST : Connexion via numéro WHATSAPP
        $loginResponse = $this->postJson('/api/login', [
            'login' => '90000002', // On utilise le WhatsApp ici
            'mot_de_passe' => 'password123'
        ]);

        $loginResponse->assertStatus(200);

        // 3. TEST : Accès au HUB (Mes Dossiers)
        $this->actingAs($user); // On simule l'auth pour la route protégée
        $hubResponse = $this->getJson('/api/mes-dossiers');

        $hubResponse->assertStatus(200)
            ->assertJsonPath('personnel.nom_complet', 'SESSOU Marc')
            ->assertJsonCount(1, 'dependants')
            ->assertJsonPath('dependants.0.nom_complet', 'SESSOU Junior');
    }
}
<?php

namespace Tests\Feature; // Changé de Unit à Feature pour tester les routes API

use Tests\TestCase;
use App\Models\Utilisateur;
use App\Models\Connexion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\LoginTokenMail;

class AuthSecurityTest extends TestCase
{
    use RefreshDatabase;

   /** @test */
public function test_utilisateur_peut_se_connecter_avec_tel_ou_whatsapp()
{
    Mail::fake();

    // 1. Ajout des champs obligatoires (sexe, role) pour éviter l'erreur NOT NULL
    $user = Utilisateur::create([
        'nom' => 'SESSOU',
        'prenom' => 'Marc',
        'tel' => '90000001',
        'whatsapp' => '90000002',
        'sexe' => 'Homme', // Ajouté ici
        'role' => 'patient', // Ajouté ici
        'mot_de_passe' => Hash::make('password123'),
    ]);

    // ... reste du code identique ...
        Connexion::create([
            'utilisateur_id' => $user->id,
            'premiere_connexion' => true
        ]);

        // 2. Test de connexion via Tel (Utilisation de 'login' et 'mot_de_passe')
        $response = $this->postJson('/api/login', [
            'login' => '90000001',
            'mot_de_passe' => 'password123'
        ]);

        // VERIFICATIONS
        $response->assertStatus(200)
                 ->assertJsonMissing(['mot_de_passe']) // Instruction : mot de passe interdit en réponse
                 ->assertJsonStructure(['refresh_token', 'premiere_connexion']);

        // Vérification de la longueur du Refresh Token (256 chars)
        $this->assertEquals(256, strlen($response->json('refresh_token')));

        // Vérification que l'Access Token est envoyé par MAIL et non dans le JSON
        $response->assertJsonMissing(['access_token']); 
        Mail::assertSent(LoginTokenMail::class);
    }

    /** @test */
    public function test_les_secrets_font_bien_256_caracteres()
    {
        $accessSecret = config('services.jwt.access_secret');
        $refreshSecret = config('services.jwt.refresh_secret');

        $this->assertGreaterThanOrEqual(256, strlen($accessSecret), "L'access secret est trop court");
        $this->assertGreaterThanOrEqual(256, strlen($refreshSecret), "Le refresh secret est trop court");
        $this->assertNotEquals($accessSecret, $refreshSecret, "Les secrets doivent être différents");
    }


   /** @test */
    public function test_utilisateur_peut_changer_mot_de_passe_et_basculer_le_flag()
    {
        // Création manuelle (Pas de factory = pas d'erreur est_tuteur)
        $user = Utilisateur::create([
            'nom' => 'TEST', 'prenom' => 'User', 'tel' => '90000010',
            'sexe' => 'Homme', 'role' => 'patient',
            'mot_de_passe' => Hash::make('ancien123')
        ]);

        $connexion = Connexion::create([
            'utilisateur_id' => $user->id,
            'premiere_connexion' => true
        ]);

        $response = $this->postJson('/api/update-password', [
            'user_id' => $user->id,
            'nouveau_mot_de_passe' => 'nouveau12345',
            'nouveau_mot_de_passe_confirmation' => 'nouveau12345'
        ]);

        $response->assertStatus(200);
        $this->assertEquals(0, $connexion->fresh()->premiere_connexion);
    }

    /** @test */
    public function test_changement_mot_de_passe_bascule_le_flag_a_false()
    {
        // Même logique ici pour la cohérence
        $user = Utilisateur::create([
            'nom' => 'DOSSOU', 'prenom' => 'Jean', 'tel' => '90000005',
            'sexe' => 'Homme', 'role' => 'patient',
            'mot_de_passe' => Hash::make('ancien123')
        ]);
        
        $connexion = Connexion::create([
            'utilisateur_id' => $user->id, 
            'premiere_connexion' => true
        ]);

        $response = $this->postJson('/api/update-password', [
            'user_id' => $user->id,
            'nouveau_mot_de_passe' => 'nouveau12345',
            'nouveau_mot_de_passe_confirmation' => 'nouveau12345'
        ]);

        $response->assertStatus(200);
        $this->assertFalse((bool)$connexion->fresh()->premiere_connexion);
    }

}
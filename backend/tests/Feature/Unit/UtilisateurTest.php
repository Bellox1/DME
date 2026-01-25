<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Utilisateur;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UtilisateurTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function test_utilisateur_utilise_le_telephone_comme_identifiant()
    {
        $user = new Utilisateur();
        // Vérifie si ton getAuthIdentifierName() renvoie bien 'tel'
        $this->assertEquals('tel', $user->getAuthIdentifierName());
    }

    /** @test */
    public function test_le_mot_de_passe_est_masque_dans_le_json()
    {
        // On crée un utilisateur simple sans Factory pour l'instant
        $user = new Utilisateur([
            'nom' => 'Test',
            'prenom' => 'User',
            'tel' => '01020304',
            'mot_de_passe' => 'secret123'
        ]);

        $array = $user->toArray();

        // Le champ 'mot_de_passe' ne doit JAMAIS être présent dans le JSON
        $this->assertArrayNotHasKey('mot_de_passe', $array);
        // On vérifie aussi 'password' au cas où Laravel utiliserait le nom par défaut
        $this->assertArrayNotHasKey('password', $array);
    }
}
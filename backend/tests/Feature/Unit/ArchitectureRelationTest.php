<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Utilisateur;
use App\Models\Enfant;
use App\Models\Patient;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ArchitectureRelationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function test_un_patient_peut_etre_lie_a_un_adulte_et_recuperer_son_nom()
    {
        //  Créer l'identité adulte
        $adulte = Utilisateur::create([
            'nom' => 'KOFFI',
            'prenom' => 'Jean',
            'tel' => '90000001',
            'mot_de_passe' => 'secret',
            'sexe' => 'Homme',
            'role' => 'patient'
        ]);

        // Créer le dossier patient lié à cet adulte
        $patient = Patient::create(['utilisateur_id' => $adulte->id]);

        // Vérifier l'accesseur nom_complet
        $this->assertEquals('KOFFI Jean', $patient->nom_complet);
    }

    /** @test */
    public function test_un_patient_peut_etre_lie_a_un_enfant_et_recuperer_son_nom()
    {
        //  Créer le parent
        $parent = Utilisateur::create([
            'nom' => 'SESSOU', 'prenom' => 'Marc', 'tel' => '90000002', 
            'mot_de_passe' => 'secret', 'sexe' => 'Homme', 'role' => 'patient'
        ]);

        // Créer l'identité enfant
        $enfant = Enfant::create([
            'parent_id' => $parent->id,
            'nom' => 'SESSOU',
            'prenom' => 'Junior',
            'sexe' => 'Homme'
        ]);

        // Créer le dossier patient lié à l'enfant
        $patient = Patient::create(['enfant_id' => $enfant->id]);

        // Vérifier l'accesseur nom_complet
        $this->assertEquals('SESSOU Junior', $patient->nom_complet);
    }
}
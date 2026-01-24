<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Consultation>
 */
class ConsultationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'patient_id' => \App\Models\Patient::factory(),
            'medecin_id' => \App\Models\Utilisateur::factory(),
            'dateH_visite' => $this->faker->dateTimeThisYear(),
            'motif' => $this->faker->sentence(),
            'antecedents' => $this->faker->text(50),
            'allergies' => $this->faker->text(30),
            'diagnostic' => $this->faker->text(30),
            'observations_medecin' => $this->faker->text(30),
            'traitement' => $this->faker->text(30),
            'duree_traitement' => $this->faker->word(),
            'prix' => $this->faker->numberBetween(1000, 20000),
            'paye' => false,
            'mode_paiement' => null,
        ];
    }
}

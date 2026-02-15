<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class EnfantFactory extends Factory
{
    public function definition(): array
    {
        return [
            'parent_id' => \App\Models\Utilisateur::factory(),
            'nom' => $this->faker->lastName,
            'prenom' => $this->faker->firstName,
            'sexe' => $this->faker->randomElement(['Homme', 'Femme']),
            'date_naissance' => $this->faker->dateTimeBetween('-15 years', '-1 year'),
        ];
    }
}

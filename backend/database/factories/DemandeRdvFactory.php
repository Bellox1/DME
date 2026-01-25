<?php

namespace Database\Factories;

use App\Models\DemandeRdv;
use App\Models\Utilisateur;
use Illuminate\Database\Eloquent\Factories\Factory;

class DemandeRdvFactory extends Factory
{
    protected $model = DemandeRdv::class;

    public function definition()
    {
        return [
            'utilisateur_id' => Utilisateur::factory(),
            'type' => 'rendez-vous',
            'objet' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(2),
            'statut' => 'en_attente',
            'date_creation' => now(),
            'date_modification' => now(),
        ];
    }

    public function approuve()
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'approuvé',
        ]);
    }

    public function rejete()
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'rejeté',
        ]);
    }
}

<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Utilisateur>
 */
class UtilisateurFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom' => fake()->lastName(),
            'prenom' => fake()->firstName(),
            'tel' => fake()->unique()->numerify('06########'),
            'whatsapp' => fake()->optional()->numerify('07########'),
            'mot_de_passe' => static::$password ??= Hash::make('password'),
            'sexe' => fake()->randomElement(['Homme', 'Femme']),
            'role' => fake()->randomElement(['admin', 'accueil', 'medecin', 'patient']),
            'ville' => fake()->city(),
            'date_naissance' => fake()->date('Y-m-d', '-18 years'),
        ];
    }
}

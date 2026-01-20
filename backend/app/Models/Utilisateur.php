<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Utilisateur extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'utilisateurs';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nom',
        'prenom',
        'tel',
        'whatsapp',
        'mot_de_passe',
        'sexe',
        'role',
        'est_tuteur',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'mot_de_passe',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'mot_de_passe' => 'hashed',
            'est_tuteur' => 'boolean',
        ];
    }

    /**
     * Get the password for authentication.
     */
    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }

    /**
     * Get the name of the unique identifier for the user.
     */
    public function getAuthIdentifierName()
    {
        return 'tel';
    }

    /**
     * Disable timestamps as we use custom date_creation and date_modification
     */
    const CREATED_AT = 'date_creation';
    const UPDATED_AT = 'date_modification';
}

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
        'ville',
        'date_naissance',
        'tel',
        'whatsapp',
        'mot_de_passe',
        'sexe',
        'role',
        'refresh_token', 
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'mot_de_passe',
        'refresh_token', 
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
            'date_naissance' => 'date',
        ];
    }

    /**
     * Relations
     */
    public function enfants()
    {
        return $this->hasMany(Enfant::class, 'parent_id');
    }

    public function patient()
    {
        return $this->hasOne(Patient::class, 'utilisateur_id');
    }

    public function demandes()
    {
        return $this->hasMany(Demande::class, 'utilisateur_id');
    }

    public function connexion()
    {
        return $this->hasOne(Connexion::class, 'utilisateur_id');
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

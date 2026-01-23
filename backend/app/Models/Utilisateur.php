<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Authenticatable
{
    use HasApiTokens, Notifiable, HasFactory;

    protected $table = 'utilisateurs';
    public $timestamps = true; // Enabled to manage date_creation and date_modification
    // Migration: $table->timestamp('date_creation')->useCurrent();
    // Laravel expects created_at/updated_at by default. If columns are custom, we need to specify.
    // Migration: date_creation, date_modification.
    const CREATED_AT = 'date_creation';
    const UPDATED_AT = 'date_modification';

    protected $fillable = [
        'nom',
        'prenom',
        'tel',
        'whatsapp',
        'mot_de_passe',
        'ville',
        'sexe',
        'role',
        'refresh_token',
        'date_naissance'
    ];

    protected $hidden = [
        'mot_de_passe',
        'refresh_token',
    ];

    protected $casts = [
        'mot_de_passe' => 'hashed',
        'date_naissance' => 'date',
    ];

    public function getAuthPassword()
    {
        return $this->mot_de_passe; // Custom password column
    }

    public function patient(): HasOne
    {
        return $this->hasOne(Patient::class, 'utilisateur_id');
    }
}

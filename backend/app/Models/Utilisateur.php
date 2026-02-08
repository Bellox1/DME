<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany; // <--- AJOUTE CECI
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Authenticatable
{
    use HasApiTokens, Notifiable, HasFactory;

    protected $table = 'utilisateurs';
    public $timestamps = true;
    
    const CREATED_AT = 'date_creation';
    const UPDATED_AT = 'date_modification';

    protected $fillable = [
        'nom', 'prenom', 'tel', 'whatsapp', 'mot_de_passe', 
        'ville', 'sexe', 'role', 'refresh_token', 'date_naissance', 'photo'
    ];

    protected $hidden = [
        'mot_de_passe',
        'refresh_token',
    ];

    protected $casts = [
        'mot_de_passe' => 'hashed',
        'date_naissance' => 'date',
    ];

    // --- RELATIONS ---

    /**
     * Un utilisateur peut être tuteur de plusieurs enfants.
     */
    public function enfants(): HasMany
    {
        // On suppose que ta table 'enfants' a une colonne 'parent_id' 
        // qui pointe vers l'id de l'utilisateur.
        return $this->hasMany(Enfant::class, 'parent_id');
    }

    public function patient(): HasOne
    {
        return $this->hasOne(Patient::class, 'utilisateur_id');
    }

    public function connexion(): HasOne
    {
        return $this->hasOne(Connexion::class, 'utilisateur_id');
    }

    // --- LOGIQUE AUTH & PERMISSIONS ---
    
    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }

    public function hasPermission(string $permissionName): bool
    {
        $roleId = \Illuminate\Support\Facades\DB::table('roles')
            ->where('nom', $this->role)
            ->value('id');

        if (!$roleId) return false;

        $permId = \Illuminate\Support\Facades\DB::table('permissions')
            ->where('nom', $permissionName)
            ->value('id');

        if (!$permId) return false;

        return \Illuminate\Support\Facades\DB::table('role_permissions')
            ->where('role_id', $roleId)
            ->where('permission_id', $permId)
            ->exists();
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
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

    public function connexion(): HasOne
    {
        return $this->hasOne(Connexion::class, 'utilisateur_id');
    }

    /**
     * Check if the user has a specific permission based on their role.
     */
    public function hasPermission(string $permissionName): bool
    {
        // Admin has all permissions usually, but let's stick to DB logic
        // 1. Get Role ID from the name stored in 'role' column
        $roleId = \Illuminate\Support\Facades\DB::table('roles')
            ->where('nom', $this->role)
            ->value('id');

        if (!$roleId) return false;

        // 2. Get Permission ID
        $permId = \Illuminate\Support\Facades\DB::table('permissions')
            ->where('nom', $permissionName)
            ->value('id');

        if (!$permId) return false;

        // 3. Check existance in role_permissions
        return \Illuminate\Support\Facades\DB::table('role_permissions')
            ->where('role_id', $roleId)
            ->where('permission_id', $permId)
            ->exists();
    }
}

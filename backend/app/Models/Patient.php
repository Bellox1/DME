<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $table = 'patients';

    // 1. AJOUT : Permet d'inclure le nom complet dans les réponses API JSON
    protected $appends = ['nom_complet'];

    protected $fillable = [

        'utilisateur_id',
        'enfant_id',
        'taille',
        'poids',
        'adresse',
        'groupe_sanguin',
    ];

    // 2. AJOUT : Conversion automatique des types
    protected $casts = [
        'taille' => 'float',
        'poids' => 'float',
    ];

    const CREATED_AT = 'date_creation';
    const UPDATED_AT = 'date_modification';



    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }

    public function enfant()
    {
        return $this->belongsTo(Enfant::class, 'enfant_id');
    }

    public function consultations()
    {
        return $this->hasMany(Consultation::class, 'patient_id');
    }

    public function rdvs()
    {
        return $this->hasMany(Rdv::class, 'patient_id');
    }

    /**
     * Accesseur pour le nom complet
     */
    public function getNomCompletAttribute()
    {
        // On vérifie d'abord si c'est l'utilisateur lui-même
        if ($this->utilisateur_id && $this->utilisateur) {
            return "{$this->utilisateur->nom} {$this->utilisateur->prenom}";
        }

        // Sinon, on vérifie si c'est un enfant
        if ($this->enfant_id && $this->enfant) {
            return "{$this->enfant->nom} {$this->enfant->prenom}";
        }

        return "Patient Inconnu";
    }
}
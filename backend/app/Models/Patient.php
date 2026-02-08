<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $table = 'patients';

    // 1. AJOUT : Permet d'inclure les infos complètes dans les réponses API JSON
    protected $appends = ['nom_complet', 'sexe', 'type', 'age', 'tel'];

    protected $fillable = [
        'numero_patient',
        'utilisateur_id',
        'enfant_id',
        'taille',
        'poids',
        'adresse',
        'groupe_sanguin',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($patient) {
            if (empty($patient->numero_patient)) {
                $patient->numero_patient = 'PAT-' . strtoupper(bin2hex(random_bytes(4)));
            }
        });
    }

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
        if ($this->utilisateur_id && $this->utilisateur) {
            return "{$this->utilisateur->nom} {$this->utilisateur->prenom}";
        }
        if ($this->enfant_id && $this->enfant) {
            return "{$this->enfant->nom} {$this->enfant->prenom}";
        }
        return "Patient Inconnu";
    }

    /**
     * Accesseur pour le sexe (M/F)
     */
    public function getSexeAttribute()
    {
        $sexe = null;
        if ($this->utilisateur_id && $this->utilisateur) {
            $sexe = $this->utilisateur->sexe;
        } elseif ($this->enfant_id && $this->enfant) {
            $sexe = $this->enfant->sexe;
        }

        // Normalisation pour le frontend (Homme -> M, Femme -> F)
        if ($sexe === 'Homme') return 'M';
        if ($sexe === 'Femme') return 'F';
        return $sexe; // Retourne tel quel si déjà M/F ou autre
    }

    /**
     * Accesseur pour le type (Adulte/Enfant)
     */
    public function getTypeAttribute()
    {
        if ($this->utilisateur_id) return 'Adulte';
        if ($this->enfant_id) return 'Enfant';
        return 'Inconnu';
    }

    /**
     * Accesseur pour l'âge
     */
    public function getAgeAttribute()
    {
        $dateNaissance = null;
        if ($this->utilisateur_id && $this->utilisateur) {
            $dateNaissance = $this->utilisateur->date_naissance;
        } elseif ($this->enfant_id && $this->enfant) {
            $dateNaissance = $this->enfant->date_naissance;
        }

        if ($dateNaissance) {
            return \Carbon\Carbon::parse($dateNaissance)->age;
        }
        return null;
    }

    /**
     * Accesseur pour le téléphone
     */
    public function getTelAttribute()
    {
        if ($this->utilisateur_id && $this->utilisateur) {
            return $this->utilisateur->tel;
        }
        // Les enfants n'ont pas de tel direct, on pourrait retourner celui du parent si besoin, 
        // mais pour l'instant 'Aucun contact' est logique ou on laisse null.
        return null;
    }
}
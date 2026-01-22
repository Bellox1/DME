<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $table = 'patients';

    protected $fillable = [
        'utilisateur_id',
        'enfant_id',
        'taille',
        'poids',
        'adresse',
        'groupe_sanguin',
    ];

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

    const CREATED_AT = 'date_creation';
    const UPDATED_AT = 'date_modification';


   
    public function getNomCompletAttribute()
    {
        if ($this->utilisateur_id) {
            return $this->utilisateur->nom . ' ' . $this->utilisateur->prenom;
        }

        if ($this->enfant_id) {
            return $this->enfant->nom . ' ' . $this->enfant->prenom;
        }

        return "Patient Inconnu";
    }
}

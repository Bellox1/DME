<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consultation extends Model
{
    use HasFactory;

    protected $table = 'consultations';

    protected $fillable = [
        'patient_id',
        'medecin_id',
        'dateH_visite',
        'motif',
        'antecedents',
        'allergies',
        'diagnostic',
        'observations_medecin',
        'traitement',
        'duree_traitement',
    ];

    protected $casts = [
        'dateH_visite' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }

    public function medecin()
    {
        return $this->belongsTo(Utilisateur::class, 'medecin_id');
    }

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class, 'consultation_id');
    }

    const CREATED_AT = 'date_creation';
    const UPDATED_AT = 'date_modification';
}

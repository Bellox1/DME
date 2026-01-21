<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rdv extends Model
{
    use HasFactory;

    protected $table = 'rdvs';

    protected $fillable = [
        'dateH_rdv',
        'statut',
        'motif',
        'patient_id',
        'medecin_id',
    ];

    protected $casts = [
        'dateH_rdv' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }

    public function medecin()
    {
        return $this->belongsTo(Utilisateur::class, 'medecin_id');
    }

    const CREATED_AT = 'date_creation';
    const UPDATED_AT = 'date_modification';
}

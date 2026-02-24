<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transfert extends Model
{
    protected $fillable = [
        'patient_id',
        'medecin_expediteur_id',
        'medecin_destinataire_id',
        'motif',
        'statut',
        'date_transfert'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function expediteur()
    {
        return $this->belongsTo(Utilisateur::class, 'medecin_expediteur_id');
    }

    public function destinataire()
    {
        return $this->belongsTo(Utilisateur::class, 'medecin_destinataire_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DemandeRdv extends Model
{
    protected $fillable = [
        'patient_id', 'type', 'statut', 'date_demande', 'motif'
    ];

    protected $casts = [
        'date_demande' => 'datetime',
    ];
}

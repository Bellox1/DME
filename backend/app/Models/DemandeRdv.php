<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DemandeRdv extends Model
{
    use HasFactory;
    protected $table = 'demandes';

    protected $fillable = [
        'utilisateur_id', 'type', 'statut', 'date_creation', 'objet', 'description'
    ];

    protected $casts = [
        'date_creation' => 'datetime',
        'date_modification' => 'datetime',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }

    const CREATED_AT = 'date_creation';
    const UPDATED_AT = 'date_modification';
}

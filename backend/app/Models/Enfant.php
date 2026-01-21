<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enfant extends Model
{
    use HasFactory;

    protected $table = 'enfants';

    protected $fillable = [
        'parent_id',
        'nom',
        'prenom',
        'sexe',
        'date_naissance',
    ];

    protected $casts = [
        'date_naissance' => 'date',
    ];

    public function parent()
    {
        return $this->belongsTo(Utilisateur::class, 'parent_id');
    }

    public function patient()
    {
        return $this->hasOne(Patient::class, 'enfant_id');
    }

    const CREATED_AT = 'date_creation';
    const UPDATED_AT = 'date_modification';
}

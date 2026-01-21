<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Connexion extends Model
{
    use HasFactory;

    protected $table = 'connexions';

    protected $fillable = [
        'utilisateur_id',
        'premiere_connexion',
        'date_derniere_connexion',
    ];

    protected $casts = [
        'premiere_connexion' => 'boolean',
        'date_derniere_connexion' => 'datetime',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }

    public $timestamps = false;
}

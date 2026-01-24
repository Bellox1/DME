<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tracabilite extends Model
{
    protected $table = 'tracabilites';

    protected $fillable = [
        'utilisateur_id',
        'action',
        'nom_table',
        'champ',
        'ancienne_valeur',
        'nouvelle_valeur'
    ];

    // On force Laravel à utiliser tes colonnes SQL personnalisées
    const CREATED_AT = 'date_creation';
    const UPDATED_AT = 'date_modification';

    /**
     * Relation : Une trace appartient à un utilisateur
     */
    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }
}
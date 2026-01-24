<?php

namespace App\Services;

use Illuminate\Support\Str;

class TokenService
{
    /**
     * Génère un token aléatoire de 256 caractères.
     * C'est ce token que tu mettras dans tes emails.
     */
    public static function generateSecureToken(int $length = 256): string
    {
        return Str::random($length);
    }

    /**
     * Hache le token pour le stockage en base de données.
     * Utilise des secrets différents selon le type (access ou refresh).
     */
    public static function hashToken(string $token, string $type = 'access'): string
    {
        // Récupère les secrets de 256 caractères que tu as mis dans config/services.php
        $secret = ($type === 'access') 
            ? config('services.jwt.access_secret') 
            : config('services.jwt.refresh_secret');

        // Hachage HMAC SHA-256 (très robuste)
        return hash_hmac('sha256', $token, $secret);
    }
}
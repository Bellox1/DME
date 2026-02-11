<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


use App\Services\TwilioService;

Route::get('/test-whatsapp', function (TwilioService $twilio) {
    // CORRECTION : Utilise -> au lieu de ::
    $result = $twilio->sendWhatsApp('+22991309710', 'Test de sécurité DME - Session Active');
    
    if ($result) {
        return "✅ Message envoyé ! Vérifie ton WhatsApp.";
    }
    return "❌ Échec. Vérifie storage/logs/laravel.log";
});
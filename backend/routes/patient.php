<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Patient\EnfantController;
use App\Http\Controllers\Api\Patient\DemandeRdvController;
use App\Http\Controllers\Api\Accueil\PatientController;

// Routes Enfants
Route::post('/enfants', [EnfantController::class, 'store']); // Create child

// Demandes de RDV (Patient Actions)
Route::get('/demande-rdv', [DemandeRdvController::class, 'index']); // List own demands
Route::post('/demande-rdv', [DemandeRdvController::class, 'store']); // Create demand

// Patient Self Actions (Authenticated)
Route::middleware('auth:sanctum')->group(function () {
    // The HUB : My folders
    Route::get('/mes-dossiers', [PatientController::class, 'getMesDossiers']);

    // Enregistrement patient (Self or via Auth?) - keeping as per API
    Route::post('/patients/enregistrer', [PatientController::class, 'enregistrer']);
});

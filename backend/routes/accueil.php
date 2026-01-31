<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Accueil\PatientController;
use App\Http\Controllers\Api\Accueil\QueueController;
use App\Http\Controllers\Api\Accueil\RdvController;
use App\Http\Controllers\Api\Patient\DemandeRdvController;
use App\Http\Controllers\Api\Medecin\ConsultationController;
use App\Http\Controllers\Api\Patient\EnfantController;

// Files d'attente
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/queue', [QueueController::class, 'index']);
    Route::patch('/rdvs/{id}/status', [QueueController::class, 'updateStatus']);
});

// Gestion des Patients
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/patients', [PatientController::class, 'index']);
    Route::post('/patients', [PatientController::class, 'store']);

    Route::get('/patients/{id}', [PatientController::class, 'show']);
    Route::put('/patients/{id}', [PatientController::class, 'update']);
    Route::get('/recherche-tuteur', [PatientController::class, 'rechercherTuteur']);
    Route::post('/enfants', [EnfantController::class, 'store']);
    Route::put('/enfants/{id}', [EnfantController::class, 'update']);

});



// Validation des demandes de RDV
Route::middleware('auth:sanctum')->patch('/demande-rdv/{id}/valider', [DemandeRdvController::class, 'valider']);

// RDVs Management (Access to RdvController for listing/managing if needed, though mostly Queue/Demande based currently)
// Add specific routes if RdvController has specific reception methods not covered





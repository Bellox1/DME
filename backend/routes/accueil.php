<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Accueil\PatientController;
use App\Http\Controllers\Api\Accueil\QueueController;
use App\Http\Controllers\Api\Accueil\RdvController;
use App\Http\Controllers\Api\Patient\DemandeRdvController;
use App\Http\Controllers\Api\Medecin\ConsultationController;

// Files d'attente
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/queue', [QueueController::class, 'index']);
    Route::patch('/rdvs/{id}/status', [QueueController::class, 'updateStatus']);
});

// Gestion des Patients
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/patients', [PatientController::class, 'index']);
    Route::post('/patients', [PatientController::class, 'store']);
});

// Validation des demandes de RDV
Route::middleware('auth:sanctum')->patch('/demande-rdv/{id}/valider', [DemandeRdvController::class, 'valider']);

// RDVs Management
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/rdvs', [RdvController::class, 'index']);
});

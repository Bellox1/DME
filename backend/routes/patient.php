<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Patient\EnfantController;
use App\Http\Controllers\Api\Patient\DemandeRdvController;
use App\Http\Controllers\Api\Patient\PrescriptionController;
use App\Http\Controllers\Api\Accueil\PatientController;

// Routes Enfants
Route::post('/enfants', [EnfantController::class, 'store']); // Create child

// Demandes de RDV (Patient Actions - Authentifié)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/demande-rdv', [DemandeRdvController::class, 'index']); // List own demands
    Route::post('/demande-rdv', [DemandeRdvController::class, 'store']); // Create demand
});

// Routes Admin/Accueil pour gestion des demandes
Route::post('/demande-rdv/{id}/valider', [DemandeRdvController::class, 'valider']); // Validate demand
Route::post('/demande-rdv/{id}/rejeter', [DemandeRdvController::class, 'rejeter']); // Reject demand

// Patient Self Actions (Authenticated)
Route::middleware('auth:sanctum')->group(function () {
    // The HUB : My folders
    Route::get('/mes-dossiers', [PatientController::class, 'getMesDossiers']);

    // Enregistrement patient (Self or via Auth?) - keeping as per API
    Route::post('/patients/enregistrer', [PatientController::class, 'enregistrer']);

    // Ordonnances
    Route::get('/ordonnances', [PrescriptionController::class, 'index']);
    Route::get('/ordonnances/stats', [PrescriptionController::class, 'getStats']);
    Route::get('/ordonnances/{id}', [PrescriptionController::class, 'show']);
    Route::get('/ordonnances/{id}/download', [PrescriptionController::class, 'downloadPdf']);
    Route::get('/consultations/{consultationId}/ordonnances', [PrescriptionController::class, 'getByConsultation']);
});

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Medecin\ConsultationController;
use App\Http\Controllers\Api\Medecin\PrescriptionController;
use App\Http\Controllers\Api\Medecin\MedicalHistoryController;
use App\Http\Controllers\Api\Medecin\OrdonnanceController;
use App\Http\Controllers\Api\Medecin\ResultatController;

// Routes protégées par authentification Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // Consultations (Medical actions)
    Route::post('/consultations', [ConsultationController::class, 'store']);
    Route::get('/consultations/{id}', [ConsultationController::class, 'show']);
    Route::put('/consultations/{id}', [ConsultationController::class, 'update']);

    // Prescriptions
    Route::post('/consultations/{id}/prescriptions', [PrescriptionController::class, 'store']);
    Route::delete('/prescriptions/{id}', [PrescriptionController::class, 'destroy']);

    // Historique Médical
    Route::get('/patients/{id}/history', [MedicalHistoryController::class, 'index']);
    Route::get('/consultations', [MedicalHistoryController::class, 'getAllForDoctor']);

    // PDF Generation
    Route::get('/consultations/{id}/pdf', [OrdonnanceController::class, 'generate']);

    // Résultats d'examens
    Route::get('/resultats', [ResultatController::class, 'index']);
    Route::get('/patients/{id}/resultats', [ResultatController::class, 'getByPatient']);
});

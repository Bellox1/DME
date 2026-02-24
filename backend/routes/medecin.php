<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Medecin\ConsultationController;
use App\Http\Controllers\Api\Medecin\PrescriptionController;
use App\Http\Controllers\Api\Medecin\MedicalHistoryController;
use App\Http\Controllers\Api\Medecin\OrdonnanceController;
use App\Http\Controllers\Api\Medecin\ResultatController;
use App\Http\Controllers\Api\Medecin\StatsController;
use App\Http\Controllers\Api\Medecin\ProfileController;
use App\Http\Controllers\Api\Medecin\NotificationController;

// Routes protégées par authentification Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // Profil management
    Route::post('/profile/update', [ProfileController::class, 'update']);
    Route::post('/profile/password', [ProfileController::class, 'updatePassword']);
    Route::post('/profile/photo', [ProfileController::class, 'updatePhoto']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
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

    // Statistiques
    Route::get('/stats', [StatsController::class, 'index']);

    // Transferts de dossier
    Route::get('/transferts/recus', [\App\Http\Controllers\Api\Medecin\TransfertController::class, 'index']);
    Route::get('/transferts/envoyes', [\App\Http\Controllers\Api\Medecin\TransfertController::class, 'sent']);
    Route::get('/transferts/medecins', [\App\Http\Controllers\Api\Medecin\TransfertController::class, 'doctors']);
    Route::post('/transferts', [\App\Http\Controllers\Api\Medecin\TransfertController::class, 'store']);
});

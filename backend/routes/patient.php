<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Patient\EnfantController;
use App\Http\Controllers\Api\Patient\DemandeRdvController;
use App\Http\Controllers\Api\Accueil\PatientController;

// Routes Enfants
use App\Http\Controllers\Api\Patient\DashboardController;
use App\Http\Controllers\Api\Patient\DossierMedicalController;
use App\Http\Controllers\Api\Patient\CompteController;
use App\Http\Controllers\Api\Patient\NotificationController;

Route::middleware(['auth:sanctum', 'role:patient'])->prefix('patient')->group(function () {
    
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/activites', [DashboardController::class, 'toutesActivites']);

    // Dossier Médical & Profils
    Route::get('/profils', [DossierMedicalController::class, 'listerProfils']); // Sélecteur de dossier
    Route::get('/dossier/{id}', [DossierMedicalController::class, 'show']);      // Détail d'un dossier
    Route::get('/examens', [DossierMedicalController::class, 'getExamens']);

    // Compte (Paramètres Utilisateur)
    Route::get('/compte', [CompteController::class, 'show']);
    Route::put('/compte', [CompteController::class, 'update']);
    Route::post('/compte/password', [CompteController::class, 'updatePassword']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);

    // Demandes
    Route::post('/demandes', [\App\Http\Controllers\Api\Patient\DemandeController::class, 'store']);

});

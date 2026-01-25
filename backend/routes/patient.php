<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Patient\EnfantController;
use App\Http\Controllers\Api\Patient\DemandeRdvController;
use App\Http\Controllers\Api\Patient\PrescriptionController;
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

    // Enregistrement patient (Self or via Auth?) - keeping as per API
    Route::post('/patients/enregistrer', [PatientController::class, 'enregistrer']);

    // Ordonnances
    Route::get('/ordonnances', [PrescriptionController::class, 'index']);
    Route::get('/ordonnances/stats', [PrescriptionController::class, 'getStats']);
    Route::get('/ordonnances/{id}', [PrescriptionController::class, 'show']);
    Route::get('/ordonnances/{id}/download', [PrescriptionController::class, 'downloadPdf']);
    Route::get('/consultations/{consultationId}/ordonnances', [PrescriptionController::class, 'getByConsultation']);
});

// Demandes de RDV (Patient Actions - Authentifié)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/demande-rdv', [DemandeRdvController::class, 'index']); // List own demands
    Route::post('/demande-rdv', [DemandeRdvController::class, 'store']); // Create demand
});

// Routes Admin/Accueil pour gestion des demandes
Route::post('/demande-rdv/{id}/valider', [DemandeRdvController::class, 'valider']); // Validate demand
Route::post('/demande-rdv/{id}/rejeter', [DemandeRdvController::class, 'rejeter']); // Reject demand

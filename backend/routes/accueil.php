<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Accueil\PatientController;
use App\Http\Controllers\Api\Accueil\QueueController;
use App\Http\Controllers\Api\Accueil\StatistiqueController;
use App\Http\Controllers\Api\Accueil\RdvController;
use App\Http\Controllers\Api\Patient\DemandeRdvController;
use App\Http\Controllers\Api\Medecin\ConsultationController;
use App\Http\Controllers\Api\Patient\EnfantController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Accueil\NotificationController;

// Files d'attente
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/queue', [QueueController::class, 'index']);
    Route::patch('/rdvs/{id}/status', [QueueController::class, 'updateStatus']);
});

// Gestion des Patients
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/patients', [PatientController::class, 'index']);
    Route::post('/patients', [PatientController::class, 'store']);
    Route::post('/auth/resend-activation', [AuthController::class, 'resendActivation']);
    Route::get('/patients/{id}', [PatientController::class, 'show']);
    Route::put('/patients/{id}', [PatientController::class, 'update']);
    Route::get('/recherche-tuteur', [PatientController::class, 'rechercherTuteur']);
    Route::post('/enfants', [EnfantController::class, 'store']);
    Route::put('/enfants/{id}', [EnfantController::class, 'update']);

});

// Gestion des demandes de RDV (Patient)
Route::middleware('auth:sanctum')->group(function () {
    // Liste des demandes (GET /api/demande-rdv)
    Route::get('/demande-rdv', [DemandeRdvController::class, 'index']);

    // Création d'une demande (POST /api/demande-rdv)
    Route::post('/demande-rdv', [DemandeRdvController::class, 'store']);

    // Validation (déjà présente chez toi, on la regroupe ici)
    Route::patch('/demande-rdv/{id}/valider', [DemandeRdvController::class, 'valider']);

    // Dans routes/api.php
    Route::patch('demande-rdv/{id}/status', [DemandeRdvController::class, 'updateStatus']);
});

// RDVs Management
Route::middleware('auth:sanctum')->group(function () {
    // Récupération globale ou par filtre patient/médecin
    Route::get('/rdvs', [RdvController::class, 'index']);
    Route::post('/rdvs', [RdvController::class, 'store']);

    // --- Gestion de la File d'Attente / Planning (QueueController) ---
    // Liste filtrée par date pour l'affichage du planning
    Route::get('/rdvs/planning', [QueueController::class, 'index']);
    // Changement de statut (programmé, annulé, passé)
    Route::patch('/rdvs/{id}/status', [QueueController::class, 'updateStatus']);

    Route::post('/accueil/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead']);
    Route::get('/accueil/notifications', [App\Http\Controllers\Api\Accueil\NotificationController::class, 'index']);
});

Route::middleware('auth:sanctum')->get('/medecins', function () {
    // On récupère uniquement les colonnes qui existent réellement dans ta migration
    return \App\Models\Utilisateur::where('role', 'medecin')
        ->get(['id', 'nom', 'prenom', 'ville']);
});

// statistiques
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/stats/globales', [StatistiqueController::class, 'getGlobalStats']);

});







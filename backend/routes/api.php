<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\EnfantController;
use App\Http\Controllers\Api\RdvController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\QueueController;
use App\Http\Controllers\Api\ConsultationController;
use App\Http\Controllers\Api\PrescriptionController;
use App\Http\Controllers\Api\MedicalHistoryController;
use App\Http\Controllers\Api\OrdonnanceController;
use App\Http\Controllers\DemandeRdvController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// --- Routes Publiques ---
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/update-password', [AuthController::class, 'updatePassword']);

// --- Routes Sécurisées (Token requis) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // Enregistrement d'un nouveau patient (Adulte ou Enfant)
    Route::post('/patients/enregistrer', [PatientController::class, 'enregistrer']);
    
    // Le HUB : Récupérer mon dossier et ceux de mes enfants
    Route::get('/mes-dossiers', [PatientController::class, 'getMesDossiers']);

    // Module Médical (Consultations, Files d'attente, etc.)
    // Note: Décommenter le middleware une fois le front aligné avec les tokens
});


// --- Routes Métier (Actuellement Open pour Dev, à sécuriser) ---

// Enfants
Route::post('/enfants', [EnfantController::class, 'store']);

// Demandes de RDV
Route::get('/demande-rdv', [DemandeRdvController::class, 'index']);
Route::post('/demande-rdv', [DemandeRdvController::class, 'store']);
Route::patch('/demande-rdv/{id}/valider', [DemandeRdvController::class, 'valider']);

// Patients List
Route::get('/patients', [PatientController::class, 'index']);

// File d'attente
Route::get('/queue', [QueueController::class, 'index']);
Route::patch('/rdvs/{id}/status', [QueueController::class, 'updateStatus']);

// Consultations
Route::post('/consultations', [ConsultationController::class, 'store']);
Route::get('/consultations/{id}', [ConsultationController::class, 'show']);
Route::put('/consultations/{id}', [ConsultationController::class, 'update']);

// Paiement Consultation
Route::patch('/consultations/{id}/paiement', [ConsultationController::class, 'updatePaiement']);
Route::get('/stats/paiements/jour', [ConsultationController::class, 'statsJournalieres']);

// Prescriptions
Route::post('/consultations/{id}/prescriptions', [PrescriptionController::class, 'store']);
Route::delete('/prescriptions/{id}', [PrescriptionController::class, 'destroy']);

// Historique
Route::get('/patients/{id}/history', [MedicalHistoryController::class, 'index']);

// PDF
Route::get('/consultations/{id}/pdf', [OrdonnanceController::class, 'generate']);

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController; 
use App\Http\Controllers\PatientController;

// --- Routes Publiques ---
Route::post('/login', [AuthController::class, 'login']);
Route::post('/update-password', [AuthController::class, 'updatePassword']);

// --- Routes Sécurisées (Nécessitent un Token) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // Enregistrement d'un nouveau patient (Adulte ou Enfant)
    Route::post('/patients/enregistrer', [PatientController::class, 'enregistrer']);
    
    // Le HUB : Récupérer mon dossier et ceux de mes enfants
    Route::get('/mes-dossiers', [PatientController::class, 'getMesDossiers']);
    
});
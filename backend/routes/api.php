
<?php
// Validation Accueil
Route::patch('/demande-rdv/{id}/valider', [App\Http\Controllers\DemandeRdvController::class, 'valider']);

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\EnfantController;
use App\Http\Controllers\Api\RdvController;
use App\Http\Controllers\Api\PatientController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Auth / Parents
Route::post('/register', [AuthController::class, 'register']);

// Enfants
Route::post('/enfants', [EnfantController::class, 'store']);


// Demandes de RDV
Route::post('/demande-rdv', [App\Http\Controllers\DemandeRdvController::class, 'store']);

// Patients List
Route::get('/patients', [PatientController::class, 'index']);

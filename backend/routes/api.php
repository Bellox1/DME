<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
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

// RDVs (Direct Creation)
Route::post('/rdvs', [RdvController::class, 'store']); // Maybe protect with middleware later

// Patients List
Route::get('/patients', [PatientController::class, 'index']);

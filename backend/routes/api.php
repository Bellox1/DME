<?php

use Illuminate\Support\Facades\Route;

require __DIR__ . '/auth.php';
require __DIR__ . '/patient.php';
require __DIR__ . '/medecin.php';
require __DIR__ . '/accueil.php';
require __DIR__ . '/admin.php';

Route::middleware('auth:sanctum')->get('/profile', [\App\Http\Controllers\Api\ProfileController::class, 'show']);
Route::middleware('auth:sanctum')->put('/profile', [\App\Http\Controllers\Api\ProfileController::class, 'update']);

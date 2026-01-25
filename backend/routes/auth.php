<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/update-password', [AuthController::class, 'updatePassword']);
Route::post('/check-activation', [AuthController::class, 'checkActivation']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->get('/user', function (\Illuminate\Http\Request $request) {
    return $request->user();
});

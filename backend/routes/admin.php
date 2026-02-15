<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\StatsController;
use App\Http\Controllers\Api\Medecin\ProfileController;

// Admin Profile routes
Route::middleware('auth:sanctum')->get('/admin/profile', function (\Illuminate\Http\Request $request) {
    return response()->json($request->user());
});
Route::middleware('auth:sanctum')->post('/admin/profile/update', [ProfileController::class, 'update']);
Route::middleware('auth:sanctum')->post('/admin/profile/photo', [ProfileController::class, 'updatePhoto']);

Route::middleware('auth:sanctum')->post('/admin/users', [UserController::class, 'store']);
Route::middleware('auth:sanctum')->get('/admin/users', [UserController::class, 'index']);
Route::middleware('auth:sanctum')->put('/admin/users/{id}', [UserController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/admin/users/{id}', [UserController::class, 'destroy']);
Route::middleware('auth:sanctum')->get('/admin/stats', [StatsController::class, 'index']);
Route::middleware('auth:sanctum')->get('/admin/logs', [\App\Http\Controllers\Api\Admin\LogController::class, 'index']);

// Permissions management
Route::middleware('auth:sanctum')->get('/admin/permissions', [\App\Http\Controllers\Api\Admin\PermissionController::class, 'index']);
Route::middleware('auth:sanctum')->post('/admin/permissions', [\App\Http\Controllers\Api\Admin\PermissionController::class, 'update']);


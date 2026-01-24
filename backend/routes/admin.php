<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\Admin\UserController;

Route::middleware('auth:sanctum')->post('/admin/users', [UserController::class, 'store']);

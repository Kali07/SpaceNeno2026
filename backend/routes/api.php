<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ApprovalController;
use App\Http\Controllers\Api\AuthController;


Route::get('/approvals', [ApprovalController::class, 'index']);
Route::get('/approvals/pending', [ApprovalController::class, 'pending']);
Route::post('/approvals/{id}/approve', [ApprovalController::class, 'approve']);
Route::post('/approvals/{id}/reject', [ApprovalController::class, 'reject']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('users', UserController::class);
});
Route::middleware('auth:sanctum')->group(function () {

    Route::put('/profile', [UserController::class, 'updateProfile']);
    Route::put('/profile/password', [UserController::class, 'updatePassword']);

});
Route::apiResource('users', UserController::class);
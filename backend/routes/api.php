<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ApprovalController;


Route::get('/approvals', [ApprovalController::class, 'index']);
Route::get('/approvals/pending', [ApprovalController::class, 'pending']);
Route::post('/approvals/{id}/approve', [ApprovalController::class, 'approve']);
Route::post('/approvals/{id}/reject', [ApprovalController::class, 'reject']);
Route::apiResource('users', UserController::class);
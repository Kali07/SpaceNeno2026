<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;

Route::get('/test-users', [UserController::class, 'index']);

Route::get('/', function () {
    return view('welcome');
});

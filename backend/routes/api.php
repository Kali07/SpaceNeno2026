<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ApprovalController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContinentController;
use App\Http\Controllers\Api\GenerationController;
use App\Http\Controllers\Api\PaysController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\VilleController;
use App\Http\Controllers\Api\StationController;



// 🔐 AUTH
Route::post('/login', [AuthController::class, 'login']);// route pour la connexion des utilisateurs en envoyant une requête POST au backend avec les informations d'identification de l'utilisateur, et en appelant la méthode login du AuthController pour authentifier l'utilisateur et générer un token d'authentification

Route::middleware('auth:sanctum')->group(function () {// groupe de routes protégées par le middleware d'authentification Sanctum, qui nécessite que l'utilisateur soit authentifié pour accéder à ces routes

    Route::post('/logout', [AuthController::class, 'logout']);// route pour la déconnexion des utilisateurs en envoyant une requête POST au backend, et en appelant la méthode logout du AuthController pour supprimer tous les tokens d'authentification associés à l'utilisateur actuellement connecté et le déconnecter

    // USERS
    Route::apiResource('users', UserController::class);// routes pour les opérations CRUD sur les utilisateurs en utilisant un contrôleur de ressources API, qui génère automatiquement les routes pour les méthodes index, store, show, update et destroy du UserController pour gérer les utilisateurs

    // PROFILE
    Route::middleware('auth:sanctum')->group(function () {// groupe de routes protégées par le middleware d'authentification Sanctum, qui nécessite que l'utilisateur soit authentifié pour accéder à ces routes
        Route::put('/profile', [UserController::class, 'updateProfile']);// route pour mettre à jour les informations du profil de l'utilisateur connecté en envoyant une requête PUT au backend, et en appelant la méthode updateProfile du UserController pour mettre à jour les informations du profil de l'utilisateur connecté
        Route::put('/profile/password', [UserController::class, 'updatePassword']);// route pour mettre à jour le mot de passe de l'utilisateur connecté en envoyant une requête PUT au backend, et en appelant la méthode updatePassword du UserController pour mettre à jour le mot de passe de l'utilisateur connecté
    });

    // APPROVALS
   // Route::middleware('auth:sanctum')->get('/approvals', [UserController::class, 'approvals']);// route pour voir les demandes d'approbation de l'utilisateur connecté en envoyant une requête GET au backend, et en appelant la méthode approvals du UserController pour récupérer les demandes d'approbation faites par l'utilisateur connecté avec les relations de demandeur et d'approbateur
    Route::get('/approvals', [ApprovalController::class, 'index']);// route pour voir toutes les demandes d'approbation en envoyant une requête GET au backend, et en appelant la méthode index du ApprovalController pour récupérer toutes les demandes d'approbation avec les relations de demandeur et d'approbateur
    Route::get('/approvals/pending', [ApprovalController::class, 'pending']);// route pour voir uniquement les demandes d'approbation en attente en envoyant une requête GET au backend, et en appelant la méthode pending du ApprovalController pour récupérer uniquement les demandes d'approbation avec le statut "pending" et la relation de demandeur
    Route::post('/approvals/{id}/approve', [ApprovalController::class, 'approve']);//route pour approuver une demande d'approbation en envoyant une requête POST au backend avec l'ID de la demande d'approbation dans l'URL, et en appelant la méthode approve du ApprovalController pour approuver la demande d'approbation en vérifiant la hiérarchie des rôles, en exécutant l'action associée à la demande d'approbation, et en mettant à jour le statut de la demande d'approbation
    Route::post('/approvals/{id}/reject', [ApprovalController::class, 'reject']);// route pour refuser une demande d'approbation en envoyant une requête POST au backend avec l'ID de la demande d'approbation dans l'URL, et en appelant la méthode reject du ApprovalController pour refuser la demande d'approbation en vérifiant la hiérarchie des rôles et en mettant à jour le statut de la demande d'approbation

    // CONTINENTS

Route::get('/continents', [ContinentController::class, 'index']);
Route::post('/continents', [ContinentController::class, 'store']);
Route::put('/continents/{id}', [ContinentController::class, 'update']);
Route::delete('/continents/{id}', [ContinentController::class, 'destroy']);


// PAYS

Route::get('/pays', [PaysController::class, 'index']);
Route::post('/pays', [PaysController::class, 'store']);
Route::put('/pays/{id}', [PaysController::class, 'update']);
Route::delete('/pays/{id}', [PaysController::class, 'destroy']);

// VILLES


Route::get('/villes', [VilleController::class, 'index']);
Route::post('/villes', [VilleController::class, 'store']);
Route::put('/villes/{id}', [VilleController::class, 'update']);
Route::delete('/villes/{id}', [VilleController::class, 'destroy']);

// STATIONS

Route::get('/stations', [StationController::class, 'index']);
Route::post('/stations', [StationController::class, 'store']);
Route::put('/stations/{id}', [StationController::class, 'update']);
Route::delete('/stations/{id}', [StationController::class, 'destroy']);

//ROLES

Route::get('/roles', [RoleController::class, 'index']);
Route::post('/roles', [RoleController::class, 'store']);
Route::put('/roles/{id}', [RoleController::class, 'update']);
Route::delete('/roles/{id}', [RoleController::class, 'destroy']);

//GENERATIONS

Route::get('/generations', [GenerationController::class, 'index']);
Route::post('/generations', [GenerationController::class, 'store']);
Route::put('/generations/{id}', [GenerationController::class, 'update']);
Route::delete('/generations/{id}', [GenerationController::class, 'destroy']);


    });

?>
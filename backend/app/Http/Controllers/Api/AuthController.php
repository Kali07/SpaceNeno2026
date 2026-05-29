<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)// function login pour authentifier un utilisateur et générer un token d'authentification
    {
        $user = User::where('email', $request->email)->first();// recupere l'utilisateur correspondant à l'email fourni dans la requête

        if (!$user || !Hash::check($request->password, $user->password)) {// vérifie si l'utilisateur existe et si le mot de passe fourni correspond au mot de passe de l'utilisateur
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;// genere un token d'authentification pour l'utilisateur

        return response()->json([// retourne une réponse JSON contenant les détails de l'utilisateur et le token d'authentification
                 'user' => $user->load('role'),
                 'token' => $token,
                 'change_password' => $user->ChangePassword()
        ]);
    }

    public function logout(Request $request)// function logout pour déconnecter un utilisateur en supprimant tous les tokens d'authentification associés à l'utilisateur
    {
        $request->user()->tokens()->delete();// supprime tous les tokens d'authentification associés à l'utilisateur actuellement connecté

        return response()->json(['message' => 'Logged out']);// retourne une réponse JSON indiquant que l'utilisateur a été déconnecté
    }
}
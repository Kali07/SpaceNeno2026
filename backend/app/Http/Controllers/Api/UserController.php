<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Approval;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Role;

class UserController extends Controller
{
    // 🔹 READ
    public function index()// function index pour récupérer tous les utilisateurs avec leur rôle associé
    {
        return User::with('role')->get();// retourne tous les utilisateurs avec leur rôle associé
    }

        public function store(Request $request)// function store pour créer un nouvel utilisateur 
    {
      $currentUser = Auth::user();// récupère l'utilisateur actuellement connecté

         $request->validate([// validation des données d'entrée pour la création d'un utilisateur
            'name' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|min:6',
            'role_id' => 'required|exists:roles,id'
        ]);

        //  Vérifier le rôle demandé
        $targetRole = Role::findOrFail($request->role_id);// récupère le rôle demandé pour le nouvel utilisateur

            if ($targetRole->level >= $currentUser->role->level) {// vérifie si le rôle demandé est égal ou supérieur au rôle de l'utilisateur actuel
              return response()->json([
            'error' => 'Création interdite pour ce niveau'
             ], 403);
        }

         $requiredLevel = 2;

         if ($currentUser->role->level >= $requiredLevel) {// vérifie si l'utilisateur actuel a un rôle égal ou supérieur au niveau requis pour créer un utilisateur

             // 🔸 Approval
             if ($currentUser->role->level == $requiredLevel) {// vérifie si l'utilisateur actuel a un rôle égal au niveau requis pour créer un utilisateur
                 //  crée une demande au lieu de créer direct
              Approval::create([// crée une nouvelle demande d'approbation pour la création d'un utilisateur
                    'requested_by' => $currentUser->id,
                     'action' => 'create_user',
                    'data' => json_encode($request->all()),
                    'status' => 'pending'
                 ]);

                 return response()->json([// retourne un message indiquant que la demande d'approbation a été soumise
                    'message' => 'Request submitted for approval'
                 ]);
            }

             // 🔸 Création directe
             $user = User::create([// crée directement le nouvel utilisateur sans approbation
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'role_id' => $request->role_id,
                'station_id' => $request->station_id,
            ]);

            return response()->json($user);// retourne les données du nouvel utilisateur créé
        }

        return response()->json(['error' => 'Unauthorized'], 403);// retourne une réponse d'erreur si l'utilisateur actuel n'a pas le niveau requis pour créer un utilisateur
    }

    // 🔹 UPDATE
    public function update(Request $request, $id)// function update pour mettre à jour les informations d'un utilisateur existant
    {
        $currentUser = Auth::user();// récupère l'utilisateur actuellement connecté
        $user = User::with('role')->findOrFail($id);// récupère l'utilisateur à mettre à jour avec son rôle associé
        
        if (!$currentUser->canManageUser($user)) {// vérifie si l'utilisateur actuel a le droit de gérer l'utilisateur ciblé (basé sur la hiérarchie des rôles)
            return response()->json([
                'error' => 'Modification interdite'
            ], 403);
        }

        $user->update([// met à jour les informations de l'utilisateur ciblé avec les données fournies dans la requête
            'name' => $request->name,
            'email' => $request->email,
            'station_id' => $request->station_id,
          ]);

        return response()->json($user);
    }

    // 🔹 DELETE
    public function destroy($id)// function destroy pour supprimer un utilisateur existant
    {
        $currentUser = Auth::user(); 
        $user = User::with('role')->findOrFail($id); 

            //  sécurité
            if (!$currentUser->canManageUser($user)) {// vérifie si l'utilisateur actuel a le droit de gérer l'utilisateur ciblé (basé sur la hiérarchie des rôles)
                return response()->json([
                    'error' => 'Suppression interdite'
                ], 403);
            }

        $user->delete();

        return response()->json([// retourne un message indiquant que l'utilisateur a été supprimé
        'message' => 'Deleted'
        ]);
    }

    public function approve($id)// function approve pour approuver une demande d'approbation (par exemple, la création d'un utilisateur)
    {
        $approval = Approval::findOrFail($id);
        $currentUser = Auth::user();

        //  Vérifie hiérarchie
        if ($currentUser->role->level <= $approval->requester->role->level) {// vérifie si l'utilisateur actuel a un rôle supérieur à celui de la personne qui a fait la demande d'approbation
        return response()->json(['error' => 'Unauthorized'], 403);// retourne une réponse d'erreur si l'utilisateur actuel n'a pas le droit d'approuver la demande d'approbation
        }

        $data = json_decode($approval->data, true);// décode les données de la demande d'approbation pour obtenir les informations nécessaires à l'action à approuver (par exemple, les données du nouvel utilisateur à créer)

        if ($approval->action === 'create_user') {
        User::create([// crée le nouvel utilisateur en utilisant les données de la demande d'approbation
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
                'role_id' => $data['role_id'],
                'station_id' => $data['station_id'],
            ]);
        }

        $approval->update([// met à jour le statut de la demande d'approbation pour indiquer qu'elle a été approuvée et enregistre l'identifiant de l'utilisateur qui a approuvé la demande
            'status' => 'approved',
            'approved_by' => $currentUser->id
        ]);

        return response()->json(['message' => 'Approved']);// retourne un message indiquant que la demande d'approbation a été approuvée
    }

    public function updateProfile(Request $request)// function updateProfile pour permettre à un utilisateur de mettre à jour son propre profil
    {
        $user = Auth::user();
    
        if (!$user) {// vérifie si l'utilisateur est authentifié
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    
        $data = $request->only(['name', 'email']);
    
        $user->update($data);// met à jour les informations de l'utilisateur avec les données fournies dans la requête (seulement le nom et l'email dans ce cas)
    
        return response()->json($user);
    }


  

public function updatePassword(Request $request)// function updatePassword pour permettre à un utilisateur de mettre à jour son mot de passe
{
    $user = Auth::user();

    if (!$user) {
        return response()->json(['error' => 'Unauthenticated'], 401);// vérifie si l'utilisateur est authentifié
    }

    if (!Hash::check($request->current_password, $user->password)) {// vérifie si le mot de passe actuel fourni correspond au mot de passe de l'utilisateur
        return response()->json(['error' => 'Mot de passe actuel incorrect'], 400);
    }

    $user->update([// met à jour le mot de passe de l'utilisateur avec le nouveau mot de passe fourni dans la requête
        'password' => bcrypt($request->new_password)// bcrypt est utilisé pour hacher le nouveau mot de passe avant de le stocker dans la base de données
    ]);

    return response()->json(['message' => 'Mot de passe mis à jour']);
}

public function show($id)// function show pour récupérer les détails d'un utilisateur spécifique
{
    $currentUser = Auth::user();
    $user = User::with('role')->findOrFail($id);// récupère l'utilisateur ciblé avec son rôle associé

    //  blocage accès
    if ($user->role->level > $currentUser->role->level) {// vérifie si le rôle de l'utilisateur ciblé est supérieur à celui de l'utilisateur actuel, ce qui signifie que l'utilisateur actuel n'a pas le droit de voir les détails de l'utilisateur ciblé
        return response()->json([// retourne une réponse d'erreur indiquant que l'accès est interdit
            'error' => 'Accès interdit'
        ], 403);
    }

    return response()->json($user);// retourne les détails de l'utilisateur ciblé si l'utilisateur actuel a le droit d'y accéder
}

}



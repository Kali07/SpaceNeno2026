<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Approval;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Role;

const LEVEL_BYPASS = 6;
const LEVEL_APPROVAL = 2;

class UserController extends Controller
{

   
    // 🔹 READ
    public function index()// function index pour récupérer tous les utilisateurs avec leur rôle associé
    {

          //return User::with('role')->get();
        return User::with('role', 'station', 'generation')->get();// retourne tous les utilisateurs avec leur rôle associé
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

                  
         if ($currentUser->role->level >=  LEVEL_APPROVAL) {// vérifie si l'utilisateur actuel a un rôle égal ou supérieur au niveau requis pour créer un utilisateur

             // 🔸 Approval
             if ($currentUser->role->level >=  LEVEL_APPROVAL && $currentUser->role->level <  LEVEL_BYPASS) {// vérifie si l'utilisateur actuel a un rôle égal au niveau requis pour créer un utilisateur
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

            if($currentUser->role->level === LEVEL_BYPASS) {// vérifie si l'utilisateur actuel a un rôle égal au niveau de contournement, ce qui signifie que l'utilisateur actuel a le droit de créer un utilisateur directement sans approbation
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

        // 🔸 Approval
        if ($currentUser->role->level >=  LEVEL_APPROVAL && $currentUser->role->level < LEVEL_BYPASS) {// vérifie si l'utilisateur actuel a un rôle égal au niveau requis pour créer un utilisateur
            //  crée une demande au lieu de créer direct

            $data = $request->all();
            $data['id'] = $id;
         Approval::create([// crée une nouvelle demande d'approbation pour la création d'un utilisateur
               'requested_by' => $currentUser->id,
                'action' => 'update_user',
                'data' => json_encode(array_merge(
                    $request->all(),
                    ['id' => $id] 
                )),
               'status' => 'pending'
            ]);

            return response()->json([// retourne un message indiquant que la demande d'approbation a été soumise
               'message' => 'Request submitted for approval'
            ]);
       }

        $user->update([// met à jour les informations de l'utilisateur ciblé avec les données fournies dans la requête
            'name' => $request->name,
            'email' => $request->email,
            'station_id' => $request->station_id,
          ]);

        return response()->json($user);
    }

    // 🔹 DELETE
    public function destroy(Request $request, $id)// function destroy pour supprimer un utilisateur existant
    {
        $currentUser = Auth::user(); 
        $user = User::with('role')->findOrFail($id); 

            //  sécurité
            if (!$currentUser->canManageUser($user)) {// vérifie si l'utilisateur actuel a le droit de gérer l'utilisateur ciblé (basé sur la hiérarchie des rôles)
                return response()->json([
                    'error' => 'Suppression interdite'
                ], 403);
            }

            if ($currentUser->role->level >=  LEVEL_APPROVAL && $currentUser->role->level <  LEVEL_BYPASS) {// vérifie si l'utilisateur actuel a un rôle égal au niveau requis pour supprimer un utilisateur
            //  crée une demande au lieu de supprimer direct

            $data = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ];
         Approval::create([// crée une nouvelle demande d'approbation pour la suppression d'un utilisateur
               'requested_by' => $currentUser->id,
                'action' => 'delete_user',
                'data' => json_encode($data),
               'status' => 'pending'
            ]);

            return response()->json([// retourne un message indiquant que la demande d'approbation a été soumise
               'message' => 'Request submitted for approval'
            ]);
       }

        $user->delete();

        return response()->json([// retourne un message indiquant que l'utilisateur a été supprimé
        'message' => 'Deleted'
        ]);
    }

    public function approve($id)// function approve pour approuver une demande d'approbation spécifique
    {
        $approval = Approval::with('requester')->findOrFail($id);// récupère la demande d'approbation ciblée avec son demandeur associé
        $currentUser = Auth::user();

        // Vérifie si déjà traité
        if ($approval->status !== 'pending') {
            return response()->json([
                'error' => 'Demande déjà traitée'
            ], 400);
        }

        // Vérifie hiérarchie demandeur
        if ($currentUser->role->level <= $approval->requester->role->level) {// vérifie si le rôle de l'utilisateur actuel est inférieur ou égal à celui du demandeur de la demande d'approbation, ce qui signifie que l'utilisateur actuel n'a pas le droit d'approuver la demande d'approbation
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $data = json_decode($approval->data, true);// décode les données de la demande d'approbation qui sont stockées au format JSON dans la base de données, et les convertit en un tableau associatif PHP pour pouvoir les utiliser dans le processus d'approbation

        // Vérifie le rôle cible
        $targetRole = Role::findOrFail($data['role_id']);// recupère le role cible de la demande d'approbation à partir des données décodées

        if ($targetRole->level >= $currentUser->role->level) {// vérifie si le rôle cible de la demande d'approbation est égal ou supérieur au rôle de l'utilisateur actuel, ce qui signifie que l'utilisateur actuel n'a pas le droit d'approuver la demande d'approbation
            return response()->json([
                'error' => 'Vous ne pouvez pas approuver cette création'
            ], 403);
        }

        // Action
        if ($approval->action === 'create_user') {// vérifie si l'action de la demande d'approbation est "create_user", ce qui signifie que la demande d'approbation concerne la création d'un nouvel utilisateur
            User::create([// crée le nouvel utilisateur avec les données fournies dans la demande d'approbation
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
                'role_id' => $data['role_id'],
                'station_id' => $data['station_id'],
            ]);
        } else if($approval->action === 'delete_user'){

            $user = User::findOrFail($data['id']);// récupère l'utilisateur ciblé pour la suppression à partir des données fournies dans la demande d'approbation

            if ($user->role->level >= $currentUser->role->level) {// vérifie si le rôle de l'utilisateur ciblé pour la suppression est égal ou supérieur au rôle de l'utilisateur actuel, ce qui signifie que l'utilisateur actuel n'a pas le droit de supprimer cet utilisateur
                return response()->json([
                    'error' => 'Vous ne pouvez pas supprimer cet utilisateur'
                ], 403);
            }

            $user->delete();// supprime l'utilisateur ciblé
        } else if($approval->action === 'update_user'){

            $user = User::findOrFail($data['id']);// récupère l'utilisateur ciblé pour la mise à jour à partir des données fournies dans la demande d'approbation

            if ($user->role->level >= $currentUser->role->level) {// vérifie si le rôle de l'utilisateur ciblé pour la mise à jour est égal ou supérieur au rôle de l'utilisateur actuel, ce qui signifie que l'utilisateur actuel n'a pas le droit de mettre à jour cet utilisateur
                return response()->json([
                    'error' => 'Vous ne pouvez pas modifier cet utilisateur'
                ], 403);
            }

            $user->update([// met à jour les informations de l'utilisateur ciblé avec les données fournies dans la demande d'approbation
                'name' => $data['name'],
                'email' => $data['email'],
                'role_id' => $data['role_id'],
              ]);
         }

        // Update approval
        $approval->update([
            'status' => 'approved',
            'approved_by' => $currentUser->id
        ]);

        return response()->json(['message' => 'Approved']);
    }



    public function reject($id)// function reject pour refuser une demande d'approbation spécifique
    {
        $approval = Approval::with('requester')->findOrFail($id);// récupère la demande d'approbation ciblée avec son demandeur associé
        $currentUser = Auth::user();

        // Vérifie si déjà traité
        if ($approval->status !== 'pending') {// vérifie si la demande d'approbation a déjà été traitée (c'est-à-dire que son statut n'est pas "pending"), ce qui signifie que la demande d'approbation ne peut pas être refusée car elle a déjà été approuvée ou rejetée
            return response()->json([
                'error' => 'Demande déjà traitée'
            ], 400);
        }

        // Vérifie hiérarchie demandeur
        if ($currentUser->role->level <= $approval->requester->role->level) {// vérifie si le rôle de l'utilisateur actuel est inférieur ou égal à celui du demandeur de la demande d'approbation, ce qui signifie que l'utilisateur actuel n'a pas le droit de refuser la demande d'approbation
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $data = json_decode($approval->data, true);

        // Vérifie le rôle cible
        $targetRole = Role::findOrFail($data['role_id']);// récupère le rôle cible de la demande d'approbation

        if ($targetRole->level >= $currentUser->role->level) {// vérifie si le rôle cible de la demande d'approbation est égal ou supérieur au rôle de l'utilisateur actuel, ce qui signifie que l'utilisateur actuel n'a pas le droit de refuser la demande d'approbation
            return response()->json([
                'error' => 'Vous ne pouvez pas refuser cette création'
            ], 403);
        }

        // Action
             // Update approval
        $approval->update([// met à jour le statut de la demande d'approbation à "rejected" et enregistre l'ID de l'utilisateur qui a refusé la demande d'approbation
            'status' => 'rejected',
            'approved_by' => $currentUser->id
        ]);

        return response()->json(['message' => 'Rejected']);
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



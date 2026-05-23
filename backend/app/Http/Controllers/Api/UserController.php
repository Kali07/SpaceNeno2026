<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Approval;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Role;
use Illuminate\Validation\Rule;

const LEVEL_BYPASS = 6;
const LEVEL_APPROVAL = 2;

class UserController extends Controller
{

    // 🔹 READ
    public function index()// function index pour récupérer tous les utilisateurs avec leur rôle associé
    {

        //return User::with('role')->get();

        return User::with(
            'role',
            'station',
            'generation',
            'statut'
        )->access()->get();// retourne tous les utilisateurs avec leur rôle associé
    }

    //CREATE
    public function store(Request $request)// function store pour créer un nouvel utilisateur
    {

        $currentUser = Auth::user();// récupère l'utilisateur actuellement connecté

        $request->validate([// validation des données d'entrée pour la création d'un utilisateur

            'name' => 'required|string|max:255',

            'email' => 'required|email|unique:users,email',

            'password' => 'required|min:6',

            'sexe' => 'nullable|in:Masculin,Feminin',

            'phone' => 'nullable|string',

            'role_id' => 'required|exists:roles,id',

            'station_id' => 'required|exists:stations,id',

            'statut_id' => 'nullable|exists:statuts,id',

            'generation_id' => 'required|exists:generations,id'
        ]);

        //  Vérifier le rôle demandé
        $targetRole = Role::findOrFail($request->role_id);// récupère le rôle demandé pour le nouvel utilisateur

        if ($targetRole->level >= $currentUser->role->level) {// vérifie si le rôle demandé est égal ou supérieur au rôle de l'utilisateur actuel

            return response()->json([
                'error' => 'Création interdite pour ce niveau'
            ], 403);
        }

        if ($currentUser->role->level >= LEVEL_APPROVAL) {// vérifie si l'utilisateur actuel a un rôle égal ou supérieur au niveau requis pour créer un utilisateur

            // 🔸 Approval
            if (
                $currentUser->role->level >= LEVEL_APPROVAL &&
                $currentUser->role->level < LEVEL_BYPASS
            ) {// vérifie si l'utilisateur actuel a un rôle égal au niveau requis pour créer un utilisateur

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

            if ($currentUser->role->level === LEVEL_BYPASS) {// vérifie si l'utilisateur actuel a un rôle égal au niveau de contournement

                // 🔸 Création directe
                $user = User::create([// crée directement le nouvel utilisateur sans approbation

                    'name' => $request->name,

                    'email' => $request->email,

                    'sexe' => $request->sexe,

                    'phone' => $request->phone,

                    'password' => bcrypt($request->password),

                    'role_id' => $request->role_id,

                    'station_id' => $request->station_id,

                    'statut_id' => $request->statut_id,

                    'generation_id' => $request->generation_id,
                ]);

                return response()->json($user);// retourne les données du nouvel utilisateur créé
            }
        }

        return response()->json([

            'error' => 'Unauthorized'

        ], 403);// retourne une réponse d'erreur si l'utilisateur actuel n'a pas le niveau requis pour créer un utilisateur
    }

    // 🔹 UPDATE
    public function update(Request $request, $id)// function update pour mettre à jour les informations d'un utilisateur existant
    {

        $currentUser = Auth::user();// récupère l'utilisateur actuellement connecté

        $user = User::with('role')->findOrFail($id);// récupère l'utilisateur à mettre à jour avec son rôle associé

        if (!$currentUser->canManageUser($user)) {// vérifie si l'utilisateur actuel a le droit de gérer l'utilisateur ciblé

            return response()->json([
                'error' => 'Modification interdite'
            ], 403);
        }

        $request->validate([

            'name' => 'required|string|max:255',

            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($id),
            ],

            'sexe' => 'nullable|in:Masculin,Feminin',

            'phone' => 'nullable|string',

            'role_id' => 'required|exists:roles,id',

            'station_id' => 'required|exists:stations,id',

            'statut_id' => 'nullable|exists:statuts,id',

            'generation_id' => 'required|exists:generations,id'
        ]);

        // 🔸 Approval
        if (
            $currentUser->role->level >= LEVEL_APPROVAL &&
            $currentUser->role->level < LEVEL_BYPASS
        ) {// vérifie si l'utilisateur actuel a un rôle égal au niveau requis pour modifier un utilisateur

            //  crée une demande au lieu de modifier direct

            $data = $request->all();

            $data['id'] = $id;

            Approval::create([// crée une nouvelle demande d'approbation pour la modification d'un utilisateur

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

            'sexe' => $request->sexe,

            'phone' => $request->phone,

            'role_id' => $request->role_id,

            'station_id' => $request->station_id,

            'statut_id' => $request->statut_id,

            'generation_id' => $request->generation_id,
        ]);

        return response()->json($user);
    }

    // 🔹 DELETE
    public function destroy(Request $request, $id)// function destroy pour supprimer un utilisateur existant
    {

        $currentUser = Auth::user();

        $user = User::with('role')->findOrFail($id);

        //  sécurité
        if (!$currentUser->canManageUser($user)) {// vérifie si l'utilisateur actuel a le droit de gérer l'utilisateur ciblé

            return response()->json([
                'error' => 'Suppression interdite'
            ], 403);
        }

        if (
            $currentUser->role->level >= LEVEL_APPROVAL &&
            $currentUser->role->level < LEVEL_BYPASS
        ) {// vérifie si l'utilisateur actuel a un rôle égal au niveau requis pour supprimer un utilisateur

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
        if ($currentUser->role->level <= $approval->requester->role->level) {

            return response()->json([
                'error' => 'Unauthorized'
            ], 403);
        }

        $data = json_decode($approval->data, true);// décode les données JSON

        // Vérifie le rôle cible
        if (isset($data['role_id'])) {

            $targetRole = Role::findOrFail($data['role_id']);

            if ($targetRole->level >= $currentUser->role->level) {

                return response()->json([
                    'error' => 'Vous ne pouvez pas approuver cette création'
                ], 403);
            }
        }

        // Action
        if ($approval->action === 'create_user') {// création utilisateur

            User::create([

                'name' => $data['name'],

                'email' => $data['email'],

                'sexe' => $data['sexe'] ?? null,

                'phone' => $data['phone'] ?? null,

                'password' => bcrypt($data['password']),

                'role_id' => $data['role_id'],

                'station_id' => $data['station_id'],

                'statut_id' => $data['statut_id'] ?? null,

                'generation_id' => $data['generation_id'],
            ]);

        } else if ($approval->action === 'delete_user') {

            $user = User::findOrFail($data['id']);

            if ($user->role->level >= $currentUser->role->level) {

                return response()->json([
                    'error' => 'Vous ne pouvez pas supprimer cet utilisateur'
                ], 403);
            }

            $user->delete();

        } else if ($approval->action === 'update_user') {

            $user = User::findOrFail($data['id']);

            if ($user->role->level >= $currentUser->role->level) {

                return response()->json([
                    'error' => 'Vous ne pouvez pas modifier cet utilisateur'
                ], 403);
            }

            $user->update([

                'name' => $data['name'],

                'email' => $data['email'],

                'sexe' => $data['sexe'] ?? null,

                'phone' => $data['phone'] ?? null,

                'role_id' => $data['role_id'],

                'station_id' => $data['station_id'],

                'statut_id' => $data['statut_id'] ?? null,

                'generation_id' => $data['generation_id'],
            ]);
        }

        // Update approval
        $approval->update([

            'status' => 'approved',

            'approved_by' => $currentUser->id
        ]);

        return response()->json([
            'message' => 'Approved'
        ]);
    }

    public function reject($id)// function reject pour refuser une demande d'approbation spécifique
    {

        $approval = Approval::with('requester')->findOrFail($id);

        $currentUser = Auth::user();

        // Vérifie si déjà traité
        if ($approval->status !== 'pending') {

            return response()->json([
                'error' => 'Demande déjà traitée'
            ], 400);
        }

        // Vérifie hiérarchie demandeur
        if ($currentUser->role->level <= $approval->requester->role->level) {

            return response()->json([
                'error' => 'Unauthorized'
            ], 403);
        }

        $data = json_decode($approval->data, true);

        // Vérifie le rôle cible
        if (isset($data['role_id'])) {

            $targetRole = Role::findOrFail($data['role_id']);

            if ($targetRole->level >= $currentUser->role->level) {

                return response()->json([
                    'error' => 'Vous ne pouvez pas refuser cette création'
                ], 403);
            }
        }

        // Update approval
        $approval->update([// met à jour le statut de la demande d'approbation

            'status' => 'rejected',

            'approved_by' => $currentUser->id
        ]);

        return response()->json([
            'message' => 'Rejected'
        ]);
    }

    public function updateProfile(Request $request)// function updateProfile pour permettre à un utilisateur de mettre à jour son propre profil
    {

        $user = Auth::user();

        if (!$user) {// vérifie si l'utilisateur est authentifié

            return response()->json([
                'error' => 'Unauthenticated'
            ], 401);
        }

        $request->validate([

            'name' => 'required|string|max:255',

            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($user->id),
            ],

            'sexe' => 'nullable|in:Masculin,Feminin',

            'phone' => 'nullable|string',
        ]);

        $data = $request->only([
            'name',
            'email',
            'sexe',
            'phone'
        ]);

        $user->update($data);// met à jour les informations de l'utilisateur

        return response()->json($user);
    }

    public function updatePassword(Request $request)// function updatePassword pour permettre à un utilisateur de mettre à jour son mot de passe
    {

        $user = Auth::user();

        if (!$user) {

            return response()->json([
                'error' => 'Unauthenticated'
            ], 401);
        }

        if (!Hash::check($request->current_password, $user->password)) {

            return response()->json([
                'error' => 'Mot de passe actuel incorrect'
            ], 400);
        }

        $request->validate([

            'current_password' => 'required',

            'new_password' => 'required|min:6|confirmed'
        ]);

        $user->update([// met à jour le mot de passe

            'password' => bcrypt($request->new_password)
        ]);

        return response()->json([
            'message' => 'Mot de passe mis à jour'
        ]);
    }

    public function show($id)// function show pour récupérer les détails d'un utilisateur spécifique
    {

        $currentUser = Auth::user();

        $user = User::with(
            'role',
            'station',
            'generation',
            'statut'
        )->findOrFail($id);

        //  blocage accès
        if ($user->role->level > $currentUser->role->level) {

            return response()->json([
                'error' => 'Accès interdit'
            ], 403);
        }

        return response()->json($user);// retourne les détails de l'utilisateur ciblé
    }
}
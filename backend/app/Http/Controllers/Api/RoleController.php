<?php

namespace App\Http\Controllers\Api;

use App\Models\Role;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

const LEVEL_BYPASS = 6;

class RoleController extends Controller
{
    // 🔹 LISTE
    public function index()
    {
        return response()->json(Role::all());
    }

    // 🔹 CREATE
    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'label' => 'required|string|unique:roles,label',
            'level' => 'required|integer'
            
        ]);


        $role = Role::where('label', $request->label)->first();// vérifie si un rôle avec le même label existe déjà dans la bdd

        if ($role) {// vérifie si un rôle avec le même label existe déjà
            return response()->json([
                'error' => 'Ce rôle existe déjà'
            ], 400);
        }

        if ($user->role->level >= LEVEL_BYPASS) {// vérifie si l'utilisateur actuel a le niveau requis pour créer un rôle

        $role = Role::create([
            'label' => $request->label,
            'level' => $request->level
        ]);

        return response()->json($role);
        } else {
            return response()->json([
                
                'error' => 'Probleme de permission pour créer ce rôle'

            ], 403);// retourne une réponse d'erreur si l'utilisateur actuel n'a pas le niveau requis pour créer un rôle
        }
    }

    // 🔹 UPDATE
    public function update(Request $request, $id)
    {
        $user = Auth::user();

        $request->validate([
            'label' => 'required|string',
            'level' => 'required|int'
        ]);

        $role = Role::findOrFail($id);

        if ($user->role->level >= LEVEL_BYPASS) {// vérifie si l'utilisateur actuel a le niveau requis pour modifier un rôle
        $role->update([
            'label' => $request->label,
            'level' => $request->level
        ]);

        return response()->json($role);
        } else {
            return response()->json([
                
                'error' => 'Probleme de permission pour modifier ce rôle'

            ], 403);// retourne une réponse d'erreur si l'utilisateur actuel n'a pas le niveau requis pour modifier un rôle
        }
    }

    // 🔹 DELETE
    public function destroy($id)
    {
        $user = Auth::user();

        $role = Role::findOrFail($id);
        
        if ($user->role->level >= LEVEL_BYPASS) {// vérifie si l'utilisateur actuel a le niveau requis pour supprimer un rôle
            $role->delete();

            return response()->json(['message' => 'Rôle supprimé']);
        } else {
            return response()->json([
                
                'error' => 'Probleme de permission pour supprimer ce rôle'

            ], 403);// retourne une réponse d'erreur si l'utilisateur actuel n'a pas le niveau requis pour supprimer un rôle
        }
    }
}

?>
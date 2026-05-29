<?php

namespace App\Http\Controllers\Api;

use App\Models\Pays;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

const LEVEL_CREATE = 3;

class PaysController extends Controller
{
    // 🔹 LISTE
    public function index()
    {
        return response()->json(
            Pays::with('continent')->access()->get()
        );
    }

    // 🔹 CREATE
    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string',
            'continent_id' => 'required|exists:continents,id'
        ]);

        if ($request->name && $request->continent_id) { // vérifie si un pays avec le même nom existe déjà dans ce continent

        $alreadyExist = Pays::where(
            'name',
            $request->name
        )
        ->where(
            'continent_id',
            $request->continent_id
        )
        ->exists();
    
        if ($alreadyExist) {
    
            return response()->json([
                'error' => 'Ce pays existe déjà dans ce continent'
            ], 400);
        }
    }

        if ($user->role->level >= LEVEL_CREATE) {// vérifie si l'utilisateur actuel a le niveau requis pour créer un pays
        $pays = Pays::create([
            'name' => $request->name,
            'continent_id' => $request->continent_id
        ]);

        return response()->json($pays);
        } else {
            return response()->json([
                
                'error' => 'Probleme de permission pour créer ce pays'

            ], 403);// retourne une réponse d'erreur si l'utilisateur actuel n'a pas le niveau requis pour créer un pays
        }
    }

    // 🔹 UPDATE
    public function update(Request $request, $id)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string',
            'continent_id' => 'required|exists:continents,id'
        ]);

        $pays = Pays::findOrFail($id);

        if ($request->name && $request->continent_id) { // vérifie si un pays avec le même nom existe déjà dans ce continent

         $alreadyExist = Pays::where('name',$request->name )
          ->where('continent_id', $request->continent_id)
            ->where( 'id', '!=', $pays->id )->exists();

            if ($alreadyExist) {

             return response()->json([
            'error' => 'Ce pays existe déjà dans ce continent'
             ], 400);
             }
        }

        if ($user->role->level >= LEVEL_CREATE) {// vérifie si l'utilisateur actuel a le niveau requis pour modifier un pays
        $pays->update([
            'name' => $request->name,
            'continent_id' => $request->continent_id
        ]);

        return response()->json($pays);
        } else {
            return response()->json([
                
                'error' => 'Probleme de permission pour modifier ce pays'

            ], 403);// retourne une réponse d'erreur si l'utilisateur actuel n'a pas le niveau requis pour modifier un pays
        }
    }

    // 🔹 DELETE
    public function destroy($id)
    {
        $user = Auth::user();

        $pays = Pays::findOrFail($id);

        if ($user->role->level >= LEVEL_CREATE) {// vérifie si l'utilisateur actuel a le niveau requis pour supprimer un pays
            $pays->delete();

            return response()->json(['message' => 'Pays supprimé']);
        } else {
            return response()->json([
                
                'error' => 'Probleme de permission pour supprimer ce pays'

            ], 403);// retourne une réponse d'erreur si l'utilisateur actuel n'a pas le niveau requis pour supprimer un pays
        }   
    }
}

?>
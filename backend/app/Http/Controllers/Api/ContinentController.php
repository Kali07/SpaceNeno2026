<?php 

namespace App\Http\Controllers\Api;

use App\Models\Continent;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

const LEVEL_CREATE = 3;

class ContinentController extends Controller
{
    // 🔹 LISTE
    public function index()
    {
        return response()->json(Continent::all());
    }

    // 🔹 CREATE
    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|unique:continents,name'
        ]);

        if ($request->name) {// vérifie si un continent avec le même nom existe déjà

        $continent = Continent::findOrFail($request->name);

                 return response()->json([
                    'error' => 'Ce continent existe déjà'
             ], 400);
        }


        if ($user->role->level >= LEVEL_CREATE) {// vérifie si l'utilisateur actuel a le niveau requis pour créer un continent

        $continent = Continent::create([
            'name' => $request->name
        ]);

        return response()->json($continent);
        } else {
            return response()->json([
                
                'error' => 'Probleme de permission pour créer ce continent'

            ], 403);// retourne une réponse d'erreur si l'utilisateur actuel n'a pas le niveau requis pour créer un continent
        }
    }

    // 🔹 UPDATE
    public function update(Request $request, $id)
    {
        $user = Auth::user();

        $continent = Continent::findOrFail($id);

        if ($user->role->level >= LEVEL_CREATE) {// vérifie si l'utilisateur actuel a le niveau requis pour modifier un continent

        $request->validate([
            'name' => 'required|string|unique:continents,name,' . $id
        ]);

        $continent->update([
            'name' => $request->name
        ]);

        return response()->json($continent);
        } else {
            return response()->json([
                
                'error' => 'Probleme de permission pour modifier ce continent'

            ], 403);// retourne une réponse d'erreur si l'utilisateur actuel n'a pas le niveau requis pour modifier un continent
        }
    }

    // 🔹 DELETE
    public function destroy($id)
    {
        $user = Auth::user();

        $continent = Continent::findOrFail($id);

        if ($user->role->level >= LEVEL_CREATE) {// vérifie si l'utilisateur actuel a le niveau requis pour supprimer un continent
         
        $continent->delete();

        return response()->json(['message' => 'Continent supprimé']);

        } else {
            return response()->json([
                
                'error' => 'Probleme de permission pour supprimer ce continent'

            ], 403);// retourne une réponse d'erreur si l'utilisateur actuel n'a pas le niveau requis pour supprimer un continent
        }
    }
}

?>
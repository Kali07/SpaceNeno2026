<?php

namespace App\Http\Controllers\Api;

use App\Models\Ville;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

const LEVEL_CREATE = 3;

class VilleController extends Controller
{
    // 🔹 LISTE
    public function index()
    {
        return response()->json(
            Ville::with('pays')->access()->get()
        );
    }

    // 🔹 CREATE
    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string',
            'pays_id' => 'required|exists:pays,id'
        ]);

        if ($request->name && $request->pays_id) { // vérifie si la ville existe déjà dans le pays

        $alreadyExist = Ville::where('name', $request->name)
            ->where('pays_id', $request->pays_id)
            ->exists();
    
        if ($alreadyExist) {
    
            return response()->json([
                'error' => 'Cette ville existe déjà dans ce pays'
            ], 400);
        }
    }


        if ($user->role->level >= LEVEL_CREATE) {// vérifie si l'utilisateur actuel a le niveau requis pour créer une ville
         
        $ville = Ville::create([
            'name' => $request->name,
            'pays_id' => $request->pays_id
        ]);

        return response()->json($ville);
        } else {
            return response()->json([
                
                'error' => 'Probleme de permission pour créer cette ville'

            ], 403);// retourne une réponse d'erreur si l'utilisateur actuel n'a pas le niveau requis pour créer une ville
        }

    }
    // 🔹 UPDATE
    public function update(Request $request, $id)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string',
            'pays_id' => 'required|exists:pays,id'
        ]);

        $ville = Ville::findOrFail($id);

        if ($request->name && $request->pays_id) { // vérifie si la ville existe déjà dans le pays

             $alreadyExist = Ville::where('name', $request->name)
                ->where('pays_id', $request->pays_id)
                ->where('id', '!=', $ville->id) // Exclure la ville actuelle de la vérification
                 ->exists();
    
            if ($alreadyExist) {
    
                 return response()->json([
                'error' => 'Cette ville existe déjà dans ce pays'
                ], 400);
            }
        }

        if ($user->role->level >= LEVEL_CREATE) {// vérifie si l'utilisateur actuel a le niveau requis pour modifier une ville

        
        $ville->update([
            'name' => $request->name,
            'pays_id' => $request->pays_id
        ]);

        return response()->json($ville);
     }else {
            return response()->json([
                
                'error' => 'Probleme de permission pour modifier cette ville'

            ], 403);// retourne une réponse d'erreur si l'utilisateur actuel n'a pas le niveau requis pour modifier une ville
        }
    }

    // 🔹 DELETE
    public function destroy($id)
    {
        $user = Auth::user();

        if ($user->role->level >= LEVEL_CREATE) {// vérifie si l'utilisateur actuel a le niveau requis pour supprimer une ville
     
                 $ville = Ville::findOrFail($id);
                    $ville->delete();

                return response()->json(['message' => 'Ville supprimée']);
         } else {
                return response()->json([
                    
                    'error' => 'Probleme de permission pour supprimer cette ville'
    
                ], 403);// retourne une réponse d'erreur si l'utilisateur actuel n'a pas le niveau requis pour supprimer une ville
            }

    }

}

?>
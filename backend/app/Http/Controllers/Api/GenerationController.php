<?php

namespace App\Http\Controllers\Api;

use App\Models\Generation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

const LEVEL_CREATE = 3;

class GenerationController extends Controller
{
    // 🔹 LISTE
    public function index()
    {
        return response()->json(Generation::all());
    }

    // 🔹 CREATE
    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'label' => 'required|string|unique:generations,label',
            
        ]);

        
        $generation = Generation::where('label', $request->label)->first();// vérifie si une génération avec le même label existe déjà dans la bdd

        if ($generation) {// vérifie si une génération avec le même label existe déjà
            return response()->json([
                'error' => 'Cette génération existe déjà'
            ], 400);
        }

        if ($user->role->level >= LEVEL_CREATE) {// vérifie si l'utilisateur actuel a le niveau requis pour créer une génération

        $generation = Generation::create([
            'label' => $request->label,
            
        ]);

        return response()->json($generation);
        } else {
            return response()->json([
                
                'error' => 'Probleme de permission pour créer cette génération'

            ], 403);// retourne une réponse d'erreur si l'utilisateur actuel n'a pas le niveau requis pour créer une génération
        }
    }

    // 🔹 UPDATE
    public function update(Request $request, $id)
    {
        $user = Auth::user();

        $request->validate([
            'label' => 'required|string',
           
        ]);

        $generation = Generation::findOrFail($id);

        if ($user->role->level >= LEVEL_CREATE) {// vérifie si l'utilisateur actuel a le niveau requis pour modifier une génération
        $generation->update([
            'label' => $request->label,
           
        ]);

        return response()->json($generation);
        } else {
            return response()->json([
                
                'error' => 'Probleme de permission pour modifier cette génération'

            ], 403);// retourne une réponse d'erreur si l'utilisateur actuel n'a pas le niveau requis pour modifier une génération
        }
    }

    // 🔹 DELETE
    public function destroy($id)
    {
        $user = Auth::user();

        $generation = Generation::findOrFail($id);

        if ($user->role->level >= LEVEL_CREATE) {// vérifie si l'utilisateur actuel a le niveau requis pour supprimer une génération
        $generation->delete();

        return response()->json(['message' => 'Génération supprimée']);
    } else {
                return response()->json([
                    
                    'error' => 'Probleme de permission pour supprimer cette génération'
    
                ], 403);// retourne une réponse d'erreur si l'utilisateur actuel n'a pas le niveau requis pour supprimer une génération
            }
        }
}

?>
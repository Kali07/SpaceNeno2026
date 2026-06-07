<?php

namespace App\Http\Controllers\Api;

use App\Models\Station;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

const LEVEL_CREATE = 3; // Niveau de rôle requis pour créer les stations

class StationController extends Controller
{

    // 🔹 LISTE
    public function index()// function index pour récupérer toutes les stations avec leur ville et responsable associé
    {

        $user = Auth::user();// récupère l'utilisateur actuellement connecté

        return response()->json(

            Station::with(
                'ville',
                'responsable'
            )
            ->withCount('users')
            ->access()
            ->paginate(5)

        );// retourne toutes les stations accessibles selon la hiérarchie d'accès
    }

    // 🔹 SHOW
    public function show($id)// function show pour récupérer les détails d'une station spécifique
    {

        $station = Station::with(
            'ville',
            'responsable',
            'users'
        )
        ->withCount('users')
        ->findOrFail($id);

        return response()->json($station);// retourne les détails de la station
    }

    // 🔹 CREATE
    public function store(Request $request)// function store pour créer une nouvelle station
    {

            $user = Auth::user();

        $request->validate([// validation des données d'entrée pour la création d'une station

            'name' => 'required|string|max:255',

            'ville_id' => 'required|exists:villes,id',

            'address' => 'required|string|max:255',

            'responsable_id' => 'required|exists:users,id'
        ]);

        // vérifie si le gestionnaire existe déjà dans une autre station
        if ($request->responsable_id) {

            $responsable = User::findOrFail($request->responsable_id);

            $alreadyAssigned = Station::where(// vérifie si le gestionnaire est déjà assigné à une station
                'responsable_id',
                $responsable->id
            )->exists();

            if ($alreadyAssigned) {

                return response()->json([

                    'error' => 'Ce gestionnaire a déjà une station'

                ], 400);
            }
        }

        // vérifie si une station avec le même nom existe déjà dans la ville
        if ($request->name && $request->ville_id) {
        
            $alreadyExist = Station::where('name', $request->name)
                 ->where('ville_id', $request->ville_id)->exists();
        
            if ($alreadyExist) {
        
                return response()->json([
        
                    'error' => 'Une station avec ce nom existe déjà dans cette ville'
        
                ], 400);
            }
        }

        if ($user->role->level >= LEVEL_CREATE) {// vérifie si l'utilisateur actuel a le niveau requis pour créer une station
        $station = Station::create([// crée une nouvelle station

            'name' => $request->name,

            'ville_id' => $request->ville_id,

            'address' => $request->address,

            'responsable_id' => $request->responsable_id
        ]);

        return response()->json(

            $station->load(
                'ville',
                'responsable'
            )

            );// retourne la station créée avec ses relations
        } else {
            return response()->json([
                
                'error' => 'Probleme de permission pour créer cette station'

            ], 403);// retourne une réponse d'erreur si l'utilisateur actuel n'a pas le niveau requis pour créer une station
        }   
    }

    // 🔹 LISTE DES GESTIONNAIRES
    public function getGestionnaires()// function getGestionnaires pour récupérer tous les gestionnaires
    {

        $gestionnaires = User::whereHas('role', function ($q) {

            $q->where('label', 'gestionnaire');

        })->access()->get();

        return response()->json($gestionnaires);// retourne la liste des gestionnaires
    }

    // 🔹 UPDATE
    public function update(Request $request, $id)// function update pour modifier une station existante
    {
        $user = Auth::user();

        $request->validate([// validation des données d'entrée

            'name' => 'required|string|max:255',

            'ville_id' => 'required|exists:villes,id',

            'address' => 'required|string|max:255',

            'responsable_id' => 'required|exists:users,id'
        ]);

        $station = Station::findOrFail($id);// récupère la station ciblée

        // vérifie si le gestionnaire existe déjà dans une autre station
        if ($request->responsable_id) {

            $responsable = User::findOrFail($request->responsable_id);

            $alreadyAssigned = Station::where(
                'responsable_id',
                $responsable->id
            )
            ->where('id', '!=', $id)
            ->exists();

            if ($alreadyAssigned) {

                return response()->json([

                    'error' => 'Ce gestionnaire a déjà une station'

                ], 400);
            }
        }

        // vérifie si une station avec le même nom existe déjà dans la ville// vérifie si une station avec le même nom existe déjà dans la ville
        if ($request->name && $request->ville_id) {
        
            $alreadyExist = Station::where('name', $request->name)
                ->where('ville_id', $request->ville_id)
                ->where('id','!=',$station->id)
                ->exists();
        
                if ($alreadyExist) {
        
                     return response()->json([
        
                    'error' => 'Une station avec ce nom existe déjà dans cette ville'
        
                    ], 400);
                }
        }

        if ($user->role->level >= LEVEL_CREATE) {// vérifie si l'utilisateur actuel a le niveau requis pour mettre à jour une station
        $station->update([// met à jour la station

            'name' => $request->name,

            'ville_id' => $request->ville_id,

            'address' => $request->address,

            'responsable_id' => $request->responsable_id
        ]);

        return response()->json(

            $station->load(
                'ville',
                'responsable'
            )

        );// retourne la station mise à jour
         } else {
            return response()->json([

                'error' => 'Probleme de permission pour mettre à jour cette station'

            ], 403);
        }
    }

    // 🔹 DELETE
    public function destroy($id)// function destroy pour supprimer une station
    {

         $user = Auth::user();

        $station = Station::findOrFail($id);// récupère la station ciblée

        // vérifie si des utilisateurs sont liés à la station
        $hasUsers = User::where(
            'station_id',
            $station->id
        )->exists();

        if ($hasUsers) {

            return response()->json([

                'error' => 'Impossible de supprimer cette station car elle contient des utilisateurs'

            ], 400);
        }

        if ($user->role->level >= LEVEL_CREATE) {// vérifie si l'utilisateur actuel a le niveau requis pour supprimer une station
        $station->delete();// supprime la station

        return response()->json([

            'message' => 'Station supprimée avec succès'
        ]);
         } else {
            return response()->json([

                'error' => 'Probleme de permission pour supprimer cette station'

            ], 403);
        }
    }
}
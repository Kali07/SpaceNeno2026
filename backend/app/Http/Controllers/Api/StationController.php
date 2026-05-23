<?php

namespace App\Http\Controllers\Api;

use App\Models\Station;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

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
            ->get()

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

        $request->validate([// validation des données d'entrée pour la création d'une station

            'name' => 'required|string|max:255',

            'ville_id' => 'required|exists:villes,id',

            'address' => 'nullable|string|max:255',

            'responsable_id' => 'nullable|exists:users,id'
        ]);

        // vérifie si le gestionnaire existe déjà dans une autre station
        if ($request->responsable_id) {

            $responsable = User::findOrFail($request->responsable_id);

            $alreadyAssigned = Station::where(
                'responsable_id',
                $responsable->id
            )->exists();

            if ($alreadyAssigned) {

                return response()->json([

                    'error' => 'Ce gestionnaire a déjà une station'

                ], 400);
            }
        }

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

        $request->validate([// validation des données d'entrée

            'name' => 'required|string|max:255',

            'ville_id' => 'required|exists:villes,id',

            'address' => 'nullable|string|max:255',

            'responsable_id' => 'nullable|exists:users,id'
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
    }

    // 🔹 DELETE
    public function destroy($id)// function destroy pour supprimer une station
    {

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

        $station->delete();// supprime la station

        return response()->json([

            'message' => 'Deleted'
        ]);
    }
}
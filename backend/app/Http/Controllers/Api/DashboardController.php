<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Station;
use App\Models\Ville;
use App\Models\Pays;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class GenerationController extends Controller
{

public function index()
{
    $user = Auth::user();// récupère l'utilisateur actuellement connecté

    // scope selon ton système (tu l’as déjà fait)
    $users = User::access()->count();
    $stations = Station::access()->count();
    $villes = Ville::access()->count();
    $pays = Pays::access()->count();

    // rôles
    $gestionnaires = User::whereHas('role', fn($q) =>
        $q->where('label', 'gestionnaire')
    )->access()->count();

    $adminsProvincial = User::whereHas('role', fn($q) =>
        $q->where('label', 'admin_provincial')
    )->access()->count();

    $adminsNational = User::whereHas('role', fn($q) =>
        $q->where('label', 'admin_national')
    )->access()->count();

    $adminsTechnique = User::whereHas('role', fn($q) =>
        $q->where('label', 'admin_technique')
    )->count(); // lui voit tout

    return response()->json([
        'users' => $users,
        'stations' => $stations,
        'villes' => $villes,
        'pays' => $pays,
        'gestionnaires' => $gestionnaires,
        'admins_provincial' => $adminsProvincial,
        'admins_national' => $adminsNational,
        'admins_technique' => $adminsTechnique,
    ]);
}

}

?>
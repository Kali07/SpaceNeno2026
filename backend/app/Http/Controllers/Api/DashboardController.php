<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Station;
use App\Models\Ville;
use App\Models\Pays;
use App\Models\Generation;


use App\Http\Controllers\Controller;

class DashboardController extends Controller
{

    public function index()
    {

        // UTILISATEURS
        $users = User::access()->count();

        // ADMINS
        $admins = User::whereHas('role', function ($q) {

            $q->whereIn('label', [
                'admin_provincial',
                'admin_national',
                'admin_technique'
            ]);

        })->access()->count();



        // UTILISATEURS ACTIFS
        // ⚠️ seulement si la colonne status existe
        /*$activeUsers = User::where(
            'status',
            'active'
        )->access()->count();*/

        // GENERATIONS
        $generations = Generation::access()->count();

        // STATIONS
        $stations = Station::access()->count();

        return response()->json([

            'users' => $users,

            'admins' => $admins,

          
          /*  'active_users' =>
                $activeUsers,*/

            'generations' =>
                $generations,

            'stations' =>
                $stations,

        ]);

    }

}

?>
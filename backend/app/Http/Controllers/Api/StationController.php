<?php

namespace App\Http\Controllers\Api;

use App\Models\Station;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class StationController extends Controller
{
    // 🔹 LISTE
    public function index()
    {
        /*return response()->json(
            Station::with('ville')->get()
        );*/

        $user = Auth::user();

        return response()->json(Station::with('ville')->access()->get()
        );
    }

    // 🔹 CREATE
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'ville_id' => 'required|exists:villes,id'
        ]);

        $station = Station::create([
            'name' => $request->name,
            'ville_id' => $request->ville_id
        ]);

        return response()->json($station);
    }

    // 🔹 UPDATE
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'ville_id' => 'required|exists:villes,id'
        ]);

        $station = Station::findOrFail($id);
        $station->update([
            'name' => $request->name,
            'ville_id' => $request->ville_id
        ]);

        return response()->json($station);
    }

    // 🔹 DELETE
    public function destroy($id)
    {
        $station = Station::findOrFail($id);
        $station->delete();

        return response()->json(['message' => 'Deleted']);
    }
}

?>
<?php

namespace App\Http\Controllers\Api;

use App\Models\Pays;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

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
        $request->validate([
            'name' => 'required|string',
            'continent_id' => 'required|exists:continents,id'
        ]);

        $pays = Pays::create([
            'name' => $request->name,
            'continent_id' => $request->continent_id
        ]);

        return response()->json($pays);
    }

    // 🔹 UPDATE
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'continent_id' => 'required|exists:continents,id'
        ]);

        $pays = Pays::findOrFail($id);
        $pays->update([
            'name' => $request->name,
            'continent_id' => $request->continent_id
        ]);

        return response()->json($pays);
    }

    // 🔹 DELETE
    public function destroy($id)
    {
        $pays = Pays::findOrFail($id);
        $pays->delete();

        return response()->json(['message' => 'Deleted']);
    }
}

?>
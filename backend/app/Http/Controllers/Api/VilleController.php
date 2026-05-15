<?php

namespace App\Http\Controllers\Api;

use App\Models\Ville;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

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
        $request->validate([
            'name' => 'required|string',
            'pays_id' => 'required|exists:pays,id'
        ]);

        $ville = Ville::create([
            'name' => $request->name,
            'pays_id' => $request->pays_id
        ]);

        return response()->json($ville);
    }

    // 🔹 UPDATE
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'pays_id' => 'required|exists:pays,id'
        ]);

        $ville = Ville::findOrFail($id);
        $ville->update([
            'name' => $request->name,
            'pays_id' => $request->pays_id
        ]);

        return response()->json($ville);
    }

    // 🔹 DELETE
    public function destroy($id)
    {
        $ville = Ville::findOrFail($id);
        $ville->delete();

        return response()->json(['message' => 'Deleted']);
    }
}

?>
<?php

namespace App\Http\Controllers\Api;

use App\Models\Generation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

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
        $request->validate([
            'label' => 'required|string',
            
        ]);

        $generation = Generation::create([
            'label' => $request->label,
            
        ]);

        return response()->json($generation);
    }

    // 🔹 UPDATE
    public function update(Request $request, $id)
    {
        $request->validate([
            'label' => 'required|string',
           
        ]);

        $generation = Generation::findOrFail($id);
        $generation->update([
            'label' => $request->label,
           
        ]);

        return response()->json($generation);
    }

    // 🔹 DELETE
    public function destroy($id)
    {
        $generation = Generation::findOrFail($id);
        $generation->delete();

        return response()->json(['message' => 'Deleted']);
    }
}

?>
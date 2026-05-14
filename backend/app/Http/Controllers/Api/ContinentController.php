<?php 

namespace App\Http\Controllers\Api;

use App\Models\Continent;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ContinentController extends Controller
{
    // 🔹 LISTE
    public function index()
    {
        return response()->json(Continent::all());
    }

    // 🔹 CREATE
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:continents,name'
        ]);

        $continent = Continent::create([
            'name' => $request->name
        ]);

        return response()->json($continent);
    }

    // 🔹 UPDATE
    public function update(Request $request, $id)
    {
        $continent = Continent::findOrFail($id);

        $request->validate([
            'name' => 'required|string|unique:continents,name,' . $id
        ]);

        $continent->update([
            'name' => $request->name
        ]);

        return response()->json($continent);
    }

    // 🔹 DELETE
    public function destroy($id)
    {
        $continent = Continent::findOrFail($id);
        $continent->delete();

        return response()->json(['message' => 'Deleted']);
    }
}

?>
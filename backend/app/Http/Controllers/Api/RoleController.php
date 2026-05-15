<?php

namespace App\Http\Controllers\Api;

use App\Models\Role;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class RoleController extends Controller
{
    // 🔹 LISTE
    public function index()
    {
        return response()->json(Role::all());
    }

    // 🔹 CREATE
    public function store(Request $request)
    {
        $request->validate([
            'label' => 'required|string',
            'level'=> 'required|int'
            
        ]);

        $role = Role::create([
            'label' => $request->label,
            'level' => $request->level
        ]);

        return response()->json($role);
    }

    // 🔹 UPDATE
    public function update(Request $request, $id)
    {
        $request->validate([
            'label' => 'required|string',
            'level' => 'required|int'
        ]);

        $role = Role::findOrFail($id);
        $role->update([
            'label' => $request->name,
            'level' => $request->level
        ]);

        return response()->json($role);
    }

    // 🔹 DELETE
    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return response()->json(['message' => 'Deleted']);
    }
}

?>
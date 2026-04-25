<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Approval;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // 🔹 READ
    public function index()
    {
        return User::with(['role', 'station'])->get();
    }

    public function store(Request $request)
    {
        //$currentUser = Auth::user();
        $currentUser = \App\Models\User::where('role_id', 6)->first();

        $request->validate([
        'name' => 'required|string',
        'email' => 'required|email', 
        'password' => 'required|min:6',
    ]);
    
        // 🔹 niveau requis pour créer un user
        $requiredLevel = 2;
    
        //  CAS 1 : autorisé direct
        if ($currentUser->role->level >= $requiredLevel) {
    
            // MAIS on vérifie si validation nécessaire
            if ($currentUser->role->level == $requiredLevel) {
    
                //  crée une demande au lieu de créer direct
                Approval::create([
                    'requested_by' => $currentUser->id,
                    'action' => 'create_user',
                    'data' => json_encode($request->all()),
                    'status' => 'pending'
                ]);
    
                return response()->json([
                    'message' => 'Request submitted for approval'
                ]);
            }
    
            //  niveau supérieur → création directe
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'role_id' => $request->role_id,
                'station_id' => $request->station_id,
            ]);
    
            return response()->json($user);
        }
    
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    // 🔹 UPDATE
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role_id' => $request->role_id,
            'station_id' => $request->station_id,
        ]);

        return response()->json($user);
    }

    // 🔹 DELETE
    public function destroy($id)
    {
        User::findOrFail($id)->delete();

        return response()->json(['message' => 'Deleted']);
    }

    public function approve($id)
    {
        $approval = Approval::findOrFail($id);
        $currentUser = Auth::user();

        // 🔥 Vérifie hiérarchie
        if ($currentUser->role->level <= $approval->requester->role->level) {
        return response()->json(['error' => 'Unauthorized'], 403);
        }

        $data = json_decode($approval->data, true);

        if ($approval->action === 'create_user') {
        User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
                'role_id' => $data['role_id'],
                'station_id' => $data['station_id'],
            ]);
        }

        $approval->update([
            'status' => 'approved',
            'approved_by' => $currentUser->id
        ]);

        return response()->json(['message' => 'Approved']);
    }

}

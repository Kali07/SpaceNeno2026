<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Approval;
use Illuminate\Support\Facades\Auth;

class ApprovalController extends Controller
{
    // 🔹 voir toutes les demandes
    public function index()
    {
        return Approval::with(['requester', 'approver'])->get();
    }

    // 🔹 voir uniquement les pending
    public function pending()
    {
        return Approval::where('status', 'pending')
            ->with('requester')
            ->get();
    }

    // 🔹 approuver
    public function approve($id)
    {
        $approval = Approval::findOrFail($id);
        $currentUser = Auth::user();

        //  sécurité hiérarchie
        if ($currentUser->role->level <= $approval->requester->role->level) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $data = json_decode($approval->data, true);

        //  exécution de l'action
        if ($approval->action === 'create_user') {
            \App\Models\User::create([
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

    // 🔹 refuser
    public function reject($id)
    {
        $approval = Approval::findOrFail($id);

        $approval->update([
            'status' => 'rejected'
        ]);

        return response()->json(['message' => 'Rejected']);
    }
}

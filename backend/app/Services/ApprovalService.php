<?php 

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Validator;

class ApprovalService
{
    public function handle($approval)
    {
        $data = json_decode($approval->data, true);

        if (!$data) {
            throw new \Exception('Invalid JSON data');
        }

        match ($approval->action) {
            'create_user' => $this->createUser($data),
            'delete_user' => $this->deleteUser($data),
            'update_user' => $this->updateUser($data),
            default => throw new \Exception('Unknown action'),
        };
    }

    private function createUser($data)
    {
        // Validation
        $validator = Validator::make($data, [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role_id' => 'required|exists:roles,id',
            'station_id' => 'nullable|exists:stations,id',

            // nouveaux champs
            'sexe' => 'required|in:Masculin,Feminin',
            'phone' => 'nullable|string',
            'statut_id' => 'nullable|exists:statuts,id',
            'generation_id' => 'required|exists:generations,id',
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first());
        }

        //création user
        User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'role_id' => $data['role_id'],
            'station_id' => $data['station_id'] ?? null,

            // nouveaux champs
            'sexe' => $data['sexe'],
            'phone' => $data['phone'] ?? null,
            'statut_id' => $data['statut_id'] ?? null,
            'generation_id' => $data['generation_id'],
        ]);
    }

    private function deleteUser($data)
    {
        $validator = Validator::make($data, [
            'id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first());
        }

        User::findOrFail($data['id'])->delete();
    }

    private function updateUser($data)
    {
        $validator = Validator::make($data, [
            'id' => 'required|exists:users,id',
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $data['id'],
            'role_id' => 'sometimes|required|exists:roles,id',

            // nouveaux champs
            'sexe' => 'sometimes|required|in:Masculin,Feminin',
            'phone' => 'sometimes|nullable|string',
            'station_id' => 'sometimes|nullable|exists:stations,id',
            'statut_id' => 'sometimes|nullable|exists:statuts,id',
            'generation_id' => 'sometimes|required|exists:generations,id',
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first());
        }

        $user = User::findOrFail($data['id']);

        $user->update([
            'name' => $data['name'] ?? $user->name,
            'email' => $data['email'] ?? $user->email,
            'role_id' => $data['role_id'] ?? $user->role_id,

            // nouveaux champs
            'sexe' => $data['sexe'] ?? $user->sexe,
            'phone' => $data['phone'] ?? $user->phone,
            'station_id' => $data['station_id'] ?? $user->station_id,
            'statut_id' => $data['statut_id'] ?? $user->statut_id,
            'generation_id' => $data['generation_id'] ?? $user->generation_id,
        ]);
    }
}

?>
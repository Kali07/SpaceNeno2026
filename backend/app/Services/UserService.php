<?php

namespace App\Services;

use App\Models\User;

class UserService
{
    public function create(array $data)
    {
        return User::create($data);
    }

    public function update(User $user, array $data)
    {
        $user->update($data);

        return $user->fresh();
    }

    public function delete(User $user)
    {
        return $user->delete();
    }
}
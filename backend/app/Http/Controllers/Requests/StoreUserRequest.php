<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'name' => 'required|string|max:255',

            'email' => 'required|email|unique:users,email',

            'password' => 'required|min:6',

            'sexe' => 'nullable|in:Masculin,Feminin',

            'phone' => 'nullable|string',

            'role_id' => 'required|exists:roles,id',

            'station_id' => 'required|exists:stations,id',

            'generation_id' => 'required|exists:generations,id',
        ];
    }
}
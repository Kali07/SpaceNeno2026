<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [

            'name' => 'required|string|max:255',

            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($id),
            ],

            'sexe' => 'nullable|in:Masculin,Feminin',

            'phone' => 'nullable|string',

            'role_id' => 'required|exists:roles,id',

            'station_id' => 'required|exists:stations,id',

            'statut_id' => 'nullable|exists:statuts,id',

            'generation_id' => 'required|exists:generations,id',
        ];
    }
}
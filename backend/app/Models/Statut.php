<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Statut extends Model
{
    public function users()
    {
        return $this->hasMany(User::class);
    }

    protected $fillable = ['label'];
}

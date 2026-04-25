<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Generation extends Model
{
    public function users()
    {
        return $this->hasMany(User::class);
    }

    protected $fillable = ['label'];
}

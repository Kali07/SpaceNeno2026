<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Generation extends Model
{
    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function scopeAccess($query)
    {
        return $query;
    }

    protected $fillable = ['label'];
}

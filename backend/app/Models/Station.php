<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Station extends Model
{

protected $fillable = ['name', 'ville_id'];

    public function ville()
    {
        return $this->belongsTo(Ville::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}

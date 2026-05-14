<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pays extends Model
{
    protected $fillable = ['name', 'continent_id'];

    public function continent()
    {
        return $this->belongsTo(Continent::class);
    }
}
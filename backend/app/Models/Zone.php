<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Zone extends Model
{
    public function stations()
    {
        return $this->hasMany(Station::class);
    }
}

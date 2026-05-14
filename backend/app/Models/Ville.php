<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ville extends Model
{

protected $fillable = ['name', 'pays_id'];

public function pays()
    {
        return $this->belongsTo(Pays::class);
    }
  
}

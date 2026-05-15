<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Ville extends Model
{

protected $fillable = ['name', 'pays_id'];

public function pays()
    {
        return $this->belongsTo(Pays::class);
    }
  



    public function scopeAccess($query)
{
    $user = Auth::user();
    $role = $user->role->label;

    if ($role === 'admin_technique') {
        return $query;
    }

    if ($role === 'admin_fonctionnel') {
        return $query->whereHas('pays.continent', function ($q) use ($user) {
            $q->where('id', $user->station->ville->pays->continent_id);
        });
    }

    if ($role === 'admin_national') {
        return $query->whereHas('pays', function ($q) use ($user) {
            $q->where('id', $user->station->ville->pays_id);
        });
    }

    if ($role === 'admin_provincial') {
        return $query->where('id', $user->station->ville_id);
    }

    // membre + gestionnaire
    return $query->where('id', $user->station->ville_id);
}
}

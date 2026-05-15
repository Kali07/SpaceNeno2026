<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;


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


    public function scopeAccess($query)
    {
        $user = Auth::user();
    
        $role = $user->role->label;
    
        if ($role === 'admin_technique') {
            return $query;
        }
    
        if ($role === 'admin_fonctionnel') {
            return $query->whereHas('ville.pays.continent', function ($q) use ($user) {
                $q->where('id', $user->station->ville->pays->continent_id);
            });
        }
    
        if ($role === 'admin_national') {
            return $query->whereHas('ville.pays', function ($q) use ($user) {
                $q->where('id', $user->station->ville->pays_id);
            });
        }
    
        if ($role === 'admin_provincial') {
            return $query->whereHas('ville', function ($q) use ($user) {
                $q->where('id', $user->station->ville_id);
            });
        }
    
        // membre + gestionnaire
        return $query->where('id', $user->station_id);
    }
}



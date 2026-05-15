<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Pays extends Model
{
    protected $fillable = ['name', 'continent_id'];

    public function continent()
    {
        return $this->belongsTo(Continent::class);
    }

    public function scopeAccess($query)
    {
        $user = Auth::user();
    
        $role = $user->role->label;
    
        if ($role === 'admin_technique') {
            return $query;
        }
    
        if ($role === 'admin_fonctionnel') {
            return $query->whereHas('continent', function ($q) use ($user) {
                $q->where('id', $user->station->ville->pays->continent_id);
            });
        }
    
        if ($role === 'admin_national') {
           // return $query->whereHas('pays', function ($q) use ($user) {
              return $query->where('id', $user->station->ville->pays_id);
            //});
        }
    
        if ($role === 'admin_provincial') {
           // return $query->whereHas('ville', function ($q) use ($user) {
                return $query-> where('id', $user->station->ville->pays_id);
           // });
        }
    
        // membre + gestionnaire
        return $query->where('id', $user->station->ville->pays_id);
    }

}
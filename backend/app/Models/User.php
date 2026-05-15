<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Auth;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens;
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'station_id',
        
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function role()// relation entre User et Role, un utilisateur appartient à un rôle
    {
        return $this->belongsTo(Role::class);// retourne le rôle associé à l'utilisateur
    }
    
    public function station()// relation entre User et Station, un utilisateur appartient à une station
    {
        return $this->belongsTo(Station::class);// retourne la station associée à l'utilisateur
    }

    public function statut()// relation entre User et Statut, un utilisateur appartient à un statut
    {
        return $this->belongsTo(Statut::class);// retourne le statut associé à l'utilisateur
    }

    public function generation()//  relation entre User et Generation, un utilisateur appartient à une génération
    {
        return $this->belongsTo(Generation::class);// retourne la génération associée à l'utilisateur
    }

    public function approvalsRequested()// relation entre User et Approval, un utilisateur peut faire plusieurs demandes d'approbation
    {
        return $this->hasMany(Approval::class, 'requested_by');// retourne les demandes d'approbation faites par l'utilisateur
    }

    public function approvalsApproved()// relation entre User et Approval, un utilisateur peut approuver plusieurs demandes d'approbation
    {
        return $this->hasMany(Approval::class, 'approved_by');// retourne les demandes d'approbation approuvées par l'utilisateur
    }

    public function canManageUser($targetUser) // fonction pour vérifier si l'utilisateur actuel a le droit de gérer un autre utilisateur basé sur la hiérarchie des rôles 
    {
        return $this->role && $targetUser->role  ? $this->role->level > $targetUser->role->level : false;// retourne true si l'utilisateur actuel a un rôle supérieur à celui de l'utilisateur ciblé, sinon retourne false
    }

    public function scopeAccess($query)
{
    $user = Auth::user();
    $role = $user->role->label;

    if ($role === 'admin_technique') {
        return $query;
    }

    if ($role === 'admin_fonctionnel') {
        return $query->whereHas('station.ville.pays.continent', function ($q) use ($user) {
            $q->where('id', $user->station->ville->pays->continent_id);
        });
    }

    if ($role === 'admin_national') {
        return $query->whereHas('station.ville.pays', function ($q) use ($user) {
            $q->where('id', $user->station->ville->pays_id);
        });
    }

    if ($role === 'admin_provincial') {
        return $query->whereHas('station.ville', function ($q) use ($user) {
            $q->where('id', $user->station->ville_id);
        });
    }

    // membre + gestionnaire
    return $query->where('station_id', $user->station_id);
}

}

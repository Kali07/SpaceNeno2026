<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Approval extends Model
{

    protected $fillable = [
        'requested_by',
        'action',
        'data',
        'status',
        'approved_by'
    ];
    public function requester()
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}

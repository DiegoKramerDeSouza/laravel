<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserDado extends Model
{
    protected $fillable = [
        'id', 'user_id', 'school_id', 'perfils_id', 'group'
    ];

    public function user(){

        return $this->belongsTo()('App\User');
    }

    public function perfil(){

        return $this->belongsTo()('App\Perfil');
    }
}

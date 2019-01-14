<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Perfil extends Model
{
    protected $fillable = [
        'id', 'name', 'description',
    ];

    public function userDado(){

        return $this->hasMany('App\UserDado');
    }

    public function perfils_has_componente(){

        return $this->hasMany('App\Perfils_has_componente');
    }
}

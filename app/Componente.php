<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Componente extends Model
{
    protected $fillable = [
        'id', 'name', 'cadastrado', 'model', 'icon'
    ];

    public function perfils_has_componente(){

        return $this->hasMany('App\Perfils_has_componente');
    }

    public function userDado(){

        return $this->hasMany('App\UserDado');
    }
}

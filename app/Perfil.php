<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Perfil extends Model
{
    protected $fillable = [
        'id', 'name', 'grant', 'description',
    ];

    public function userDado(){

        return $this->hasMany('App\UserDado');
    }
}

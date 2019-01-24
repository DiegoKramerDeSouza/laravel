<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Escola extends Model
{   
    protected $fillable = [
        'id', 'name', 'register',
    ];

    public function turma(){

        return $this->hasMany('App\Turma');
    }

    public function enderecoEscola(){

        return $this->hasOne('App\EnderecoEscola');
    }
}

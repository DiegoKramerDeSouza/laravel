<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Modulo extends Model
{
    protected $fillable = [
        'id', 'name', 'description'
    ];

    public function curso(){

        return $this->hasMany('App\Curso');
    }
}

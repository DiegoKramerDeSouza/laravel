<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Curso extends Model
{
    protected $fillable = [
        'id', 'name', 'modulo_id',
    ];

    public function aulas_has_curso(){

        return $this->hasMany('App\Aulas_has_curso');
    }

    public function modulo(){

        return $this->belongsTo('App\Modulo');
    }
}

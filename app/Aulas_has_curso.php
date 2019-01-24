<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Aulas_has_curso extends Model
{
    protected $fillable = [
        'aula_id', 'curso_id'
    ];

    public function aula(){

        return $this->belongsTo('App\Aula');
    }

    public function curso(){

        return $this->belongsTo('App\Curso');
    }
}

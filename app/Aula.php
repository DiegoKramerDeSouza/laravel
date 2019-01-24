<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Aula extends Model
{
    protected $fillable = [
        'id', 'hash', 'name', 'theme', 'author', 'estudio_id'
    ];

    public function aulas_has_curso(){

        return $this->hasMany('App\Aulas_has_curso');
    }

    public function turmas_has_aula(){

        return $this->hasMany('App\Turma_has_aula');
    }
}

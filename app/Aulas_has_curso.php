<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Aulas_has_curso extends Model
{
    protected $fillable = [
        'aula_id', 'curso_id'
    ];
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Turmas_has_aula extends Model
{
    protected $fillable = [
        'turma_id', 'aula_id'
    ];
}
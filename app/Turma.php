<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Turma extends Model
{
    protected $fillable = [
        'id', 'name', 'school_name', 'login', 'password', 'school_id', 'curso_id', 'description',
    ];

}

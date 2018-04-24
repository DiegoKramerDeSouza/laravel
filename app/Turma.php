<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Turma extends Model
{
    protected $fillable = [
        'id', 'name', 'school_id', 'school_name', 'description',
    ];
}

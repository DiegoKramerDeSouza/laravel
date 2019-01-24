<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Aula extends Model
{
    protected $fillable = [
        'id', 'hash', 'name', 'theme', 'author', 'estudio_id'
    ];
}

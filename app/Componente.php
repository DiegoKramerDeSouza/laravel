<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Componente extends Model
{
    protected $fillable = [
        'id', 'name', 'cadastrado', 'model'
    ];
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
//Cria classe Escola como um Model (Extends)
class Escola extends Model
{   
    protected $fillable = [
        'id', 'name'
    ];
}

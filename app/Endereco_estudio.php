<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Endereco_estudio extends Model
{
    protected $fillable = [
        'id', 'postal', 'address', 'city', 'number', 'complement', 'st', 'estudio_id'
    ];
}

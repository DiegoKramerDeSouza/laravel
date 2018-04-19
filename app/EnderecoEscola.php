<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EnderecoEscola extends Model
{
    protected $fillable = [
        'id', 'school_id', 'postal', 'address', 'complement', 'st', 'coordinates'
    ];
}

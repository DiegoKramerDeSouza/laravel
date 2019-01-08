<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EnderecoEscola extends Model
{
    protected $fillable = [
        'id', 'school_id', 'postal', 'address', 'city', 'number', 'complement', 'st', 'coordinates'
    ];

    public function escola(){

        return $this->belongsTo('App\Escola');
    }
}

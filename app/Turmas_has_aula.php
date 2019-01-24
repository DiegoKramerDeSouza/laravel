<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Turmas_has_aula extends Model
{
    protected $fillable = [
        'user_id', 'aula_id', 'qtd'
    ];

    public function user(){

        return $this->belongsTo('App\User');
    }

    public function aula(){

        return $this->belongsTo('App\Aula');
    }
}

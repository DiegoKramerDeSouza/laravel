<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Perfils_has_componente extends Model
{
    protected $fillable = [
        'perfils_id', 'componentes_id', 
    ];

    public function perfil(){

        return $this->belongsTo('App\Perfil');
    }

    public function componente(){

        return $this->belongsTo('App\Componente');
    }
}

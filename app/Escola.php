<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
//Cria classe Escola como um Model (Extends)
class Escola extends Model
{   //Declara a função lista()
    public function lista(){
        return (object)[
            'nome' => 'CE',
            'cod'  => '10'
        ];
    }
}

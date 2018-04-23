<?php

namespace App\Http\Controllers\Site;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Escola;

class RoomController extends Controller
{
    public function index(){
        $salas = [
            (object)["numero"=>1, "status"=>'livre'],
            (object)["numero"=>2, "status"=>'livre'],
            (object)["numero"=>3, "status"=>'ocupada'],
            (object)["numero"=>4, "status"=>'livre'],
            (object)["numero"=>5, "status"=>'ocupada']
        ];
        //Instancia a classe Escola
        $escola = new Escola();
        //Chama a função lista()
        //dd($escola->lista());
        
        return view('salas.index', compact('salas'));
    }
}

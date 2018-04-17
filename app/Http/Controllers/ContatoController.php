<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
//Adiciona Model Escola
use App\Escola;

class ContatoController extends Controller
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
    public function criar(Request $value){
        //dd($value->all());
        return "Criação de ContatoController: " . $value['nome'];
    }
    public function editar(){
        return "Edição de ContatoController.";
    }
}

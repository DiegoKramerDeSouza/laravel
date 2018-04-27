<?php

namespace App\Http\Controllers\Site;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;

use App\Escola;
use App\Turma;
use App\User;
use App\UserDado;
use App\Curso;
use App\Modulo;

class RoomController extends Controller
{
    public function index(){
        //Deve ser encaminhada em compact()
        $streamPage = true;
        $userid = Auth::user()->id;
        $escolas = Escola::all();
        $turmas = Turma::all();
        $allmodulos = Modulo::all()->toArray();
        $modulos = array();
        foreach($allmodulos as $modulo){
            $modulos[$modulo['id']] = $modulo['name'];
        }
        $cursos = Curso::all();
        
        return view('salas.index', compact('escolas', 'turmas', 'modulos', 'cursos', 'streamPage'));
    }

    public function turma(){
        //Deve ser encaminhada em compact()
        $streamPage = true;
        $userid = Auth::user()->id;
        $escolas = Escola::all();
        $turmas = Turma::where('user_id', $userid)->first();
        $allmodulos = Modulo::all()->toArray();
        $modulos = array();
        foreach($allmodulos as $modulo){
            $modulos[$modulo['id']] = $modulo['name'];
        }
        $cursos = Curso::all();
        
        return view('salas.index', compact('escolas', 'turmas', 'modulos', 'cursos', 'streamPage'));
    }
}

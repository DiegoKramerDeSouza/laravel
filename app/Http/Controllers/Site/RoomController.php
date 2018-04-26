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
        $userdado = UserDado::where('user_id', $userid)->first();
        $escolas = Escola::all();
        $turmas = Turma::all();
        $modulos = Modulo::all();
        $cursos = Curso::all();
        
        return view('salas.index', compact('userdado', 'escolas', 'turmas', 'modulos', 'cursos', 'streamPage'));
    }
}

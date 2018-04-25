<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use App\Escola;
use App\Turma;
use App\Modulo;
use App\Curso;

class CadastroController extends Controller
{
    public function index(){
        $users = User::all();
        $turmas = Turma::all();
        $escolas = Escola::all();
        $modulos = Modulo::all();
        $cursos = Curso::all();
        return view('admin.cadastro.index', compact('users', 'escolas', 'turmas', 'modulos', 'cursos'));
    }
    
}

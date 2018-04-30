<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\EspecialMethods;
use Auth;
use App\User;
use App\UserDado;
use App\Escola;
use App\Turma;
use App\Modulo;
use App\Curso;
use App\Perfil;

class CadastroController extends Controller
{
    use EspecialMethods;

    public function index(){
        $userid = Auth::user()->id;
        $cadastro = $this->validadeCadastro($userid);
        if(Auth::user()->type == 0 && $cadastro){
            $users = User::where('type', 0)->get();
            $dados = UserDado::where('user_id', $userid)->first();
            $granted = Perfil::find($dados->group);
            $turmas = Turma::all();
            $escolas = Escola::all();
            $modulos = Modulo::all();
            $cursos = Curso::all();
            $perfis = Perfil::all();
            return view('admin.cadastro.index', compact('users', 'granted', 'escolas', 'turmas', 'modulos', 'cursos', 'perfis'));
        } else {
            return redirect()->route('denied');
        }
    }
    
}

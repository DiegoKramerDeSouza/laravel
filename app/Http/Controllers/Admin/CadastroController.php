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

    /**
     * Valida o acesso à função de cadastro;
     * Encaminha para a View de cadastro caso o acesso seja administrativo;
     */
    public function index(){

        $userid = Auth::user()->id;
        if(Auth::user()->type == 0){
            $cadastro = $this->adminAccess($userid);
        }
        
        if(isset($cadastro)){
            if($cadastro != "0"){
                $users = User::where('type', 0)->get();
                $dados = UserDado::where('user_id', $userid)->first();
                $granted = Perfil::find($dados->group);
                $turmas = Turma::all();
                $escolas = Escola::all();
                $modulos = Modulo::all();
                $cursos = Curso::all();
                $perfis = Perfil::all();
                $countModulos = count(explode(';', $granted));
                $grid = (12/$countModulos);
                if($grid <= 3){
                    $grid = (24/$countModulos);
                }
                return view('admin.cadastro.index', compact('users', 'granted', 'grid', 'escolas', 'turmas', 'modulos', 'cursos', 'perfis'));
            }
        }
        return $this->accessDenied();
    }
    
}

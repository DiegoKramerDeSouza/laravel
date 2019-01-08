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
use App\Perfils_has_componente;
use App\Componente;

class CadastroController extends Controller
{
    use EspecialMethods;

    /**
     * Valida o acesso à função de cadastro;
     * Encaminha para a View de cadastro caso o acesso seja administrativo;
     */
    public function index(){

        $userid = Auth::user()->id;
        $cadastro = 0;
        $granted = [];
        if(Auth::user()->type == 0) $cadastro = $this->adminAccess($userid);
        
        if($cadastro > 0){
            $users = User::where('type', 0)->count();
            $dados = UserDado::where('user_id', $userid)->first();
            $componentes = Perfils_has_componente::where('perfils_id', $dados->perfils_id)->get();
            $grid = (12/$cadastro);
            if($grid <= 3) $grid = (24/$cadastro);
            $grid = (int) $grid;

            foreach($componentes as $module){
                $comp = Componente::find($module->componentes_id);
                $model = 'App\\' . $comp->model;
                $comp->id == 5 ? $count = $model::where('type', 0)->count() : $count = $model::count();
                array_push($granted, ['name'=>$comp->name, 'cadastrado'=>$comp->cadastrado, 'icon'=>$comp->icon, 'count'=>$count]);
            }
            return view('admin.cadastro.index', compact('granted', 'grid'));
        }
        return $this->accessDenied();
    }
    
}

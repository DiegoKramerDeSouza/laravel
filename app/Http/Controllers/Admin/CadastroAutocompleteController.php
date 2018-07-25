<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Curso;
use App\Escola;
use App\Modulo;
use App\Perfil;
use App\Turma;
use App\User;
use App\Componente;

class CadastroAutocompleteController extends Controller
{
    public function autocomplete($module){

        $components = Componente::where('cadastrado', $module)->first();
        $model = 'App\\' . $components->model;
        if($components->model == "User"){
            //$allData = $model::where('type', 0)->get()->toArray();
            $allData = $model::where('type', 0)->get();
        } else {
            //$allData = $model::all()->toArray();
            $allData = $model::all();
        }
        
        foreach($allData as $value){
            //$data = str_replace("\0", "", $value['name']);
            //$result[$value['name']] = null;
            $data = str_replace("\0", "", $value->name);
            $result[$value->name] = null;
        }
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    }

    public function resultAutocomplete($module, $data){

        $isAutocomplete = true;
        if(isset($components)){
            dd($components);
        }
        $components = Componente::where('cadastrado', $module)->first();
        $model = 'App\\' . $components->model;
        $searchResult = $model::where('name', '=', $data)->orderBy('name', 'asc')->paginate(5);

        switch ($module) {
            case 'cursos':
                $cursos = $searchResult;
                $allmodulos = Modulo::all();
                $modulos = array();
                foreach($allmodulos as $modulo){
                    $modulos[$modulo->id] = $modulo->name;
                }
                return view('admin.cadastro.' . $module . '.index', compact($module, 'modulos', 'isAutocomplete'));
                break;

            case 'escolas':
                $escolas = $searchResult;
                return view('admin.cadastro.' . $module . '.index', compact($module, 'isAutocomplete'));
                break;
            case 'modulos':
                $modulos = $searchResult;
                return view('admin.cadastro.' . $module . '.index', compact($module, 'isAutocomplete'));
                break;
            case 'perfis':
                $perfis = $searchResult;
                return view('admin.cadastro.' . $module . '.index', compact($module, 'isAutocomplete'));
                break;
            case 'turmas':
                $turmas = $searchResult;
                $accounts = User::where('type', 1)->get();
                $users = array();
                foreach($accounts as $account){
                    $users[$account->id] = $account->login;
                }
                return view('admin.cadastro.' . $module . '.index', compact($module, 'users', 'isAutocomplete'));
                break;
            case 'usuarios':
                $users = $searchResult;
                return view('admin.cadastro.' . $module . '.index', compact('users', 'isAutocomplete'));
                break;          
        }
        
        
    }
    
}

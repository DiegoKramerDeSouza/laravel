<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\EspecialMethods;
use App\Curso;
use App\Escola;
use App\Modulo;
use App\Perfil;
use App\Turma;
use App\User;
use App\Componente;

class CadastroAutocompleteController extends Controller
{
    use EspecialMethods;
    
    public function __construct()
    {
        $this->pagination = $this->setDefaults()->pagination;
    }
    
    public function autocomplete($module){

        $components = Componente::where('cadastrado', $module)->first();
        if($components == null) return;
        $model = 'App\\' . $components->model;
        $components->model == "User" ?
            $allData = $model::where('type', 0)->get() :
            $allData = $model::all();
        
        // Formação de atributo para o autocomplete do MaterializeCss
        // Formato JSON: {nameX: "photo.png", nameY: null, ...}
        foreach($allData as $value){
            $data = str_replace("\0", "", $value->name);
            $result[$value->name] = null;
        }
        header('Content-Type: application/json; charset=utf-8');
        return json_encode($result, JSON_UNESCAPED_UNICODE);
    }

    public function resultAutocomplete($module, $data){

        $components = Componente::where('cadastrado', $module)->first();
        if($components == null) return;
        $model = 'App\\' . $components->model;
        $searchResult = $model::where('name', '=', $data)->orderBy('name', 'asc')->paginate($this->pagination);
        $resultado = $searchResult;
        $isAutocomplete = true;
        $linkHome = true;

        $users = array();
        $modulos = array();
        if($module == 'cursos' || $module == 'turmas'){
            try{
                $allmodulos = Modulo::all();
                foreach($allmodulos as $modulo) $modulos[$modulo->id] = $modulo->name;
                $accounts = User::where('type', 1)->get();
                foreach($accounts as $account) $users[$account->id] = $account->login;
            }catch(\Exception $e){
                return;
            }
        }
        return view('admin.cadastro.' . $module . '.index', compact('resultado', 'users', 'modulos', 'isAutocomplete', 'linkHome'));
    }
    
}

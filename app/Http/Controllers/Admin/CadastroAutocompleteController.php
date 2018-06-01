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

class CadastroAutocompleteController extends Controller
{
    public function autocomplete($module){
        switch ($module) {
            case 'cursos':
                $allData = Curso::all()->toArray();
                break;
            case 'escolas':
                $allData = Escola::all()->toArray();
                break;
            case 'modulos':
                $allData = Modulo::all()->toArray();
                break;
            case 'perfis':
                $allData = Perfil::all()->toArray();
                break;
            case 'turmas':
                $allData = Turma::all()->toArray();
                break;
            case 'usuarios':
                $allData = User::where('type', 0)->get()->toArray();
                break;          
        }
        $result = array();
        for($i = 0; $i < count($allData); $i++){
            $data = str_replace("\0", "", $allData[$i]['name']);
            $result[$allData[$i]['name']] = null;
        }
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    }
    public function resultAutocomplete($module, $data){
        $resultToString = true;
        switch ($module) {
            case 'cursos':
                $cursos = Curso::where('name', '=', $data)->orderBy('name', 'asc')->paginate(5);
                $allmodulos = Modulo::all()->toArray();
                $modulos = array();
                foreach($allmodulos as $modulo){
                    $modulos[$modulo['id']] = $modulo['name'];
                }
                return view('admin.cadastro.' . $module . '.index', compact('cursos', 'modulos', 'resultToString'));
                break;
            case 'escolas':
                $escolas = Escola::where('name', '=', $data)->orderBy('name', 'asc')->paginate(5);
                return view('admin.cadastro.' . $module . '.index', compact('escolas', 'resultToString'));
                break;
            case 'modulos':
                $modulos = Modulo::where('name', '=', $data)->orderBy('name', 'asc')->paginate(5);
                return view('admin.cadastro.' . $module . '.index', compact('modulos', 'resultToString'));
                break;
            case 'perfis':
                $perfis = Perfil::where('name', '=', $data)->orderBy('name', 'asc')->paginate(5);
                return view('admin.cadastro.' . $module . '.index', compact('perfis', 'resultToString'));
                break;
            case 'turmas':
                $turmas = Turma::where('name', '=', $data)->orderBy('name', 'asc')->paginate(5);
                $accounts = User::where('type', 1)->get()->toArray();
                $users = array();
                foreach($accounts as $account){
                    $users[$account['id']] = $account['login'];
                }
                return view('admin.cadastro.' . $module . '.index', compact('turmas', 'users', 'resultToString'));
                break;
            case 'usuarios':
                $users = User::where('name', '=', $data)->orderBy('name', 'asc')->paginate(5);
                return view('admin.cadastro.' . $module . '.index', compact('users', 'resultToString'));
                break;          
        }
    }
    
}

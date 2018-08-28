<?php

namespace App\Http\Controllers\Site;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;
use Validator;
use App\Escola;
use App\Turma;
use App\User;
use App\UserDado;
use App\Curso;
use App\Modulo;
use App\Aula;

class RoomController extends Controller
{
    public function index(){

        $streamPage = true;
        $userid = Auth::user()->id;
        $escolas = Escola::all();
        if(Auth::user()->type == 1){
            $turmas = Turma::where('user_id', $userid)->first();
        } else {
            $turmas = Turma::all();
        }
        $allmodulos = Modulo::all()->toArray();
        $modulos = array();
        foreach($allmodulos as $modulo){
            $modulos[$modulo['id']] = $modulo['name'];
        }
        $cursos = Curso::all();
        
        return view('salas.index', compact('escolas', 'turmas', 'modulos', 'cursos', 'streamPage'));
    }

    public function save(Request $req){

        $validator = Validator::make($req->all(), [
            'hash' => 'bail|required|unique:aulas|min:4|max:191'
        ]);
        if ($validator->fails()) {
            return redirect()->route('salas')
                        ->withErrors($validator)
                        ->withInput();
        }
        $aulas = [
            '_token'=>$req->_token,
            'hash'=>$req->hash,
            'name'=>$req->name,
            'theme'=>$req->theme,
            'author'=>$req->author,
            'quantity'=>0
        ];
        Aula::create($aulas);
        return \Response::json($aulas);
    }
}

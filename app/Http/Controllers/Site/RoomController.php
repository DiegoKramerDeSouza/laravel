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
use App\Turmas_has_aula;

class RoomController extends Controller
{
    public function index(){

        $streamPage = true;
        $userid = Auth::user()->id;
        $escolas = Escola::all();
        if(Auth::user()->type == 1) $turmas = Turma::where('user_id', $userid)->first();
        else $turmas = Turma::all();
        
        $allmodulos = Modulo::all()->toArray();
        $modulos = array();
        foreach($allmodulos as $modulo) $modulos[$modulo['id']] = $modulo['name'];
        
        $cursos = Curso::all();
        if(session()->has('viewers')){
            $viewers = session()->get('viewers');
            return view('salas.index', compact('escolas', 'turmas', 'modulos', 'cursos', 'streamPage', 'viewers'));
        }  
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
            'author'=>Auth::user()->id,
            'quantity'=>0
        ];
        try{
            Aula::create($aulas);
        }catch(\Exception $e){
            if($e->getCode() == 23000) return $e->getCode();
            else return $e;
        }
        return \Response::json($aulas);
    }

    public function update(Request $req){

        $aula = Aula::where('hash', $req->turmaHash)->first();
        $assistindo = [
            '_token'=>$req->_token,
            'user_id'=>Auth::user()->id,
            'aula_id'=>$aula->id
        ];
        session(['viewers' => $req->numViews]);
        try{
            $registro = Turmas_has_aula::create($assistindo);
        }catch(\Exception $e){
            if($e->getCode() == 23000) return $e->getCode();
            else return $e;
        }
        $value = $aula->quantity + $req->numViews;
        $count = [
            '_token'=>$req->_token,
            'quantity'=>$value
        ];
        try{
            Aula::find($aula->id)->update($count);
        }catch(\Exception $e){
            if($e->getCode() == 23000) return $e->getCode();
            else return $e;
        }
        return \Response::json($count);
    }
}

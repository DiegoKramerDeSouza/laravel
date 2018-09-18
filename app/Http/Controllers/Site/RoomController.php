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
use App\Aulas_has_curso;

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
            'author'=>Auth::user()->id
        ];
        try{
            $aula = Aula::create($aulas);
            $cursos = explode(';', $req->courses);
            foreach($cursos as $curso){
                $courses = [
                    '_token'=>$req->_token,
                    'aula_id'=>$aula->id,
                    'curso_id'=>$curso
                ];
                try{
                    Aulas_has_curso::create($courses);
                }catch(\Exception $e){ }
            }
        }catch(\Exception $e){
            if($e->getCode() == 23000) return $e->getCode();
            else return $e;
        }
        return \Response::json($aulas);
    }

    public function update(Request $req){

        $user = Auth::user()->id;
        $aula = Aula::where('hash', $req->turmaHash)->first();
        $assistindo = [
            '_token'=>$req->_token,
            'user_id'=>$user,
            'aula_id'=>$aula->id,
            'qtd'=>$req->numViews
        ];
        session(['viewers' => $req->numViews]);
        try{
            $registro = Turmas_has_aula::create($assistindo);
        }catch(\Exception $e){
            if($e->getCode() == 23000){
                $count = ['qtd'=>$req->numViews];
                try{
                    Turmas_has_aula::where('user_id', $user)->where('aula_id', $aula->id)->update($count);
                }catch(\Exception $e){
                    return $e;
                }
                return \Response::json($assistindo);
            }
            else return $e;
        }
        return \Response::json($assistindo);
    }
}

<?php

namespace App\Http\Controllers\Site;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;
use App\Turma;
use app\User;


class RestController extends Controller
{

    public function index(){

        $found = true;
        $turmaId = session()->get('turmaId');
        $turmaName = session()->get('turmaName');
        $aula = session()->get('aula');
        $data = session()->get('classList');
        $allData = session()->get('allClassList');
        
        return view('salas.chamada', compact('turmaId', 'turmaName', 'aula', 'allData', 'found'));
    }

    public function listaTurmas(){

        $turmas = Turma::all();
        $json = json_encode($turmas, JSON_UNESCAPED_UNICODE);
        dd(session()->get('classList'));
        return $json;
    }

    public function listaPresenca(Request $req){

        $found = false;
        $turmaId = $req->turmaId;
        $aula = $req->aula;
        $data = $req->presentes;
        $allData = $req->allData;

        $userid = Auth::user()->id;
        $user = User::where('id', $userid)->first();
        if($user->type == 1){
            $turma = Turma::where('user_id', $userid)->first();
            $turmaUserId = $turma->id;
        } else {
            //$turmaUserId = -1;
            $turmaUserId = $userid;
        }
        $turmaName = $user->name;
        
        if($turmaId == $turmaUserId){
            if(session()->has('classList')){
                $arrayAttend = array_merge(session()->get('classList'), $data);
                $arrayAttend = array_unique($arrayAttend);
            } else {
                $arrayAttend = $data;
            }
            session(['classList' => $arrayAttend]);
            
            for($i = 0; $i < count($allData); $i++){
                $key = array_search($allData[$i][1], $arrayAttend);
                $key === false ? $allData[$i][2] = 0 : $allData[$i][2] = 1;
            }
            
            $found = true;
            session(['aula' => $aula]);
            session(['allClassList' => $allData]);
        }

        $htmlView = view('salas.chamada', compact('turmaId', 'turmaName', 'aula', 'allData', 'found'));
        return $htmlView->render();
    }

    public function confirmaPresenca(Request $req){

        session(['classList' => $req->presentes]);
        return json_encode(session()->get('classList'), JSON_UNESCAPED_UNICODE);
    }

}

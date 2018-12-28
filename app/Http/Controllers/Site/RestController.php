<?php

namespace App\Http\Controllers\Site;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;
use App\Turma;


class RestController extends Controller
{

    public function index(){

        $turmaId = session()->get('turmaId');
        $turmaName = session()->get('turmaName');
        $aula = session()->get('aula');
        $data = session()->get('classList');
        $allData = session()->get('allClassList');
        
        return view('salas.chamada', compact('turmaId', 'turmaName', 'aula', 'allData'));
    }

    public function listaTurmas(){

        $turmas = Turma::all();
        $json = json_encode($turmas, JSON_UNESCAPED_UNICODE);
        return $json;
    }

    public function listaPresenca(Request $req){
        
        if($req->data == 0) return json_encode(false, JSON_UNESCAPED_UNICODE);

        $userid = Auth::user()->id;
        $turmaId = $req->turmaId;
        $turmaUserId = $req->turmaUserId;
        $turmaName = $req->turmaName;
        $aula = $req->aula;
        $data = $req->data;
        $allData = $req->allData;
        
        if($turmaId == 0 && count($data) > 0){
            if(session()->has('classList')){
                $arrayPresenca = array_merge(session()->get('classList'), $data);
                $arrayPresenca = array_unique($arrayPresenca);
            } else {
                $arrayPresenca = $data;
            }
            session(['classList' => $arrayPresenca]);
            foreach($arrayPresenca as $user){
                for($i = 0; $i < count($allData); $i++){
                    if($user == $allData[$i][0]) $allData[$i][2] = 1;
                }
            }
            
            session(['turmaId' => $turmaId]);
            session(['turmaName' => $turmaName]);
            session(['aula' => $aula]);
            session(['allClassList' => $allData]);

            $htmlView = view('salas.chamada', compact('turmaId', 'turmaName', 'aula', 'allData'));

            //return json_encode($arrayPresenca, JSON_UNESCAPED_UNICODE);
            return $htmlView->render();
        }
        return false;
    }

}

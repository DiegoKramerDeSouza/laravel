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
        $turmaName = session()->get('className');
        $aula = session()->get('aula');
        $data = session()->get('classList');
        $tema = session()->get('tema');
        $allData = session()->get('allClassList');
        
        return view('salas.chamada', compact('turmaId', 'turmaName', 'aula', 'tema', 'allData', 'found'));
    }

    public function listaTurmas(){

        $turmas = Turma::all();
        $json = json_encode($turmas, JSON_UNESCAPED_UNICODE);
        //$json = json_encode(session()->all(), JSON_UNESCAPED_UNICODE);
        //$json = json_encode(session()->get('classList'), JSON_UNESCAPED_UNICODE);
        return $json;
    }

    public function listaPresenca(Request $req){

        $found = false;
        $classe = null;
        $turmaId = $req->turmaId;
        $aula = $req->aula;
        $data = $req->presentes;
        $tema = $req->tema;
        $allData = $req->allData;

        $userid = Auth::user()->id;
        $user = User::where('id', $userid)->first();
        if($user->type == 1){
            $turma = Turma::where('user_id', $userid)->first();
            $turmaUserId = $turma->id;
        } else {
            $turmaUserId = -1;
        }
        $turmaName = $user->name;
        
        if($turmaId == $turmaUserId){
            if(session()->has('classList')){
                $old = session()->get('classList');
                $data == [] ? $arrayAttend = $old : $arrayAttend = array_merge($old, $data);
                $arrayAttend = array_unique($arrayAttend);
            } else {
                $arrayAttend = $data;
            }

            for($i = 0; $i < count($allData); $i++){
                $arrayAttend == null ? $key = false : $key = array_search($allData[$i][1], $arrayAttend);
                $key === false ? $allData[$i][2] = 0 : $allData[$i][2] = 1;
            }
            
            $found = true;
            session(['classList' => $arrayAttend]);
            session(['aula' => $aula]);
            session(['tema' => $tema]);
            session(['allClassList' => $allData]);
            $classe = session()->get('classList');
        }
        $htmlView = view('salas.chamada', compact('turmaId', 'turmaName', 'aula', 'tema', 'allData', 'found', 'classe'));
        return $htmlView->render();
    }

    public function confirmaPresenca(Request $req){

        session(['classList' => $req->presentes]);
        return json_encode(session()->get('classList'), JSON_UNESCAPED_UNICODE);
    }

    public function testaPresenca(Request $req){

        $turma = $req->turmaId;
        $aula = $req->aula;
        // Simulação de Dados coletados
        $especPresentes = [];
        $total = [
                    ['Aasdfg', 1],
                    ['Basdfg', 2],
                    ['Casdfg', 3],
                    ['Dasdfg', 4],
                    ['Easdfg', 9],
                    ['Fasdfg', 6],
                    ['Gasdfg', 7],
                    ['Hasdfg', 5],
                    ['Iasdfg', 8],
                    ['Jasdfg', 10],
                    ['Kasdfg', 11],
                    ['Lasdfg', 12],
                    ['Masdfg', 13],
                    ['Nasdfg', 14],
                    ['Oasdfg', 15],
                    ['Pasdfg', 16],
                    ['Qasdfg', 17],
                    ['Rasdfg', 18],
                    ['Sasdfg', 19],
                    ['Tasdfg', 20],
                    ['Uasdfg', 21],
                    ['Vasdfg', 22],
                    ['Wasdfg', 23],
                    ['Xasdfg', 24],
                    ['Yasdfg', 25],
                    ['Zasdfg', 26],
                    ['1asdfg', 27],
                    ['2asdfg', 28],
                    ['3asdfg', 29],
                    ['4asdfg', 30],
                    ['5asdfg', 31],
                    ['6asdfg', 32],
                    ['7asdfg', 33],
                    ['8asdfg', 34],
                    ['9asdfg', 35],
                    ['10asdfg', 36],
                    ['11asdfg', 37],
                    ['12asdfg', 38],
                    ['13asdfg', 39],
                    ['14asdfg', 40]
                ];
        $json = ['presentes' => $especPresentes, 'total' => $total];
        return json_encode($json, JSON_UNESCAPED_UNICODE);
    }

    public function testaReceivePhoto(Request $req){

        // Simulação de recebimento de fotos de turmas para reconhecimento facial
        $pic = $req->picture;
        $turma = $req->turmaId;
        $hash = $req->aulaHash;
        $json = [$turma, $hash, $pic];
        return json_encode($json, JSON_UNESCAPED_UNICODE);
    }

}

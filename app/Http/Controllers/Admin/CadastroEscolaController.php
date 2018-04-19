<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Escola;
use App\EnderecoEscola;

class CadastroEscolaController extends Controller
{
    public function index(){
        //Habilita uma view a receber e enviar dados via WEBRTC
        //$streamPage = true;
        $escolas = Escola::all();
        return view('admin.cadastro.escolas.index', compact('escolas'));
    }
    public function add(){
        return view('admin.cadastro.escolas.adicionar');
    }
    public function save(Request $req){
        //Ajusta cep para decimal
        $postal = str_replace('-', '.', $req->postal);
        $postal = floatval($postal);
        //Ajusta cep e localiza coordenadas **MOVER PARA O JAVASCRIPT**
        $cep = $req->postal;
        $cep = explode('-', $cep, 2);
        $postalcode =$cep[0] . $cep[1][0];
        $url = 'http://maps.googleapis.com/maps/api/geocode/json?address=' . $postalcode;
        $json = json_decode(file_get_contents($url), true);
        if(isset($json['results'][0]['geometry']['location']['lat']) && isset($json['results'][0]['geometry']['location']['lng'])){
            $lat = $json['results'][0]['geometry']['location']['lat'];
            $lng = $json['results'][0]['geometry']['location']['lng'];
            $location = $lat . ";" . $lng;
        } else{
            return redirect()->route('admin.cadastro.escolas');
        }
        //Define os campos enviados que devem ser criados no banco
        $escola = [
            '_token'=>$req->_token,
            'name'=>$req->name
        ];
        //Insere dados na base Escolas
        $created = Escola::create($escola);

        //Define os campos enviados que devem ser gravados no banco
        $enderecoescola = [
            '_token'=>$req->_token,
            'school_id'=>$created->id,
            'postal'=>$postal,
            'address'=>$req->address,
            'complement'=>$req->complement,
            'st'=>$req->st,
            'coordinates'=>$location
        ];
        echo $created->id . '<br>' . $postal . '<br>' . $req->address . '<br>' . $req->complement . '<br>' . $req->st . '<br>' . $location;
        //Insere dados na base UserDados
        EnderecoEscola::create($enderecoescola);
        return redirect()->route('admin.cadastro.escolas');
    }
    public function edit($id){
        //
    }
    public function update(Request $req, $id){
        //
    }
    public function delete($id){
        Escola::find($id)->delete();
        EnderecoEscola::where('school_id', $id)->first()->delete();
        return redirect()->route('admin.cadastro.escolas');
    }
    //teste
    public function collect($data){

        $cep = explode('-', $data, 2);
        $postalcode =$cep[0] . $cep[1][0] . '00';

        $url = 'http://maps.googleapis.com/maps/api/geocode/json?address=' . $postalcode;
        $json = json_decode(file_get_contents($url), true);
        $lat = $json['results'][0]['geometry']['location']['lat'];
        $lng = $json['results'][0]['geometry']['location']['lng'];
        $location = $lat . ";" . $lng;
        echo $location;

    }
}

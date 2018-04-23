<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\User;
use App\UserDado;
use App\Escola;
use App\EnderecoEscola;
use App\RecursoApi;

class CadastroEscolaController extends Controller
{
    //->View escolas cadastradas
    public function index(){
        //Habilita uma view a receber e enviar dados via WEBRTC
        //Deve ser encaminhada em compact()
        //$streamPage = true;
        $escolas = Escola::all();
        return view('admin.cadastro.escolas.index', compact('escolas'));
    }
    //->View para adição de novas escolas
    public function add(){
        $api = RecursoApi::where('name', 'Google Maps Geolocation')->first();
        $apicep = RecursoApi::where('name', 'ViaCEP Consulta')->first();
        return view('admin.cadastro.escolas.adicionar', compact('api', 'apicep', 'ufs'));
    }
    //Salvar uma nova escola na base de dados
    public function save(Request $req){
        if(Escola::where('register', $req->register)->count() == 0){
            //Define os campos enviados que devem ser criados no banco
            $escola = [
                '_token'=>$req->_token,
                'register'=>$req->register,
                'name'=>$req->name
            ];
            //Insere dados na base Escolas
            $created = Escola::create($escola);

            //Define os campos enviados que devem ser gravados no banco
            //Referencia o school_id ao id criado na criação da escola ($created->id)
            $enderecoescola = [
                '_token'=>$req->_token,
                'school_id'=>$created->id,
                'postal'=>$req->postal,
                'address'=>$req->address,
                'city'=>$req->city,
                'number'=>$req->number,
                'complement'=>$req->complement,
                'st'=>$req->st,
                'coordinates'=>$req->location
            ];
            //Insere dados na base UserDados
            EnderecoEscola::create($enderecoescola);
            return redirect()->route('admin.cadastro.escolas');
        } else {
            echo "<h4>Instituição com registro " . $req->register . " já existente!</h4>";
        }
        
    }
    //->View para editar dados de escolas
    public function edit($id){
        $api = RecursoApi::where('name', 'Google Maps Geolocation')->first();
        $apicep = RecursoApi::where('name', 'ViaCEP Consulta')->first();
        $escolas = Escola::find($id);
        $endereco = EnderecoEscola::where('school_id', $id)->first();
        return view('admin.cadastro.escolas.editar', compact('api', 'apicep', 'escolas', 'endereco'));
    }
    //Atualizar dados de escola e gravar na base
    public function update(Request $req, $id){
        //Define os campos enviados que devem ser atualizados no banco
        $escola = [
            '_token'=>$req->_token,
            'register'=>$req->register,
            'name'=>$req->name
        ];
        //Atualiza base de dados Escola
        Escola::find($id)->update($escola);
        //Define os campos enviados que devem ser atualizados no banco
        $enderecoescola = [
            '_token'=>$req->_token,
            'postal'=>$req->postal,
            'address'=>$req->address,
            'city'=>$req->city,
            'number'=>$req->number,
            'complement'=>$req->complement,
            'st'=>$req->st,
            'coordinates'=>$req->location
        ];
        //Atualiza base de dados EnderecoEscola
        EnderecoEscola::where('school_id', $id)->first()->update($enderecoescola);
        return redirect()->route('admin.cadastro.escolas');
    }
    //Deletar escolas registradas e todos os usuários vinculados a esta
    public function delete($id){
        $todelete = UserDado::where('school_id', '=', $id)->get();
        //Para cada usuário vinculado à instituição
        foreach($todelete as $deleteUser){
            $deleted = $deleteUser->delete();
            User::find($deleteUser->user_id)->delete();
        }
        Escola::find($id)->delete();
        EnderecoEscola::where('school_id', $id)->first()->delete();
        return redirect()->route('admin.cadastro.escolas');
    }
    //Função de teste para coleta de geolocalização 
    //Apenas Debug
    public function collect($data){
        $api = RecursoApi::where('name', 'Google Maps Geolocation')->first();
        $cep = explode('-', $data, 2);
        $postalcode =$cep[0] . $cep[1][0] . '00';
        $url = $api->details . '?address=' . $postalcode . '&key=' . $api->key;
        $json = json_decode(file_get_contents($url), true);
        $lat = $json['results'][0]['geometry']['location']['lat'];
        $lng = $json['results'][0]['geometry']['location']['lng'];
        $location = $lat . ";" . $lng;
        echo $location;
    }
}

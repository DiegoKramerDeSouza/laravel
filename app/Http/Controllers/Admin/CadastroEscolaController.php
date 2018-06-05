<?php

namespace App\Http\Controllers\Admin;

use Validator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\EspecialMethods;
use App\User;
use App\UserDado;
use App\Escola;
use App\EnderecoEscola;
use App\Turma;
use App\RecursoApi;

class CadastroEscolaController extends Controller
{
    use EspecialMethods;
    
    //->View escolas cadastradas
    public function index(){
        if($this->validade('4')){
            //Paginação dos valores coletados na entidade Escolas
            $escolas = Escola::orderBy('name', 'asc')->paginate(5);
            $resultToString = true;
            return view('admin.cadastro.escolas.index', compact('escolas', 'resultToString'));
        } else {
            return redirect()->route('denied');
        }
    }
    //->View para adição de novas escolas
    public function add(){
        if($this->validade('4')){
            $api = RecursoApi::where('name', 'Google Maps Geolocation')->first();
            $apicep = RecursoApi::where('name', 'ViaCEP Consulta')->first();
            return view('admin.cadastro.escolas.adicionar', compact('api', 'apicep'));
        } else {
            return redirect()->route('denied');
        }
    }
    //Salvar uma nova escola na base de dados
    public function save(Request $req){
        if($this->validade('4')){
            // Validação dos campos
            $validator = Validator::make($req->all(), [
                'name' => 'bail|required|min:4|max:191',
                'register' => 'bail|required|unique:escolas|min:4|max:191',
                'postal' => 'required',
                'address' => 'required',
                'city' => 'required',
                'number' => 'required',
                'st' => 'required'
            ]);
            if ($validator->fails()) {
                return redirect()->route('admin.cadastro.escolas.adiciona')
                            ->withErrors($validator)
                            ->withInput();
            }
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
                return redirect()->route('admin.cadastro.escolas', ['page' => '1']);
            } else {
                echo "<h4>Instituição com registro " . $req->register . " já existente!</h4>";
            }
        } else {
            return redirect()->route('denied');
        }
        
    }
    //->View para editar dados de escolas
    public function edit($id){
        if($this->validade('4')){
            $api = RecursoApi::where('name', 'Google Maps Geolocation')->first();
            $apicep = RecursoApi::where('name', 'ViaCEP Consulta')->first();
            $escolas = Escola::find($id);
            $endereco = EnderecoEscola::where('school_id', $id)->first();
            return view('admin.cadastro.escolas.editar', compact('api', 'apicep', 'escolas', 'endereco'));
        } else {
            return redirect()->route('denied');
        }
    }
    //Atualizar dados de escola e gravar na base
    public function update(Request $req, $id){
        if($this->validade('4')){
            // Validação dos campos
            $validator = Validator::make($req->all(), [
                'name' => 'bail|required|min:4|max:191',
                'register' => 'bail|required|unique:escolas,register,' . $id . '|min:4|max:191',
                'postal' => 'required',
                'address' => 'required',
                'city' => 'required',
                'number' => 'required',
                'st' => 'required'
            ]);
            if ($validator->fails()) {
                return redirect()->route('admin.cadastro.escolas.edita', $id)
                            ->withErrors($validator)
                            ->withInput();
            }
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

            $turmas = [
                'school_name'=>$req->name
            ];
            $toupdateTurma = Turma::where('school_id', '=', $id)->get();
            foreach($toupdateTurma as $updateTurma){
                $updateTurma->update($turmas);
            }
            return redirect()->route('admin.cadastro.escolas', ['page' => '1']);
        } else {
            return redirect()->route('denied');
        }
    }
    //Deletar escolas registradas e todos os usuários vinculados a esta
    public function delete($id){
        if($this->validade('4')){
            $todeleteTurma = Turma::where('school_id', '=', $id)->get();
            //Para cada turma vinculada à instituição
            foreach($todeleteTurma as $deleteTurma){
                $deleteTurma->delete();
            }
            Escola::find($id)->delete();
            EnderecoEscola::where('school_id', $id)->first()->delete();
            return redirect()->route('admin.cadastro.escolas', ['page' => '1']);
        } else {
            return redirect()->route('denied');
        }
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

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
    
    public function __construct()
    {
        $this->pagination = $this->setDefaults()->pagination;
        $this->module = 'Escola';
    }
    
    /**
     * Validação de permissão de acesso;
     * Coleta todas as escolas por nome;
     * Direciona para a View de Listagem de turmas;
     */
    public function index(Request $req){

        if($this->validade($this->module)){
            $escolas = Escola::orderBy('name', 'asc')->paginate($this->pagination);
            $isAutocomplete = true;
            if(isset($req->success)) {
                $success = $this->returnMessages($req, $this->module);
                return view('admin.cadastro.escolas.index', compact('escolas', 'isAutocomplete', 'success'));
            }
            return view('admin.cadastro.escolas.index', compact('escolas', 'isAutocomplete'));
        } else {
            return $this->accessDenied();
        }
    }

    /**
     * Validação de permissão de acesso;
     * Coleta os recursos de API cadastradas para escolas;
     * Direciona para View de novo Cadastro;
     */
    public function add(){

        if($this->validade($this->module)){
            $api = RecursoApi::where('name', 'Google Maps Geolocation')->first();
            $apicep = RecursoApi::where('name', 'ViaCEP Consulta')->first();
            return view('admin.cadastro.escolas.adicionar', compact('api', 'apicep'));
        } else {
            return $this->accessDenied();
        }
    }

    /**
     * 1. Validação de permissão de acesso;
     * 2. Validação dos campos a gravar;
     * 3. Define os campos enviados que devem ser gravados em Escolas;
     * 4. Insere na base de dados Escolas;
     * 5. Define os campos enviados que devem ser gravados em EnderecoEscolas;
     * 6. Referencia o school_id ao id criado na criação da escola ($created->id)
     * 7. Insere na base de dados EnderecoEscolas;
     */
    public function save(Request $req){

        if($this->validade($this->module)){
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
                $escola = [
                    '_token'=>$req->_token,
                    'register'=>$req->register,
                    'name'=>$req->name
                ];
                $created = Escola::create($escola);

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
                EnderecoEscola::create($enderecoescola);

                return redirect()->route('admin.cadastro.escolas', ['success' => '1']);
            }
        } else {

            return $this->accessDenied();
        }
    }

    /**
     * 1. Validação de permissão de acesso;
     * 2. Coleta os recursos de API cadastradas para escolas;
     * 3. Direciona para View de edição;
     */  
    public function edit($id){

        if($this->validade($this->module)){
            $api = RecursoApi::where('name', 'Google Maps Geolocation')->first();
            $apicep = RecursoApi::where('name', 'ViaCEP Consulta')->first();
            $escolas = Escola::find($id);
            $endereco = EnderecoEscola::where('school_id', $id)->first();
            return view('admin.cadastro.escolas.editar', compact('api', 'apicep', 'escolas', 'endereco'));
        } else {
            return $this->accessDenied();
        }
    }

    /**
     * 1. Validação de permissão de acesso;
     * 2. Validação dos campos a alterar;
     * 3. Define os campos enviados que devem ser atualizados em Escolas;
     * 4. Atualiza base de dados Escolas;
     * 5. Define os campos enviados que devem ser atualizados em EnderecoEscolas;
     * 6. Atualiza base de dados EnderecoEscolas;
     * 7. Define os campos enviados que devem ser atualizados em Turmas;
     * 8. Atualiza base de dados Turmas;
     */
    public function update(Request $req, $id){

        if($this->validade($this->module)){
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
            
            $escola = [
                '_token'=>$req->_token,
                'register'=>$req->register,
                'name'=>$req->name
            ];
            Escola::find($id)->update($escola);
            
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
            EnderecoEscola::where('school_id', $id)->first()->update($enderecoescola);

            $turmas = [
                'school_name'=>$req->name
            ];
            $toupdateTurma = Turma::where('school_id', '=', $id)->get();
            foreach($toupdateTurma as $updateTurma){
                $updateTurma->update($turmas);
            }

            return redirect()->route('admin.cadastro.escolas', ['success' => '2']);
        } else {

            return $this->accessDenied();
        }
    }

    /**
     * Validação de permissão de acesso;
     * Deleta cada turma registrada para a mesma escola;
     * Deleta ID informado na base Escolas;
     * Deleta ID informado na base EnderecoEscolas;
     */
    public function delete($id){

        if($this->validade('Escola')){
            $todeleteTurma = Turma::where('school_id', '=', $id)->get();
            foreach($todeleteTurma as $deleteTurma){
                $deleteTurma->delete();
            }
            Escola::find($id)->delete();
            EnderecoEscola::where('school_id', $id)->first()->delete();
            return redirect()->route('admin.cadastro.escolas', ['success' => '3']);
        } else {
            return redirect()->route('denied');
        }
    }
}

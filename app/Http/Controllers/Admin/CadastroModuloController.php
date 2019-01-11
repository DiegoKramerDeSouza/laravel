<?php

namespace App\Http\Controllers\Admin;

use Validator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\EspecialMethods;
use App\Modulo;

class CadastroModuloController extends Controller
{
    use EspecialMethods;
    
    public function __construct()
    {
        $this->pagination = $this->setDefaults()->pagination;
        $this->module = 'Modulo';
    }

    /**
     * Validação de permissão de acesso;
     * Coleta todos os módulos por nome;
     * Direciona para a View de Listagem de turmas;
     */
    public function index(Request $req){

        if($this->validade($this->module)){
            $resultado = Modulo::orderBy('name', 'asc')->paginate($this->pagination);
            $isAutocomplete = true;
            if(isset($req->success)) {
                $success = $this->returnMessages($req, $this->module);
                return view('admin.cadastro.modulos.index', compact('resultado', 'isAutocomplete', 'success'));
            }
            return view('admin.cadastro.modulos.index', compact('resultado', 'isAutocomplete'));
        } else {
            return $this->accessDenied();
        }
    }

    /**
     * Validação de permissão de acesso;
     * Coleta todas os modulos cadastrado;
     * Direciona para View de novo Cadastro;
     */
    public function add(){

        if($this->validade($this->module)){
            $resultado = Modulo::all();
            return view('admin.cadastro.modulos.adicionar', compact('resultado'));
        } else {
            return $this->accessDenied();
        }
    }

    /**
     * 1. Validação de permissão de acesso;
     * 2. Validação dos campos a gravar;
     * 3. Define os campos enviados que devem ser gravados em Modulos;
     * 4. Insere na base de dados Users;
     */
    public function save(Request $req){

        if($this->validade($this->module)){
            $validator = Validator::make($req->all(), [
                'name' => 'bail|required|unique:modulos|min:4|max:191'
            ]);
            if ($validator->fails()) {
                return redirect()->route('admin.cadastro.modulos.adiciona')
                            ->withErrors($validator)
                            ->withInput();
            }
            
            $modulos = [
                '_token'=>$req->_token,
                'name'=>$req->name,
                'description'=>$req->description
            ];
            Modulo::create($modulos);

            return redirect()->route('admin.cadastro.modulos', ['success' => '1']);
        } else {

            return $this->accessDenied();
        }
    }

    /**
     * 1. Validação de permissão de acesso;
     * 2. Direciona para View de edição;
     */   
    public function edit($id){

        if($this->validade($this->module)){
            $resultado = Modulo::find($id);
            return view('admin.cadastro.modulos.editar', compact('resultado'));
        } else {
            return $this->accessDenied();
        }
    }

    /**
     * 1. Validação de permissão de acesso;
     * 2. Validação dos campos a alterar;
     * 3. Define os campos enviados que devem ser atualizados em Modulos;
     * 4. Atualiza base de dados Modulos;
     */
    public function update(Request $req, $id){

        if($this->validade($this->module)){
            $validator = Validator::make($req->all(), [
                'name' => 'bail|required|unique:modulos,name,' . $id . '|min:4|max:191'
            ]);
            if ($validator->fails()) {
                return redirect()->route('admin.cadastro.modulos.edita', $id)
                            ->withErrors($validator)
                            ->withInput();
            }

            $modulos = [
                '_token'=>$req->_token,
                'name'=>$req->name,
                'description'=>$req->description
            ];
            Modulo::find($id)->update($modulos);

            return redirect()->route('admin.cadastro.modulos', ['success' => '2']);
        } else {

            return $this->accessDenied();
        }
    }

    /**
     * Validação de permissão de acesso;
     * Deleta ID informado na base Modulos;
     */
    public function delete($id){
        if($this->validade($this->module)){
            Modulo::find($id)->delete();
            return redirect()->route('admin.cadastro.modulos', ['success' => '3']);
        } else {
            return redirect()->route('denied');
        }
    }

}

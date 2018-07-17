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

    /**
     * Validação de permissão de acesso;
     * Coleta todos os módulos por nome;
     * Direciona para a View de Listagem de turmas;
     */
    public function index(){

        if($this->validade('Modulo')){
            $modulos = Modulo::orderBy('name', 'asc')->paginate(5);
            $isAutocomplete = true;
            return view('admin.cadastro.modulos.index', compact('modulos', 'isAutocomplete'));
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

        if($this->validade('Modulo')){
            $modulos = Modulo::all();
            return view('admin.cadastro.modulos.adicionar', compact('modulos'));
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

        if($this->validade('Modulo')){
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
                'name'=>$req->name
            ];
            Modulo::create($modulos);

            return redirect()->route('admin.cadastro.modulos', ['page' => '1']);
        } else {

            return $this->accessDenied();
        }
    }

    /**
     * 1. Validação de permissão de acesso;
     * 2. Direciona para View de edição;
     */   
    public function edit($id){

        if($this->validade('Modulo')){
            $modulos = Modulo::find($id);
            return view('admin.cadastro.modulos.editar', compact('modulos'));
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

        if($this->validade('Modulo')){
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
                'name'=>$req->name
            ];
            Modulo::find($id)->update($modulos);

            return redirect()->route('admin.cadastro.modulos', ['page' => '1']);
        } else {

            return $this->accessDenied();
        }
    }

    /**
     * Validação de permissão de acesso;
     * Deleta ID informado na base Modulos;
     */
    public function delete($id){
        if($this->validade('Modulo')){
            Modulo::find($id)->delete();
            return redirect()->route('admin.cadastro.modulos', ['page' => '1']);
        } else {
            return redirect()->route('denied');
        }
    }

}

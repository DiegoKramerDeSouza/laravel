<?php

namespace App\Http\Controllers\Admin;

use Validator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\EspecialMethods;
use App\Perfil;
use App\Componente;

class CadastroPerfilController extends Controller
{
    use EspecialMethods;

    /**
     * Validação de permissão de acesso;
     * Coleta todos os perfis cadastrados;
     * Direciona para a View de Listagem de perfis;
     */
    public function index(){

        if($this->validade('Perfil')){
            $perfis = Perfil::orderBy('name', 'asc')->paginate(5);
            $isAutocomplete = true;
            return view('admin.cadastro.perfis.index', compact('perfis', 'isAutocomplete'));
        } else {
            return $this->accessDenied();
        }
    }

    /**
     * Validação de permissão de acesso;
     * Coleta dados das bases Perfis e Components a partir do ID de User;
     * Direciona para View de novo Cadastro;
     */
    public function add(){

        if($this->validade('Perfil')){
            $grant = true;
            $perfis = Perfil::all();
            $componentes = Componente::all();
            return view('admin.cadastro.perfis.adicionar', compact('perfis', 'grant', 'componentes'));
        } else {
            return $this->accessDenied();
        }
    }

    /**
     * 1. Validação de permissão de acesso;
     * 2. Validação dos campos a gravar;
     * 3. Define os campos enviados que devem ser gravados em Perfis;
     * 4. Insere na base de dados Perfis;
     */
    public function save(Request $req){

        if($this->validade('Perfil')){
            $validator = Validator::make($req->all(), [
                'name' => 'bail|required|unique:perfils|min:4|max:191'
            ]);
            if ($validator->fails()) {
                return redirect()->route('admin.cadastro.perfis.adiciona')
                            ->withErrors($validator)
                            ->withInput();
            }
            if($req->grantList != null){
                $grantList = implode(';', $req->grantList);
            } else {
                $grantList = '0';
            }
            
            $perfis = [
                '_token'=>$req->_token,
                'name'=>$req->name,
                'grant'=>$grantList,
                'description'=>$req->description
            ];
            
            Perfil::create($perfis);
            return redirect()->route('admin.cadastro.perfis', ['page' => '1']);
        } else {

            return $this->accessDenied();
        }
    }

    /**
     * Validação de permissão de acesso;
     * Efetua o controle de valores coletados do campo $perfis->grant;
     * Define os atributos para encaminhar a lista de permissões para a View;
     */    
    public function edit($id){

        if($this->validade('Perfil')){
            $grant = true;
            $perfis = Perfil::find($id);
            if($perfis->grant != '0'){
                $componentes = Componente::all();
                $granted = explode(';', $perfis->grant);
                $html = $this->constructGrantList($componentes, $granted);

                return view('admin.cadastro.perfis.editar', compact('perfis', 'grant', 'html'));
                
            } else {
                $componentes = Componente::all();
                return view('admin.cadastro.perfis.editar', compact('perfis', 'grant', 'componentes'));
            }
        } else {

            return $this->accessDenied();
        }
    }

    /**
     * 1. Validação de permissão de acesso;
     * 2. Validação dos campos a alterar;
     * 3. Formata lista de permissões (de array para string);
     * 4. Define os campos enviados que devem ser atualizados em Perfis;
     * 5. Atualiza base de dados Perfis;
     */
    public function update(Request $req, $id){
        if($this->validade('Perfil')){
            $validator = Validator::make($req->all(), [
                'name' => 'bail|required|unique:perfils,name,' . $id . '|min:4|max:191'
            ]);
            if ($validator->fails()) {
                return redirect()->route('admin.cadastro.perfis.edita', $id)
                            ->withErrors($validator)
                            ->withInput();
            }

            if($req->grantList != null){
                $grantList = implode(';', $req->grantList);
            } else {
                $grantList = '0';
            }

            $perfis = [
                '_token'=>$req->_token,
                'name'=>$req->name,
                'grant'=>$grantList,
                'description'=>$req->description
            ];
            Perfil::find($id)->update($perfis);

            return redirect()->route('admin.cadastro.perfis', ['page' => '1']);
        } else {

            return $this->accessDenied();
        }
    }

    /**
     * Validação de permissão de acesso;
     * Deleta ID informado na base Perfis;
     */
    public function delete($id){

        if($this->validade('Perfil')){
            Perfil::find($id)->delete();
            return redirect()->route('admin.cadastro.perfis', ['page' => '1']);
        } else {
            return $this->accessDenied();
        }
    }

    /**
     * Define lista de permissões para ser construída na View
     */
    private function constructGrantList($componentes, $granted){

        $grantArr = array();
        foreach($componentes as $tag){
            $checked = false;
            foreach($granted as $allow){
                if("$tag->id" == $allow) $checked = true;
                elseif($checked) break;
            }
            array_push($grantArr, ["id" => $tag->id, "name" => $tag->name, "selected" => $checked]);
        }
        return $grantArr;
    }
}

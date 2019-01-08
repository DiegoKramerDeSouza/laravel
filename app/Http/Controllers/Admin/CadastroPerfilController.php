<?php

namespace App\Http\Controllers\Admin;

use Validator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\EspecialMethods;
use App\Perfil;
use App\Componente;
use App\Perfils_has_componente;

class CadastroPerfilController extends Controller
{
    use EspecialMethods;
    
    public function __construct()
    {
        $this->pagination = $this->setDefaults()->pagination;
        $this->module = 'Perfil';
    }

    /**
     * Validação de permissão de acesso;
     * Coleta todos os perfis cadastrados;
     * Direciona para a View de Listagem de perfis;
     */
    public function index(Request $req){

        if($this->validade($this->module)){
            $perfis = Perfil::orderBy('name', 'asc')->paginate($this->pagination);
            $isAutocomplete = true;
            if(isset($req->success)) {
                $success = $this->returnMessages($req, $this->module);
                return view('admin.cadastro.perfis.index', compact('perfis', 'isAutocomplete', 'success'));
            }
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

        if($this->validade($this->module)){
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

        if($this->validade($this->module)){
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
            
            $created = Perfil::create($perfis);
            if($grantList != '0'){
                foreach($req->grantList as $comp){
                    $perfilComponent = [
                        '_token'=>$req->_token,
                        'perfils_id'=>$created->id,
                        'componentes_id'=>$comp
                    ];
                    Perfils_has_componente::create($perfilComponent);
                }
            }
            return redirect()->route('admin.cadastro.perfis', ['success' => '1']);
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

        if($this->validade($this->module)){
            $grant = true;
            $perfis = Perfil::find($id);
            $componentes = Componente::all();
            $perfilComp = Perfils_has_componente::where('perfils_id', $perfis->id)->get();
            if($perfilComp->count() > 0){
                $html = $this->constructGrantList($componentes, $perfilComp);
                return view('admin.cadastro.perfis.editar', compact('perfis', 'grant', 'html')); 
            } else {
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
        if($this->validade($this->module)){
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
            $finding = Perfils_has_componente::where('perfils_id', $id)->get();
            $count = $finding->count();
            if($count > 0 && $grantList != '0'){
                foreach($finding as $comp){
                    Perfils_has_componente::where('perfils_id', $id)
                                            ->where('componentes_id', $comp->componentes_id)->delete();
                }
                foreach($req->grantList as $comp){
                    $perfilComponent = [
                        '_token'=>$req->_token,
                        'perfils_id'=>$id,
                        'componentes_id'=>$comp
                    ];
                    Perfils_has_componente::create($perfilComponent);
                }

            } elseif($count > 0 && $grantList == '0'){
                foreach($finding as $comp){
                    Perfils_has_componente::where('perfils_id', $id)
                                            ->where('componentes_id', $comp->componentes_id)->delete();
                }

            } elseif($count < 1 && $grantList != '0'){
                foreach($req->grantList as $comp){
                    $perfilComponent = [
                        '_token'=>$req->_token,
                        'perfils_id'=>$id,
                        'componentes_id'=>$comp
                    ];
                    Perfils_has_componente::create($perfilComponent);
                }
            }
            return redirect()->route('admin.cadastro.perfis', ['success' => '2']);
        } else {

            return $this->accessDenied();
        }
    }

    /**
     * Validação de permissão de acesso;
     * Deleta ID informado na base Perfis;
     */
    public function delete($id){

        if($this->validade($this->module)){
            Perfil::find($id)->delete();
            return redirect()->route('admin.cadastro.perfis', ['success' => '3']);
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
                //if("$tag->id" == $allow) $checked = true;
                if("$tag->id" == $allow->componentes_id) $checked = true;
                elseif($checked) break;
            }
            array_push($grantArr, ["id" => $tag->id, "name" => $tag->name, "selected" => $checked]);
        }
        return $grantArr;
    }
}

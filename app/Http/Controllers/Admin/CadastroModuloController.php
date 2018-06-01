<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\EspecialMethods;
use App\Modulo;

class CadastroModuloController extends Controller
{
    use EspecialMethods;

    public function index(){
        if($this->validade('2')){
            //Paginação dos valores coletados na entidade Modulos
            $modulos = Modulo::orderBy('name', 'asc')->paginate(5);
            $resultToString = true;
            return view('admin.cadastro.modulos.index', compact('modulos', 'resultToString'));
        } else {
            return redirect()->route('denied');
        }
    }
    public function add(){
        if($this->validade('2')){
            //Coleta todas os modulos cadastrados
            $modulos = Modulo::all();
            return view('admin.cadastro.modulos.adicionar', compact('modulos'));
        } else {
            return redirect()->route('denied');
        }
    }
    public function save(Request $req){
        if($this->validade('2')){
            //Define os campos enviados que devem ser gravados no banco
            $modulos = [
                '_token'=>$req->_token,
                'name'=>$req->name
            ];
            //Insere dados na base Turma
            Modulo::create($modulos);
            return redirect()->route('admin.cadastro.modulos', ['page' => '1']);
        } else {
            return redirect()->route('denied');
        }
    }
    public function edit($id){
        if($this->validade('2')){
            //Direciona para View de edição
            $modulos = Modulo::find($id);
            return view('admin.cadastro.modulos.editar', compact('modulos'));
        } else {
            return redirect()->route('denied');
        }
    }
    public function update(Request $req, $id){
        if($this->validade('2')){
            //Define os campos enviados que devem ser atualizados no banco
            $modulos = [
                '_token'=>$req->_token,
                'name'=>$req->name
            ];
            //Atualiza base de dados Turma
            Modulo::find($id)->update($modulos);
            return redirect()->route('admin.cadastro.modulos', ['page' => '1']);
        } else {
            return redirect()->route('denied');
        }
    }
    public function delete($id){
        if($this->validade('2')){
            Modulo::find($id)->delete();
            return redirect()->route('admin.cadastro.modulos', ['page' => '1']);
        } else {
            return redirect()->route('denied');
        }
    }
    public function autocomplete(){
        $allModulos = Modulo::all()->toArray();
        $result = array();
        for($i = 0; $i < count($allModulos); $i++){
            $data = str_replace("\0", "", $allModulos[$i]['name']);
            $result[$allModulos[$i]['name']] = null;       
        }
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    }
    public function resultAutocomplete($data){
        $modulosToString = true;
        $modulos = Modulo::where('name', '=', $data)->orderBy('name', 'asc')->paginate(5);
        return view('admin.cadastro.modulos.index', compact('modulos', 'modulosToString'));
    }
}

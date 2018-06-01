<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\EspecialMethods;
use App\Curso;
use App\Modulo;

class CadastroCursoController extends Controller
{
    use EspecialMethods;

    public function index(){
        if($this->validade('3')){
            //Paginação dos valores coletados na entidade Cursos
            $cursos = Curso::orderBy('name', 'asc')->paginate(5);
            $allmodulos = Modulo::all()->toArray();
            $modulos = array();
            foreach($allmodulos as $modulo){
                $modulos[$modulo['id']] = $modulo['name'];
            }
            $resultToString = true;
            return view('admin.cadastro.cursos.index', compact('cursos', 'modulos', 'resultToString'));
        } else {
            return redirect()->route('denied');
        }
        
    }
    public function add(){
        if($this->validade('3')){
            //Coleta todos cursos cadastrados
            $cursos = Curso::all();
            $modulos = Modulo::all();
            return view('admin.cadastro.cursos.adicionar', compact('cursos', 'modulos'));
        } else {
            return redirect()->route('denied');
        }
    }
    public function save(Request $req){
        if($this->validade('3')){
            //Define os campos enviados que devem ser gravados no banco
            $cursos = [
                '_token'=>$req->_token,
                'name'=>$req->name,
                'modulo_id'=>$req->modulo_id
            ];
            //Insere dados na base Turma
            Curso::create($cursos);
            return redirect()->route('admin.cadastro.cursos', ['page' => '1']);
        } else {
            return redirect()->route('denied');
        }
    }
    public function edit($id){
        if($this->validade('3')){
            //Direciona para View de edição
            $cursos = Curso::find($id);
            $modulos = Modulo::all();
            return view('admin.cadastro.cursos.editar', compact('cursos', 'modulos'));
        } else {
            return redirect()->route('denied');
        }
    }
    public function update(Request $req, $id){
        if($this->validade('3')){
            //Define os campos enviados que devem ser atualizados no banco
            $cursos = [
                '_token'=>$req->_token,
                'name'=>$req->name,
                'modulo_id'=>$req->modulo_id
            ];
            //Atualiza base de dados Turma
            Curso::find($id)->update($cursos);
            return redirect()->route('admin.cadastro.cursos', ['page' => '1']);
        } else {
            return redirect()->route('denied');
        }
    }
    public function delete($id){
        if($this->validade('3')){
            Curso::find($id)->delete();
            return redirect()->route('admin.cadastro.cursos', ['page' => '1']);
        } else {
            return redirect()->route('denied');
        }
    }
}

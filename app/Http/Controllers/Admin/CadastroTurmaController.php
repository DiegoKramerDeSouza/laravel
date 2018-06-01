<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\EspecialMethods;
use App\User;
use App\Escola;
use App\Turma;
use App\Curso;
use App\Modulo;

class CadastroTurmaController extends Controller
{
    use EspecialMethods;

    public function index(){
        if($this->validade('1')){
            //Paginação dos valores coletados na entidade Turmas
            $turmas = Turma::orderBy('name', 'asc')->paginate(5);
            //$escolas = Escola::all();
            $accounts = User::where('type', 1)->get()->toArray();
            $users = array();
            foreach($accounts as $account){
                $users[$account['id']] = $account['login'];
            }
            $resultToString = true;
            return view('admin.cadastro.turmas.index', compact('turmas', 'users', 'resultToString'));
        } else {
            return redirect()->route('denied');
        }
    }
    public function add(){
        if($this->validade('1')){
            //Coleta todas as escolas cadastradas
            $classroom = true;
            $escolas = Escola::all();
            $cursos = Curso::all();
            $allmodulos = Modulo::all()->toArray();
            $modulos = array();
            foreach($allmodulos as $modulo){
                $modulos[$modulo['id']] = $modulo['name'];
            }
            return view('admin.cadastro.turmas.adicionar', compact('escolas', 'cursos', 'modulos', 'classroom'));
        } else {
            return redirect()->route('denied');
        }
    }
    public function save(Request $req){
        if($this->validade('1')){
            //Define os campos enviados que devem ser gravados no banco
            $users = [
                '_token'=>$req->_token,
                'name'=>$req->name,
                'login'=>$req->login,
                'password'=>bcrypt($req->password),
                'type'=>1
            ];
            //Insere dados na base Users
            $created = User::create($users);

            //Define os campos enviados que devem ser gravados no banco
            $school = $req->school_id;
            $school = explode('|', $school, 2);
            $schoolId = $school[0];
            $schoolName = $school[1];
            $listCurso = implode(';', $req->curso_id_list);
            $turmas = [
                '_token'=>$req->_token,
                'name'=>$req->name,
                'user_id'=>$created->id,
                'school_name'=>$schoolName,
                'login'=>$req->login,
                'password'=>bcrypt($req->password),
                'school_id'=>$schoolId,
                'curso_id'=>$listCurso,
                'description'=>$req->description
            ];
            //Insere dados na base Turma
            Turma::create($turmas);

            return redirect()->route('admin.cadastro.turmas', ['page' => '1']);
        } else {
            return redirect()->route('denied');
        }
    }
    public function edit($id){
        if($this->validade('1')){
            //Direciona para View de edição
            $classroom = true;
            $turmas = Turma::find($id);
            $users = User::find($turmas->user_id);
            $escolas = Escola::all();
            $cursos = Curso::all();
            
            //Efetua relação de cada Modulo e seu respectivo nome e os coloca em um array
            $allmodulos = Modulo::all()->toArray();
            $modulos = array();
            foreach($allmodulos as $modulo){
                $modulos[$modulo['id']] = $modulo['name'];
            }
            //Efetua o controle de valores coletados do campo $turmas->curso_id
            //Escreve um html para marcar os objetos de $tumas->curso_id, separado em ';' e devolve para a View um select já pronto
            $html = '';
            $listCursos = explode(';', $turmas->curso_id);
            foreach($cursos as $objCurso){
                $checked = false;
                foreach($listCursos as $curso){
                    if($curso == $objCurso->id){
                        $html .= '<option value="' . $objCurso->id . '" selected>' . $modulos[$objCurso->modulo_id] . ' - ' . $objCurso->name . '</option>';
                        $checked = true;
                    } elseif($checked)
                        break;
                }
                if(!$checked)
                    $html .= '<option value="' . $objCurso->id . '">' . $modulos[$objCurso->modulo_id] . ' - ' . $objCurso->name . '</option>';
            }
            //returna tudo para a View
            return view('admin.cadastro.turmas.editar', compact('users', 'turmas', 'escolas', 'cursos', 'modulos', 'html', 'classroom'));
        } else {
            return redirect()->route('denied');
        }
    }
    public function update(Request $req, $id){
        if($this->validade('1')){
            //Define os campos enviados que devem ser atualizados no banco
            $users = [
                '_token'=>$req->_token,
                'name'=>$req->name,
                'login'=>$req->login,
                'type'=>1
            ];
            //'password'=>bcrypt($req->password),

            //Insere dados na base Users
            $created = User::find($id)->update($users);

            $school = $req->school_id;
            $school = explode('|', $school, 2);
            $schoolId = $school[0];
            $schoolName = $school[1];
            $listCurso = implode(';', $req->curso_id_list);
            
            //Define os campos enviados que devem ser atualizados no banco
            $turma = [
                '_token'=>$req->_token,
                'name'=>$req->name,
                'school_name'=>$schoolName,
                'school_id'=>$schoolId,
                'curso_id'=>$listCurso,
                'description'=>$req->description
            ];
            //Atualiza base de dados Turma
            Turma::where('user_id', $id)->first()->update($turma);

            return redirect()->route('admin.cadastro.turmas', ['page' => '1']);
        } else {
            return redirect()->route('denied');
        }
    }
    public function delete($id){
        if($this->validade('1')){
            $turmas = Turma::find($id);
            User::find($turmas->user_id)->delete();
            $turmas->delete();
            return redirect()->route('admin.cadastro.turmas', ['page' => '1']);
        } else {
            return redirect()->route('denied');
        }
    }
}

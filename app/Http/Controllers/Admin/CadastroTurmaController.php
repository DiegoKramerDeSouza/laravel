<?php

namespace App\Http\Controllers\Admin;

use Validator;
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
    
    public function __construct()
    {
        $this->pagination = $this->setDefaults()->pagination;
        $this->module = 'Turma';
    }

    /**
     * Validação de permissão de acesso;
     * Coleta todos os usuários de type = 1;
     * Direciona para a View de Listagem de turmas;
     */
    public function index(Request $req){

        if($this->validade($this->module)){
            $turmas = Turma::orderBy('name', 'asc')->paginate($this->pagination);
            $accounts = User::where('type', 1)->get()->toArray();
            $users = array();
            foreach($accounts as $account) $users[$account['id']] = $account['login'];
            $isAutocomplete = true;
            if(isset($req->success)) {
                $success = $this->returnMessages($req, $this->module);
                return view('admin.cadastro.turmas.index', compact('turmas', 'users', 'isAutocomplete', 'success'));
            }
            return view('admin.cadastro.turmas.index', compact('turmas', 'users', 'isAutocomplete'));
        } else {
            return $this->accessDenied();
        }
    }

    /**
     * Validação de permissão de acesso;
     * Coleta dados das bases Escolas, Cursos e Modulos;
     * Direciona para View de novo Cadastro;
     */
    public function add(){

        if($this->validade($this->module)){
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
            
            return $this->accessDenied();
        }
    }

    /**
     * 1. Validação de permissão de acesso;
     * 2. Validação dos campos a gravar;
     * 3. Define os campos enviados que devem ser gravados em Users;
     * 4. Insere na base de dados Users;
     * 5. Define os campos enviados que devem ser atualizados em Trumas;
     * 6. user_id recebe o id criado durante o cadastro do usuário $created;
     * 7. Insere na base de dados Turmas;
     */
    public function save(Request $req){

        if($this->validade($this->module)){
            $validator = Validator::make($req->all(), [
                'name' => 'bail|required|min:4|max:191',
                'login' => 'bail|required|unique:users|min:4|max:191',
                'password' => 'bail|required|min:6|max:20|confirmed',
                'password_confirmation' => ''
            ]);
            if ($validator->fails()) {
                return redirect()->route('admin.cadastro.turmas.adiciona')
                            ->withErrors($validator)
                            ->withInput();
            }
            
            $users = [
                '_token'=>$req->_token,
                'name'=>$req->name,
                'login'=>$req->login,
                'password'=>bcrypt($req->password),
                'type'=>1
            ];
            $created = User::create($users);

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
            Turma::create($turmas);

            return redirect()->route('admin.cadastro.turmas', ['success' => '1']);
        } else {

            return $this->accessDenied();
        }
    }

    /**
     * Validação de permissão de acesso;
     * Coleta dados das bases Turmas, Users, Escolas e Cursos a partir do ID de User;
     * Efetua relação de cada Modulo e seu respectivo nome e os coloca em um array;
     * Efetua o controle de valores coletados do campo $turmas->curso_id;
     * Cria uma listagem de cursos formatando o nome e definindo seu valor;
     * Direciona para View de edição;
     */    
    public function edit($id){

        if($this->validade($this->module)){
            $classroom = true;
            $turmas = Turma::find($id);
            $users = User::find($turmas->user_id);
            $escolas = Escola::all();
            $cursos = Curso::all();

            $allmodulos = Modulo::all()->toArray();
            $modulos = array();
            foreach($allmodulos as $modulo){
                $modulos[$modulo['id']] = $modulo['name'];
            }
            $html = $this->constructCursosList($cursos, $turmas->curso_id, $modulos);

            return view('admin.cadastro.turmas.editar', compact('users', 'turmas', 'escolas', 'cursos', 'modulos', 'html', 'classroom'));
        } else {

            return $this->accessDenied();
        }
    }

    /**
     * 1. Validação de permissão de acesso;
     * 2. Validação dos campos a alterar;
     * 3. Define os campos enviados que devem ser atualizados em Users;
     * 4. Atualiza base de dados Users;
     * 5. Define os campos enviados que devem ser atualizados em Turmas;
     * 6. Atualiza base de dados Turmas;
     */
    public function update(Request $req, $id){

        if($this->validade($this->module)){
            $userId = Turma::where('user_id', $id)->first();
            $validator = Validator::make($req->all(), [
                'name' => 'bail|required|min:4|max:191',
                'login' => 'bail|required|unique:users,login,' . $id . '|min:4|max:191'
            ]);
            if ($validator->fails()) {
                return redirect()->route('admin.cadastro.turmas.edita', $userId->id)
                            ->withErrors($validator)
                            ->withInput();
            }
            
            $users = [
                '_token'=>$req->_token,
                'name'=>$req->name,
                'login'=>$req->login,
                'type'=>1
            ];
            $created = User::find($id)->update($users);

            $school = $req->school_id;
            $school = explode('|', $school, 2);
            $schoolId = $school[0];
            $schoolName = $school[1];
            $listCurso = implode(';', $req->curso_id_list);
            
            $turma = [
                '_token'=>$req->_token,
                'name'=>$req->name,
                'school_name'=>$schoolName,
                'school_id'=>$schoolId,
                'curso_id'=>$listCurso,
                'description'=>$req->description
            ];
            Turma::where('user_id', $id)->first()->update($turma);

            return redirect()->route('admin.cadastro.turmas', ['success' => '2']);
        } else {

            return $this->accessDenied();
        }
    }

    /**
     * Validação de permissão de acesso;
     * Deleta ID informado na base Users e em sequência em Turmas;
     */
    public function delete($id){

        if($this->validade($this->module)){
            $turmas = Turma::find($id);
            User::find($turmas->user_id)->delete();
            //$turmas->delete();
            return redirect()->route('admin.cadastro.turmas', ['success' => '3']);
        } else {

            return $this->accessDenied();
        }
    }

    /**
     * Define lista de cursos para ser construída na View
     */
    private function constructCursosList($cursos, $cursosIds, $modulos){

        $arrCursos = array();
        $listCursos = explode(';', $cursosIds);
        foreach($cursos as $curso){
            $checked = false;
            foreach($listCursos as $cursoId){
                if($curso->id == $cursoId) $checked = true;
                elseif($checked) break;
            }
            $targetName = $modulos[$curso->modulo_id] . ' - ' . $curso->name;
            array_push($arrCursos, ["id" => $curso->id, "name" => $targetName, "selected" => $checked]);
        }
        return $arrCursos;
    }
}

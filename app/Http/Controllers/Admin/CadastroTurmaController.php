<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\User;
use App\Escola;
use App\Turma;
use App\Curso;
use App\Modulo;

class CadastroTurmaController extends Controller
{
    public function index($page){
        //Paginação dos valores coletados na entidade Turmas
        $turmas = Turma::paginate(10);
        $escolas = Escola::all();
        $accounts = User::where('type', 1)->get()->toArray();
        $users = array();
        foreach($accounts as $account){
            $users[$account['id']] = $account['login'];
        }

        //Construção da paginação personalizada
        $prev = $page-1;
        $next = $page+1;
        $last = $turmas->lastPage();
        $paginate = '';
        if($page == 1){
            $paginate .= '<li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>';
        } else {
            $paginate .= '<li class="waves-effect waves-teal"><a href="http://localhost/admin/cadastro/turmas/p' . $prev . '?page=' . $prev . '"><i class="material-icons">chevron_left</i></a></li>';
        }
        for($i = 1; $i<=$last; $i++){
            if($i == $page){
                $paginate .= '<li class="active blue white-text"><a>' . $i . '</a></li>';
            } else {
                $paginate .= '<li class="waves-effect waves-teal"><a href="http://localhost/admin/cadastro/turmas/p' . $i . '?page=' . $i . '">' . $i . '</a></li>';
            }
        }
        if($page == $last){
            $paginate .= '<li class="disabled"><a href="#!"><i class="material-icons">chevron_right</i></a></li>';
        } else {
            $paginate .= '<li class="waves-effect waves-teal"><a href="http://localhost/admin/cadastro/turmas/p' . $next . '?page=' . $next . '"><i class="material-icons">chevron_right</i></a></li>';
        }

        return view('admin.cadastro.turmas.index', compact('turmas', 'users', 'paginate'));
    }
    public function add(){
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
    }
    public function save(Request $req){
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
        $turmas = [
            '_token'=>$req->_token,
            'name'=>$req->name,
            'user_id'=>$created->id,
            'school_name'=>$schoolName,
            'login'=>$req->login,
            'password'=>bcrypt($req->password),
            'school_id'=>$schoolId,
            'curso_id'=>$req->curso_id,
            'description'=>$req->description
        ];
        //Insere dados na base Turma
        Turma::create($turmas);

        return redirect()->route('admin.cadastro.turmas', ['page' => '1']);
    }
    public function edit($id){
        //Direciona para View de edição
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

        return view('admin.cadastro.turmas.editar', compact('users', 'turmas', 'escolas', 'cursos', 'modulos', 'html', 'classroom'));
    }
    public function update(Request $req, $id){
        //Define os campos enviados que devem ser atualizados no banco
        $users = [
            '_token'=>$req->_token,
            'name'=>$req->name,
            'login'=>$req->login,
            'password'=>bcrypt($req->password),
            'type'=>1
        ];
        //Insere dados na base Users
        $created = User::find($id)->update($users);

        $school = $req->school_id;
        $school = explode('|', $school, 2);
        $schoolId = $school[0];
        $schoolName = $school[1];
        //Define os campos enviados que devem ser atualizados no banco
        $turma = [
            '_token'=>$req->_token,
            'name'=>$req->name,
            'school_name'=>$schoolName,
            'school_id'=>$schoolId,
            'curso_id'=>$req->curso_id,
            'description'=>$req->description
        ];
        //Atualiza base de dados Turma
        Turma::where('user_id', $id)->first()->update($turma);

        return redirect()->route('admin.cadastro.turmas', ['page' => '1']);
    }
    public function delete($id){
        $turmas = Turma::find($id);
        User::find($turmas->user_id)->delete();
        $turmas->delete();
        return redirect()->route('admin.cadastro.turmas', ['page' => '1']);
    }
}

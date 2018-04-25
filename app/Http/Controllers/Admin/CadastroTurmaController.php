<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Escola;
use App\Turma;
use App\Curso;

class CadastroTurmaController extends Controller
{
    public function index($page){
        //Paginação dos valores coletados na entidade Turmas
        $turmas = Turma::paginate(10);
        $escolas = Escola::all();

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

        return view('admin.cadastro.turmas.index', compact('turmas', 'paginate'));
    }
    public function add(){
        //Coleta todas as escolas cadastradas
        $escolas = Escola::all();
        $cursos = Curso::all();
        return view('admin.cadastro.turmas.adicionar', compact('escolas', 'cursos'));
    }
    public function save(Request $req){
        //Define os campos enviados que devem ser gravados no banco
        $school = $req->school_id;
        $school = explode('|', $school, 2);
        $schoolId = $school[0];
        $schoolName = $school[1];
        $turmas = [
            '_token'=>$req->_token,
            'name'=>$req->name,
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
        $turmas = Turma::find($id);
        $escolas = Escola::all();
        return view('admin.cadastro.turmas.editar', compact('turmas', 'escolas'));
    }
    public function update(Request $req, $id){
        $school = $req->school_id;
        $school = explode('|', $school, 2);
        $schoolId = $school[0];
        $schoolName = $school[1];
        //Define os campos enviados que devem ser atualizados no banco
        $turma = [
            '_token'=>$req->_token,
            'name'=>$req->name,
            'school_name'=>$schoolName,
            'login'=>$req->login,
            'password'=>bcrypt($req->password),
            'school_id'=>$schoolId,
            'curso_id'=>$req->curso_id,
            'description'=>$req->description
        ];
        //Atualiza base de dados Turma
        Turma::find($id)->update($turma);
        return redirect()->route('admin.cadastro.turmas', ['page' => '1']);
    }
    public function delete($id){
        Turma::find($id)->delete();
        return redirect()->route('admin.cadastro.turmas', ['page' => '1']);
    }
}

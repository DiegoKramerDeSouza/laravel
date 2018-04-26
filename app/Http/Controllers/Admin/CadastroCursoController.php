<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Curso;
use App\Modulo;

class CadastroCursoController extends Controller
{
    public function index($page){
        //Paginação dos valores coletados na entidade Cursos
        $cursos = Curso::paginate(10);
        $allmodulos = Modulo::all()->toArray();
        $modulos = array();
        foreach($allmodulos as $modulo){
            $modulos[$modulo['id']] = $modulo['name'];
        }
        //Construção da paginação personalizada
        $prev = $page-1;
        $next = $page+1;
        $last = $cursos->lastPage();
        $paginate = '';
        if($page == 1){
            $paginate .= '<li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>';
        } else {
            $paginate .= '<li class="waves-effect waves-teal"><a href="http://localhost/admin/cadastro/cursos/p' . $prev . '?page=' . $prev . '"><i class="material-icons">chevron_left</i></a></li>';
        }
        for($i = 1; $i<=$last; $i++){
            if($i == $page){
                $paginate .= '<li class="active blue white-text"><a>' . $i . '</a></li>';
            } else {
                $paginate .= '<li class="waves-effect waves-teal"><a href="http://localhost/admin/cadastro/cursos/p' . $i . '?page=' . $i . '">' . $i . '</a></li>';
            }
        }
        if($page == $last){
            $paginate .= '<li class="disabled"><a href="#!"><i class="material-icons">chevron_right</i></a></li>';
        } else {
            $paginate .= '<li class="waves-effect waves-teal"><a href="http://localhost/admin/cadastro/cursos/p' . $next . '?page=' . $next . '"><i class="material-icons">chevron_right</i></a></li>';
        }

        return view('admin.cadastro.cursos.index', compact('cursos', 'modulos', 'paginate'));
    }
    public function add(){
        //Coleta todos cursos cadastrados
        $cursos = Curso::all();
        $modulos = Modulo::all();
        return view('admin.cadastro.cursos.adicionar', compact('cursos', 'modulos'));
    }
    public function save(Request $req){
        //Define os campos enviados que devem ser gravados no banco
        $cursos = [
            '_token'=>$req->_token,
            'name'=>$req->name,
            'modulo_id'=>$req->modulo_id
        ];
        //Insere dados na base Turma
        Curso::create($cursos);
        return redirect()->route('admin.cadastro.cursos', ['page' => '1']);
    }
    public function edit($id){
        //Direciona para View de edição
        $cursos = Curso::find($id);
        $modulos = Modulo::all();
        return view('admin.cadastro.cursos.editar', compact('cursos', 'modulos'));
    }
    public function update(Request $req, $id){
        //Define os campos enviados que devem ser atualizados no banco
        $cursos = [
            '_token'=>$req->_token,
            'name'=>$req->name,
            'modulo_id'=>$req->modulo_id
        ];
        //Atualiza base de dados Turma
        Curso::find($id)->update($cursos);
        return redirect()->route('admin.cadastro.cursos', ['page' => '1']);
    }
    public function delete($id){
        Curso::find($id)->delete();
        return redirect()->route('admin.cadastro.cursos', ['page' => '1']);
    }
}

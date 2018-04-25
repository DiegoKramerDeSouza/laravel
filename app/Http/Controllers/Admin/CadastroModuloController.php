<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Modulo;

class CadastroModuloController extends Controller
{
    public function index($page){
        //Paginação dos valores coletados na entidade Modulos
        $modulos = Modulo::paginate(10);

        //Construção da paginação personalizada
        $prev = $page-1;
        $next = $page+1;
        $last = $modulos->lastPage();
        $paginate = '';
        if($page == 1){
            $paginate .= '<li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>';
        } else {
            $paginate .= '<li class="waves-effect waves-teal"><a href="http://localhost/admin/cadastro/modulos/p' . $prev . '?page=' . $prev . '"><i class="material-icons">chevron_left</i></a></li>';
        }
        for($i = 1; $i<=$last; $i++){
            if($i == $page){
                $paginate .= '<li class="active blue white-text"><a>' . $i . '</a></li>';
            } else {
                $paginate .= '<li class="waves-effect waves-teal"><a href="http://localhost/admin/cadastro/modulos/p' . $i . '?page=' . $i . '">' . $i . '</a></li>';
            }
        }
        if($page == $last){
            $paginate .= '<li class="disabled"><a href="#!"><i class="material-icons">chevron_right</i></a></li>';
        } else {
            $paginate .= '<li class="waves-effect waves-teal"><a href="http://localhost/admin/cadastro/modulos/p' . $next . '?page=' . $next . '"><i class="material-icons">chevron_right</i></a></li>';
        }

        return view('admin.cadastro.modulos.index', compact('paginate', 'modulos'));
    }
    public function add(){
        //Coleta todas os modulos cadastrados
        $modulos = Modulo::all();
        return view('admin.cadastro.modulos.adicionar', compact('modulos'));
    }
    public function save(Request $req){
        //Define os campos enviados que devem ser gravados no banco
        $modulos = [
            '_token'=>$req->_token,
            'name'=>$req->name
        ];
        //Insere dados na base Turma
        Modulo::create($modulos);
        return redirect()->route('admin.cadastro.modulos', ['page' => '1']);
    }
    public function edit($id){
        //Direciona para View de edição
        $modulos = Modulo::find($id);
        return view('admin.cadastro.modulos.editar', compact('modulos'));
    }
    public function update(Request $req, $id){
        //Define os campos enviados que devem ser atualizados no banco
        $modulos = [
            '_token'=>$req->_token,
            'name'=>$req->name
        ];
        //Atualiza base de dados Turma
        Modulo::find($id)->update($modulos);
        return redirect()->route('admin.cadastro.modulos', ['page' => '1']);
    }
    public function delete($id){
        Modulo::find($id)->delete();
        return redirect()->route('admin.cadastro.modulos', ['page' => '1']);
    }
}

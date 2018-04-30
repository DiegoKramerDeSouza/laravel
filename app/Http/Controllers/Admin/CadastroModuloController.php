<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\EspecialMethods;
use App\Modulo;

class CadastroModuloController extends Controller
{
    use EspecialMethods;

    public function index($page){
        if($this->validade('2')){
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
}

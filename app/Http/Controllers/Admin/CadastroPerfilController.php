<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Perfil;
use App\Componente;

class CadastroPerfilController extends Controller
{
    public function index($page){
        //Paginação dos valores coletados na entidade Perfils
        $perfis = Perfil::paginate(10);
        //Construção da paginação personalizada
        $prev = $page-1;
        $next = $page+1;
        $last = $perfis->lastPage();
        $paginate = '';
        if($page == 1){
            $paginate .= '<li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>';
        } else {
            $paginate .= '<li class="waves-effect waves-teal"><a href="http://localhost/admin/cadastro/perfis/p' . $prev . '?page=' . $prev . '"><i class="material-icons">chevron_left</i></a></li>';
        }
        for($i = 1; $i<=$last; $i++){
            if($i == $page){
                $paginate .= '<li class="active blue white-text"><a>' . $i . '</a></li>';
            } else {
                $paginate .= '<li class="waves-effect waves-teal"><a href="http://localhost/admin/cadastro/perfis/p' . $i . '?page=' . $i . '">' . $i . '</a></li>';
            }
        }
        if($page == $last){
            $paginate .= '<li class="disabled"><a href="#!"><i class="material-icons">chevron_right</i></a></li>';
        } else {
            $paginate .= '<li class="waves-effect waves-teal"><a href="http://localhost/admin/cadastro/perfis/p' . $next . '?page=' . $next . '"><i class="material-icons">chevron_right</i></a></li>';
        }

        return view('admin.cadastro.perfis.index', compact('perfis', 'paginate'));
    }
    public function add(){
        //Coleta todos perfis cadastrados
        $grant = true;
        $perfis = Perfil::all();
        $componentes = Componente::all();
        return view('admin.cadastro.perfis.adicionar', compact('perfis', 'grant', 'componentes'));
    }
    public function save(Request $req){
        //Define os campos enviados que devem ser gravados no banco
        $perfis = [
            '_token'=>$req->_token,
            'name'=>$req->name,
            'grant'=>$req->grant,
            'description'=>$req->description
        ];
        //Insere dados na base Perfils
        Perfil::create($perfis);
        return redirect()->route('admin.cadastro.perfis', ['page' => '1']);
    }
    public function edit($id){
        //Direciona para View de edição
        $grant = true;
        $perfis = Perfil::find($id);
        if($perfis->grant != '0'){
            $componentes = Componente::all()->toArray();
            $granted = explode(';', $perfis->grant);
            $html = '';
            foreach($componentes as $tag){
                $checked = false;
                foreach($granted as $allow){
                    if($tag['id'] == $allow){
                        $html .= '<option value="' . $tag['id'] . '" selected>' . $tag['name'] . '</option>';
                        $checked = true;
                    } elseif($checked)
                        break;
                }
                if(!$checked)
                    $html .= '<option value="' . $tag['id'] . '">' . $tag['name'] . '</option>';
            }
            return view('admin.cadastro.perfis.editar', compact('perfis', 'grant', 'html'));
        } else {
            $componentes = Componente::all();
            return view('admin.cadastro.perfis.editar', compact('perfis', 'grant', 'componentes'));
        }
    }
    public function update(Request $req, $id){
        //Define os campos enviados que devem ser atualizados no banco
        $perfis = [
            '_token'=>$req->_token,
            'name'=>$req->name,
            'grant'=>$req->grant,
            'description'=>$req->description
        ];
        //Atualiza base de dados Turma
        Perfil::find($id)->update($perfis);
        return redirect()->route('admin.cadastro.perfis', ['page' => '1']);
    }
    public function delete($id){
        Perfil::find($id)->delete();
        return redirect()->route('admin.cadastro.perfis', ['page' => '1']);
    }
}

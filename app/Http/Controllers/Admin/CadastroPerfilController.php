<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\EspecialMethods;
use App\Perfil;
use App\Componente;

class CadastroPerfilController extends Controller
{
    use EspecialMethods;

    public function index($page){
        if($this->validade('6')){
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
        } else {
            return redirect()->route('denied');
        }
    }
    public function add(){
        if($this->validade('6')){
            //Coleta todos perfis cadastrados
            $grant = true;
            $perfis = Perfil::all();
            $componentes = Componente::all();
            return view('admin.cadastro.perfis.adicionar', compact('perfis', 'grant', 'componentes'));
        } else {
            return redirect()->route('denied');
        }
    }
    public function save(Request $req){
        if($this->validade('6')){
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
        } else {
            return redirect()->route('denied');
        }
    }
    public function edit($id){
        if($this->validade('6')){
            //Direciona para View de edição
            $grant = true;
            $perfis = Perfil::find($id);
            //Efetua o controle de valores coletados do campo $perfis->grant
            //Escreve um html para marcar os objetos de $perfis->grant, separado em ';' e devolve para a View um select já pronto
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
                //returna tudo para a View caso a lista de permissões de $perfis->grant seja diferente de '0'
                return view('admin.cadastro.perfis.editar', compact('perfis', 'grant', 'html'));
            } else {
                $componentes = Componente::all();
                //returna tudo para a View caso $perfis->grant seja igual a '0'
                return view('admin.cadastro.perfis.editar', compact('perfis', 'grant', 'componentes'));
            }
        } else {
            return redirect()->route('denied');
        }
    }
    public function update(Request $req, $id){
        if($this->validade('6')){
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
        } else {
            return redirect()->route('denied');
        }
    }
    public function delete($id){
        if($this->validade('6')){
            Perfil::find($id)->delete();
            return redirect()->route('admin.cadastro.perfis', ['page' => '1']);
        } else {
            return redirect()->route('denied');
        }
    }
}

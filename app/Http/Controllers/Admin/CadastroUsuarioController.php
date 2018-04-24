<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\User;
use App\UserDado;
use App\Escola;

class CadastroUsuarioController extends Controller
{
    public function index($page){
        $users = User::paginate(10);
        $escolas = Escola::all();

        //Construção da paginação personalizada
        $prev = $page-1;
        $next = $page+1;
        $last = $users->lastPage();
        $paginate = '';
        if($page == 1){
            $paginate .= '<li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>';
        } else {
            $paginate .= '<li class="waves-effect waves-teal"><a href="http://localhost/admin/cadastro/usuarios/p' . $prev . '?page=' . $prev . '"><i class="material-icons">chevron_left</i></a></li>';
        }
        for($i = 1; $i<=$last; $i++){
            if($i == $page){
                $paginate .= '<li class="active blue white-text"><a href="#">' . $i . '</a></li>';
            } else {
                $paginate .= '<li class="waves-effect waves-teal"><a href="http://localhost/admin/cadastro/usuarios/p' . $i . '?page=' . $i . '">' . $i . '</a></li>';
            }
        }
        if($page == $last){
            $paginate .= '<li class="disabled"><a href="#!"><i class="material-icons">chevron_right</i></a></li>';
        } else {
            $paginate .= '<li class="waves-effect waves-teal"><a href="http://localhost/admin/cadastro/usuarios/p' . $next . '?page=' . $next . '"><i class="material-icons">chevron_right</i></a></li>';
        }

        //Habilita uma view a receber e enviar dados via WEBRTC
        //$streamPage = true; 
        return view('admin.cadastro.usuarios.index', compact('users', 'paginate'));
    }
    public function add(){
        //Coleta todas as escolas cadastradas
        $escolas = Escola::all();
        return view('admin.cadastro.usuarios.adicionar', compact('escolas'));
    }
    public function save(Request $req){
        if(User::where('email', $req->email)->count() == 0){
            //Define os campos enviados que devem ser gravados no banco
            $user = [
                '_token'=>$req->_token,
                'name'=>$req->name,
                'email'=>$req->email,
                'password'=>bcrypt($req->password)
            ];
            //IMAGENS--------------------------------
            //Coleta todos os dados recebidos
            $data = $req->all();
            //Tratamento de imagem. Se necessário
            if(isset($data->imagem)){
                if($req->hasfile("imagem")){
                    $img = $req->file('imagem');
                    $num = rand(1111,9999);
                    $dir = 'img/users/';
                    $ext = $img->guessClientExtension();
                    $imgName = 'IMG' . $num . "." . $ext;
                    $img->move('$dir', $imgName);
                    $data["imagem"] = $dir . "/" . $imgName;
                }
            }
            //---------------------------------------
            //Insere dados na base User
            $created = User::create($user);
            //Define os campos enviados que devem ser criados no banco
            //user_id recebe o id criado durante o cadastro do usuário $created
            $userdata = [
                '_token'=>$req->_token,
                'user_id'=>$created->id,
                'school_id'=>$req->school_id,
                'group'=>$req->group
            ];
            //Insere dados na base UserDados
            UserDado::create($userdata);
            return redirect()->route('admin.cadastro.usuarios', ['page' => '1']);
        } else {
            echo "<h4>O endereço de e-mail " . $req->email . " já encontra-se cadastrado!</h4>";
        }
    }
    public function edit($id){
        //Direciona para View de edição
        $user = User::find($id);
        $userdata = UserDado::where('user_id', $id)->first();
        $escolas = Escola::all();
        return view('admin.cadastro.usuarios.editar', compact('user', 'userdata', 'escolas'));
    }
    public function update(Request $req, $id){
        //Define os campos enviados que devem ser atualizados no banco
        $user = [
            '_token'=>$req->_token,
            'name'=>$req->name,
            'email'=>$req->email,
        ];
        //Atualiza base de dados Users
        User::find($id)->update($user);
        //Define os campos enviados que devem ser atualizados no banco
        $userdata = [
            '_token'=>$req->_token,
            'school_id'=>$req->school_id,
            'group'=>$req->group
        ];
        //Atualiza base de dados UserDados
        UserDado::where('user_id', $id)->first()->update($userdata);
        return redirect()->route('admin.cadastro.usuarios', ['page' => '1']);
    }
    public function delete($id){
        User::find($id)->delete();
        UserDado::where('user_id', $id)->first()->delete();
        return redirect()->route('admin.cadastro.usuarios', ['page' => '1']);
    }
}

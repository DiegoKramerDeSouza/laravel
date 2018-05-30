<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\EspecialMethods;
use App\User;
use App\UserDado;
use App\Escola;
use App\Perfil;

class CadastroUsuarioController extends Controller
{
    use EspecialMethods;

    public function index(){
        if($this->validade('5')){
            $users = User::where('type', 0)->orderBy('name', 'asc')->paginate(5);
            return view('admin.cadastro.usuarios.index', compact('users'));
        } else {
            return redirect()->route('denied');
        }
    }
    public function add(){
        if($this->validade('5')){
            //Coleta todas as escolas cadastradas
            $escolas = Escola::all();
            $perfis = Perfil::all();
            return view('admin.cadastro.usuarios.adicionar', compact('escolas', 'perfis'));
        } else {
            return redirect()->route('denied');
        }
    }
    public function save(Request $req){
        if($this->validade('5')){
            if(User::where('email', $req->email)->count() == 0){
                //Define os campos enviados que devem ser gravados no banco
                $user = [
                    '_token'=>$req->_token,
                    'name'=>$req->name,
                    'login'=>$req->login,
                    'email'=>$req->email,
                    'password'=>bcrypt($req->password),
                    'type'=>0
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
                    'group'=>$req->group
                ];
                //Insere dados na base UserDados
                UserDado::create($userdata);
                return redirect()->route('admin.cadastro.usuarios', ['page' => '1']);
            } else {
                echo "<h4>O endereço de e-mail " . $req->email . " já encontra-se cadastrado!</h4>";
            }
        } else {
            return redirect()->route('denied');
        }
    }
    public function edit($id){
        if($this->validade('5')){
            //Direciona para View de edição
            $user = User::find($id);
            $userdata = UserDado::where('user_id', $id)->first();
            $escolas = Escola::all();
            $perfis = Perfil::all();
            return view('admin.cadastro.usuarios.editar', compact('user', 'userdata', 'escolas', 'perfis'));
        } else {
            return redirect()->route('denied');
        }
    }
    public function update(Request $req, $id){
        if($this->validade('5')){
            //Define os campos enviados que devem ser atualizados no banco
            $user = [
                '_token'=>$req->_token,
                'name'=>$req->name,
                'login'=>$req->login,
                'email'=>$req->email,
                'type'=>0
            ];
            //Atualiza base de dados Users
            User::find($id)->update($user);
            //Define os campos enviados que devem ser atualizados no banco
            $userdata = [
                '_token'=>$req->_token,
                'group'=>$req->group
            ];
            //Atualiza base de dados UserDados
            UserDado::where('user_id', $id)->first()->update($userdata);
            return redirect()->route('admin.cadastro.usuarios', ['page' => '1']);
        } else {
            return redirect()->route('denied');
        }
    }
    public function delete($id){
        if($this->validade('5')){
            User::find($id)->delete();
            UserDado::where('user_id', $id)->first()->delete();
            return redirect()->route('admin.cadastro.usuarios', ['page' => '1']);
        } else {
            return redirect()->route('denied');
        }
    }
}

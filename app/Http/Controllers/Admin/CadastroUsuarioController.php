<?php

namespace App\Http\Controllers\Admin;

use Validator;
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
            $resultToString = true;
            return view('admin.cadastro.usuarios.index', compact('users', 'resultToString'));
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
            // Validação dos campos
            $validator = Validator::make($req->all(), [
                'name' => 'bail|required|min:4|max:191',
                'login' => 'bail|required|unique:users|min:4|max:191',
                'email' => 'bail|required|unique:users|email|max:191',
                'password' => 'bail|required|min:6|max:20|confirmed',
                'password_confirmation' => '',
                'group' => 'required'
            ]);
            if ($validator->fails()) {
                return redirect()->route('admin.cadastro.usuarios.adiciona')
                            ->withErrors($validator)
                            ->withInput();
            }
            
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
            // Validação dos campos
            $validator = Validator::make($req->all(), [
                'name' => 'bail|required|min:4|max:191',
                'login' => 'bail|required|unique:users,login,' . $id . '|min:4|max:191',
                'email' => 'bail|required|unique:users,email,' . $id . '|email|max:191',
                'group' => 'required'
            ]);
            if ($validator->fails()) {
                return redirect()->route('admin.cadastro.usuarios.edita', $id)
                            ->withErrors($validator)
                            ->withInput();
            }
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

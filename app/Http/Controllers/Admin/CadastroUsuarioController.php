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
    
    public function __construct()
    {
        $this->pagination = $this->setDefaults()->pagination;
        $this->module = 'User';
    }

    /**
     * Validação de permissão de acesso;
     * Coleta todos os usuários de type = 0;
     * Direciona para a View de Listagem de usuários;
     */
    public function index(Request $req){
        
        if($this->validade($this->module)){
            $resultado = User::where('type', 0)->orderBy('name', 'asc')->paginate($this->pagination);
            $isAutocomplete = true;
            if(isset($req->success)) {
                $success = $this->returnMessages($req, $this->module);
                return view('admin.cadastro.usuarios.index', compact('resultado', 'isAutocomplete', 'success'));
            }
            return view('admin.cadastro.usuarios.index', compact('resultado', 'isAutocomplete'));
        } else {
            return $this->accessDenied();
        }
    }

    /**
     * Validação de permissão de acesso;
     * Coleta dados das bases Escolas e Perfis a partir do ID de User;
     * Direciona para View de novo Cadastro;
     */
    public function add(){

        if($this->validade($this->module)){
            $escolas = Escola::all();
            $perfis = Perfil::all();
            return view('admin.cadastro.usuarios.adicionar', compact('escolas', 'perfis'));
        } else {
            return $this->accessDenied();
        }
    }

    /**
     * 1. Validação de permissão de acesso;
     * 2. Validação dos campos a gravar;
     * 3. Define os campos enviados que devem ser gravados em Users;
     * 4. Insere na base de dados Users;
     * 5. Define os campos enviados que devem ser atualizados em UserDados;
     * 6. user_id recebe o id criado durante o cadastro do usuário $created;
     * 7. Insere na base de dados UserDados;
     */
    public function save(Request $req){

        if($this->validade($this->module)){
            $validator = Validator::make($req->all(), [
                'name' => 'bail|required|min:4|max:191',
                'login' => 'bail|required|unique:users|min:4|max:191',
                'email' => 'bail|required|unique:users|email|max:191',
                'password' => 'bail|required|min:6|max:20|confirmed',
                'password_confirmation' => ''
            ]);
            if ($validator->fails()) {
                return redirect()->route('admin.cadastro.usuarios.adiciona')
                            ->withErrors($validator)
                            ->withInput();
            }
            
            $user = [
                '_token'=>$req->_token,
                'name'=>$req->name,
                'login'=>$req->login,
                'email'=>$req->email,
                'password'=>bcrypt($req->password),
                'type'=>0
            ];
            $created = User::create($user);
            
            $userdata = [
                '_token'=>$req->_token,
                'user_id'=>$created->id,
                'perfils_id'=>$req->group
            ];
            UserDado::create($userdata);

            return redirect()->route('admin.cadastro.usuarios', ['success' => '1']);
        } else {

            return $this->accessDenied();
        }
    }

    /**
     * Validação de permissão de acesso;
     * Coleta dados das bases UserData, Escolas e Perfis a partir do ID de User;
     * Direciona para View de edição;
     */
    public function edit($id){

        if($this->validade($this->module)){
            $resultado = User::find($id);
            $userdata = UserDado::where('user_id', $id)->first();
            $escolas = Escola::all();
            $perfis = Perfil::all();
            return view('admin.cadastro.usuarios.editar', compact('resultado', 'userdata', 'escolas', 'perfis'));
        } else {

            return $this->accessDenied();
        }
    }

    /**
     * 1. Validação de permissão de acesso;
     * 2. Validação dos campos a alterar;
     * 3. Define os campos enviados que devem ser atualizados em Users;
     * 4. Atualiza base de dados Users;
     * 5. Define os campos enviados que devem ser atualizados em UserDados;
     * 6. Atualiza base de dados UserDados;
     */
    public function update(Request $req, $id){

        if($this->validade($this->module)){
            $validator = Validator::make($req->all(), [
                'name' => 'bail|required|min:4|max:191',
                'login' => 'bail|required|unique:users,login,' . $id . '|min:4|max:191',
                'email' => 'bail|required|unique:users,email,' . $id . '|email|max:191'
            ]);
            if ($validator->fails()) {
                return redirect()->route('admin.cadastro.usuarios.edita', $id)
                            ->withErrors($validator)
                            ->withInput();
            }

            $user = [
                '_token'=>$req->_token,
                'name'=>$req->name,
                'login'=>$req->login,
                'email'=>$req->email,
                'type'=>0
            ];
            User::find($id)->update($user);

            $userdata = [
                '_token'=>$req->_token,
                'perfils_id'=>$req->group
            ];
            UserDado::where('user_id', $id)->first()->update($userdata);

            return redirect()->route('admin.cadastro.usuarios', ['success' => '2']);
        } else {

            return $this->accessDenied();
        }
    }

    /**
     * Validação de permissão de acesso;
     * Deleta ID informado na base User e em sequência em UserDado;
     */
    public function delete($id){

        if($this->validade($this->module)){
            User::find($id)->delete();
            //UserDado::where('user_id', $id)->first()->delete();
            return redirect()->route('admin.cadastro.usuarios', ['success' => '3']);
        } else {

            return $this->accessDenied();
        }
    }

}

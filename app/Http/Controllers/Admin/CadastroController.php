<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use App\UserDado;
use App\Escola;

class CadastroController extends Controller
{
    public function index(){
        $users = User::all();
        $escolas = Escola::all();
        //Habilita uma view a receber e enviar dados via WEBRTC
        //$streamPage = true;    
        return view('admin.cadastro.index', compact('users'));
    }
    public function add(){
        $escolas = Escola::all();
        return view('admin.cadastro.adicionar', compact('escolas'));
    }
    public function save(Request $req){
        //Define os campos enviados que devem ser gravados no banco
        $user = [
            '_token'=>$req->_token,
            'name'=>$req->name,
            'email'=>$req->email,
            'password'=>$req->password
        ];

        $data = $req->all();
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
        $created = User::create($user);

        $userdata = [
            '_token'=>$req->_token,
            'user_id'=>$created->id,
            'escola_id'=>$req->escola_id,
            'group'=>$req->group
        ];
        UserDado::create($userdata);
        return redirect()->route('admin.cadastro');
        
    }
    public function edit($id){
        //Direciona para View de edição
        $user = User::find($id);
        $userdata = UserDado::where('user_id', $id)->first();
        $escolas = Escola::all();
        return view('admin.cadastro.editar', compact('user', 'userdata', 'escolas'));
    }
    public function update(Request $req, $id){
        //Define os campos enviados que devem ser atualizados no banco
        $user = [
            '_token'=>$req->_token,
            'name'=>$req->name,
            'email'=>$req->email,
        ];
        //Tratamento de imagem. Caso necessário
        $data = $req->all();
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
        //Atualiza base de dados Users
        User::find($id)->update($user);

        $userdata = [
            '_token'=>$req->_token,
            'escola_id'=>$req->escola_id,
            'group'=>$req->group
        ];
        //Atualiza base de dados UserDados
        UserDado::where('user_id', $id)->first()->update($userdata);
        return redirect()->route('admin.cadastro');
    }
    public function delete(){
        //
    }
}

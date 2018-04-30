<?php
namespace App\Traits;

use Auth;
use App\UserDado;
use App\Perfil;
use App\Common;

//Traits para reutilização de métodos e funções criadas para o projeto

trait EspecialMethods{

    public function validade($id){
        //dd(Auth::user()->type);
        if(Auth::user()->type == 0){
            $userid = Auth::user()->id;
            $userGroup = UserDado::where('user_id', $userid)->first();
            $access = Perfil::find($userGroup->group);
            if(strpos($access->grant, $id) !== false){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }    
    }
    public function validadeCadastro($userid){
        $dados = UserDado::where('user_id', $userid)->first();
        $granted = Perfil::find($dados->group);
        if(strpos($granted->grant, '0') !== false){
            return false;
        } else {
            return true;
        }
    }
}


?>
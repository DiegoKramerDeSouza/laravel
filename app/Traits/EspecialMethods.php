<?php
namespace App\Traits;

use Auth;
use App\UserDado;
use App\Perfil;
use App\Common;
use App\Componente;

/**
 * Traits para reutilização de métodos criadas para os acessos administrativos;
 */

trait EspecialMethods{

    /**
     * Coleta o ID do componente que está sendo acessado;
     */
    public function getComponentId($module){

        $moduleId = Componente::where('model', $module)->first();
        return $moduleId->id;
    }

    /**
     * Valida o componente acessado com as permissões do usuário;
     */
    public function validade($module){

        $id = $this->getComponentId($module);
        if(Auth::user()->type == 0){
            $userid = Auth::user()->id;
            $userGroup = UserDado::where('user_id', $userid)->first();
            $access = Perfil::find($userGroup->group);
            if(strpos($access->grant, "$id") !== false){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }    
    }
    
    /**
     * Verifica o tipo de acesso do usuário;
     */
    public function adminAccess($userid){

        $dados = UserDado::where('user_id', $userid)->first();
        $granted = Perfil::find($dados->group);
        return $granted->grant;
    }

    /**
     * Redirecionamento para página de acesso negado;
     */
    public function accessDenied(){

        return redirect()->route('denied');
    }
}


?>
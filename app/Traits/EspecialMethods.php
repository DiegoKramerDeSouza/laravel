<?php
namespace App\Traits;

use Auth;
use App\UserDado;
use App\Perfil;
use App\Common;
use App\Componente;
use App\DefaultConfig;
use App\DefaultMessages;
use App\Perfils_has_componente;

/**
 * Traits para reutilização de métodos criadas para os acessos administrativos;
 * Acessível para todos os Controllers
 */

trait EspecialMethods{

    private $arrayChamada = [];

    /**
     * Carrega definições básicas de configuração da aplicação
     */
    public function setDefaults(){

        $config = new DefaultConfig();
        return $config;
    }

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
            $finding = Perfils_has_componente::where('perfils_id', $access->id)
                                            ->where('componentes_id', $id)->count();
            if($finding > 0) return true;
            //if(strpos($access->grant, "$id") !== false) return true; 
            else return false;
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
        $finding = Perfils_has_componente::where('perfils_id', $granted->id)->count();
        return $finding;
    }

    /**
     * Redirecionamento para página de acesso negado;
     */
    public function accessDenied(){

        return redirect()->route('denied');
    }

    /**
     * Trata mensagem de retorno de operações de banco
     */
    public function returnMessages($req, $target){

        if(isset($req->success)) {
            $message = new DefaultMessages();
            if($req->success == '1') $msg = $message->created[$target];
            elseif($req->success == '2') $msg = $message->updated[$target];
            else $msg = $message->deleted[$target];
            return $msg;
        } else {
            return null;
        }
    }

    /**
     * Verifica existência da variável de sessão "viewers e efetua a sua remoção"
     */
    public function forgetSession(){

        if(session()->has('viewers')) session()->forget('viewers');
        if(session()->has('classList')) session()->forget('classList');
        if(session()->has('turmaId')) session()->forget('turmaId');
        if(session()->has('className')) session()->forget('className');
        if(session()->has('aula')) session()->forget('aula');
        if(session()->has('tema')) session()->forget('tema');
        if(session()->has('allClassList')) session()->forget('allClassList');
    }

}


?>
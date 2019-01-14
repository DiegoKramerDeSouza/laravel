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

    // Teste de contabilização
    private static $initiator = 0;

    /**
     * Carrega definições básicas de configuração da aplicação
     */
    public function setDefaults(){

        $config = new DefaultConfig();
        return $config;
    }

    /**
     * Coleta o ID do componente que está sendo acessado
     * {String} $module 
     */
    public function getComponentId($module){

        $componente = Componente::where('model', $module)->first();
        return $componente->id;
    }

    /**
     * Valida o componente acessado com as permissões do usuário
     * {String} $module 
     */
    public function validade($module){

        //self::$initiator++;
        if(Auth::user()->type == 0){
            $componenteId = $this->getComponentId($module);
            $userid = Auth::user()->id;
            $userGroup = UserDado::where('user_id', $userid)->first();
            $access = Perfil::find($userGroup->perfils_id);
            $finding = Perfils_has_componente::where('perfils_id', $access->id)
                                            ->where('componentes_id', $componenteId)->count();
            if($finding > 0) return true;
        }
        return false;
    }
    
    /**
     * Verifica o tipo de acesso do usuário
     * {Int} $userId 
     */
    public function adminAccess($userid){

        $dados = UserDado::where('user_id', $userid)->first();
        $granted = Perfil::find($dados->perfils_id);
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
     * {Obj post request} $req
     * {String} target 
     */
    public function returnMessages($req, $target){

        if(isset($req->success)) {
            $message = new DefaultMessages();
            if($req->success == '1') $response = $message->created[$target];
            elseif($req->success == '2') $response = $message->updated[$target];
            else $response = $message->deleted[$target];
            return $response;
        }
        return null;
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
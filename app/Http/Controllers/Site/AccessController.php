<?php

namespace App\Http\Controllers\Site;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\DefaultMessages;

class AccessController extends Controller
{
    //Padrão para resposta de acesso negado
    public function index(){

        $message = new DefaultMessages();
        $error = $message->accessDenied;
        return view('access.denied', compact('error'));
    }
}

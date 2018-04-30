<?php

namespace App\Http\Controllers\Site;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AccessController extends Controller
{
    //Padrão para resposta de acesso negado
    public function index(){
        return view('denied');
    }
}

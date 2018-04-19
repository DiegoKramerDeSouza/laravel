<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use App\Escola;

class CadastroController extends Controller
{
    public function index(){
        $users = User::all();
        $escolas = Escola::all();
        return view('admin.cadastro.index', compact('users', 'escolas'));
    }
    
}

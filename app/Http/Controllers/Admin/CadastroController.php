<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use App\Escola;

class CadastroController extends Controller
{
    public function index(){
        $usuarios = User::all();
        $escolas = Escola::all();     
        return view('admin.cadastro.index', compact('usuarios'));
    }
    public function add(){
        $escolas = Escola::all();  
        return view('admin.cadastro.adicionar', compact('escolas'));
    }
    public function save(){
        //
    }
    public function edit(){
        return view('admin.cadastro.editar');
    }
    public function update(){
        //
    }
    public function delete(){
        //
    }
}

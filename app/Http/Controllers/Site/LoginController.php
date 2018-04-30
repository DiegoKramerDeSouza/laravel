<?php

namespace App\Http\Controllers\Site;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;

class LoginController extends Controller
{
    public function index(){
        return view('access.index');
    }
    public function access(Request $req){
        $data = $req->all();
        if(Auth::attempt(['login' => $data['login'], 'password' => $data['password']])){
            if(Auth::user()->type == 0){
                return redirect()->route('home');
            } else {
                return redirect()->route('salas');
            }
        };
        return redirect()->route('login');
    }
    public function logout(){
        Auth::logout();
        return redirect()->route('home');
    }
}

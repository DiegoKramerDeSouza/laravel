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
        if(Auth::attempt(['email' => $data['email'], 'password' => $data['password']])){
            return redirect()->route('home');
        };
        return redirect()->route('login');
    }
    public function logout(){
        Auth::logout();
        return redirect()->route('home');
    }
}

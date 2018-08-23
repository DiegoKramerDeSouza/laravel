<?php

namespace App\Http\Controllers\Site;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;
use App\DefaultMessages;

class LoginController extends Controller
{
    public function index(){
        if(!Auth::guest()){
            return redirect()->route('home');
        }
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
        $message = new DefaultMessages();
        $error = $message->userPasswordIncorrect;
        return view('access.index', compact('error'));
    }
    public function logout(){
        Auth::logout();
        return redirect()->route('home');
    }
}

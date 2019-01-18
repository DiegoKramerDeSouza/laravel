<?php

namespace App\Http\Controllers\Site;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;
use App\DefaultMessages;
use App\Traits\EspecialMethods;

class LoginController extends Controller
{
    use EspecialMethods;

    public function index(){

        if(!Auth::guest()) return redirect()->route('home');
        $this->forgetSession();
        return view('access.index');
    }

    public function access(Request $req){

        $data = $req->all();
        if(Auth::attempt(['login' => $data['login'], 'password' => $data['password']])){
            session()->put('sessaoIniciada', true);
            if(Auth::user()->type == 0) return redirect()->route('home');
            else return redirect()->route('salas');
        }
        $message = new DefaultMessages();
        $error = $message->userPasswordIncorrect;
        return view('access.index', compact('error'));
    }

    public function logout(){
        
        $this->forgetSession();
        Auth::logout();
        return redirect()->route('home');
    }
}

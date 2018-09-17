<?php

namespace App\Http\Controllers\Site;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\EspecialMethods;
use Auth;

class HomeController extends Controller
{
    use EspecialMethods;

    public function index(){

        if(Auth::guest()) $this->forgetSession();
        if(isset(Auth::user()->type)){
            if(Auth::user()->type == 1){
                return redirect()->route('salas');
            }
        }
        return view('home');
    }
}

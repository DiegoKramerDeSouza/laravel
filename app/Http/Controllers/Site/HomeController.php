<?php

namespace App\Http\Controllers\Site;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;

class HomeController extends Controller
{
    public function index(){
        if(isset(Auth::user()->type)){
            if(Auth::user()->type == 1){
                return redirect()->route('turmas');
            }
        }
        return view('home');
    }
}

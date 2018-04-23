<?php

namespace App\Http\Controllers\Site;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;

use App\Escola;
use App\User;
use App\UserDado;

class RoomController extends Controller
{
    public function index(){
        //Deve ser encaminhada em compact()
        $streamPage = true;
        $userid = Auth::user()->id;
        $school = UserDado::where('user_id', $userid)->first();

        //Instancia a classe Escola
        //$escola = new Escola();
        //Chama a função lista()
        //dd($escola->lista());
        
        return view('salas.index', compact('school', 'streamPage'));
    }
}

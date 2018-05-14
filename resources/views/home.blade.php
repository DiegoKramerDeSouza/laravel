<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Início')

<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card z-depth-5'>
        <div class='card-content'>
            @if(Auth::guest())
                <div class='row center container'>
                    <h2 class='card-title' align='left'>
                        <b>Bem vindo ao <span class='blue-text'>WebTV</span>.</b><br>
                        Efetue seu acesso para começar.
                    </h2>
                    <div class='divider'></div>
                    <div class='row'>
                        <h3 class='card-title' align='left'><i class='fa fa-user-circle blue-text'></i> Login</h3>
                        <form class='' action='{{ route('login.access') }}' method='post' enctype="multipart/form-data">
                            {{ csrf_field() }}
                            <div class='row'>
                                <div class='input-field col s12 m6'>
                                    <input class='validate' autofocus required type='text' name='login' id='login'>
                                    <label for='login'><i class='fa fa-user-o'></i> Usuário</label>
                                </div>
                                <div class='input-field col s12 m6'>
                                    <input class='validate' required type='password' name='password' id='password'>
                                    <label for='password'><i class='fa fa-lock'></i> Senha</label>
                                </div>
                            </div>
                            <div class='card-action' align='right'>
                                <button id='access' type='submit' class='btn-flat green-text text-darken-2 waves-effect waves-green'>Entrar <i class='fa fa-sign-in'></i></button>
                            </div>
                        </form>
                    </div>
                </div>
            @else
                <div class='row center'>
                    <h2 class='card-title' align='left'>
                        <b>Bem vindo(a) <br><span class='blue-text'><i class='fa fa-user-circle'></i> {{ Auth::user()->name }}</span>.</b><br>
                    </h2>
                    <div class='divider'></div>
                    <div class='row'>
                        
                        
                    </div>
                </div>
            @endif 
        </div>
    </div>
    
@endsection
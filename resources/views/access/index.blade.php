<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Acesso')
@section('nome', 'Coordenador')
<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card z-depth-5'>
        <div class='card-content'>
            <h2 class='card-title'>
                <b class='red-text text-darken-3'><i class='fa fa-exclamation-triangle'></i> Acesso restrito.</b><br>
                Por favor efetue o login para acessar os recursos desta página.
            </h2>
            <div class='divider'></div>
            <div class='row container'>
                <h3 class='card-title'><i class='fa fa-user-circle blue-text'></i> Login</h3>
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
                        <button id='access' type='submit' class='btn green darken-2 waves-effect waves-light'>Entrar <i class='fa fa-sign-in'></i></button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
@endsection
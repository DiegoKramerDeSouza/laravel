<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Acesso')
@section('nome', 'Coordenador')
<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card z-depth-5'>
        <div class='card-content'>
            <div class='row container'>
                <h3 class='card-title'>Login</h3>
                <form class='' action='{{ route('login.access') }}' method='post' enctype="multipart/form-data">
                    {{ csrf_field() }}
                    <div class='row'>
                        <div class='input-field col s12 m6'>
                            <input class='validate' autofocus required type='text' name='email' id='email'>
                            <label for='email'><i class='fa fa-envelope-o'></i> E-mail</label>
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
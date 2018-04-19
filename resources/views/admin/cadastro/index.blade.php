<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Cadastro')
@section('nome', 'Coordenador')
<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card'>
        <div class='card-content'>
            <div class='row center'>
                <div class='col s12 m6'>
                    <a class='hoverarchor green-text text-darken-2' href='{{ route('admin.cadastro.escolas') }}'>
                        <h3><i class='fa fa-graduation-cap'></i> Instituições:</h3>
                        <p>Instituições cadastradas: <b>{{ count($escolas) }}</b></p>
                    </a>
                </div>
                <div class='col s12 m6'>
                    <a class='hoverarchor green-text text-darken-2' href='{{ route('admin.cadastro.usuarios') }}'>
                        <h3><i class='fa fa-users'></i> Usuários:</h3>
                        <p>Usuários cadastrados: <b>{{ count($users) }}</b></p>
                    </a>
                </div>
            </div>
            <br>
            <br>
        </div>
    </div>
    
@endsection
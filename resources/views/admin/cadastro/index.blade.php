<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Cadastro')
@section('nome', 'Coordenador')
<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card z-depth-5'>
        <div class='card-content'>
            <div class='row center container'>
                <div class='col s12 m6 hoverarchor'>
                    <a class='blue-text' href='{{ route('admin.cadastro.escolas') }}' style='padding:40px;'>
                        <h1><i class='fa fa-institution fa-2x'></i></h1>
                        <h3>Instituições</h3>
                        <p>Instituições cadastradas: <b>{{ count($escolas) }}</b></p>
                    </a>
                </div>
                <div class='col s12 m6 hoverarchor'>
                    <a class=' blue-text' href='{{ route('admin.cadastro.usuarios') }}' style='padding:40px;'>
                        <h1><i class='fa fa-users fa-2x'></i></h1>
                        <h3>Usuários</h3>
                        <p>Usuários cadastrados: <b>{{ count($users) }}</b></p>
                    </a>
                </div>
            </div>
            <br>
            <br>
        </div>
    </div>
    
@endsection
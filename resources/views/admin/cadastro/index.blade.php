<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Cadastro')

<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card z-depth-5'>
        <div class='card-content'>
            <div class='row center'>
                <div class='col s12 m4 hoverarchor'>
                    <a class='grey-text' href='{{ route('admin.cadastro.escolas', ['page' => '1']) }}' style='padding:40px;'>
                        <h2><i class='fa fa-institution fa-2x'></i></h2>
                        <h5>Instituições</h5>
                        <p>Cadastradas: <b>{{ count($escolas) }}</b></p>
                    </a>
                </div>
                <div class='col s12 m4 hoverarchor'>
                    <a class=' grey-text' href='{{ route('admin.cadastro.modulos', ['page' => '1']) }}' style='padding:40px;'>
                        <h2><i class='fa fa-database fa-2x'></i></h2>
                        <h5>Módulos</h5>
                        <p>Cadastrados: <b>{{ count($modulos) }}</b></p>
                    </a>
                </div>
                <div class='col s12 m4 hoverarchor'>
                    <a class=' grey-text' href='{{ route('admin.cadastro.cursos', ['page' => '1']) }}' style='padding:40px;'>
                        <h2><i class='fa fa-cubes fa-2x'></i></h2>
                        <h5>Cursos</h5>
                        <p>Cadastrados: <b>{{ count($cursos) }}</b></p>
                    </a>
                </div>
                <div class='col s12 m4 hoverarchor'>
                    <a class=' grey-text' href='{{ route('admin.cadastro.turmas', ['page' => '1']) }}' style='padding:40px;'>
                        <h2><i class='fa fa-graduation-cap fa-2x'></i></h2>
                        <h5>Turmas</h5>
                        <p>Cadastradas: <b>{{ count($turmas) }}</b></p>
                    </a>
                </div>
                <div class='col s12 m4 hoverarchor'>
                    <a class=' grey-text' href='{{ route('admin.cadastro.perfis', ['page' => '1']) }}' style='padding:40px;'>
                        <h2><i class='fa fa-vcard-o fa-2x'></i></h2>
                        <h5>Perfis</h5>
                        <p>Cadastrados: <b>{{ count($perfis) }}</b></p>
                    </a>
                </div>
                <div class='col s12 m4 hoverarchor'>
                    <a class=' grey-text' href='{{ route('admin.cadastro.usuarios', ['page' => '1']) }}' style='padding:40px;'>
                        <h2><i class='fa fa-users fa-2x'></i></h2>
                        <h5>Usuários</h5>
                        <p>Cadastrados: <b>{{ count($users) }}</b></p>
                    </a>
                </div>
            </div>
            <br>
            <br>
        </div>
    </div>
    
@endsection
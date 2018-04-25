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
                    <a class='blue-text' href='{{ route('admin.cadastro.escolas', ['page' => '1']) }}' style='padding:40px;'>
                        <h2><i class='fa fa-institution fa-2x'></i></h2>
                        <h3>Instituições</h3>
                        <p>Instituições cadastradas: <b>{{ count($escolas) }}</b></p>
                    </a>
                </div>
                <div class='col s12 m4 hoverarchor'>
                    <a class=' blue-text' href='{{ route('admin.cadastro.turmas', ['page' => '1']) }}' style='padding:40px;'>
                        <h2><i class='fa fa-graduation-cap fa-2x'></i></h2>
                        <h3>Turmas</h3>
                        <p>Turmas cadastradas: <b>{{ count($turmas) }}</b></p>
                    </a>
                </div>
                <div class='col s12 m4 hoverarchor'>
                    <a class=' blue-text' href='{{ route('admin.cadastro.usuarios', ['page' => '1']) }}' style='padding:40px;'>
                        <h2><i class='fa fa-users fa-2x'></i></h2>
                        <h3>Usuários</h3>
                        <p>Usuários cadastrados: <b>{{ count($users) }}</b></p>
                    </a>
                </div>
                <div class='col s12 m6 hoverarchor'>
                    <a class=' blue-text' href='{{ route('admin.cadastro.modulos', ['page' => '1']) }}' style='padding:40px;'>
                        <h2><i class='fa fa-database fa-2x'></i></h2>
                        <h3>Módulos</h3>
                        <p>Módulos cadastrados: <b>{{ count($modulos) }}</b></p>
                    </a>
                </div>
                <div class='col s12 m6 hoverarchor'>
                        <a class=' blue-text' href='{{ route('admin.cadastro.cursos', ['page' => '1']) }}' style='padding:40px;'>
                            <h2><i class='fa fa-cubes fa-2x'></i></h2>
                            <h3>Cursos</h3>
                            <p>Cursos cadastrados: <b>{{ count($cursos) }}</b></p>
                        </a>
                    </div>
            </div>
            <br>
            <br>
        </div>
    </div>
    
@endsection
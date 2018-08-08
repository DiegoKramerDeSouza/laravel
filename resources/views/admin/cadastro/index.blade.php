<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Cadastro')

<!--Define yield('content') em layout.site-->
@section('content')
    <h4 class='row white-text'>
        <span><b>{!! $manageWhiteIcon !!} Gerenciar</b></span>
        <div class='divider'></div>
    </h4>
    <div class='card z-depth-5'>
        <div class='card-content'>
            <div class='row center'>
                @if(strpos($granted->grant, '4') !== false)
                    <div class='col s12 m{{ $grid }} hoverarchor'>
                        <a class='load grey-text' href='{{ route('admin.cadastro.escolas') }}' style='padding:40px;'>
                            <h2>{!! $institutionLargeIcon !!}</h2>
                            <h5>Instituições</h5>
                            <p>Cadastradas: <b>{{ count($escolas) }}</b></p>
                        </a>
                    </div>
                @endif
                @if(strpos($granted->grant, '2') !== false)
                    <div class='col s12 m{{ $grid }} hoverarchor'>
                        <a class='load grey-text' href='{{ route('admin.cadastro.modulos') }}' style='padding:40px;'>
                            <h2>{!! $modulosLargeIcon !!}</h2>
                            <h5>Módulos</h5>
                            <p>Cadastrados: <b>{{ count($modulos) }}</b></p>
                        </a>
                    </div>
                @endif
                @if(strpos($granted->grant, '3') !== false)
                    <div class='col s12 m{{ $grid }} hoverarchor'>
                        <a class='load grey-text' href='{{ route('admin.cadastro.cursos') }}' style='padding:40px;'>
                            <h2>{!! $cursosLargeIcon !!}</h2>
                            <h5>Cursos</h5>
                            <p>Cadastrados: <b>{{ count($cursos) }}</b></p>
                        </a>
                    </div>
                @endif
                @if(strpos($granted->grant, '1') !== false)
                    <div class='col s12 m{{ $grid }} hoverarchor'>
                        <a class='load grey-text' href='{{ route('admin.cadastro.turmas') }}' style='padding:40px;'>
                            <h2>{!! $turmasLargeIcon !!}</h2>
                            <h5>Turmas</h5>
                            <p>Cadastradas: <b>{{ count($turmas) }}</b></p>
                        </a>
                    </div>
                @endif
                @if(strpos($granted->grant, '6') !== false)
                    <div class='col s12 m{{ $grid }} hoverarchor'>
                        <a class='load grey-text' href='{{ route('admin.cadastro.perfis') }}' style='padding:40px;'>
                            <h2>{!! $perfisLargeIcon !!}</h2>
                            <h5>Perfis</h5>
                            <p>Cadastrados: <b>{{ count($perfis) }}</b></p>
                        </a>
                    </div>
                @endif
                @if(strpos($granted->grant, '5') !== false)
                    <div class='col s12 m{{ $grid }} hoverarchor'>
                        <a class='load grey-text' href='{{ route('admin.cadastro.usuarios') }}' style='padding:40px;'>
                            <h2>{!! $usuariosLargeIcon !!}</h2>
                            <h5>Usuários</h5>
                            <p>Cadastrados: <b>{{ count($users) }}</b></p>
                        </a>
                    </div>
                @endif
            </div>
            <br>
            <br>
        </div>
    </div>
    
@endsection
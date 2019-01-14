<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Cadastro')

<!--Define yield('content') em layout.site-->
@section('content')
    <h4 class='row white-text'>
        <span><b>{!! $default->manageWhiteIcon !!} Gerenciar</b></span>
        <div class='divider'></div>
    </h4>
    <div class='card z-depth-5'>
        <div class='card-content'>
            <div class='row center'>
                @foreach($granted as $model)
                    <div class='col s12 m{{ $grid }} hoverarchor'>
                        <a class='load grey-text p-40' href='{{ route('admin.cadastro.' . $model['cadastrado']) }}'>
                            <h2><i class='{{ $model['icon'] }}'></i></h2>
                            <h5>{{ $model['name'] }}</h5>
                            <p>Cadastrado(a)s: <b>{{ $model['count'] }}</b></p>
                        </a>
                    </div>
                @endforeach
            </div>
            <br>
            <br>
        </div>
    </div>
    
@endsection
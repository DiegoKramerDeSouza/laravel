<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Acesso Negado!')

<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card z-depth-5'>
        <div class='card-content'>
            <div class='row center container'>
                <h2 class='card-title' align='left'>
                    <b><span class='blue-text'>{!! $default->loginIcon !!} {{ Auth::user()->name }}</span></b><br>
                </h2>
                <div class='divider'></div>
                <br>
                <div class='red-text text-darken-3' align='center'>
                    <h5>
                        {!! $default->closeLargeIcon !!}
                        <br>
                        Acesso Negado!
                    </h5>
                    <h6>
                    Você não possui permissão para acessar este recurso!
                    </h6>
                </div>
                <br>
                <div class='divider'></div>
                <br>
            <a class='load btn-flat blue-text text-darken-1 waves-effect waves-teal' href='{{ route('home') }}'>{!! $default->gobackLink !!}</a>
            </div>
        </div>
    </div>
    
@endsection
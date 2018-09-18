<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Novo Módulo')

<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card z-depth-5'>
        <div class='card-content'>
            <h3 class='card-title green-text'>{!! $default->novoIcon !!} Novo Módulo:</h3>
            <div class='divider'></div>
            <form class='' action='{{ route('admin.cadastro.modulos.salva') }}' method='post' enctype="multipart/form-data">
                <!--Formulário de cadastro e edição de turmas--> 
                {{ csrf_field() }}
                @include('admin.cadastro.modulos._form')

                <div class='card-action' align='right'>
                    <a href='{{ route('admin.cadastro.modulos', ['page' => '1']) }}' class='load-cancel btn-flat red-text text-darken-3 waves-effect waves-red'>{!! $default->cancelIcon !!} Cancelar</a>
                    <button type='submit' class='load btn-flat green-text text-darken-2 waves-effect waves-green'>{!! $default->applyIcon !!} Salvar</button>
                </div>
            </form>
        </div>
    </div>
@endsection




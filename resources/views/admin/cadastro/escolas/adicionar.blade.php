<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Nova Escola')
<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card z-depth-5'>
        <div class='card-content'>
            <h3 class='card-title green-text'>{!! $default->novoIcon !!} Nova Instituição:</h3>
            <div class='divider'></div>
            <form class='' action='{{ route('admin.cadastro.escolas.salva') }}' method='post' enctype="multipart/form-data">
                <!--Formulário de cadastro e edição de usuários--> 
                {{ csrf_field() }}
                @include('admin.cadastro.escolas._form')

                <div class='card-action' align='right'>
                    <a href='{{ route('admin.cadastro.escolas', ['page' => '1']) }}' class='load-cancel btn-flat red-text text-darken-3 waves-effect waves-red'>{!! $default->cancelIcon !!} Cancelar</a>
                    <button id='save' type='submit' class='load btn-flat green-text text-darken-2 waves-effect waves-green'>{!! $default->applyIcon !!} Salvar</button>
                </div>
            </form>
        </div>
    </div>
@endsection




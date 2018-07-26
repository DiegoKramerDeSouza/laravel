<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Nova Turma')
<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card z-depth-5'>
        <div class='card-content'>
            <h3 class='card-title green-text'>{!! $novoIcon !!} Nova Turma:</h3>
            <div class='divider'></div>
            @if(count($escolas) > 0)
                <form class='' action='{{ route('admin.cadastro.turmas.salva') }}' method='post' enctype="multipart/form-data">
                    <!--Formulário de cadastro e edição de turmas--> 
                    {{ csrf_field() }}
                    @include('admin.cadastro.turmas._form')

                    <div class='card-action' align='right'>
                        <a href='{{ route('admin.cadastro.turmas', ['page' => '1']) }}' class='load-cancel btn-flat red-text text-darken-3 waves-effect waves-red'>{!! $cancelIcon !!} Cancelar</a>
                        <button type='submit' class='load btn-flat green-text text-darken-2 waves-effect waves-green'>{!! $applyIcon !!} Salvar</button>
                    </div>
                </form>
            @else
                <br>
                <br>
                <h5 class='center grey-text'>{!! $cancelRedIcon !!} Não há escolas cadastradas!<br>Cadastre novas escolas para criar uma nova turma.</h5>
            @endif
        </div>
    </div>
@endsection




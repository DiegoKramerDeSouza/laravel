<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Novo Usuário')
@section('nome', 'Professor')
<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card z-depth-5'>
        <div class='card-content'>
            <h3 class='card-title'>Novo Usuário:</h3>
            <div class='divider'></div>
            @if(count($escolas) > 0)
                <form class='' action='{{ route('admin.cadastro.usuarios.salva') }}' method='post' enctype="multipart/form-data">
                    <!--Formulário de cadastro e edição de usuários--> 
                    {{ csrf_field() }}
                    @include('admin.cadastro.usuarios._form')

                    <div class='card-action' align='right'>
                        <a href='{{ route('admin.cadastro.usuarios', ['page' => '1']) }}' class='load btn-flat red-text text-darken-3 waves-effect waves-red'><i class='fa fa-times'></i> Cancelar</a>
                        <button type='submit' class='load btn-flat green-text text-darken-2 waves-effect waves-green'><i class='fa fa-check'></i> Salvar</button>
                    </div>
                </form>
            @else
                <br>
                <br>
                <h5 class='center grey-text'><i class='fa fa-times red-text text-darken-3'></i> Não há escolas cadastradas!<br>Cadastre novas escolas para criar um usuário.</h5>
            @endif
        </div>
    </div>
@endsection




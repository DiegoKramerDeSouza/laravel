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
            @if(count($escolas) > 0)
                <form class='' action='{{ route('admin.cadastro.usuarios.salva') }}' method='post' enctype="multipart/form-data">
                    <!--Formulário de cadastro e edição de usuários--> 
                    {{ csrf_field() }}
                    @include('admin.cadastro.usuarios._form')

                    <div class='card-action' align='right'>
                        <button type='submit' class='btn green darken-2 waves-effect waves-light'><i class='fa fa-check'></i> Salvar</button>
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




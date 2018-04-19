<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Nova Escola')
@section('nome', 'Professor')
<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card'>
        <div class='card-content'>
            <h3 class='card-title'>Nova Escola:</h3>
            <form class='' action='{{ route('admin.cadastro.escolas.salva') }}' method='post' enctype="multipart/form-data">
                <!--Formulário de cadastro e edição de usuários--> 
                {{ csrf_field() }}
                @include('admin.cadastro.escolas._form')

                <div class='card-action' align='right'>
                    <button type='submit' class='btn green darken-2 waves-effect waves-light'><i class='fa fa-check'></i> Salvar</button>
                </div>
            </form>
        </div>
    </div>
@endsection




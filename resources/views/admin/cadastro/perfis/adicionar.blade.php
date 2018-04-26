<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Novo Perfil')

<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card z-depth-5'>
        <div class='card-content'>
            <h3 class='card-title'>Novo Perfil:</h3>
            <div class='divider'></div>
            <form class='' action='{{ route('admin.cadastro.perfis.salva') }}' method='post' enctype="multipart/form-data">
                <!--Formulário de cadastro e edição de turmas--> 
                {{ csrf_field() }}
                @include('admin.cadastro.perfis._form')

                <div class='card-action' align='right'>
                    <a href='{{ route('admin.cadastro.perfis', ['page' => '1']) }}' class='btn-flat red-text text-darken-3 waves-effect waves-red'><i class='fa fa-times'></i> Cancelar</a>
                    <button type='submit' class='btn-flat green-text text-darken-2 waves-effect waves-green'><i class='fa fa-check'></i> Salvar</button>
                </div>
            </form>
        </div>
    </div>
@endsection



<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Novo Usuário')
<!--Define yield('content') em layout.site-->
@section('content')
    <h3>Novo Usuário:</h3>
    <form class='' action='{{ route('admin.cadastro.salva') }}' method='post' enctype="multipart/form-data">
        {{ csrf_field() }}
        @include('admin.cadastro._form')
        <div class='right'>
            <button type='button' class='btn green darken-2'>Salvar</button>
        </div>
    </form>
@endsection
<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Editar ' . $usuarios->name)
<!--Define yield('content') em layout.site-->
@section('content')
    <h3>{{ $usuarios->name }}:</h3>
    <form class='' action='{{ route('admin.cadastro.atualiza') }}' method='post'>
        {{ csrf_field() }}
        @include('admin.cadastro._form')
        <button type='button' class='btn blue darken-2'>Atualizar</button>
    </form>
@endsection
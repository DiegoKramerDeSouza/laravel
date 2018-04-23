<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Salas de aula')

<!--Define yield('content') em layout.site-->
@section('content')
    <h3>Salas</h3>
    @foreach($salas as $sala)
        <p>{{ $sala->numero }}: {{ $sala->status }}</p>
    @endforeach
@endsection
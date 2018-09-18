
@extends('layout.site')

@section('titulo', 'Salas')

@section('content')
    @if(isset($streamPage))
    
        <!-- Formulário de criação de salas -->
        @include('salas._includes.form')

        <!-- Controles e Mídias -->
        @include('salas._includes.midia')
        
        <!-- Modals -->
        @include('salas._includes.modals')

    @endif
@endsection
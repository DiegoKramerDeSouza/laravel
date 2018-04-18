<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Cadastro de Usuários')
<!--Define yield('content') em layout.site-->
@section('content')
    <h3>Cadastro:</h3>
    <div class='row right'>
        Usuários cadastrados: <b>{{ count($usuarios) }}</b>
    </div>
    <div class='row'>
        <table class='striped'>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Criação</th>
                </tr>
            </thead>

            <tbody>
                @foreach($usuarios as $user)
                    <tr>
                        <td><i class='fa fa-user fa-lg'></i> {{ $user->name }}</td>
                        <td><i class='fa fa-envelope fa-lg'></i> {{ $user->email }}</td>
                        <td><i class='fa fa-watch fa-lg'></i> {{ $user->created_at }}</td>
                        <td class='right'>
                            <a class='btn-flat waves-effect waves-red red-text text-darken-3' href='{{ route('admin.cadastro.deleta', $user->id) }}'>deletar</a>
                            <a class='btn-flat waves-effect waves-orange amber-text text-darken-3' href='{{ route('admin.cadastro.edita', $user->id) }}'>editar</a>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    <div alig='center'>
        <a class='btn-flat waves-effect waves-green green-text text-darken-2' href='{{ route('admin.cadastro.adiciona') }}'><i class='fa fa-plus'></i> novo</a>
    </div>
@endsection
<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Cadastro de Usuários')
@section('nome', 'Professor')
<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card'>
        <div class='card-content'>
            <div class='card-title'>
                Cadastro:
            </div>
            <div class='row right'>
                Usuários cadastrados: <b>{{ count($users) }}</b>
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
                        @foreach($users as $user)
                            <tr>
                                <td><i class='fa fa-user fa-lg'></i> {{ $user->name }}</td>
                                <td><i class='fa fa-envelope fa-lg'></i> {{ $user->email }}</td>
                                <td><i class='fa fa-watch fa-lg'></i> {{ $user->created_at }}</td>
                                <td class='right'>
                                    <a class='btn-flat waves-effect waves-red red-text text-darken-3 modal-trigger' href='#confirm-message-{{$user->id}}'>deletar</a>
                                    <a class='btn-flat waves-effect waves-orange amber-text text-darken-3' href='{{ route('admin.cadastro.usuarios.edita', $user->id) }}'>editar</a>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            <div class='center'>
                <a class='btn-flat waves-effect waves-green green-text text-darken-2' href='{{ route('admin.cadastro.usuarios.adiciona') }}'><i class='fa fa-plus'></i> novo</a>
            </div>
        </div>
    </div>
    @foreach($users as $user)
        <div id='confirm-message-{{$user->id}}' class='modal bottom-sheet'>
            <div class-'modal-content'>
                <h5>Deseja remover {{$user->name}}?</h5>
                <div class='right'>
                    <a class='btn waves-effect waves-light red darken-3' href='{{ route('admin.cadastro.usuarios.deleta', $user->id) }}'>Deletar</a>
                    <a class='btn waves-effect waves-light blue' href='#'>Cancelar</a>
                </div>
            </div>
            <div class='modal-footer'>
                <br>
            </div>
        </div>
    @endforeach
@endsection
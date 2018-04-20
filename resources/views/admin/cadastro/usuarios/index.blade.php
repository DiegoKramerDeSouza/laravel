<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Cadastro de Usuários')
@section('nome', 'Professor')
<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card z-depth-5'>
        <div class='card-content'>
            <div class='card-title'>
                Cadastro:
            </div>
            <div class='row' align='right'>
                Usuários cadastrados: <b>{{ count($users) }}</b>
                <h6><a class='green-text text-darken-1' href='{{ route('admin.cadastro.usuarios.adiciona') }}'><i class='fa fa-plus-circle fa-lg'></i> Novo Usuário</a></h6>
            </div>
            <div class='divider'></div>
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
            <div class='divider'></div>
            <br>
        </div>
    </div>
    @foreach($users as $user)
        <div id='confirm-message-{{$user->id}}' class='modal bottom-sheet'>
            <div class-'modal-content'>
                <h5>Deseja remover o usuário {{$user->name}}?</h5>
                <div class='divider'></div>
                <div class='right'>
                    <br>
                    <a class='btn-flat waves-effect waves-red red-text darken-3' href='{{ route('admin.cadastro.usuarios.deleta', $user->id) }}'><i class='fa fa-trash-o'></i> Deletar</a>
                    <a class='modal-action modal-close btn-flat waves-effect waves-blue blue-text' href='#'><i class='fa fa-times'></i> Cancelar</a>
                </div>
                <br>
            </div>
            <div class='modal-footer'>
                <br>
            </div>
        </div>
    @endforeach
@endsection
<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Cadastro de Escolas')
@section('nome', 'Professor')
<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card'>
        <div class='card-content'>
            <div class='card-title'>
                Cadastro:
            </div>
            <div class='row right'>
                Instituições cadastradas: <b>{{ count($escolas) }}</b>
            </div>
            <div class='row'>
                <table class='striped'>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Criação</th>
                        </tr>
                    </thead>

                    <tbody>
                        @foreach($escolas as $escola)
                            <tr>
                                <td><i class='fa fa-user fa-lg'></i> {{ $escola->name }}</td>
                                <td><i class='fa fa-watch fa-lg'></i> {{ $escola->created_at }}</td>
                                <td class='right'>
                                    <a class='btn-flat waves-effect waves-red red-text text-darken-3 modal-trigger' href='#confirm-message-{{$escola->id}}'>deletar</a>
                                    <a class='btn-flat waves-effect waves-orange amber-text text-darken-3' href='{{ route('admin.cadastro.escolas.edita', $escola->id) }}'>editar</a>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            <div class='center'>
                <a class='btn-flat waves-effect waves-green green-text text-darken-2' href='{{ route('admin.cadastro.escolas.adiciona') }}'><i class='fa fa-plus'></i> nova</a>
            </div>
        </div>
    </div>
    @foreach($escolas as $escola)
        <div id='confirm-message-{{$escola->id}}' class='modal bottom-sheet'>
            <div class-'modal-content'>
                <h5>Deseja remover {{$escola->name}}?</h5>
                <div class='right'>
                    <a class='btn waves-effect waves-light red darken-3' href='{{ route('admin.cadastro.escolas.deleta', $escola->id) }}'>Deletar</a>
                    <a class='btn waves-effect waves-light blue' href='#'>Cancelar</a>
                </div>
            </div>
            <div class='modal-footer'>
                <br>
            </div>
        </div>
    @endforeach
@endsection
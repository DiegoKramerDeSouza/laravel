<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Cadastro de Escolas')
@section('nome', 'Professor')
<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card z-depth-5'>
        <div class='card-content'>
            <div class='card-title'>
                Cadastro:
            </div>
            <div class='row' align='right'>
                Instituições cadastradas: <b>{{ count($escolas) }}</b>
                <h6><a class='green-text text-darken-1' href='{{ route('admin.cadastro.escolas.adiciona') }}'><i class='fa fa-plus-circle fa-lg'></i> Nova Instituição</a></h6>
            </div>
            <div class='divider'></div>
            <div class='row'>
                @if(count($escolas) > 0)
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
                                        <a class='btn-flat waves-effect waves-red red-text text-darken-3 modal-trigger' href='#confirm-message-{{$escola->id}}'><i class='fa fa-trash-o'></i> deletar</a>
                                        <a class='btn-flat waves-effect waves-orange amber-text text-darken-3' href='{{ route('admin.cadastro.escolas.edita', $escola->id) }}'><i class='fa fa-edit'></i> editar</a>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                @else
                    <div class='grey-text center' style='margin-top:40px; margin-bottom:40px;'>
                        <h5><i class='red-text text-darken-3 fa fa-times'></i> Não há registros de instituições!</h5>
                    </div>
                @endif
            </div>
            <div class='divider'></div>
            <br>
        </div>
    </div>
    @foreach($escolas as $escola)
        <div id='confirm-message-{{$escola->id}}' class='modal bottom-sheet'>
            <div class-'modal-content'>
                <h5>Deseja remover a instituição {{$escola->name}}?</h5>
                <div class='center red-text text-darken-3'>
                    <h6><b><i class='fa fa-exclamation-triangle'></i> ATENÇÃO:</b></h6>
                    <p><b>A remoção desta instituição implica na remoção automática de todos os usuários vinculados a esta.</b></p>
                </div>
                <div class='divider'></div>
                <div class='right'>
                    <br>
                    <a class='btn-flat waves-effect waves-red red-text text-darken-3' href='{{ route('admin.cadastro.escolas.deleta', $escola->id) }}'><i class='fa fa-trash-o'></i> Deletar</a>
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
<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Cadastro de Módulos')

<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card z-depth-5'>
        <div class='card-content'>
            <div class='card-title'>
                <b class='grey-text text-darken-2'><i class='fa fa-database'></i> Cadastro de Módulos</b>
            </div>
            <div class='row' align='right'>
                Módulos cadastrados: <b>{{ count($modulos) }}</b>
                <h6><a class='load green-text text-darken-1' href='{{ route('admin.cadastro.modulos.adiciona') }}'><i class='fa fa-plus-circle fa-lg'></i> Novo Módulo</a></h6>
            </div>
            <div class='divider'></div>
            <div class='row'>
                @if(count($modulos) > 0)
                    <table class='striped'>
                        <thead>
                            <tr>
                                <th><i class='fa fa-database fa-lg blue-text'></i> Nome</th>
                                <th><i class='fa fa-clock-o fa-lg blue-text'></i> Criação</th>
                            </tr>
                        </thead>

                        <tbody>
                            @foreach($modulos as $modulo)
                                <tr>
                                    <td><b> {{ $modulo->name }}</b></td>
                                    <td> {{ $modulo->created_at }}</td>
                                    <td class='right'>
                                        <a class='load btn-flat waves-effect waves-red red-text text-darken-3 modal-trigger' href='#confirm-message-{{$modulo->id}}'><i class='fa fa-trash-o'></i> deletar</a>
                                        <a class='load btn-flat waves-effect waves-orange amber-text text-darken-3' href='{{ route('admin.cadastro.modulos.edita', $modulo->id) }}'><i class='fa fa-edit'></i> editar</a>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                    <div class='row center'>
                        <ul class="pagination">
                            {!! $paginate !!}
                        </ul>
                        <br>
                    </div>
                @else
                    <div class='grey-text center' style='margin-top:40px; margin-bottom:40px;'>
                        <h5><i class='red-text text-darken-3 fa fa-times'></i> Não há registros de módulos!</h5>
                    </div>
                @endif
            </div>
            <div class='divider'></div>
            <div align='center'>
                <br>
                <a href="{{ route('admin.cadastro') }}" class='load btn-flat waves-effect waves-teal blue-text text-darken-2'><i class='fa fa-arrow-left'></i> voltar</a>
            </div>
            <br>
        </div>
    </div>
    @foreach($modulos as $modulo)
        <div id='confirm-message-{{$modulo->id}}' class='modal'>
            <div class='modal-content'>
                <h5>Deseja remover o módulo <b>{{$modulo->name}}</b>?</h5>
                <div class='divider'></div>
                <div class='right'>
                    <br>
                    <a class='load btn-flat waves-effect waves-red red-text darken-3' href='{{ route('admin.cadastro.modulos.deleta', $modulo->id) }}'><i class='fa fa-trash-o'></i> Deletar</a>
                    <a class='modal-action modal-close btn-flat waves-effect waves-blue blue-text text-darken-2' href='#'><i class='fa fa-times'></i> Cancelar</a>
                </div>
                <br>
            </div>
            <div class='modal-footer'>
                <br>
            </div>
        </div>
    @endforeach
@endsection
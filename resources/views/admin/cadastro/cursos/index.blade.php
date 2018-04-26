<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Cadastro de Cursos')

<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card z-depth-5'>
        <div class='card-content'>
            <div class='card-title'>
                <i class='fa fa-cube'></i> Cadastro de Cursos:
            </div>
            <div class='row' align='right'>
                Cursos cadastrados: <b>{{ count($cursos) }}</b>
                <h6><a class='green-text text-darken-1' href='{{ route('admin.cadastro.cursos.adiciona') }}'><i class='fa fa-plus-circle fa-lg'></i> Novo Curso</a></h6>
            </div>
            <div class='divider'></div>
            <div class='row'>
                @if(count($cursos) > 0)
                    <table class='striped'>
                        <thead>
                            <tr>
                                <th><i class='fa fa-cube fa-lg'></i> Nome</th>
                                <th><i class='fa fa-database fa-lg'></i> Módulo</ht>
                                <th><i class='fa fa-clock-o fa-lg'></i> Criação</th>
                            </tr>
                        </thead>

                        <tbody>
                            @foreach($cursos as $curso)
                                <tr>
                                    <td><b> {{ $curso->name }}</b></td>
                                    <td> {{ $modulos[$curso->modulo_id] }}</td>
                                    <td> {{ $curso->created_at }}</td>
                                    <td class='right'>
                                        <a class='btn-flat waves-effect waves-red red-text text-darken-3 modal-trigger' href='#confirm-message-{{$curso->id}}'><i class='fa fa-trash-o'></i> deletar</a>
                                        <a class='btn-flat waves-effect waves-orange amber-text text-darken-3' href='{{ route('admin.cadastro.cursos.edita', $curso->id) }}'><i class='fa fa-edit'></i> editar</a>
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
                        <h5><i class='red-text text-darken-3 fa fa-times'></i> Não há registros de cursos!</h5>
                    </div>
                @endif
            </div>
            <div class='divider'></div>
            <br>
        </div>
    </div>
    @foreach($cursos as $curso)
        <div id='confirm-message-{{$curso->id}}' class='modal bottom-sheet'>
            <div class-'modal-content'>
                <h5>Deseja remover o curso {{$curso->name}}?</h5>
                <div class='divider'></div>
                <div class='right'>
                    <br>
                    <a class='btn-flat waves-effect waves-red red-text darken-3' href='{{ route('admin.cadastro.cursos.deleta', $curso->id) }}'><i class='fa fa-trash-o'></i> Deletar</a>
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
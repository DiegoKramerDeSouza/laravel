<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Cadastro de Turmas')

<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card z-depth-5'>
        <div class='card-content'>
            <div class='card-title'>
                <b class='grey-text text-darken-2'><i class='fa fa-graduation-cap'></i> Cadastro de Turmas</b>
            </div>
            <div class='row' align='right'>
                Turmas cadastradas: <b>{{ count($turmas) }}</b>
                <h6><a class='load green-text text-darken-1' href='{{ route('admin.cadastro.turmas.adiciona') }}'><i class='fa fa-plus-circle fa-lg'></i> Nova Turma</a></h6>
            </div>
            <div class='divider'></div>
            <div class='row'>
                @if(count($turmas) > 0)
                    <table class='striped'>
                        <thead>
                            <tr>
                                <th><i class='fa fa-graduation-cap fa-lg blue-text'></i> Nome</th>
                                <th><i class='fa fa-user-circle fa-lg blue-text'></i> Login</th>
                                <th><i class='fa fa-institution fa-lg blue-text'></i> Instituição</th>
                                <th><i class='fa fa-clock-o fa-lg blue-text'></i> Criação</th>
                            </tr>
                        </thead>

                        <tbody>
                            @foreach($turmas as $turma)
                                <tr>
                                    <td><b> {{ $turma->name }}</b></td>
                                    <td> {{ $users[$turma->user_id] }}</td>
                                    <td> {{ $turma->school_name }}</td>
                                    <td> {{ $turma->created_at }}</td>
                                    <td class='right'>
                                        <a class='btn-flat waves-effect waves-red red-text text-darken-3 modal-trigger' href='#confirm-message-{{$turma->id}}'><i class='fa fa-trash-o'></i> deletar</a>
                                        <a class='load btn-flat waves-effect waves-orange amber-text text-darken-3' href='{{ route('admin.cadastro.turmas.edita', $turma->id) }}'><i class='fa fa-edit'></i> editar</a>
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
                        <h5><i class='red-text text-darken-3 fa fa-times'></i> Não há registros de turmas!</h5>
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
    @foreach($turmas as $turma)
        <div id='confirm-message-{{$turma->id}}' class='modal'>
            <div class='modal-content'>
                <h5>Deseja remover a turma <b>{{$turma->name}}</b>?</h5>
                <div class='divider'></div>
                <div class='right'>
                    <br>
                    <a class='load btn-flat waves-effect waves-red red-text darken-3' href='{{ route('admin.cadastro.turmas.deleta', $turma->id) }}'><i class='fa fa-trash-o'></i> Deletar</a>
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
<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Cadastro de Turmas')

<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card z-depth-5'>
        <div class='card-content'>
            <div class='card-title'>
                <i class='fa fa-graduation-cap'></i> Cadastro de Turmas:
            </div>
            <div class='row' align='right'>
                Turmas cadastradas: <b>{{ count($turmas) }}</b>
                <h6><a class='green-text text-darken-1' href='{{ route('admin.cadastro.turmas.adiciona') }}'><i class='fa fa-plus-circle fa-lg'></i> Nova Turma</a></h6>
            </div>
            <div class='divider'></div>
            <div class='row'>
                @if(count($turmas) > 0)
                    <table class='striped'>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Login</th>
                                <th>Instituição</th>
                                <th>Criação</th>
                            </tr>
                        </thead>

                        <tbody>
                            @foreach($turmas as $turma)
                                <tr>
                                    <td><i class='fa fa-graduation-cap fa-lg'></i> {{ $turma->name }}</td>
                                    <td><i class='fa fa-user-circle fa-lg'></i> {{ $turma->login }}</td>
                                    <td><i class='fa fa-institution fa-lg'></i> {{ $turma->school_name }}</td>
                                    <td><i class='fa fa-clock-o fa-lg'></i> {{ $turma->created_at }}</td>
                                    <td class='right'>
                                        <a class='btn-flat waves-effect waves-red red-text text-darken-3 modal-trigger' href='#confirm-message-{{$turma->id}}'><i class='fa fa-trash-o'></i> deletar</a>
                                        <a class='btn-flat waves-effect waves-orange amber-text text-darken-3' href='{{ route('admin.cadastro.turmas.edita', $turma->id) }}'><i class='fa fa-edit'></i> editar</a>
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
            <br>
        </div>
    </div>
    @foreach($turmas as $turma)
        <div id='confirm-message-{{$turma->id}}' class='modal bottom-sheet'>
            <div class-'modal-content'>
                <h5>Deseja remover a turma {{$turma->name}}?</h5>
                <div class='divider'></div>
                <div class='right'>
                    <br>
                    <a class='btn-flat waves-effect waves-red red-text darken-3' href='{{ route('admin.cadastro.turmas.deleta', $turma->id) }}'><i class='fa fa-trash-o'></i> Deletar</a>
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
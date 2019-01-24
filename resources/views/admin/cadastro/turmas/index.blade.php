<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Cadastro de Turmas')

<!--Define yield('content') em layout.site-->
@section('content')
    <h4 class='row white-text'>
        <span>{!! $default->turmasIcon !!}<b> Gerenciar Turmas</b></span>
        <div class='divider'></div>
    </h4>
    <div class='card z-depth-5'>
        <div class='card-content'>
            <div class='row'>
                <div class="input-field col s12 m6">
                    {!! $default->prefixSearchIcon !!}
                    <input type="text" id="search-input" class="autocomplete">
                    <label for="search-input">Procurar</label>
                </div>
                <div class="input-field col s12 m6" align='right'>
                    Turmas encontradas: <b>{{ $resultado->total() }}</b>
                    <h6><a class='load green-text text-darken-1' href='{{ route('admin.cadastro.turmas.adiciona') }}'>{!! $default->novoIcon !!} Nova Turma</a></h6>
                </div>
            </div>
            <div class='divider'></div>
            <div class='row'>
                @if(count($resultado) > 0)
                    <table class='striped'>
                        <thead>
                            <tr>
                                <th class='blue-text'>{!! $default->turmasIcon !!} Nome</th>
                                <th class='blue-text'>{!! $default->loginIcon !!} Login</th>
                                <th class='blue-text'>{!! $default->institutionIcon !!} Instituição</th>
                                <th class='blue-text'>{!! $default->timeIcon !!} Criação</th>
                            </tr>
                        </thead>

                        <tbody>
                            @foreach($resultado as $turma)
                                <tr>
                                    <td><b> {{ $turma->name }}</b></td>
                                    <td> {{ $users[$turma->user_id] }}</td>
                                    <td> {{ $turma->school_name }}</td>
                                    <td> {{ $turma->created_at }}</td>
                                    <td class='right'>
                                        <a class='btn-flat waves-effect waves-red red-text text-darken-3 modal-trigger' href='#confirm-message-{{$turma->id}}' title='Deletar'>{!! $default->deleteIcon !!}</a>
                                        <a class='load btn-flat waves-effect waves-orange amber-text text-darken-3' href='{{ route('admin.cadastro.turmas.edita', $turma->id) }}' title='Editar'>{!! $default->editIcon !!}</a>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                    <div class='row center'>
                        {{ $resultado->links() }}
                    </div>
                @else
                    <div class='grey-text center' style='margin-top:40px; margin-bottom:40px;'>
                        <h5>{!! $default->cancelRedIcon !!} Não há registros de turmas!</h5>
                    </div>
                @endif
            </div>
        </div>
        <div class='card-action grey lighten-5' align='center'>
            @if(isset($linkHome))
                <a href='{{ route('admin.cadastro.turmas') }}' class='load btn waves-effect waves-light blue'>{!! $default->gobackLink !!}</a>
            @else
                <a href="{{ route('admin.cadastro') }}" class='load btn waves-effect waves-light blue'>{!! $default->gobackLink !!}</a>
            @endif
        </div>
    </div>
    @foreach($resultado as $turma)
        <div id='confirm-message-{{$turma->id}}' class='modal'>
            <div class='modal-content'>
                <h5>Deseja remover a turma <b>{{$turma->name}}</b>?</h5>
                <div class='divider'></div>
                <div class='right'>
                    <br>
                    <a class='load btn-flat waves-effect waves-red red-text darken-3' href='{{ route('admin.cadastro.turmas.deleta', $turma->id) }}'>{!! $default->deleteIcon !!} Deletar</a>
                    <a class='modal-action modal-close btn-flat waves-effect waves-blue blue-text text-darken-2' href='#'>{!! $default->cancelIcon !!} Cancelar</a>
                </div>
                <br>
            </div>
            <div class='modal-footer'>
                <br>
            </div>
        </div>
    @endforeach
@endsection
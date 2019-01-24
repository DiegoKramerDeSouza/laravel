<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Cadastro de Usuários')

<!--Define yield('content') em layout.site-->
@section('content')
    <h4 class='row white-text'>
        <span>{!! $default->usuariosDefaultIcon !!}<b> Gerenciar Usuários</b></span>
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
                    Usuários encontrados: <b>{{ $resultado->total() }}</b>
                    <h6><a class='load green-text text-darken-1' href='{{ route('admin.cadastro.usuarios.adiciona') }}'>{!! $default->novoIcon !!} Novo Usuário</a></h6>
                </div>
            </div>
            <div class='divider'></div>
            <div class='row'>
                @if(count($resultado) > 0)
                    <table class='striped'>
                        <thead>
                            <tr>
                                <th class='blue-text'>{!! $default->userOIcon !!} Nome</th>
                                <th class='blue-text'>{!! $default->envelopeIcon !!} E-mail</th>
                                <th class='blue-text'>{!! $default->timeIcon !!} Criação</th>
                            </tr>
                        </thead>

                        <tbody>
                            @foreach($resultado as $user)
                                <tr>
                                    <td><b> {{ $user->name }}</b></td>
                                    <td> {{ $user->email }}</td>
                                    <td> {{ $user->created_at }}</td>
                                    <td class='right'>
                                        <a class='btn-flat waves-effect waves-red red-text text-darken-3 modal-trigger' href='#confirm-message-{{$user->id}}' title='Deletar'>{!! $default->deleteIcon !!}</a>
                                        <a class='load btn-flat waves-effect waves-orange amber-text text-darken-3' href='{{ route('admin.cadastro.usuarios.edita', $user->id) }}' title='Editar'>{!! $default->editIcon !!}</a>
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
                        <h5>{!! $default->cancelRedIcon !!} Não há registros de usuários!</h5>
                    </div>
                @endif
            </div>
        </div>
        <div class='card-action grey lighten-5' align='center'>
            @if(isset($linkHome))
                <a href='{{ route('admin.cadastro.usuarios') }}' class='load btn waves-effect waves-light blue'>{!! $default->gobackLink !!}</a>
            @else
                <a href="{{ route('admin.cadastro') }}" class='load btn waves-effect waves-light blue'>{!! $default->gobackLink !!}</a>
            @endif
        </div>
    </div>
    @foreach($resultado as $user)
        <div id='confirm-message-{{$user->id}}' class='modal'>
            <div class='modal-content'>
                <h5>Deseja remover o usuário <b>{{$user->name}}</b>?</h5>
                <div class='divider'></div>
                <div class='right'>
                    <br>
                    <a class='load btn-flat waves-effect waves-red red-text darken-3' href='{{ route('admin.cadastro.usuarios.deleta', $user->id) }}'>{!! $default->deleteIcon !!} Deletar</a>
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
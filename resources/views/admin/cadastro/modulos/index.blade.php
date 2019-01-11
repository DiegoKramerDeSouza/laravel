<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Cadastro de Módulos')

<!--Define yield('content') em layout.site-->
@section('content')
    <h4 class='row white-text'>
        <span>{!! $default->modulosIcon !!}<b> Gerenciar Módulos</b></span>
        <div class='divider'></div>
    </h4>
    <div class='card z-depth-5'>
        <div class='card-content'>
            <div class='row'>
                <div class="input-field col s12 m6">
                    {!! $default->prefixSearchIcon !!}
                    <input type="text" id="search-input" class="autocomplete">
                    <label for="search-input">Pesquisar</label>
                </div>
                <div class="input-field col s12 m6" align='right'>
                    Módulos encontrados: <b>{{ $resultado->total() }}</b>
                    <h6><a class='load green-text text-darken-1' href='{{ route('admin.cadastro.modulos.adiciona') }}'>{!! $default->novoIcon !!} Novo Módulo</a></h6>
                </div>
                <div class='col s12 divider'></div>
            </div>
            <div class='row'>
                @if(count($resultado) > 0)
                    <table class='striped'>
                        <thead>
                            <tr>
                                <th class='blue-text'>{!! $default->modulosIcon !!} Nome</th>
                                <th class='blue-text'>{!! $default->timeIcon !!} Criação</th>
                            </tr>
                        </thead>

                        <tbody>
                            @foreach($resultado as $modulo)
                                <tr>
                                    <td><b> {{ $modulo->name }}</b></td>
                                    <td> {{ $modulo->created_at }}</td>
                                    <td class='right'>
                                        <a class='btn-flat waves-effect waves-red red-text text-darken-3 modal-trigger' href='#confirm-message-{{$modulo->id}}' title='Deletar'>{!! $default->deleteIcon !!}</a>
                                        <a class='load btn-flat waves-effect waves-orange amber-text text-darken-3' href='{{ route('admin.cadastro.modulos.edita', $modulo->id) }}' title='Editar'>{!! $default->editIcon !!}</a>
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
                        <h5>{!! $default->cancelRedIcon !!} Não há registros de módulos!</h5>
                    </div>
                @endif
            </div>
        </div>
        <div class='card-action grey lighten-5' align='center'>
            @if(isset($linkHome))
                <a href='{{ route('admin.cadastro.modulos') }}' class='load btn waves-effect waves-light blue'>{!! $default->gobackLink !!}</a>
            @else
                <a href="{{ route('admin.cadastro') }}" class='load btn waves-effect waves-light blue'>{!! $default->gobackLink !!}</a>
            @endif
        </div>
    </div>
    @foreach($resultado as $modulo)
        <div id='confirm-message-{{$modulo->id}}' class='modal'>
            <div class='modal-content'>
                <h5>Deseja remover o módulo <b>{{$modulo->name}}</b>?</h5>
                <div class='divider'></div>
                <div class='right'>
                    <br>
                    <a class='load btn-flat waves-effect waves-red red-text darken-3' href='{{ route('admin.cadastro.modulos.deleta', $modulo->id) }}'>{!! $default->deleteIcon !!} Deletar</a>
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
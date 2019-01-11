<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Cadastro de Perfis')

<!--Define yield('content') em layout.site-->
@section('content')
    <h4 class='row white-text'>
        <span>{!! $default->perfisIcon !!}<b> Gerenciar Perfis</b></span>
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
                    Perfis encontrados: <b>{{ $resultado->total() }}</b>
                    <h6><a class='load green-text text-darken-1' href='{{ route('admin.cadastro.perfis.adiciona') }}'>{!! $default->novoIcon !!} Novo Perfil</a></h6>
                </div>
            </div>
            <div class='divider'></div>
            <div class='row'>
                @if(count($resultado) > 0)
                    <table class='striped'>
                        <thead>
                            <tr>
                                <th class='blue-text'>{!! $default->perfisIcon !!} Nome</th>
                                <th class='blue-text'>{!! $default->descricaoIcon !!} Descrição</ht>
                                <th class='blue-text'>{!! $default->timeIcon !!} Criação</th>
                            </tr>
                        </thead>

                        <tbody>
                            @foreach($resultado as $perfil)
                                <tr>
                                    <td><b> {{ $perfil->name }}</b></td>
                                    <td> {{ $perfil->description }}</td>
                                    <td> {{ $perfil->created_at }}</td>
                                    <td class='right'>
                                        <a class='btn-flat waves-effect waves-red red-text text-darken-3 modal-trigger' href='#confirm-message-{{$perfil->id}}' title='Deletar'>{!! $default->deleteIcon !!}</a>
                                        <a class='load btn-flat waves-effect waves-orange amber-text text-darken-3' href='{{ route('admin.cadastro.perfis.edita', $perfil->id) }}' title='Editar'>{!! $default->editIcon !!}</a>
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
                        <h5>{!! $default->cancelRedIcon !!} Não há registros de perfis!</h5>
                    </div>
                @endif
            </div>
        </div>
        <div class='card-action grey lighten-5' align='center'>
            @if(isset($linkHome))
                <a href='{{ route('admin.cadastro.perfis') }}' class='load btn waves-effect waves-light blue'>{!! $default->gobackLink !!}</a>
            @else
                <a href="{{ route('admin.cadastro') }}" class='load btn waves-effect waves-light blue'>{!! $default->gobackLink !!}</a>
            @endif
        </div>
    </div>
    @foreach($resultado as $perfil)
        <div id='confirm-message-{{$perfil->id}}' class='modal'>
            <div class='modal-content'>
                <h5>Deseja remover o perfil <b>{{$perfil->name}}</b>?</h5>
                <div class='divider'></div>
                <div class='right'>
                    <br>
                    <a class='load btn-flat waves-effect waves-red red-text darken-3' href='{{ route('admin.cadastro.perfis.deleta', $perfil->id) }}'>{!! $default->deleteIcon !!} Deletar</a>
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
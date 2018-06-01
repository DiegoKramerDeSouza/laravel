<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Cadastro de Cursos')

<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card z-depth-5'>
        <div class='card-content'>
            <div class='card-title'>
                <b class='grey-text text-darken-2'><i class='fa fa-cubes'></i> Cadastro de Cursos</b>
            </div>
            <div class='row'>
                <div class="input-field col s12 m6">
                    <i class="material-icons prefix">search</i>
                    <input type="text" id="search-input" autofocus class="autocomplete">
                    <label for="search-input">Procurar</label>
                </div>
                <div class="input-field col s12 m6" align='right'>
                    Cursos encontrados: <b>{{ $cursos->total() }}</b>
                    <h6><a class='green-text text-darken-1 load' href='{{ route('admin.cadastro.cursos.adiciona') }}'><i class='fa fa-plus-circle fa-lg'></i> Novo Curso</a></h6>
                </div>
            </div>
            <div class='divider'></div>
            <div class='row'>
                @if(count($cursos) > 0)
                    <table class='striped'>
                        <thead>
                            <tr>
                                <th><i class='fa fa-cube fa-lg blue-text'></i> Nome</th>
                                <th><i class='fa fa-database fa-lg blue-text'></i> Módulo</ht>
                                <th><i class='fa fa-clock-o fa-lg blue-text'></i> Criação</th>
                            </tr>
                        </thead>

                        <tbody>
                            @foreach($cursos as $curso)
                                <tr>
                                    <td><b> {{ $curso->name }}</b></td>
                                    <td> {{ $modulos[$curso->modulo_id] }}</td>
                                    <td> {{ $curso->created_at }}</td>
                                    <td class='right'>
                                        <a class='btn-flat waves-effect waves-red red-text text-darken-3 modal-trigger' href='#confirm-message-{{$curso->id}}' title='Deletar'>{!! $deleteIcon !!}</a>
                                        <a class='load btn-flat waves-effect waves-orange amber-text text-darken-3' href='{{ route('admin.cadastro.cursos.edita', $curso->id) }}' title='Editar'>{!! $editIcon !!}</a>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                    <div class='row center'>
                        {{ $cursos->links() }}
                    </div>
                @else
                    <div class='grey-text center' style='margin-top:40px; margin-bottom:40px;'>
                        <h5><i class='red-text text-darken-3 fa fa-times'></i> Não há registros de cursos!</h5>
                    </div>
                @endif
            </div>
            <div class='divider'></div>
            <div align='center'>
                <br>
                <a href="{{ route('admin.cadastro') }}" class='load btn-flat waves-effect waves-teal blue-text text-darken-2'>{!! $gobackLink !!}</a>
            </div>
            <br>
        </div>
    </div>
    @foreach($cursos as $curso)
        <div id='confirm-message-{{$curso->id}}' class='modal'>
            <div class='modal-content'>
                <h5>Deseja remover o curso <b>{{$curso->name}}</b>?</h5>
                <div class='divider'></div>
                <div class='right'>
                    <br>
                    <a class='load btn-flat waves-effect waves-red red-text darken-3' href='{{ route('admin.cadastro.cursos.deleta', $curso->id) }}'>{!! $deleteIcon !!} Deletar</a>
                    <a class='modal-action modal-close btn-flat waves-effect waves-blue blue-text text-darken-2' href='#'>{!! $cancelIcon !!} Cancelar</a>
                </div>
                <br>
            </div>
            <div class='modal-footer'>
                <br>
            </div>
        </div>
    @endforeach
@endsection
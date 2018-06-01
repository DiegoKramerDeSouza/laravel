<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Cadastro de Usuários')

<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card z-depth-5'>
        <div class='card-content'>
            <div class='card-title'>
                    <b class='grey-text text-darken-2'><i class='fa fa-user'></i> Cadastro de Usuários</b>
            </div>
            <div class='row'>
                <div class="input-field col s12 m6">
                    <i class="material-icons prefix">search</i>
                    <input type="text" id="search-input" autofocus class="autocomplete">
                    <label for="search-input">Procurar</label>
                </div>
                <div class="input-field col s12 m6" align='right'>
                    Usuários encontrados: <b>{{ $users->total() }}</b>
                    <h6><a class='load green-text text-darken-1' href='{{ route('admin.cadastro.usuarios.adiciona') }}'><i class='fa fa-plus-circle fa-lg'></i> Novo Usuário</a></h6>
                </div>
            </div>
            <div class='divider'></div>
            <div class='row'>
                @if(count($users) > 0)
                    <table class='striped'>
                        <thead>
                            <tr>
                                <th><i class='fa fa-user-o fa-lg blue-text'></i> Nome</th>
                                <th><i class='fa fa-envelope-o fa-lg blue-text'></i> E-mail</th>
                                <th><i class='fa fa-clock-o fa-lg blue-text'></i> Criação</th>
                            </tr>
                        </thead>

                        <tbody>
                            @foreach($users as $user)
                                <tr>
                                    <td><b> {{ $user->name }}</b></td>
                                    <td> {{ $user->email }}</td>
                                    <td> {{ $user->created_at }}</td>
                                    <td class='right'>
                                        <a class='btn-flat waves-effect waves-red red-text text-darken-3 modal-trigger' href='#confirm-message-{{$user->id}}' title='Deletar'><i class='fa fa-trash-o'></i></a>
                                        <a class='load btn-flat waves-effect waves-orange amber-text text-darken-3' href='{{ route('admin.cadastro.usuarios.edita', $user->id) }}' title='Editar'><i class='fa fa-edit'></i></a>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                    <div class='row center'>
                        {{ $users->links() }}
                    </div>
                @else
                    <div class='grey-text center' style='margin-top:40px; margin-bottom:40px;'>
                        <h5><i class='red-text text-darken-3 fa fa-times'></i> Não há registros de usuários!</h5>
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
    @foreach($users as $user)
        <div id='confirm-message-{{$user->id}}' class='modal'>
            <div class='modal-content'>
                <h5>Deseja remover o usuário <b>{{$user->name}}</b>?</h5>
                <div class='divider'></div>
                <div class='right'>
                    <br>
                    <a class='load btn-flat waves-effect waves-red red-text darken-3' href='{{ route('admin.cadastro.usuarios.deleta', $user->id) }}'><i class='fa fa-trash-o'></i> Deletar</a>
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
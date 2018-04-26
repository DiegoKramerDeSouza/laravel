<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Cadastro de Perfis')

<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card z-depth-5'>
        <div class='card-content'>
            <div class='card-title'>
                Cadastro de Perfis:
            </div>
            <div class='row' align='right'>
                Perfis cadastrados: <b>{{ count($perfis) }}</b>
                <h6><a class='green-text text-darken-1' href='{{ route('admin.cadastro.perfis.adiciona') }}'><i class='fa fa-plus-circle fa-lg'></i> Novo Perfil</a></h6>
            </div>
            <div class='divider'></div>
            <div class='row'>
                @if(count($perfis) > 0)
                    <table class='striped'>
                        <thead>
                            <tr>
                                <th><i class='fa fa-vcard-o fa-lg'></i> Nome</th>
                                <th><i class='fa fa-commenting fa-lg'></i> Descrição</ht>
                                <th><i class='fa fa-clock-o fa-lg'></i> Criação</th>
                            </tr>
                        </thead>

                        <tbody>
                            @foreach($perfis as $perfil)
                                <tr>
                                    <td><b> {{ $perfil->name }}</b></td>
                                    <td> {{ $perfil->description }}</td>
                                    <td> {{ $perfil->created_at }}</td>
                                    <td class='right'>
                                        <a class='btn-flat waves-effect waves-red red-text text-darken-3 modal-trigger' href='#confirm-message-{{$perfil->id}}'><i class='fa fa-trash-o'></i> deletar</a>
                                        <a class='btn-flat waves-effect waves-orange amber-text text-darken-3' href='{{ route('admin.cadastro.perfis.edita', $perfil->id) }}'><i class='fa fa-edit'></i> editar</a>
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
                        <h5><i class='red-text text-darken-3 fa fa-times'></i> Não há registros de perfis!</h5>
                    </div>
                @endif
            </div>
            <div class='divider'></div>
            <br>
        </div>
    </div>
    @foreach($perfis as $perfil)
        <div id='confirm-message-{{$perfil->id}}' class='modal bottom-sheet'>
            <div class-'modal-content'>
                <h5>Deseja remover o perfil {{$perfil->name}}?</h5>
                <div class='divider'></div>
                <div class='right'>
                    <br>
                    <a class='btn-flat waves-effect waves-red red-text darken-3' href='{{ route('admin.cadastro.perfis.deleta', $perfil->id) }}'><i class='fa fa-trash-o'></i> Deletar</a>
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
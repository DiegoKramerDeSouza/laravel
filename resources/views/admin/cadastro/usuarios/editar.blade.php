<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Editar ' . $user->name)
@section('nome', 'Professor')
<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card'>
        <div class='card-content'>
            <h3 class='card-title'>
                Editar {{ $user->name }}:
            </h3>
            @if(isset($user->id))
                <form class='' action='{{ route('admin.cadastro.usuarios.atualiza', $user->id) }}' method='post' enctype="multipart/form-data">
                    <!--Formulário de cadastro e edição de usuários--> 
                    {{ csrf_field() }}
                    @include('admin.cadastro.usuarios._form')

                    <input type='hidden' name='_method' value='put' />
                    <div class='card-action' align='right'>
                        <button type='submit' class='btn green darken-2 waves-effect waves-light'><i class='fa fa-check'></i> Atualizar</button>
                    </div>
                </form>
            @else
                <br>
                <br>
                <h5 class='center grey-text'><i class='fa fa-times red-text text-darken-3'></i> Usuário não localizado!</h5>
            @endif
        </div>
    </div>
@endsection
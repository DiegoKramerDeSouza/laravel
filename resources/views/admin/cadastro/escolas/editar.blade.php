<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Editar ' . $escolas->name)
@section('nome', 'Professor')
<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card z-depth-5'>
        <div class='card-content'>
            <h3 class='card-title'>
                Editar {{ $escolas->name }}:
            </h3>
            @if(isset($escolas->id))
                <form class='' action='{{ route('admin.cadastro.escolas.atualiza', $escolas->id) }}' method='post' enctype="multipart/form-data">
                    <!--Formulário de cadastro e edição de usuários--> 
                    {{ csrf_field() }}
                    @include('admin.cadastro.escolas._form')

                    <input type='hidden' name='_method' value='put' />
                    <div class='card-action' align='right'>
                        <a href='{{ route('admin.cadastro.escolas') }}' class='btn-flat red-text text-darken-3 waves-effect waves-red'><i class='fa fa-times'></i> Cancelar</a>
                        <button type='submit' class='btn-flat green-text text-darken-2 waves-effect waves-green'><i class='fa fa-check'></i> Atualizar</button>
                    </div>
                </form>
            @else
                <br>
                <br>
                <h5 class='center grey-text'><i class='fa fa-times red-text text-darken-3'></i> Instituição não localizada!</h5>
            @endif
        </div>
    </div>
@endsection
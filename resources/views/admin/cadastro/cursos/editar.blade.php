<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Editar ' . $cursos->name)

<!--Define yield('content') em layout.site-->
@section('content')
    <div class='card z-depth-5'>
        <div class='card-content'>
            <h3 class='card-title'>
                Editar {{ $cursos->name }}:
            </h3>
            <div class='divider'></div>
            @if(isset($cursos->id))
                <form class='' action='{{ route('admin.cadastro.cursos.atualiza', $cursos->id) }}' method='post' enctype="multipart/form-data">
                    <!--Formulário de cadastro e edição de cursos--> 
                    {{ csrf_field() }}
                    @include('admin.cadastro.cursos._form')

                    <input type='hidden' name='_method' value='put' />
                    <div class='card-action' align='right'>
                        <a href='{{ route('admin.cadastro.cursos', ['page' => '1']) }}' class='load btn-flat red-text text-darken-3 waves-effect waves-red'><i class='fa fa-times'></i> Cancelar</a>
                        <button type='submit' class='load btn-flat green-text text-darken-2 waves-effect waves-green'><i class='fa fa-check'></i> Atualizar</button>
                    </div>
                </form>
            @else
                <br>
                <br>
                <h5 class='center grey-text'><i class='fa fa-times red-text text-darken-3'></i> Curso não localizado!</h5>
            @endif
        </div>
    </div>
@endsection
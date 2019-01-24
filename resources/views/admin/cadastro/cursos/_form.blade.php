@include('admin.cadastro._includes.alert')
<div class='row'>
    <div class='input-field col s12 m6'>
        <input class='validate' required type='text' name='name' id='name' value='{{ isset($resultado->name) ? $resultado->name : ''}}'>
        <label for='name'>{!! $default->loginIcon !!} Nome</label>
    </div>

    <div class='input-field col s12 m6'>
        <select id='modulo_id' required name='modulo_id'>
            @if(isset($resultado->modulo_id))
                @foreach($modulos as $modulo)
                    <option value="{{ $modulo->id }}" {{ ($modulo->id == $resultado->modulo_id) ? 'selected' : ''}}>{{ $modulo->name }}</option>
                @endforeach
            @else
                <option value="" disabled selected>Escolha um módulo</option>
                @foreach($modulos as $modulo)
                    <option value="{{ $modulo->id }}">{{ $modulo->name }}</option>
                @endforeach
            @endif
        </select>
        <label for='school_id'>{!! $default->modulosIcon !!} Módulo</label>
    </div>
</div>
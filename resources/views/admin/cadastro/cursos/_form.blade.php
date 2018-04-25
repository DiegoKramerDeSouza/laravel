<div class='row'>
    <div class='input-field col s12 m6'>
        <input class='validate' required type='text' name='name' id='name' value='{{ isset($cursos->name) ? $cursos->name : ''}}'>
        <label for='name'><i class='fa fa-user-circle'></i> Nome</label>
    </div>

    <div class='input-field col s12 m6'>
        <select id='modulo_id' required name='modulo_id'>
            @if(isset($cursos->modulo_id))
                @foreach($modulos as $modulo)
                    <option value="{{ $modulo->id }}" {{ ($modulo->id == $cursos->modulo_id) ? 'selected' : ''}}>{{ $modulo->name }}</option>
                @endforeach
            @else
                <option value="" disabled selected>Escolha um módulo</option>
                @foreach($modulos as $modulo)
                    <option value="{{ $modulo->id }}">{{ $modulo->name }}</option>
                @endforeach
            @endif
        </select>
        <label for='school_id'><i class='fa fa-database'></i> Módulo</label>
    </div>
</div>
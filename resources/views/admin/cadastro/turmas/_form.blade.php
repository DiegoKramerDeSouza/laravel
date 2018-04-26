<div class='row'>
    <div class='input-field col s12 m6'>
        <input class='validate' required type='text' name='name' id='name' value='{{ isset($turmas->name) ? $turmas->name : ''}}'>
        <label for='name'><i class='fa fa-graduation-cap'></i> Nome</label>
    </div>
    <div class='input-field col s12 m6'>
        <input class='validate' required type='text' name='login' id='login' value='{{ isset($turmas->login) ? $turmas->login : ''}}'>
        <label for='login'><i class='fa fa-user-circle'></i> Login</label>
    </div>

    <div class='input-field col s12 m6'>
        <input class='validate' required type='password' name='password' id='password' {{ isset($turmas->password) ? 'disabled' : ''}} value='{{ isset($turmas->password) ? '12345678' : ''}}'>
        <label for='password'><i class='fa fa-lock'></i> Senha</label>
    </div>
    <div class='input-field col s12 m6'>
        <input class='validate' required type='password' name='confpassword' id='confpassword' {{ isset($turmas->password) ? 'disabled' : ''}} value='{{ isset($turmas->password) ? '12345678' : ''}}'>
        <label for='confpassword'><i class='fa fa-lock'></i> Confirmar senha</label>
    </div>

    <div class='input-field col s12 m6'>
        <select id='curso_id' required name='curso_id'>
            @if(isset($turmas->curso_id))
                @foreach($cursos as $curso)
                    <option value="{{ $curso->id }}" {{ ($curso->id == $turmas->curso_id) ? 'selected' : ''}}> {{ $modulos[$curso->modulo_id] }} - {{ $curso->name }}</option>
                @endforeach
            @else
                <option value="" disabled selected>Escolha um curso</option>
                @foreach($cursos as $curso)
                    <option value="{{ $curso->id }}">{{ $modulos[$curso->modulo_id] }} - {{ $curso->name }}</option>
                @endforeach
            @endif
        </select>
        <label for='school_id'><i class='fa fa-cube'></i> Curso</label>
    </div>

    <div class='input-field col s12 m6'>
        <select id='school_id' required name='school_id'>
            @if(isset($turmas->school_id))
                @foreach($escolas as $escola)
                    <option value="{{ $escola->id . '|' . $escola->name }}" {{ ($escola->id == $turmas->school_id) ? 'selected' : ''}}>{{ $escola->name }}</option>
                @endforeach
            @else
                <option value="" disabled selected>Escolha uma escola</option>
                @foreach($escolas as $escola)
                    <option value="{{ $escola->id . '|' . $escola->name }}">{{ $escola->name }}</option>
                @endforeach
            @endif
        </select>
        <label for='school_id'><i class='fa fa-building'></i> Escola</label>
    </div>
    <div class='input-field col s12'>
        <input class='validate' type='text' name='description' id='description' value='{{ isset($turmas->description) ? $turmas->description : ''}}'>
        <label for='description'><i class='fa fa-commenting-o'></i> Descrição (opcional)</label>
    </div>
</div>
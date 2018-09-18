@include('admin.cadastro._includes.alert')
<div class='row'>
    <div class='input-field col s12 m6'>
        <input class='validate' required type='text' name='name' id='name' value='{{ isset($turmas->name) ? $turmas->name : ''}}'>
        <label for='name'>{!! $default->turmasIcon !!} Nome</label>
    </div>
    <div class='input-field col s12 m6'>
        <input class='validate' required type='text' name='login' id='login' value='{{ isset($users->login) ? $users->login : ''}}'>
        <label for='login'>{!! $default->loginIcon !!} Login</label>
    </div>
    @if(!isset($users->password))
        <div class='input-field col s12 m6'>
            <input class='validate' required type='password' name='password' id='password'>
            <label for='password'>{!! $default->lockIcon !!} Senha</label>
        </div>
        <div class='input-field col s12 m6'>
            <input class='validate' required type='password' name='password_confirmation' id='password_confirmation'>
            <label for='password_confirmation'>{!! $default->lockIcon !!} Confirmar senha</label>
        </div>
    @endif

    <div class='input-field col s12 m6'>
        <select id='curso_id_list' multiple required name='curso_id_list[]'>
            @if(isset($html))
                @foreach($html as $arrData)
                    @if($arrData['selected'])
                        <option value="{{ $arrData['id'] }}" selected>{{ $arrData['name'] }}</option>
                    @else
                        <option value="{{ $arrData['id'] }}">{{ $arrData['name'] }}</option>
                    @endif
                @endforeach
            @else
                <option value="" disabled>Escolha um curso</option>
                @foreach($cursos as $curso)
                    <option value="{{ $curso->id }}">{{ $modulos[$curso->modulo_id] }} - {{ $curso->name }}</option>
                @endforeach
            @endif
        </select>
        <label for='curso_id_list'>{!! $default->cursosIcon !!} Cursos</label>
        <input type='hidden' id='curso_id' name='curso_id' readonly>
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
        <label for='school_id'>{!! $default->institutionIcon !!} Instituição</label>
    </div>
    <div class='input-field col s12'>
        <input class='validate' type='text' name='description' id='description' value='{{ isset($turmas->description) ? $turmas->description : ''}}'>
        <label for='description'>{!! $default->descricaoIcon !!} Descrição (opcional)</label>
    </div>
</div>
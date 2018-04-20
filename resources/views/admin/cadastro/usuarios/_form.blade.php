<div class='row'>
    <div class='input-field col s12 m6'>
        <input class='validate' required type='text' name='name' id='name' value='{{ isset($user->name) ? $user->name : ''}}'>
        <label for='name'><i class='fa fa-user-circle'></i> Nome</label>
    </div>

    <div class='input-field col s12 m6'>
        <input class='validate' required type='text' name='email' id='email' value='{{ isset($user->email) ? $user->email : ''}}'>
        <label for='email'><i class='fa fa-envelope-o'></i> E-mail</label>
    </div>
</div>

<div class='row'>
    <div class='input-field col s12 m6'>
        <input class='validate' required {{ isset($user->password) ? 'disabled' : ''}} type='password' name='password' id='password' value='{{ isset($user->password) ? '1234567890' : ''}}'>
        <label for='password'><i class='fa fa-lock'></i> Senha</label>
    </div>

    <div class='input-field col s12 m6'>
        <input class='validate' required {{ isset($user->password) ? 'disabled' : ''}} type='password' name='confpassword' id='confpassword' value='{{ isset($user->password) ? '1234567890' : ''}}'>
        <label for='confpassword'><i class='fa fa-lock'></i> Confirmar Senha</label>
    </div>
</div>

<div class='row'>
    <div class='input-field col s12 m6'>
        <select id='school_id' required name='school_id'>
            @if(isset($userdata->group))
                @foreach($escolas as $escola)
                    <option value="{{ $escola->id }}" {{ ($escola->id == $userdata->school_id) ? 'selected' : ''}}>{{ $escola->name }}</option>
                @endforeach
            @else
                <option value="" disabled selected>Escola do usuário</option>
                @foreach($escolas as $escola)
                    <option value="{{ $escola->id }}">{{ $escola->name }}</option>
                @endforeach
            @endif
        </select>
        <label for='school_id'><i class='fa fa-building'></i> Escola</label>
    </div>
    <div class='input-field col s12 m6'>
        <select id='group' required name='group'>
            @if(isset($userdata->group))
                <option value="PROFESSOR" {{ ($userdata->group == 'PROFESSOR') ? 'selected' : ''}}>Professor</option>
                <option value="AUXILIAR" {{ ($userdata->group == 'AUXILIAR') ? 'selected' : ''}}>Professor Auxiliar</option>
                <option value="CLASSE" {{ ($userdata->group == 'CLASSE') ? 'selected' : '' }}>Sala de Aula</option>
            @else
                <option value="" disabled selected>Perfil do usuário</option>
                <option value="PROFESSOR" >Professor</option>
                <option value="AUXILIAR">Professor Auxiliar</option>
                <option value="CLASSE">Sala de Aula</option>
            @endif
        </select>
        <label for='group'><i class='fa fa-address-card'></i> Perfil</label>
    </div>
</div>
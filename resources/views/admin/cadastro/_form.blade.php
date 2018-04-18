<div class='row'>
    <div class='input-field col s12 m6'>
        <input class='validate' type='text' name='name' id='name' value='{{ isset($usuario->name) ? $usuario->name : ''}}'>
        <label for='name'><i class='fa fa-user-circle'></i> Nome</label>
    </div>

    <div class='input-field col s12 m6'>
        <input class='validate' type='text' name='email' id='email' value='{{ isset($usuario->email) ? $usuario->email : ''}}'>
        <label for='email'><i class='fa fa-envelope-o'></i> E-mail</label>
    </div>
</div>

<div class='row'>
    <div class='input-field col s12 m6'>
        <input class='validate' type='password' name='password' id='password' value=''>
        <label for='password'><i class='fa fa-lock'></i> Senha</label>
    </div>

    <div class='input-field col s12 m6'>
        <input class='validate' type='password' name='confpassword' id='confpassword' value=''>
        <label for='confpassword'><i class='fa fa-lock'></i> Confirmar Senha</label>
    </div>
</div>

<div class='row'>
    <div class='input-field col s12 m6'>
        <select id='escola_id' name='escola_id'>
            <option value="" disabled selected>Escola do usuário</option>
            @foreach($escolas as $escola)
                <option value="{{ $escola->id }}">{{ $escola->name }}</option>
            @endforeach
        </select>
        <label for='escola_id'>Escola</label>
    </div>
    <div class='input-field col s12 m6'>
        <select id='group' name='group'>
            <option value="" disabled selected>Perfil do usuário</option>
            <option value="COORDENADOR">Coordenador</option>
            <option value="PROFESSOR">Professor</option>
            <option value="AUXILIAR">Professor Auxiliar</option>
            <option value="CLASSE">Sala de Aula</option>
        </select>
        <label for='group'>Perfil</label>
    </div>
</div>
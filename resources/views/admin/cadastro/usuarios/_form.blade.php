<div class='row'>
    <div class='input-field col s12 m6'>
        <input class='validate' required type='text' name='name' id='name' value='{{ isset($user->name) ? $user->name : ''}}'>
        <label for='name'><i class='fa fa-user-o'></i> Nome</label>
    </div>

    <div class='input-field col s12 m6'>
        <input class='validate' required type='text' name='login' id='login' value='{{ isset($user->login) ? $user->login : ''}}'>
        <label for='login'><i class='fa fa-user-circle'></i> Usuário</label>
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
        <input class='validate' required type='text' name='email' id='email' value='{{ isset($user->email) ? $user->email : ''}}'>
        <label for='email'><i class='fa fa-envelope-o'></i> E-mail</label>
    </div>
    <div class='input-field col s12 m6'>
        <select id='group' required name='group'>
            @if(isset($userdata->group))
                <option value="" >Selecione um grupo</option>
                @foreach($perfis as $perfil)
                    <option value="{{ $perfil->id }}" {{ ($userdata->group == $perfil->id) ? 'selected' : ''}}>{{ $perfil->name }}</option>
                @endforeach
            @else
                <option value="" selected >Selecione um grupo</option>
                @foreach($perfis as $perfil)
                    <option value="{{ $perfil->id }}" >{{ $perfil->name }}</option>
                @endforeach
            @endif
        </select>
        <label for='group'><i class='fa fa-address-card'></i> Perfil</label>
    </div>
</div>
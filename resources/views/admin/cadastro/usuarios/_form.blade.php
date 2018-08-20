@include('admin.cadastro._includes.alert')
<div class='row'>
    <div class='input-field col s12 m6'>
        <input class='validate' required type='text' name='name' id='name' value='{{ isset($user->name) ? $user->name : ''}}'>
        <label for='name'>{!! $default->userOIcon !!} Nome</label>
    </div>

    <div class='input-field col s12 m6'>
        <input class='validate' required type='text' name='login' id='login' value='{{ isset($user->login) ? $user->login : ''}}'>
        <label for='login'>{!! $default->loginIcon !!} Login</label>
    </div>
</div>
@if(!isset($user->password))
    <div class='row'>
        <div class='input-field col s12 m6'>
            <input class='validate' required type='password' name='password' id='password'>
            <label for='password'>{!! $default->lockIcon !!} Senha</label>
        </div>

        <div class='input-field col s12 m6'>
            <input class='validate' required type='password' name='password_confirmation' id='password_confirmation'>
            <label for='password_confirmation'>{!! $default->lockIcon !!} Confirmar Senha</label>
        </div>
    </div>
@endif
<div class='row'>
    <div class='input-field col s12 m6'>
        <input class='validate' required type='text' name='email' id='email' value='{{ isset($user->email) ? $user->email : ''}}'>
        <label for='email'>{!! $default->envelopeIcon !!} E-mail</label>
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
        <label for='group'>{!! $default->perfisIcon !!} Perfil</label>
    </div>
</div>
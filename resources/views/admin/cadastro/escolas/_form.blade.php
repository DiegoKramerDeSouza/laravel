@include('admin.cadastro._includes.alert')
<div class='row'>
    <div class='input-field col s12 m6'>
        <input class='validate' autofocus required type='text' name='name' id='name' value='{{ isset($resultado->name) ? $resultado->name : ''}}'>
        <label for='name'>{!! $default->institutionIcon !!} Nome</label>
    </div>

    <div class='input-field col s12 m6'>
        <input class='validate' required type='text' name='register' id='register' value='{{ isset($resultado->register) ? $resultado->register : ''}}'>
        <label for='register'>{!! $default->turmasIcon !!} Registro</label>
    </div>
</div>

<div class='row'>
    <div class='input-field col s12 m4'>
            <input class='validate' required type='text' maxlength='9' name='postal' id='postal' value='{{ isset($endereco->postal) ? $endereco->postal : ''}}'>
            <label for='postal'>{!! $default->envelopeIcon !!} CEP</label>
    </div>

    <div class='input-field col s12 m8'>
        <input class='validate' required type='text' name='address' id='address' value='{{ isset($endereco->address) ? $endereco->address : ''}}'>
        <label class='active' for='address'>{!! $default->enderecoIcon !!} Endereço</label>
    </div>
</div>

<div class='row'>
    <div class='input-field col s6 m4'>
        <select id='st' required name='st'>
            @if(isset($endereco->st))
                @foreach($default->ufs as $uf)
                    <option value="{{ array_search($uf, $default->ufs) }}" {{ ($endereco->st == array_search($uf, $default->ufs)) ? 'selected' : ''}}>{{ $uf }}</option>
                @endforeach
            @else
                <option value="" disabled selected>Selecione</option>
                @foreach($default->ufs as $uf)
                    <option value="{{ array_search($uf, $default->ufs) }}">{{ $uf }}</option>
                @endforeach
            @endif
        </select>
        <label for='st'>{!! $default->globoIcon !!} Estado</label>
    </div>
    <div class='input-field col s6 m4'>
        <input class='validate' required type='text' name='city' id='city' value='{{ isset($endereco->city) ? $endereco->city : ''}}'>
        <label class='active' for='city'>{!! $default->mapIcon !!} Cidade</label>
    </div>
    <div class='input-field col s6 m4'>
            <input class='validate' required type='text' name='number' id='number' value='{{ isset($endereco->number) ? $endereco->number : ''}}'>
            <label for='number'>{!! $default->numeroIcon !!} Número</label>
        </div>
    <div class='input-field col s6 m12'>
        <input class='validate' required type='text' name='complement' id='complement' value='{{ isset($endereco->complement) ? $endereco->complement : ''}}'>
        <label for='complement'>{!! $default->plusIcon !!} Complemento</label>
    </div>
    
    <input required type='hidden' name='location' id='location' value='{{ isset($endereco->coordinates) ? $endereco->coordinates : ''}}'>
    <input required type='hidden' name='url' id='url' value='{{ $api->details }}'>
    <input required type='hidden' name='lock' id='lock' value='{{ $api->key}}'>
    <input required type='hidden' name='urlcep' id='urlcep' value='{{ $apicep->details }}'>
    <input required type='hidden' name='lockcep' id='lockcep' value='{{ $apicep->key}}'>
    
</div>


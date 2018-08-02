@include('admin.cadastro._includes.alert')
<div class='row'>
    <div class='input-field col s12 m6'>
        <input class='validate' autofocus required type='text' name='name' id='name' value='{{ isset($escolas->name) ? $escolas->name : ''}}'>
        <label for='name'>{!! $institutionIcon !!} Nome</label>
    </div>

    <div class='input-field col s12 m6'>
        <input class='validate' required type='text' name='register' id='register' value='{{ isset($escolas->register) ? $escolas->register : ''}}'>
        <label for='register'>{!! $turmasIcon !!} Registro</label>
    </div>
</div>

<div class='row'>
    <div class='input-field col s12 m4'>
            <input class='validate' required type='text' maxlength='9' name='postal' id='postal' value='{{ isset($endereco->postal) ? $endereco->postal : ''}}'>
            <label for='postal'>{!! $envelopeIcon !!} CEP</label>
    </div>

    <div class='input-field col s12 m8'>
        <input class='validate' required type='text' name='address' id='address' value='{{ isset($endereco->address) ? $endereco->address : ''}}'>
        <label class='active' for='address'>{!! $enderecoIcon !!} Endereço</label>
    </div>
</div>

<div class='row'>
    <div class='input-field col s6 m4'>
        <select id='st' required name='st'>
            @if(isset($endereco->st))
                @foreach($ufs as $uf)
                    <option value="{{ array_search($uf, $ufs) }}" {{ ($endereco->st == array_search($uf, $ufs)) ? 'selected' : ''}}>{{ $uf }}</option>
                @endforeach
            @else
                <option value="" disabled selected>Selecione</option>
                @foreach($ufs as $uf)
                    <option value="{{ array_search($uf, $ufs) }}">{{ $uf }}</option>
                @endforeach
            @endif
        </select>
        <label for='st'>{!! $globoIcon !!} Estado</label>
    </div>
    <div class='input-field col s6 m4'>
        <input class='validate' required type='text' name='city' id='city' value='{{ isset($endereco->city) ? $endereco->city : ''}}'>
        <label class='active' for='city'>{!! $mapIcon !!} Cidade</label>
    </div>
    <div class='input-field col s6 m4'>
            <input class='validate' required type='text' name='number' id='number' value='{{ isset($endereco->number) ? $endereco->number : ''}}'>
            <label for='number'>{!! $numeroIcon !!} Número</label>
        </div>
    <div class='input-field col s6 m12'>
        <input class='validate' required type='text' name='complement' id='complement' value='{{ isset($endereco->complement) ? $endereco->complement : ''}}'>
        <label for='complement'>{!! $plusIcon !!} Complemento</label>
    </div>
    
    <input required type='hidden' name='location' id='location' value='{{ isset($endereco->coordinates) ? $endereco->coordinates : ''}}'>
    <input required type='hidden' name='url' id='url' value='{{ $api->details }}'>
    <input required type='hidden' name='lock' id='lock' value='{{ $api->key}}'>
    <input required type='hidden' name='urlcep' id='urlcep' value='{{ $apicep->details }}'>
    <input required type='hidden' name='lockcep' id='lockcep' value='{{ $apicep->key}}'>
    
</div>


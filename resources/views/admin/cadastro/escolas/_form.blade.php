<div class='row'>
    <div class='input-field col s12 m6'>
        <input class='validate' autofocus required type='text' name='name' id='name' value='{{ isset($escolas->name) ? $escolas->name : ''}}'>
        <label for='name'><i class='fa fa-graduation-cap'></i> Nome</label>
    </div>

    <div class='input-field col s12 m6'>
            <input class='validate' required type='text' maxlength='9' name='postal' id='postal' value='{{ isset($endereco->postal) ? $endereco->postal : ''}}'>
            <label for='postal'><i class='fa fa-envelope-o'></i> CEP</label>
    </div>
</div>

<div class='row'>
    <div class='input-field col s6 m9'>
        <input class='validate' required type='text' name='address' id='address' value='{{ isset($endereco->address) ? $endereco->address : ''}}'>
        <label class='active' for='address'><i class='fa fa-map-marker'></i> Endereço</label>
    </div>

    <div class='input-field col s6 m3'>
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
        <label for='st'><i class='fa fa-globe'></i> Estado</label>
    </div>
</div>

<div class='row'>
    <div class='input-field col s6 m4'>
        <input class='validate' required type='text' name='city' id='city' value='{{ isset($endereco->city) ? $endereco->city : ''}}'>
        <label class='active' for='city'><i class='fa fa-map-o'></i> Cidade</label>
    </div>
    <div class='input-field col s6 m4'>
            <input class='validate' required type='text' name='number' id='number' value='{{ isset($endereco->number) ? $endereco->number : ''}}'>
            <label for='number'><i class='fa fa-tag'></i> Número</label>
        </div>
    <div class='input-field col s12 m4'>
        <input class='validate' required type='text' name='complement' id='complement' value='{{ isset($endereco->complement) ? $endereco->complement : ''}}'>
        <label for='complement'><i class='fa fa-plus-square-o'></i> Complemento</label>
    </div>
    
    <input required type='hidden' name='location' id='location' value='{{ isset($endereco->coordinates) ? $endereco->coordinates : ''}}'>
    <input required type='hidden' name='url' id='url' value='{{ $api->details }}'>
    <input required type='hidden' name='lock' id='lock' value='{{ $api->key}}'>
    <input required type='hidden' name='urlcep' id='urlcep' value='{{ $apicep->details }}'>
    <input required type='hidden' name='lockcep' id='lockcep' value='{{ $apicep->key}}'>
    
</div>
<script type="text/javascript" src="{!! asset('js/formEscola.js') !!}"></script>

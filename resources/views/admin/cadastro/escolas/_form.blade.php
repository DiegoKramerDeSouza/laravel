<div class='row'>
    <div class='input-field col s12 m6'>
        <input class='validate' required type='text' name='name' id='name' value='{{ isset($escolas->name) ? $escolas->name : ''}}'>
        <label for='name'><i class='fa fa-graduation-cap'></i> Nome</label>
    </div>

    <div class='input-field col s12 m6'>
            <input class='validate' required type='text' maxlength='9' name='postal' id='postal' value='{{ isset($endereco->postal) ? $endereco->postal : ''}}'>
            <label for='postal'><i class='fa fa-envelope-o'></i> CEP</label>
    </div>
    
</div>

<div class='row'>
    <div class='input-field col s10'>
        <input class='validate' required type='text' name='address' id='address' value='{{ isset($endereco->address) ? $endereco->address : ''}}'>
        <label for='address'><i class='fa fa-map-marker'></i> Endereço</label>
    </div>

    <div class='input-field col s2'>
        <input class='validate' required type='text' name='st' id='st' value='{{ isset($endereco->st) ? $endereco->st : ''}}'>
        <label for='st'><i class='fa fa-globe'></i> UF</label>
    </div>
</div>

<div class='row'>
    <div class='input-field col s12'>
        <input class='validate' required type='text' name='complement' id='complement' value='{{ isset($endereco->complement) ? $endereco->complement : ''}}'>
        <label for='complement'><i class='fa fa-pencil-square-o'></i> Complemento</label>
    </div>
    
    <input required type='text' name='location' id='location' value='{{ isset($endereco->location) ? $endereco->location : ''}}'>
    <input required type='hidden' name='url' id='url' value='{{ $api->details }}'>
    <input required type='hidden' name='lock' id='lock' value='{{ $api->key}}'>
    
</div>
<script type="text/javascript" src="{!! asset('js/ready.js') !!}"></script>

<div class='row'>
    <div class='input-field col s12 m6'>
        <input class='validate' required type='text' name='name' id='name' value='{{ isset($perfis->name) ? $perfis->name : ''}}'>
        <label for='name'><i class='fa fa-vcard-o'></i> Nome</label>
    </div>
    <div class='input-field col s12 m6'>
        <select id='grantList' multiple name='grantList[]'>
            @if(isset($html))
                {!! $html !!}
            @else
                @foreach($componentes as $componente)
                    <option value="{{ $componente->id }}">{{ $componente->name }}</option>
                @endforeach
            @endif
        </select>
        <label for='school_id'><i class='fa fa-shield'></i> Acessos</label>
    </div>
    <div class='input-field col s12'>
        <input class='validate' required type='text' name='description' id='description' value='{{ isset($perfis->description) ? $perfis->description : ''}}'>
        <label for='description'><i class='fa fa-commenting'></i> Descrição</label>
    </div>
    <input class='validate' required type='hidden' readonly name='grant' id='grant' value='{{ isset($perfis->grant) ? $perfis->grant : ''}}'>

</div>
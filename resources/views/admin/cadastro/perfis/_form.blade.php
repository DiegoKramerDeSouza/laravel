@include('admin.cadastro._includes.alert')
<div class='row'>
    <div class='input-field col s12 m6'>
        <input class='validate' required type='text' name='name' id='name' value='{{ isset($perfis->name) ? $perfis->name : ''}}'>
        <label for='name'>{!! $perfisIcon !!} Nome</label>
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
        <label for='school_id'>{!! $acessosIcon !!} Acessos</label>
    </div>
    <div class='input-field col s12'>
        <input class='validate' required type='text' name='description' id='description' value='{{ isset($perfis->description) ? $perfis->description : ''}}'>
        <label for='description'>{!! $descricaoIcon !!} Descrição</label>
    </div>
    <input class='validate' required type='hidden' readonly name='grant' id='grant' value='{{ isset($perfis->grant) ? $perfis->grant : ''}}'>

</div>
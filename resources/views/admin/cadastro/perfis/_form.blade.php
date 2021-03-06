@include('admin.cadastro._includes.alert')
<div class='row'>
    <div class='input-field col s12 m6'>
        <input class='validate' required type='text' name='name' id='name' value='{{ isset($resultado->name) ? $resultado->name : ''}}'>
        <label for='name'>{!! $default->perfisIcon !!} Nome</label>
    </div>
    <div class='input-field col s12 m6'>
        <select id='grantList' multiple name='grantList[]'>
            @if(isset($html))
                @foreach($html as $arrData)
                    @if($arrData['selected'])
                        <option value="{{ $arrData['id'] }}" selected>{{ $arrData['name'] }}</option>
                    @else
                        <option value="{{ $arrData['id'] }}">{{ $arrData['name'] }}</option>
                    @endif
                @endforeach
            @else
                @foreach($componentes as $componente)
                    <option value="{{ $componente->id }}">{{ $componente->name }}</option>
                @endforeach
            @endif
        </select>
        <label for='school_id'>{!! $default->acessosIcon !!} Acessos</label>
    </div>
    <div class='input-field col s12'>
        <input class='validate' required type='text' name='description' id='description' value='{{ isset($resultado->description) ? $resultado->description : ''}}'>
        <label for='description'>{!! $default->descricaoIcon !!} Descrição</label>
    </div>

</div>
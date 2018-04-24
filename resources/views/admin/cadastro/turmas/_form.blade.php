<div class='row'>
    <div class='input-field col s12 m6'>
        <input class='validate' required type='text' name='name' id='name' value='{{ isset($turmas->name) ? $turmas->name : ''}}'>
        <label for='name'><i class='fa fa-user-circle'></i> Nome</label>
    </div>
    <div class='input-field col s12 m6'>
        <select id='school_id' required name='school_id'>
            @if(isset($turmas->school_id))
                @foreach($escolas as $escola)
                    <option value="{{ $escola->id . '|' . $escola->name }}" {{ ($escola->id == $turmas->school_id) ? 'selected' : ''}}>{{ $escola->name }}</option>
                @endforeach
            @else
                <option value="" disabled selected>Escola uma escola</option>
                @foreach($escolas as $escola)
                    <option value="{{ $escola->id . '|' . $escola->name }}">{{ $escola->name }}</option>
                @endforeach
            @endif
        </select>
        <label for='school_id'><i class='fa fa-building'></i> Escola</label>
    </div>
    <div class='input-field col s12'>
        <input class='validate' type='text' name='description' id='description' value='{{ isset($turmas->description) ? $turmas->description : ''}}'>
        <label for='description'><i class='fa fa-commenting-o'></i> Descrição (opcional)</label>
    </div>
</div>
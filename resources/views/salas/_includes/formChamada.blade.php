@if($found)
    
    <div class='card z-depth-1'>
        <div class='card-content'>
            <div class='row'>
                <div class='col s12 '>
                    <span class='card-title'>
                        <b class='blue-text'>Turma:</b> {{ $turmaName }}
                    </span>
                    <div class='col s12 m6 truncate' title='{{ $tema }}'>
                        <b class='blue-text'>Tema:</b> {{ $tema }}
                    </div>
                    <div class='col s12 m6 truncate' title='{{ $aula }}'>
                        <b class='blue-text'>Aula:</b> {{ $aula }}
                    </div>
                    <div class='col s12 divider'></div>
                </div>
                <div class='card-content col s12'>
                    <table class='striped'>
                        <thead>
                            <tr>
                                <th class='blue-text'>{!! $default->userOIcon !!} Nome</th>
                                <th class='blue-text right'>{!! $default->editIcon !!} Presença</th>
                            </tr>
                        </thead>
                        <tbody>
                            <input type='hidden' class='attendance_list_class' id='{{ $turmaId }}' name='{{ $turmaId }}' disabled readonly value='{{ $turmaId }}' />
                            @foreach($allData as $users)
                                <tr>
                                    <td title='{{ $users[0] }}'>
                                        <b class='truncate'>{{ $users[0] }}</b>
                                        <input type='hidden' class='attendance_list_id' id='{{ $users[1] }}' name='{{ $users[1] }}' disabled readonly value='{{ $users[1] }}' />
                                    </td>
                                    <td>
                                        <label class='right'>
                                            <input type='checkbox' id='{{ $users[1] }}-attend' name='{{ $users[1] }}-attend' class='changeAttend attendance_list_attend' {{ ($users[2]==0 ? '' : 'checked') }} />
                                            <span id='{{ $users[1] }}-attend-label'>
                                                <span class='{{ ($users[2]==0 ? 'red-text text-darken-3' : 'green-text') }}'>
                                                    {{ ($users[2]==0 ? 'Ausente' : 'Presente') }}
                                                </span>
                                            </span> 
                                        </label>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>  
                    </table>
                    <br />
                    <div class='center'>
                        <button id='confirmAttendance' class='load btn cyan waves-effect waves-light modal-close'>{!! $default->checkLeftIcon !!} confirmar e enviar lista</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
@else

    <br />
    <div class='p-10 red-text text-darken-3 rounded-borders grey lighten-3 center'><b class='p-10'>{!! $default->cancelRedIcon !!} Turma não encontrada!</b></div>
    <br />

@endif
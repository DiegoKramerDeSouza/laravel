@if(Auth::user()->type == 0)
    <div class='card z-depth-5'>
        <div class='card-content'>
            <div class='row'>
                <div class='col s12 '>
                    <span class='card-title'>
                        <b>{!! $default->turmasIcon !!} {{ $turmaName }}</b>
                    </span>
                </div>
                <div class='card-content col s12'>
                    <span id='token' class='d-none' data-content='{{ csrf_token() }}'></span>
                    <table class='striped'>
                        <thead>
                            <tr>
                                <th class='blue-text'>{!! $default->userOIcon !!} Nome</th>
                                <th class='blue-text'>{!! $default->timeIcon !!} Presença</th>
                            </tr>
                        </thead>

                        <tbody>
                            @foreach($allData as $users)
                                <tr>
                                    <td class='truncate' title='{{ $users[0] }}'>
                                        <b>{{ $users[0] }}</b>
                                        <input type='hidden' id='{{ $turmaId }}' name='{{ $turmaId }}' disabled readonly value='{{ $turmaId }}' />
                                        <input type='hidden' id='{{ $users[1] }}' name='{{ $users[1] }}' disabled readonly value='{{ $users[0] }}' />
                                        <input type='hidden' id='{{ $users[1] }}_present' name='{{ $users[1] }}_present' disabled readonly value='{{ $users[2] }}' />
                                    </td>
                                    <td>
                                        <span class="{{ ($users[2]==0 ? 'red-text text-darken-3' : 'green-text text-darken-2') }}"><b>{{ ($users[2]==0 ? 'Ausente' : 'Presente') }}</b></span> 
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endif

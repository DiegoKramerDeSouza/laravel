
@extends('layout.site')

@section('titulo', 'Salas')

@section('content')
    <div id='initial-access' class='row'>
        <div class='white-text'>

            @if(Auth::user()->type == 0)
                <div id='opend-rooms' class='col s12 m6'>
                    <h4 class='row'>
                        <span><b>{!! $default->roomsIcon !!} Salas disponíveis</b></span>
                    </h4>
            @else
                <div id='opend-rooms' class='col s12'>
                    <h4 class='row'>
                        <span>{!! $default->roomsIcon !!} <b>Bem vindo(a) <span class='blue-text'>{{ Auth::user()->name }}</span></b></span>
                    </h4>
                    <h5 class='row'>
                        <span><b>Estas são as salas disponíveis para você:</b></span>
                    </h5>
            @endif
                <div class='divider'></div>
                <div id='public-conference'>
                    <!-- Loading de conteúdo -->
                    <div class="center blue-text text-darken-2" align='center'>
                        <h5>Encontrando salas...</h5>
                        <a class="btn-floating btn-large blue pulse">{!! $default->searchIcon !!}</a>
                        <br>
                        <br>
                        <br>                                                
                    </div>
                    <!--Listagem de Salas disponíveis-->
                </div>
            </div>

            @if(Auth::user()->type == 0)
                <div id='teacher-access' class='card z-depth-5 col s12 m6'>
                    <div class='card-content'>
                        <div class='card-title black-text'>
                            <h5>{!! $default->tvBlueIcon !!} Iniciar nova sala</h5>
                        </div>
                        <div class='row'>
                            <!--Tema e Assunto da sala-->
                            <div class='input-field col s12'>
                                <input type='text' class='validate' id='tema' name='tema' required autofocus>
                                <label for='tema'>{!! $default->bookIcon !!} Tema:</label>
                            </div>
                            <div class='input-field col s12'>
                                <input type='text' class='validate' id='assunto' name='assunto' required>
                                <label for='assunto'>{!! $default->bookmarkIcon !!} Assunto:</label>
                            </div>
                            <div class='input-field col s12'>
                                <select multiple id='cursos-list' required name='cursos-list' title='Selecione ao menos um curso'>
                                    @if(isset($cursos))
                                        <option value='' disabled>Selecione ao menos um curso</option>
                                        @foreach($cursos as $curso)
                                            <option value="{{ $curso->id }}">{{ $modulos[$curso->modulo_id] }} {{ $curso->name }}</option>
                                        @endforeach
                                    @endif
                                </select>
                                <label for='cursos-list'>{!! $default->cursosIcon !!} Seleção de Cursos</label>
                            </div>
                            <div class='divider'></div>
                            <div align='right'>
                                <button id='btn-conf-devices' class='btn teal white-text waves-effect waves-light modal-trigger' style='display:none;' href='#choose-devices'>{!! $default->configIcon !!} Dispositivos</button>
                                <button type='submit' id='btn-join-as-productor' class='btn blue white-text waves-effect waves-light'>{!! $default->playButtomIcon !!} Iniciar</button>
                            </div>
                        </div> 
                    </div>
                </div>
                <input type='hidden' id='target' name='target' disabled readonly />
            @else
                <span id='btn-join-as-productor' class='d-none'></span>
                <input type='hidden' id='target' name='target' readonly disabled value='{{ $turmas->curso_id }}' />
            @endif
        </div>
    </div>

    <!-- Nome da conexão, tipo e nome do usuário -->
    <input type='hidden' id='room-id' name='room-id' value='{{ Auth::user()->login }}-{{ Auth::user()->name }}-{!! rand(0,999) !!}' disabled readonly />
    <input type='hidden' id='room-type' name='room-type' value='{{ Auth::user()->type }}' disabled readonly />
    <input type='hidden' id='current-user' value='{{ Auth::user()->name }}' disabled readonly />
    <!-- ID do broadcaster, sala e tela -->
    <input type='hidden' id='broadcaster' name='broadcaster' disabled readonly />
    <input type='hidden' id='in-room' name='in-room' disabled readonly />
    <input type='hidden' id='in-screen' name='in-screen' disabled readonly />

    <!-- Sidebar de painel de chat -->
    <ul id="slide-out" class="sidenav grey lighten-4 z-depth-5">
        <div class='row'>
            <div id='chat-textarea' class=''>
                <div id='chat-panel' class='white-text'>
                    <!-- Output de mensagens -->
                </div>
            </div>
            <div id='message-writer-content' class='grey lighten-4'>
                <div class='divider'></div>
                <div class='file-field input-field' style=''>
                    <a id='send-message-btn' class='btn-floating waves-effect waves-light blue right'>
                        {!! $default->sendIcon !!}
                    </a>
                    <div class='file-path-wrapper'>
                        <!-- Input de mensagem -->
                        {!! $default->prefixCommentingIcon !!}
                        <input type='text' class='' id='text-message' placeholder='Chat'>
                    </div>
                </div>
            </div>
        </div>
    </ul>

    <!-- Controles e Mídias -->
    @include('salas._includes.midia')
    
    @if(isset($streamPage))
        <!-- Modals -->
        @include('salas._includes.elements.modals')

        <!-- Controle de acesso de usuários à transmissão -->
        @if(Auth::user()->type == 0)
            <!-- Botão de desconexão de usuário em transmissão -->
            <div id='div-end' class='fixed-action-btn d-none' title='Finalizar participação'>
                <a id='end-session' class='btn-floating btn-large waves-effect waves-light red darken-2' data-active='disabled'>
                    {!! $default->videocamoffLargeIcon !!}
                </a>
            </div>
        @endif
        <!-- Botão de ingresso de usuário em transmissão -->
        <div id='div-enter' class='fixed-action-btn d-none' title='Ingressar'>
            <a id='enter-session' class='btn-floating btn-large waves-effect waves-light cyan pulse' data-active='disabled'>
                {!! $default->videocamLargeIcon !!}
            </a>
        </div>
    @endif
@endsection
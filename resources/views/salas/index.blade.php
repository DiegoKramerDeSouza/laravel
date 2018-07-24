
@extends('layout.site')

@section('titulo', 'Salas')

@section('content')
    <div id='initial-access' class='row'>
        <div class='white-text'>

            @if(Auth::user()->type == 0)

                <div id='opend-rooms' class='col s12 m6'>
                    <h5 class='row'>
                        <span><b>{!! $roomsIcon !!} Salas disponíveis</b></span>
                    </h5>

            @else

                <div id='opend-rooms' class='col s12'>
                    <h4 class='row'>
                        <span>{!! $roomsIcon !!} <b>Bem vindo(a) <span class='blue-text'>{{ Auth::user()->name }}</span></b></span>
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
                        <a class="btn-floating btn-large blue pulse">{!! $searchIcon !!}</a>
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
                            <h5>{!! $tvBlueIcon !!} Iniciar nova sala</h5>
                        </div>
                        <div class='row'>
                            <!--Tema e Assunto da sala-->
                            <div class='input-field col s12'>
                                <input type='text' class='validate' id='tema' name='tema' required autofocus>
                                <label for='tema'>{!! $bookIcon !!} Tema:</label>
                            </div>
                            <div class='input-field col s12'>
                                <input type='text' class='validate' id='assunto' name='assunto' required>
                                <label for='assunto'>{!! $bookmarkIcon !!} Assunto:</label>
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
                                <label for='cursos-list'>{!! $cursosIcon !!} Seleção de Cursos</label>
                            </div>
                            <div class='divider'></div>
                            <div align='right'>
                                <button type='submit' id='btn-join-as-productor' class='btn blue white-text waves-effect waves-light'>{!! $playButtomIcon !!} Iniciar</button>
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

    <!-- Controles e Mídias -->
    @include('salas._includes.midia')
    
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
                        {!! $sendIcon !!}
                    </a>
                    <div class='file-path-wrapper'>
                        <!-- Input de mensagem -->
                        {!! $prefixCommentingIcon !!}
                        <input type='text' class='' id='text-message' placeholder='Chat'>
                    </div>
                </div>
            </div>
        </div>
    </ul>

    @if(isset($streamPage))
        @if(Auth::user()->type == 0)

            <!-- Modal de solicitação de vez-->
            <div id='msg-solicita' class='modal'>
                <div class='modal-content'>
                    <h5>
                        {!! $panToolBlueIcon !!} Solicitações:
                        <span class='right'>
                            <a class='modal-close'>
                                {!! $cancelRedIcon !!}
                            </a>
                        </span>
                    </h5>
                    <div class='divider'></div>
                    <ul id='solicita-list' class='collection'>
                        <li align='center' class='red-text text-darken-3 p-40' ><b>{!! $cancelRedIcon !!} Não há solicitações no momento.</b></li>
                    </ul>
                    <br>
                </div>
            </div>
            <!-- Modal de extensão compartilhamento de tela -->
            <div id='msg-share' class='modal'>
                <div class='modal-content'>
                    <h5>
                        <i class='material-icons blue-text'>extension</i> Extensão do Chrome:
                        <span class='right'>
                            <a class='modal-close'>
                                {!! $cancelRedIcon !!}
                            </a>
                        </span>
                    </h5>
                    <div class='divider'></div>
                    <div class='red-text text-darken-3'>
                        <p>Para compartilhar sua tela, seu navegador deve possuir a extensão do {{ $logo }}.</p>
                        <p><b>Deseja instalar a extensão do {{ $logo }} para o navegador Google Chrome?</b></p>
                    </div>
                    <br>
                </div>
                <div class='modal-action'>
                    <a href='{!! $chromeExt !!}' target='_blank' onclick='chrome.webstore.install()' class='right btn-flat blue-text text-darken-2 waves-effect waves-teal'>{!! $applyIcon !!} sim, instalar</a>
                    <a class='modal-close right btn-flat red-text text-darken-3 waves-effect waves-red'>{!! $cancelIcon !!} não</a>
                </div>
            </div>
            <!-- Botão de desconexão de usuário em transmissão -->
            <div id='div-end' class='fixed-action-btn d-none' title='Finalizar participação'>
                <a id='end-session' class='btn-floating btn-large waves-effect waves-light red darken-2' data-active='disabled'>
                    {!! $videocamoffLargeIcon !!}
                </a>
            </div>

        @else

            <div id='msg-informa-espectadores' class='modal'>
                <div class='modal-content'>
                    <h5>
                        {!! $peopleIcon !!} Espectadores:
                        <span class='right'>
                            <a class='modal-close'>
                                {!! $cancelRedIcon !!}
                            </a>
                        </span>
                    </h5>
                    <div class='divider'></div>
                    <p>Por favor informe quantas pessoas estão acompanhando esta apresentação:</p>

                    <br>
                </div>
            </div>
            
        @endif

        <!-- Botão de ingresso de usuário em transmissão -->
        <div id='div-enter' class='fixed-action-btn d-none' title='Ingressar'>
            <a id='enter-session' class='btn-floating btn-large waves-effect waves-light cyan pulse' data-active='disabled'>
                {!! $videocamLargeIcon !!}
            </a>
        </div>
        
    @endif
@endsection
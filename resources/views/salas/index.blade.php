<!--Estende layout/site.blade.php-->
@extends('layout.site')
<!--Define yield('titulo') em layout._includes.top-->
@section('titulo', 'Salas de aula')

<!--Define yield('content') em layout.site-->
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
                    <!--Div de loading de conteúdo. Apenas demonstrativa-->
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
            <!--Acesso para criação de sala: Apenas para usuários do tipo 0 (Agente)-->
            @if(Auth::user()->type == 0)
                <div id='teacher-access' class='card z-depth-5 col s12 m6'>
                    <div class='card-content'>
                        <div class='card-title black-text'>
                            <h5>{!! $tvBlueIcon !!} Iniciar nova sala</h5>
                        </div>
                        <div class='row'>
                            <!--Tema e Assunto da aula-->
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
                <input type='hidden' id='btn-join-as-productor' readonly disabled />
                <input type='hidden' id='target' name='target' readonly disabled value='{{ $turmas->curso_id }}' />
            @endif
        </div>
    </div>

    <!--Campos de controle-->
    <input type='hidden' id='room-id' name='room-id' value='{{ Auth::user()->login}}-{{ Auth::user()->name}}-{!! rand(0,999) !!}' disabled readonly />
    <!-- ID do broadcaster-->
    <input type='hidden' id='broadcaster' name='broadcaster' disabled readonly />
    <!-- ID da sala e tela-->
    <input type='hidden' id='in-room' name='in-room' disabled readonly />
    <input type='hidden' id='in-screen' name='in-screen' disabled readonly />
    <!-- Usuário-->
    <input type='hidden' id='current-user' value='{{ Auth::user()->name}}' disabled readonly />
    <!--Video Panel - Não exibido a princípio-->
    <div id='video-panel' class='d-none'>
        <div class='col s12'>
            <!--Card de vídeo-->
            <div class='card'>
                <div class='card-content'>
                    <div id='class-suptitle'>
                        <span id='class-title' class='card-title'>
                            <!--Título da aula - Matéria (Assunto)-->
                        </span>
                    </div>
                    <div class='divider'></div>
                    <br>
                    <div class='row'>
                        <!--Div de loading de conteúdo (Apenas demonstrativa)-->
                        <div id='div-connect' class='col s12'>
                            <div align='center' style='margin-top:50px;'>
                                <h6 class='blue-text'>Conectando...</h6>
                            </div>
                            <div class="progress grey lighten-3">
                                <div class="indeterminate blue"></div>
                            </div>
                        </div>
                        @if(Auth::user()->type == 0)
                            <div id='screen-share-alert' align='left' class='col s12 d-none'>
                                <div id='screen-share-message' class='col s8 offset-s2 center'>
                                    <div class='card-panel grey lighten-5 z-depth-1'>
                                        <div class="row valign-wrapper">
                                            <div class="col s2 m1">
                                                <span class='btn-floating red darken-2 pulse'>{!! $tvIcon !!}</span>
                                            </div>
                                            <div class="col s10 m11">
                                                <span class="grey-text text-darken-2">
                                                    <b>Você está transmintindo a sua tela.</b>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @endif
                        <div id='div-main-video' class='col s12'>
                            <div id='main-video' align='center' class='inroom mainView'>
                                <div id='videos'>
                                    <!--VÍDEO PRINCIPAL-->
                                    <div id='span-video-preview' data-status='disabled' data-position='main' class='width-limit first-video'>
                                        <video id="video-preview" class="responsive-video" preload="none" loop ></video>
                                        <div id='div-exit-fullscreen' class='fixed-action-btn d-none'>
                                            <a id='exit-fullscreen' class='btn-floating btn-large blue darken-2'>
                                                {!! $fullscreenExitLargeIcon !!}
                                            </a>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </div>
                        <div id='div-incoming-videos' data-active='out' class='d-none col'>
                            <!--TERCEIRO VÍDEO-->
                            <div id='span-video-preview-3rd' data-status='disabled' data-position='second' class='col s12 d-none'>
                                <video id="thirdvideo-preview" preload="none" loop class='min-video responsive-video'></video>
                            </div>
                            <!--SEGUNDO VÍDEO-->
                            <div id='span-video-preview-2nd' align='right' data-status='disabled' data-position='second' class='col s12 d-none'>
                                <a id='swap-video' class='btn-floating blue darken-2 waves-effect waves-light'>
                                    {!! $swapIcon !!}
                                </a>
                                <video id="secondvideo-preview" preload="none" loop class='min-video responsive-video'></video>
                            </div>
                        </div>
                        <div class='col s12'>
                            <div class='row'>
                                <div id='div-controller' class='d-none col s12 center'>
                                    <div id='nav-controller' class='container'>
                                        <!-- Barra de controle de mídia -->
                                        <div class='controllers-container blue-text center grey lighten-4'>
                                            <span id='li-toggle-camera'>
                                                <a id='toggle-camera' data-active='enabled' class='media-control btn-floating btn-large' data-position='top' title='Camera'>
                                                    {!! $videocamIcon !!}
                                                </a>
                                            </span>
                                            <span id='li-toggle-mute'>
                                                <a id='toggle-mute' data-active='enabled' class='media-control btn-floating btn-large' data-position='top' title='Microfone'>
                                                    {!! $micIcon !!}
                                                </a>
                                            </span>
                                            <span id='li-toggle-volume'>
                                                <a id='toggle-volume' data-active='enabled' class='media-control btn-floating btn-large' data-position='top' title='Áudio'>
                                                    {!! $volumeUpIcon !!}
                                                </a>
                                            </span>
                                            <span id='li-share-screen'>
                                                <a id='share-screen' data-active='enabled' class='media-control btn-floating btn-large' data-position='top' title='Compartilhar Tela'>
                                                    {!! $screenShareIcon !!}
                                                </a>
                                            </span>
                                            <span id='li-toggle-screen'>
                                                <a id='toggle-screen' data-active='enabled' class='media-control btn-floating btn-large' data-position='top' title='Tela cheia'>
                                                    {!! $fullscreenIcon !!}
                                                </a>
                                            </span>
                                            <span id='li-toggle-size'>
                                                    <a id='toggle-size' data-active='enabled' class='media-control btn-floating btn-large' data-position='top' title='Expandir'>
                                                        {!! $sizeIcon !!}
                                                    </a>
                                                </span>
                                            <span id='li-toggle-chat'>
                                                <a id='toggle-chat' data-target='slide-out' class='media-control btn-floating btn-large sidenav-trigger' data-position='top' title='Chat'>
                                                    {!! $forumIcon !!}
                                                </a>
                                            </span>
                                            <span id='li-pedir-vez'>
                                                <a id='sol-pedir' data-active='enabled' class='media-control btn-floating btn-large' title='Solicitar vez'>
                                                    {!! $panToolIcon !!} 
                                                </a>
                                            </span>
                                            <span id='control-pedir-vez' class=''>
                                                <a id='lista-pedir-vez' data-active='enabled' class='media-control btn-floating btn-large modal-trigger' data-position='top' title='Solicitações' href='#msg-solicita'>
                                                    {!! $panToolIcon !!} 
                                                </a>
                                                <span id='count-pedir-vez' href='#msg-solicita' class='btn-floating btn-small red darken-4 pulse modal-trigger'>0</span>
                                            </span>
                                            <input id='pedir-vez' type='hidden' disabled readonly value='0' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class='row'>
                                <!-- Controle de espectadores conectados -->
                                <ul id="connected-users" class='collapsible popout d-none'>
                                    <li>
                                        <div class="collapsible-header"><b><i class="fa fa-play-circle-o blue-text">
                                            </i>Espectadores online: <span id="users-counter" data-target='{{ Auth::user()->type  }}' class="blue-text">0</span></b>
                                        </div>
                                        <div id="connected-users-list" class="collapsible-body active">
                                            <!-- Lista de espectadores ativos -->
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Sidebar de painel de chat -->
    <ul id="slide-out" class="sidenav grey lighten-4 z-depth-5">
        <div class='row'>
            <div id='chat-textarea' class=''>
                <div id='chat-panel' class='white-text'>
                    <!--Output de mensagem-->
                </div>
            </div>
            <div id='message-writer-content' class='grey lighten-4'>
                <div class='divider'></div>
                <div class='file-field input-field' style=''>
                    <a id='send-message-btn' class='btn-floating waves-effect waves-light blue right'>
                        {!! $sendIcon !!}
                    </a>
                    <div class='file-path-wrapper'>
                        <!--Input de mensagem-->
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
                        <li align='center' class='red-text text-darken-3' style='padding:40px;' ><b>{!! $cancelRedIcon !!} Não há solicitações no momento.</b></li>
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
        @endif
        <!-- Botão de ingresso de usuário em transmissão -->
        <div id='div-enter' class='fixed-action-btn d-none' title='Ingressar'>
            <a id='enter-session' class='btn-floating btn-large waves-effect waves-light cyan pulse' data-active='disabled'>
                {!! $videocamLargeIcon !!}
            </a>
        </div>
        
    @endif
@endsection
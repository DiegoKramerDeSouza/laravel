
    <!--Video Panel -->
    <div id='video-panel' class='d-none'>
        <div class='col s12'>
            <!--Card de vídeo-->
            <div class='card grey darken-4 rounded-borders'>
                
                <div id='started_room' class='card-content rounded-borders'>
                    <div id='class-suptitle' class='dark-grey p-10 rounded-borders'>
                        <span class='right'>
                            <a href='' title='Sair' class='red-text text-darken-4'>{!! $default->exitRoom !!}</a>
                        </span>
                        <span id='screen-share-alert' title='Você está transmintindo a sua tela' class='d-none left'>
                            <a href='#started_room' id='alert-share' class='btn-floating red darken-4 pulse'>{!! $default->tvIcon !!}</a>
                        </span>&nbsp;
                        <span id='class-title' class='white-text'>
                            <!-- Matéria (Assunto) -->
                        </span>
                    </div>
                    
                    <br>
                    <div class='row'>
                        <!-- Loading de conteúdo -->
                        <div id='div-connect' class='col s12'>
                            <div align='center' class='mt-50'>
                                <h6 class='blue-text'>{!! $default->connecting !!}</h6>
                            </div>
                            <div class="progress grey darken-4">
                                <div class="indeterminate blue"></div>
                            </div>
                        </div>
                         
                        <div class='row'>
                            <div id='room-status' class='col s12 m12 l2 blue-text d-none obj-invisible'>
                                <div class='row p-10' align='center'>
                                    <!-- STATUS DA SALA -->
                                    <div class="col s5 m4 l12 push-s1" title='Tempo conectado'>
                                        {!! $default->timeIconLeft !!} 
                                        <span id='current-time' class='white-text left'>
                                            <span id='currentHour'>--</span>:<span id='currentMin'>--</span>:<span id='currentSec'>--</span>
                                        </span>
                                    </div>
                                    <div class="col s5 m4 l12 push-s1" title='Espectadores'>
                                        {!! $default->peopleIconLeft !!} <span id='current-users' class='white-text left'>0</span>
                                    </div>
                                    <div id="token_Detection" class="col m4 l12 hide-on-small-and-down d-none" align="left">
                                        <span id="tokenOn" class="d-none blue-text" title='Token Conectado'>{!! $default->tokenUsb !!}<b>ON</b></span>
                                        <span id="tokenOff" class="d-none red-text" title='Token Desconectado'>{!! $default->tokenUsb !!}<b>OFF</b></span>
                                    </div>
                                    <div class="d-none">
                                        <!-- BOTÃO DE VALIDAÇÃO DO TOKEN DE ACESSO -->
                                        <a id='call-token' class='btn btn-floating blue waves-effect waves-light'><i class='material-icons'>usb</i></a>
                                    </div>
                                </div>
                            </div>                 
                            <div id='div-main-video' class='col s12 m8 l8 push-m2 d-none obj-invisible'>
                                <div class=''>
                                    <div id='main-video' align='center' class='inroom mainView'>
                                        <div id='videos'>
                                            <!--VÍDEO PRINCIPAL-->
                                            <div id='span-video-preview' data-status='disabled' data-position='main' class='width-limit first-video'>
                                                <video id="video-preview" class="responsive-video" preload="none" loop ></video>
                                                <div id='div-exit-fullscreen' class='fixed-action-btn d-none'>
                                                    <a id='exit-fullscreen' class='btn-floating btn-large blue darken-2'>
                                                        {!! $default->fullscreenExitLargeIcon !!}
                                                    </a>
                                                </div>
                                            </div> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id='div-incoming-videos' data-active='out' class='col s12 m2 l2 push-m2 d-none obj-invisible' align='center'>
                                <div class='row'>
                                    <!--TERCEIRO VÍDEO-->
                                    <div id='span-video-preview-3rd' align="center" data-status='disabled' data-position='second' class='col s12 d-none'>
                                        <video id="thirdvideo-preview" draggable="false" preload="none" loop class='min-video responsive-video'></video>
                                    </div>
                                    <!--SEGUNDO VÍDEO-->
                                    <div id='span-video-preview-2nd' align="center" data-status='disabled' data-position='second' class='col s12 d-none'>
                                        <a id='swap-video' title='Passar para vídeo principal' class='btn-floating blue darken-2 waves-effect waves-light obj-invisible'>
                                            {!! $default->swapIcon !!}
                                        </a>
                                        <video id="secondvideo-preview" draggable="false" preload="none" loop class='min-video responsive-video'></video>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class='col s12'>
                            <!-- Controles de mídia -->
                            @include('salas._includes.controles')

                            <div class='row'>
                                <!-- Controle de espectadores conectados -->
                                <ul id="connected-users" class='collapsible popout d-none'>
                                    <li>
                                        <div class="collapsible-header white-text dark-grey">
                                            <span class="blue-text">{!! $default->peopleIconLeft !!}</span>
                                            <b> Espectadores: <span id="users-counter" data-target='{{ Auth::user()->type  }}' class="blue-text">0</span></b>
                                        </div>
                                        <div id="connected-users-list" class="collapsible-body active white-text">
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
            <div id='chat-textarea'>
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
    <!-- Sidebar de painel de arquivos enviados/recebidos -->
    <div id='files-side-bar' class='sidenav z-depth-5 grey darken-4'>
        <h4 class='blue-text m-10'><b>Web<span class='white-text'>Tv</span></b></h4>
        <div class='divider'></div>
        <div id='exp-files' align='left'>
            <div id='send-files' class='blue-text'>
                <div class='p-10'>
                    <h6><b>{!! $default->blueCloudUpload !!} Arquivos Enviados</b></h6>
                </div>
                <div id='send-pool' class='files-pool p-10 m-10 dark-grey rounded-borders'>
                    <div id='div-sended-files' class=''>
                        <!-- Lista de arquivos enviados -->
                    </div>
                </div>
            </div>
            <div id='receive-files' class='blue-text'>
                <div class='p-10'>
                    <h6><b>{!! $default->blueCloudDownload !!} Arquivos Recebidos</b></h6>
                </div>
                <div id='receive-pool' class='files-pool p-10 m-10 dark-grey rounded-borders'>
                    <div id='file-transfering' class='blue-text '></div>
                    <div id='div-file-sharing'>
                        <!-- Lista de arquivos compartilhados -->
                    </div>
                </div>
            </div>
        </div>
    </div>

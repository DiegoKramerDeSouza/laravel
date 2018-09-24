
    <!--Video Panel -->
    <div id='video-panel' class='d-none'>
        <div class='col s12'>
            <!--Card de vídeo-->
            <div class='card grey darken-4 '>
                <div class='card-content rounded-borders'>
                    <div id='class-suptitle' class='black p-10 rounded-borders'>
                        <span id='screen-share-alert' title='Você está transmintindo a sua tela' class='d-none left'>
                            <a href='#' class='btn-floating red darken-4 pulse'>{!! $default->tvIcon !!}</a>
                        </span>&nbsp;
                        <span id='class-title' class='white-text'>
                            <!-- Matéria: Assunto -->
                        </span>
                    </div>
                    
                    <br>
                    <div class='row'>
                        <!-- Loading de conteúdo -->
                        <div id='div-connect' class='col s12'>
                            <div align='center' class='mt-50'>
                                <h6 class='blue-text'>Conectando...</h6>
                            </div>
                            <div class="progress grey darken-4">
                                <div class="indeterminate blue"></div>
                            </div>
                        </div>
                         
                        <div class='row'>
                            <div id='file-list' class='col s12 m1 blue-text'>
                                
                                <div id='min-files' align='center'>
                                    <span id='min-send-files' title='Arquivos Enviados' class='d-none'>
                                        <a href='#' id='call-send-files' class='media-control btn-floating btn-large'>
                                            {!! $default->blueCloudUploadLg !!}
                                        </a>
                                        <b><span id='count-send-files' class='inform-files btn-floating btn-small white-text red darken-4'>0</span></b>
                                    </span>
                                    <span id='min-receive-files' title='Arquivos Recebidos' class='d-none'>
                                        <a href='#' id='call-receive-files' class='media-control btn-floating btn-large'>
                                            {!! $default->blueCloudDownloadLg !!}
                                        </a>
                                        <b><span id='count-receive-files' class='inform-files btn-floating btn-small white-text red darken-4'>0</span></b>
                                    </span>
                                </div>
                                <div id='exp-files' class='d-none'>
                                    <div id='send-files' class='blue-text' align='left'>
                                        <div class=''>
                                            <h6 class='truncate'><a href='#' id='call-send-min'>{!! $default->chevronLeftLeft !!} Arquivos Enviados:</a></h6>
                                            <div class='divider'></div>
                                        </div>
                                        <div class="files-pool p-10 mt-10 rounded-borders">
                                            <div id='div-sended-files' class='truncate'>
                                                <!-- Lista de arquivos enviados -->
                                            </div>
                                        </div>
                                    </div>
                                    <div id='receive-files' class='blue-text' align='left'>
                                        <div class=''>
                                            <h6 class='truncate'><a href='#' id='call-receive-min'>{!! $default->chevronLeftLeft !!} Arquivos Recebidos:</a></h6>
                                            <div class='divider'></div>
                                        </div>
                                        <div class="files-pool p-10 mt-10 rounded-borders">
                                            <div id='file-transfering' class='blue-text '></div>
                                            <div id='div-file-sharing' class='truncate'>
                                                <!-- Lista de arquivos compartilhados -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br/>
                            </div>                 
                            <div id='div-main-video' class='col s12 m10'>
                                <div class='row'>
                                    <div id='main-video' align='center' class='inroom mainView col s12'>
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
                            <div id='div-incoming-videos' data-active='out' class='col s12 m1'>
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
                                        <div class="collapsible-header white-text black"><b>
                                            <span class="blue-text">{!! $default->peopleIconLeft !!}</span>
                                            </i>Espectadores: <span id="users-counter" data-target='{{ Auth::user()->type  }}' class="blue-text">0</span></b>
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
    
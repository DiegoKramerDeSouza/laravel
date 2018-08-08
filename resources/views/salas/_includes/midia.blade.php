
    <!--Video Panel -->
    <div id='video-panel' class='d-none'>
        <div class='col s12'>
            <!--Card de vídeo-->
            <div class='card'>
                <div class='card-content'>
                    <div id='class-suptitle'>
                        <span id='class-title' class='card-title'>
                            <!-- Matéria: Assunto -->
                        </span>
                    </div>
                    <div class='divider'></div>
                    <br>
                    <div class='row'>
                        <!-- Loading de conteúdo -->
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
                                <a id='swap-video' title='Passar para vídeo principal' class='btn-floating blue darken-2 waves-effect waves-light obj-invisible'>
                                    {!! $swapIcon !!}
                                </a>
                                <video id="secondvideo-preview" draggable="false" preload="none" loop class='min-video responsive-video'></video>
                            </div>
                        </div>
                        <div class='col s12'>
                            
                            <!-- Controles de mídia -->
                            @include('salas._includes.controles')

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
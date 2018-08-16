
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
                    @if(Auth::user()->type == 0)
                        <span id='li-sharing-file'>
                            <a id='file-sharing' data-active='enabled' class='media-control btn-floating btn-large' title='Compartilhar arquivos'>
                                {!! $shareIcon !!} 
                            </a>
                        </span>
                    @endif
                    <span id='control-pedir-vez' class=''>
                        <a id='lista-pedir-vez' data-active='enabled' class='media-control btn-floating btn-large modal-trigger' data-position='top' title='Solicitações' href='#msg-solicita'>
                            {!! $panToolIcon !!} 
                        </a>
                        <span id='count-pedir-vez' href='#msg-solicita' class='btn-floating btn-small red darken-4 pulse modal-trigger'>0</span>
                    </span>
                    <input id='pedir-vez' type='hidden' disabled readonly value='0' />
                </div>
            </div>
            <div id='send-files' class='container blue-text' align='left'>
                <div class=''>
                    <h6>{!! $blueCloudUpload !!} Arquivos Enviados:</h6>
                    <div class='divider'></div>
                </div>
                <br/>
                <div class="files-pool">
                    <div id='div-sended-files' class='container'>
                        <!-- Lista de arquivos enviados -->
                    </div>
                </div>
            </div>
            <div id='receive-files' class='container blue-text' align='left'>
                <div class=''>
                    <h6>{!! $blueCloudDownload !!} Arquivos Recebidos:</h6>
                    <div class='divider'></div>
                </div>
                <br/>
                <div class="files-pool">
                    <div id='file-transfering' class='blue-text container'></div>
                    <div id='div-file-sharing' class='container'>
                        <!-- Lista de arquivos compartilhados -->
                    </div>
                </div>
            </div>
        </div>
    </div>
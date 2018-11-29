
    <div class='row'>
        <div id='div-controller' class='d-none col s12 center'>
            <div id='nav-controller' class='container'>
                <!-- Barra de controle de mídia -->
                <div class='controllers-container blue-text center dark-grey'>

                    
                    <span id='li-toggle-camera' class='d-none'>
                        <a id='toggle-camera' data-active='enabled' class='media-control btn-floating btn-large' data-position='top' title='Camera'>
                            {!! $default->videocamIcon !!}
                        </a>
                    </span>
                    <span id='li-toggle-mute' class='d-none'>
                        <a id='toggle-mute' data-active='enabled' class='media-control btn-floating btn-large' data-position='top' title='Microfone'>
                            {!! $default->micIcon !!}
                        </a>
                    </span>
                    

                    <span id='li-toggle-volume'>
                        <a id='toggle-volume' data-active='enabled' class='media-control btn-floating btn-large red' data-position='top' title='Mudo'>
                            {!! $default->volumeDownIcon !!}
                        </a>
                    </span>
                    <span id='li-toggle-screen'>
                        <a id='toggle-screen' data-active='enabled' class='media-control btn-floating btn-large' data-position='top' title='Tela cheia'>
                            {!! $default->fullscreenIcon !!}
                        </a>
                    </span>
                    <span id='li-toggle-size'>
                        <a id='toggle-size' data-active='enabled' class='media-control btn-floating btn-large' data-position='top' title='Expandir'>
                            {!! $default->sizeIcon !!}
                        </a>
                    </span>
                    <span id='li-share-screen'>
                        <a id='share-screen' data-active='enabled' class='media-control btn-floating btn-large' data-position='top' title='Compartilhar Tela'>
                            {!! $default->screenShareIcon !!}
                        </a>
                    </span>
                    <span id='li-toggle-chat'>
                        <a id='toggle-chat' data-target='slide-out' class='media-control btn-floating btn-large sidenav-trigger' data-position='top' title='Chat'>
                            {!! $default->forumIcon !!}
                        </a>
                    </span>
                    <span id='li-pedir-vez'>
                        <a id='sol-pedir' data-active='enabled' class='media-control btn-floating btn-large' title='Solicitar vez'>
                            {!! $default->panToolIcon !!} 
                        </a>
                    </span>
                    <span id='control-pedir-vez'>
                        <a id='lista-pedir-vez' data-active='enabled' class='media-control btn-floating btn-large modal-trigger' data-position='top' title='Solicitações' href='#msg-solicita'>
                            {!! $default->panToolIcon !!} 
                        </a>
                        <span id='count-pedir-vez' href='#msg-solicita' class='btn-floating btn-small red darken-4 pulse modal-trigger'>0</span>
                    </span>
                    <span id='li-sharing-file'>
                        <a id='file-sharing' data-active='enabled' class='media-control btn-floating btn-large' title='Compartilhar arquivos'>
                            {!! $default->shareIcon !!} 
                        </a>
                    </span>
                    <span id='min-files'>
                        <span id='min-send-files' title='Arquivos Enviados'>
                            <a href='#' id='view-send-files' class='sidenav-trigger media-control btn-floating btn-large' data-target='files-side-bar'>
                                {!! $default->blueCloudUploadLg !!}
                            </a>
                            <b><span id='count-send-files' class='inform-files btn-floating btn-small white-text blue'>0</span></b>
                        </span>
                        <span id='min-receive-files' title='Arquivos Recebidos'>
                            <a href='#' id='view-receive-files' class='sidenav-trigger media-control btn-floating btn-large' data-target='files-side-bar'>
                                {!! $default->blueCloudDownloadLg !!}
                            </a>
                            <b><span id='count-receive-files' class='inform-files btn-floating btn-small white-text blue'>0</span></b>
                        </span>
                    </span>

                    <input id='pedir-vez' type='hidden' disabled readonly value='0' />
                </div>
            </div>
        </div>
    </div>
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
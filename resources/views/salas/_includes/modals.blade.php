
@if(Auth::user()->type == 0)
    <!-- Modal de solicitação de vez-->
    <div id='msg-solicita' class='modal'>
        <div class='modal-content'>
            <h5>
                {!! $default->panToolBlueIcon !!} Solicitações:
                <span class='right'>
                    <a class='modal-close'>
                        {!! $default->cancelRedIcon !!}
                    </a>
                </span>
            </h5>
            <div class='divider'></div>
            <ul id='solicita-list' class='collection'>
                <li align='center' class='red-text text-darken-3 p-40' ><b>{!! $default->cancelRedIcon !!} Não há solicitações no momento.</b></li>
            </ul>
            <br>
        </div>
    </div>
    <!-- Modal de extensão compartilhamento de tela -->
    <div id='msg-share' class='modal'>
        <div class='modal-content'>
            <h5>
                {!! $default->blueExtension !!} Extensão do Chrome:
                <span class='right'>
                    <a class='modal-close'>
                        {!! $default->cancelRedIcon !!}
                    </a>
                </span>
            </h5>
            <div class='divider'></div>
            <div class='red-text text-darken-4'>
                <p>Para compartilhar sua tela, seu navegador deve possuir a extensão do {{ $default->logo }}.</p>
                <p><b>Deseja instalar a extensão do {{ $default->logo }} para o navegador Google Chrome?</b></p>
            </div>
            <br>
        </div>
        <div class='modal-action grey lighten-3'>
            <a href='{!! $default->chromeExt !!}' target='_blank' onclick='chrome.webstore.install()' class='right btn-flat blue-text text-darken-2 waves-effect waves-teal'>{!! $default->applyIcon !!} sim, instalar</a>
            <a class='modal-close right btn-flat red-text text-darken-3 waves-effect waves-red'>{!! $default->cancelIcon !!} não</a>
        </div>
    </div>
    <!-- Modal de seleção de dispositívos de áudio e vídeo -->
    <div id='choose-devices' class='modal modal-fixed-footer'>
        <div class='modal-content'>
            <h5>
                {!! $default->configBlueIcon !!} Dispositivos:
                <span class='right'>
                    <a class='modal-close'>
                        {!! $default->cancelRedIcon !!}
                    </a>
                </span>
            </h5>
            <div class='divider'></div>
            <p><b>Selecione os dispositivos de entrada de áudio e vídeo</b></p>
            <br/>
            
            <div id='audio-device-list' class='input-field col s12 m6 offset-m3'>
                <select id='audio_list' class='' required name='audio_list'>
                    <option value="">Carregando...</option>
                    <!-- AJAX input -->
                </select>
                <label for='audio_list'>{!! $default->microphoneIcon !!} Dispositivo de input áudio:</label>
            </div>
            <br />
            <div id='video-device-list' class='input-field col s12 m6 offset-m3'>
                <select id='video_list' class='' required name='video_list'>
                    <option value="">Carregando...</option>
                    <!-- AJAX input -->
                </select>
                <label for='video_list'>{!! $default->camIcon !!} Dispositivo de input vídeo:</label>
            </div>
            <br>
        </div>
        <div class='modal-footer grey lighten-4'>
            <button id='confirmDevices' type='submit' class='btn-flat blue-text text-darken-2 waves-effect waves-teal modal-close'> {!! $default->applyIcon !!} Ok </button>
        </div>
    </div>
@else
    <input id='confirmDevices' type='hidden' disabled readonly />
@endif

<div id='msg-informa-espectadores' class='modal modal-fixed-footer'>
    <div class='modal-content'>
        <h5>
            {!! $default->usuariosBlueIcon !!} Espectadores:
            <span class='right'>
                <a class='modal-close'>
                    {!! $default->cancelRedIcon !!}
                </a>
            </span>
        </h5>
        <div class='divider'></div>
        <p>Por favor informe quantas pessoas irão acompanhar esta apresentação com você</p>
        <div class='input-field col s12 m6 offset-m3'>
            <input class='validate' required type="number" min='1' step='1' name='numViews' id='numViews' value='{{ isset($viewers) ? $viewers : ''}}' />
            <label for='numViews'>{!! $default->usuariosIcon !!} Quantidade de espectadores:</label>
        </div>
        <br>
    </div>
    <div class='modal-footer grey lighten-3'>
        <button id='informViews' type='submit' class='btn-flat blue-text text-darken-2 waves-effect waves-teal modal-close'> {!! $default->applyIcon !!} Ok </button>
    </div>
</div>

<div id='listaChamada' class='modal '>
    <div class='modal-content'>
        <h5>
            {!! $default->usuariosBlueIcon !!} Espectadores Presentes:
            <span class='right'>
                <a class='modal-close'>
                    {!! $default->cancelRedIcon !!}
                </a>
            </span>
        </h5>
        <div class='divider'></div>
        <div id='chamada'>
            <!-- Gera listagem de presença -->
        </div>
        <br>
    </div>
</div>

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
            <div class='input-field col s12 m6 offset-m3'>
                <input class='validate' required type='text' name='numViews' id='numViews' >
                <label for='numViews'>{!! $usuariosIcon !!} Quantidade de espectadores:</label>
            </div>
            <br>
        </div>
        <div class='modal-footer'>
            <input type='submit' class='right btn-flat blue-text text-darken-2 waves-effect waves-teal' value='OK' />
        </div>
    </div>
@endif
<div id='preVideo' class='col s12 d-none'>
    <div class='col s12 m8 l8 push-m2 push-l2 dark-grey rounded-borders'>
        <div class='p-10 white-text center'>
            {!! $default->playLargeIcon !!}
            <br />
            <div class='card-title'>
                <p>Quando estiver pronto para iniciar sua transmissão</p>
                <p>clique no botão abaixo</p>
                <br />
                <a id='start-transmition' class='btn-large blue darken-2 waves-light waves-effect p-10'>Iniciar transmissão</a>
            </div>
        </div>
    </div>
</div>
<div id='preVideoFinished' class='col s12 d-none'>
    <div class='col s12 m8 l8 push-m2 push-l2 dark-grey rounded-borders'>
        <div class='p-10 white-text center'>
            {!! $default->videocamoffLargeRedIcon !!}
            <br />
            <div class='card-title red-text text-darken-3'>
                <p>Transmissão Finalizada</p>
                <br />
                <span class='white-text'>O conteúdo desta transmissão está salvo e disponível para visualização e download no formato MP4</span>
            </div>
            <br />
            <div id='div-download-video' class='d-none'>
                <a id='download-video' class='blue p-10 rounded-borders white-text' href='' target='_blank' >
                    {!! $default->downloadIcon !!} <u>Baixar esta aula</u>
                </a>
            </div>
            <br />
        </div>
    </div>
</div>
<div id='preApresentacao' class='col s12 d-none'>
    <div class='col s12 m8 l8 push-m2 push-l2 dark-grey rounded-borders'>
        <div class='p-10 white-text center'>
            <br />
            <br />
            <h4><b>Aguardando apresentador</b></h4>
            <br />
            {!! $default->scheduleIcon !!}
            <div class='card-title'>
                <p>Seu vídeo iniciará em breve</p>
            </div>
            <br />
            <br />
        </div>
    </div>
</div>
<div id='preLoaderVideo' class='col s12 d-none'>
    <div class='col s12 m8 l8 push-m2 push-l2 dark-grey rounded-borders'>
        <div class='p-10 white-text center'>
            <br />
            <br />
            <h4>Iniciando transmissão em <b id='countdown'>5</b></h4>
            <br />
            {!! $default->preLoader !!}
            <br />
            <br />
        </div>
    </div>
</div>
<div id='preLoaderPresentation' class='col s12 d-none'>
    <div class='col s12 m8 l8 push-m2 push-l2 dark-grey rounded-borders'>
        <div class='p-10 white-text center'>
            <br />
            <br />
            <h4>Iniciando apresentação</h4>
            <br />
            {!! $default->preLoader !!}
            <br />
            <br />
        </div>
    </div>
</div>
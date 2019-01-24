/**
 * Cotrola elementos visuais e alterações de view quando aplicados aos elementos de mídia
 */
class MediaView {

    constructor() {

        this._alerta = new MessageController();

        this._mute = doc.TAG(dom.MUTE);
        this._cam = doc.TAG(dom.CAM);
        this._vol = doc.TAG(dom.VOL);
        this._share = doc.TAG(dom.SHARE);
        this._pedir = doc.TAG(dom.PEDIR);
        this._sharedFile = doc.TAG(dom.BTN_FILE_SHARING);
        this._participation = doc.TAG(dom.SESSION_ACCESS);
        this._divParticipation = doc.TAG(dom.DIV_ENTER);
        this._divMainVideo = doc.TAG(dom.DIV_MAIN_VIDEO);
        this._divIncomingVideo = doc.TAG(dom.DIV_INCOMING_VIDEO);
        this._spanMainVideo = doc.TAG(dom.VIDEO_MAIN);
        this._mainVideo = doc.TAG(dom.FIRST_VIDEO);
        this._pageMainContainer = doc.TAG(dom.PAGE_MAIN_CONTENT);
        this._chatPanel = doc.TAG(dom.CHAT_PANEL);
        this._sideNavbar = doc.TAG(dom.SIDE_NAVBAR);
        this._chatTextArea = doc.TAG(dom.CHAT_TEXTAREA);
        this._countPedirVez = doc.TAG(dom.COUNT_PEDIR);
        this._solicitationList = doc.TAG(dom.SOL_LIST);
        this._fileTransfering = doc.TAG(dom.FILE_TRANSFERING);
        this._fileListReceive = doc.TAG(dom.FILE_LIST_REICEIVED);
        this._fileListSend = doc.TAG(dom.FILE_LIST_SENDED);
        this._fileSideBar = doc.TAG(dom.FILE_EXP);
        this._countdown = doc.TAG(dom.COUNTDOWN);
        this._videoField = doc.TAG(dom.PRE_APRESENTACAO);
        this._listContent = '';
        this._countReceiveFiles = 0;
        this._countSendFiles = 0;
        this._otherVideos = false;
        this._readyToPlay = false;
        this._stop = false;

    }

    /**
     * Torna o Objeto do DOM indicado invisível
     * @param {Obj} elem Objeto do DOM a ser adicionada a classe invisível
     */
    setInvisible(elem) {

        elem.classList.add(misc.CLASS_INVISIBLE);
    }

    /**
     * Torna o Objeto do DOM indicado visível
     * @param {Obj} elem Objeto do DOM a ser adicionada a classe visível
     */
    setVisible(elem) {

        elem.classList.remove(misc.CLASS_INVISIBLE);
    }

    /**
     * !!DESUSO!!
     * Trata aparência do botão de microfone para o status ativo
     */
    setVoiceOn() {

        this._mute.classList.remove(misc.OFF_COLOR);
        this._mute.innerHTML = misc.ICON_MIC;
        this._alerta.initiateMessage(conf.message.MIC_ON);
    }

    /**
     * !!DESUSO!!
     * Trata aparência do botão de microfone para o status inativo
     */
    setVoiceOff() {

        this._mute.classList.add(misc.OFF_COLOR);
        this._mute.innerHTML = misc.ICON_MUTE_MIC;
        this._alerta.initiateMessage(conf.message.MIC_OFF);
    }

    /**
     * !!DESUSO!!
     * Trata aparência do botão de microfone para o status desabilitado
     */
    voiceOff() {

        this._mute.classList.add(misc.DISABLED_COLOR);
        this._mute.innerHTML = misc.ICON_MUTE_MIC;
        this._mute.disabled = true;
        GeneralHelper.hideit(dom.LI_MUTE);
    }

    /**
     * Trata aparência do botão de áudio para o status ativo
     */
    setVolumeOn() {

        this._vol.classList.remove(misc.OFF_COLOR);
        this._vol.classList.remove(misc.DISABLED_COLOR);
        this._vol.innerHTML = misc.ICON_VOL_ON;
        this._vol.setAttribute(misc.ATTR_ACTIVE, 'unmute');
        this._alerta.initiateMessage(conf.message.VOL_UP);
        GeneralHelper.showit(dom.LI_VOLUME);
    }

    /**
     * Trata aparência do botão de áudio para o status inativo
     */
    setVolumeOff() {

        this._vol.classList.add(misc.OFF_COLOR);
        this._vol.classList.remove(misc.DISABLED_COLOR);
        this._vol.innerHTML = misc.ICON_VOL_OFF;
        this._vol.setAttribute(misc.ATTR_ACTIVE, 'mute');
        this._alerta.initiateMessage(conf.message.VOL_DOWN);
    }

    /**
     * Trata aparência do botão de áudio para o status desabilitado
     */
    volumeOff() {

        this._vol.classList.add(misc.DISABLED_COLOR);
        this._vol.innerHTML = misc.ICON_VOL_OFF;
        GeneralHelper.hideit(dom.LI_VOLUME);
    }

    /**
     * !!DESUSO!!
     * Trata aparência do botão de câmera para o status ativo
     */
    setCamOn() {

        this._cam.classList.remove(misc.OFF_COLOR);
        this._cam.innerHTML = misc.ICON_CAM_ON;
        this._alerta.initiateMessage(conf.message.CAM_ON);
    }

    /**
     * !!DESUSO!!
     * Trata aparência do botão de câmera para o status inativo
     */
    setCamOff() {

        this._cam.classList.add(misc.OFF_COLOR);
        this._cam.innerHTML = misc.ICON_CAM_OFF;
        this._alerta.initiateMessage(conf.message.CAM_OFF);
    }

    /**
     * !!DESUSO!!
     * Trata aparência do botão de câmera para o status desabilitado
     */
    camOff() {

        this._cam.classList.add(misc.DISABLED_COLOR);
        this._cam.innerHTML = misc.ICON_CAM_OFF;
        this._cam.disabled = true;
        GeneralHelper.hideit(dom.LI_CAM);
    }

    /**
     * Trata a disposição dos vídeos Princial e Secundário ao ser iniciada uma participação ou um compartilhamento de tela
     * @param {Obj} mainVideo Objeto do DOM indicando o vídeo principal
     * @param {Obj} inVideo Objeto do DOM indicando o vídeo secundário que é recebido
     */
    openIncomingVideos(mainVideo, inVideo) {

        mainVideo.classList.remove("m8");
        mainVideo.classList.add("m7");
        inVideo.classList.add("m3");
        inVideo.classList.remove("m2");
        this._otherVideos = true;
    }

    /**
     * Trata a disposição dos vídeos Princial e Secundário ao ser finalizada uma participação ou um compartilhamento de tela
     * @param {Obj} mainVideo Objeto do DOM indicando o vídeo principal
     * @param {Obj} inVideo Objeto do DOM indicando o vídeo secundário que é recebido
     */
    closeIncomingVideos(mainVideo, inVideo) {

        mainVideo.classList.add("m8");
        mainVideo.classList.remove("m7");
        inVideo.classList.add("m2");
        inVideo.classList.remove("m3");
        this._otherVideos = false;
    }

    /**
     * Trata aparência do botão de compartilhamento de tela para o status ativo
     */
    startShare() {

        GeneralHelper.showit(dom.SHARE);
        this._share.classList.add(misc.OFF_COLOR);
        this._share.innerHTML = misc.ICON_SHARE_OFF;
    }

    /**
     * Trata aparência do botão de compartilhamento de tela para o status inatvo
     */
    exitShare() {

        GeneralHelper.showit(dom.SHARE);
        this._share.classList.remove(misc.OFF_COLOR);
        this._share.innerHTML = misc.ICON_SHARE_ON;
    }

    /**
     * Trata aparência do botão de compartilhamento de tela para o status desabilitado
     */
    shareOff() {

        this._share.disabled = true;
        this._share.classList.add(misc.DISABLED_COLOR);
        this._share.innerHTML = misc.ICON_SHARE_ON;
        GeneralHelper.hideit(dom.LI_SHARE);
    }

    /**
     * Trata aparência do botão de compartilhamento de tela para o status habilitado
     */
    shareEnabled() {

        this._share.disabled = false;
        this._share.classList.add(misc.ON_COLOR);
        this._share.classList.remove(misc.OFF_COLOR);
        this._share.classList.remove(misc.DISABLED_COLOR);
        GeneralHelper.showit(dom.LI_SHARE);
    }

    /**
     * Trata disposição e apresentação do botão de finalização de participação ao iniciar uma nova participação
     */
    startParticipation() {

        GeneralHelper.showit(dom.DIV_ENTER);
        GeneralHelper.showit(dom.CLOSE_PARTICIPATION, 300);
        this._divParticipation.title = 'Finalizar participação';
        this._participation.classList.remove(misc.HILIGHT_COLOR);
        this._participation.classList.add(misc.OFF_COLOR);
        this._participation.innerHTML = misc.ICON_CAM_OFF;
    }

    /**
     * Trata disposição e apresentação do botão de finalização de participação ao finalizar uma participação
     */
    endParticipation() {

        GeneralHelper.showit(dom.DIV_ENTER);
        GeneralHelper.showit(dom.CLOSE_PARTICIPATION, 300);
        this._divParticipation.title = 'Ingressar';
        this._participation.classList.remove(misc.OFF_COLOR);
        this._participation.classList.add(misc.HILIGHT_COLOR);
        this._participation.innerHTML = misc.ICON_CAM_ON;
    }

    /**
     * Trata disposição e apresentação do botão de finalização de participação como desabilitado
     */
    participationOff() {

        this._participation.classList.remove(misc.HILIGHT_COLOR);
        this._participation.classList.add(misc.OFF_COLOR);
        this._participation.innerHTML = misc.ICON_CAM_OFF;
        this._participation.disabled = true;
        GeneralHelper.hideit(dom.DIV_ENTER);
        GeneralHelper.hideit(dom.CLOSE_PARTICIPATION, 300);
    }

    /**
     * Trata e apresenta mensagens e controles de participação de um espectador em uma transmissão após a confirmação
     * do pedido de participação pelo apresentador
     */
    allowSolicitation() {

        this._alerta.initiateMessage(conf.message.SEND_ACP_SOLICITATION);
        setTimeout(() => {
            GeneralHelper.showit(dom.DIV_ENTER, 300);
            GeneralHelper.showit(dom.CLOSE_PARTICIPATION, 300);
            this.endParticipation();
            $(dom.SESSION_ACCESS).click();
            this._alerta.initiateMessage(conf.message.SEND_START_SOLICITATION);
        }, 2000);
    }

    /**
     * Trata e apresenta mensagens a um espectador em uma transmissão após a negação do pedido de participação
     * pelo apresentador
     */
    denySolicitation() {

        this.participationOff();
        this._alerta.initiateMessage(conf.message.NOT_ACP_SOLICITATION);
    }

    /**
     * Trata disposição e apresentação do botão de pedir vez como desabilitado
     */
    pedirOff() {

        this._pedir.classList.add(misc.OFF_COLOR);
        this._pedir.disabled = true;
        GeneralHelper.hideit(dom.LI_PERDIR);
    }

    /**
     * Trata disposição e apresentação do botão de compartilhamento de arquivos como desabilitado
     */
    fileSharingOff() {

        this._sharedFile.classList.remove(misc.HILIGHT_COLOR);
        this._sharedFile.classList.add(misc.OFF_COLOR);
        this._sharedFile.disabled = true;
        GeneralHelper.hideit(dom.BTN_FILE_SHARING);
    }

    /**
     * Trata disposição e apresentação do botão de lista de arquivos enviados/recebidos como desabilitado
     */
    fileSharingListOff() {

        this._fileListReceive.classList.remove(misc.HILIGHT_COLOR);
        this._fileListSend.classList.remove(misc.HILIGHT_COLOR);
        this._fileListReceive.classList.add(misc.OFF_COLOR);
        this._fileListSend.classList.add(misc.OFF_COLOR);
        this._fileListReceive.disabled = true;
        this._fileListSend.disabled = true;
        GeneralHelper.hideit(dom.FILE_LIST);
    }

    /**
     * Executa mensagem de quantidade de espectadores não suficientes para enviar arquivos (< 1)
     */
    noFileSharing() {

        this._alerta.initiateMessage(conf.message.NO_PARTICIPANTS);
    }

    /**
     * Trata disposição e apresentação do botão de tela cheia como inativo
     */
    exitFullscreen() {

        GeneralHelper.hideit(dom.DIV_EXIT_FSCREEN, 500);
        this._spanMainVideo.classList.remove(misc.TURNOFF_COLOR);
        this._spanMainVideo.classList.add(misc.CLASS_WIDTH_LIMIT);
        this._spanMainVideo.style.height = misc.STYLE_HEIGHT_INHERIT;
        this.shrinkVideoSize();
    }

    /**
     * Trata disposição e apresentação do botão de tela cheia como ativo
     */
    enterFullscreen() {

        GeneralHelper.showit(dom.DIV_EXIT_FSCREEN, 500);
        this._spanMainVideo.classList.add(misc.TURNOFF_COLOR);
        this._spanMainVideo.classList.remove(misc.CLASS_WIDTH_LIMIT);
        this._spanMainVideo.style.height = (window.innerHeight) + 'px';
    }

    /**
     * Tratamento da disposição do botão de tela cheia como invisível
     */
    fullScreamOff() {

        GeneralHelper.hideit(dom.LI_SCREEN);
    }

    /**
     * Tratamento e apresentação a ação de expansão de tela
     */
    expandVideoSize() {

        this._pageMainContainer.classList.remove(misc.CLASS_MAIN_CONTAINER);
        this._pageMainContainer.classList.add(misc.CLASS_MAIN_CONTAINER_FULL);
        this._spanMainVideo.classList.add(misc.CLASS_WIDTH_LIMIT_NO);
        this._spanMainVideo.classList.remove(misc.CLASS_WIDTH_LIMIT);
    }

    /**
     * Tratamento e apresentação a ação de redução de tela
     */
    shrinkVideoSize() {

        this._pageMainContainer.classList.remove(misc.CLASS_MAIN_CONTAINER_FULL);
        this._pageMainContainer.classList.add(misc.CLASS_MAIN_CONTAINER);
        this._spanMainVideo.classList.add(misc.CLASS_WIDTH_LIMIT);
        this._spanMainVideo.classList.remove(misc.CLASS_WIDTH_LIMIT_NO);
    }

    /**
     * Tratamento e apresentação do fundo de tela ao ingressar ou ser iniciada uma sala
     */
    adjustStreamScreen() {

        GeneralHelper.showit(dom.BG_DARK, 500);
        $(dom.ROOM_LOBBY).slideUp(500);
        $(dom.VIDEOS_PANEL).slideDown(500);
    }

    /**
     * Tratamento e apresentação da inicialização da função de chat
     * Ajuste e disposição de paineis
     */
    adjustChatFilePanel() {

        let chatHeight = window.screen.height;
        this._chatPanel.style.height = (chatHeight - 250) + 'px';
        this._chatPanel.style.maxHeight = (chatHeight - 250) + 'px';
        this._fileSideBar.style.height = (chatHeight - 200) + 'px';
        this._fileSideBar.style.maxHeight = (chatHeight - 200) + 'px';
    }

    /**
     * Ajusta a apresentação dos elementos de controle da sala ao iniciar uma transmissão
     * Status da sala (Temporizador, total de espectadores e utilizaçãodo token)
     * Vídeo principal
     * Vídeos secundários
     */
    showControlElements() {

        doc.TAG(dom.ALERT_SHARE).click();
        GeneralHelper.showit(dom.ROOM_STATUS, 500);
        GeneralHelper.showit(dom.DIV_MAIN_VIDEO, 500);
        GeneralHelper.showit(dom.DIV_INCOMING_VIDEO, 500);
        setTimeout(() => {
            doc.TAG(dom.ROOM_STATUS).classList.remove("obj-invisible");
            doc.TAG(dom.DIV_MAIN_VIDEO).classList.remove("obj-invisible");
            doc.TAG(dom.DIV_INCOMING_VIDEO).classList.remove("obj-invisible");
        }, 800);
    }

    /**
     * Ajusta a apresentação dos elementos de controle da sala ao finalizar uma transmissão
     * Status da sala (Temporizador, total de espectadores e utilizaçãodo token)
     * Vídeo principal
     * Vídeos secundários
     */
    hideControlElements() {

        GeneralHelper.hideit(dom.ROOM_STATUS);
        GeneralHelper.hideit(dom.DIV_MAIN_VIDEO);
        GeneralHelper.hideit(dom.DIV_INCOMING_VIDEO);

        doc.TAG(dom.ROOM_STATUS).classList.add("obj-invisible");
        doc.TAG(dom.DIV_MAIN_VIDEO).classList.add("obj-invisible");
        doc.TAG(dom.DIV_INCOMING_VIDEO).classList.add("obj-invisible");
    }

    /**
     * Monta corpo de mensagens enviadas por chat
     * @param {String} user Nome do participante que encaminhou a mensagem
     * @param {String} message Texto da mensagem
     */
    writeChatMessage(user, message) {

        let texto = `<b class='small'>${user}</b> :<br>${message}`;
        texto = btoa(texto);
        return texto;
    }

    /**
     * Registra o envio/recebimento de mensagens no corpo do painel de chat ou em forma de toast
     * @param {String} message Corpo da mensagem
     * @param {String} pContainer Caixa de texto com definições de aparência da mensagem
     * @param {Boolean} isOpen Status do chat panel (aberto/fechado)
     */
    writeReceiveMessage(message, pContainer, isOpen) {

        isOpen ? null : this._alerta.initiateMessage(conf.message.CHAT_MESSAGE, message);
        this._chatPanel.innerHTML = `${this._chatPanel.innerHTML}${pContainer}${message}</p>`;
        this._chatTextArea.style.height = (window.innerHeight - 100) + 'px';
    }

    /**
     * Apresenta contador de solicitações de mensagens junto ao botão de "listar solicitações" do apresentador
     * @param {Number} val Quantitativo de requisições pedindo vez recebidas
     */
    showSolicitation(val) {

        this._countPedirVez.innerHTML = val;
        GeneralHelper.showit(dom.COUNT_PEDIR, 300);
    }

    /**
     * Remove contador de solicitações de mensagens junto ao botão de "listar solicitações"
     */
    hideSolicitation() {

        GeneralHelper.hideit(dom.COUNT_PEDIR, 300);
    }

    /**
     * Trata e apresenta lista de itens criados para cada solicitação aberta para participar da trasmissão, feitas ao apresentador ainda aguardando resposta
     * @param {Number} count Total de requisições já realizadas ainda aguardando resposta
     * @param {String} username Nome do solicitante
     * @param {String} userid Identificador do solicitante
     */
    listSolicitation(count, username, userid) {

        if (count === 1) this._listContent = '';
        this._listContent += `
                <li id="${ userid }" data-sender="${ username }" class="sol-response collection-item avatar li-hover">
                    <i class="material-icons blue lighten-2 circle">tv</i>
                    <h6><b>${ username }</b> solicita vez.</h6>
                    <div class="secondary-content">
                        <a id="allow_${ userid }" class="room-enter responses blue-text text-darken-2 modal-close" title="Permitir"><i class="fa fa-check-circle fa-2x"></i></a> &nbsp;&nbsp;
                        <a id="deny_${ userid }" class="room-enter responses red-text text-darken-3 modal-close" title="Negar"><i class="fa fa-times-circle fa-2x"></i></a>
                    </div>
                </li>`;
        this._solicitationList.innerHTML = this._listContent;
        this._alerta.initiateMessage(conf.message.NEW_SOLICITATION, username);
    }

    /**
     * Limpa listagem de solicitações de participação abertas
     */
    clearSolicitationLis() {

        this._listContent = '';
    }

    /**
     * Mensagem padrão apresentada no modal de solicitações recebidas pelo apresentador quando não há mensagens aguardando resposta
     */
    noSolicitation() {

        this._listContent = "<li align='center' class='red-text text-darken-3 p-40' ><b><i class='fa fa-times fa-lg'></i> Não há solicitações no momento.</b></li>";
    }

    /**
     * Cria nova lista de solicitação de participação a partir de elementos do DOM
     * @param {Obj} item Objeto do DOM apresentando informações sobre o solicitante
     */
    newSolicitation(item) {

        let sender = item.getAttribute(misc.ATTR_SOLICITATION);
        this._listContent += `
            <li id="${ item.id }" data-sender="${ sender }" class="sol-response collection-item avatar li-hover">
                <i class="material-icons blue lighten-2 circle">tv</i>
                <h6><b>${ sender }</b> solicita vez.</h6>
                <span class="secondary-content">
                    <a id="allow_${ item.id }" class="room-enter responses blue-text text-darken-2 modal-close" title="Permitir"><i class="fa fa-check-circle fa-2x"></i></a> &nbsp;&nbsp;
                    <a id="deny_${ item.id }" class="room-enter responses red-text text-darken-3 modal-close" title="Negar"><i class="fa fa-times-circle fa-2x"></i></a>
                </span>
            </li>`;
    }

    /**
     * Constrói uma nova listagem de solicitações para exibição
     */
    constructSolicitationList() {

        this._solicitationList.innerHTML = this._listContent;
    }

    /**
     * Ajusta a exibição das funções da barra de controles de mídia para o apresentador
     */
    adjustBroadCaster() {

        this._prepareFileMenu(dom.LI_PERDIR, dom.DIV_RECEIVE_FILES, dom.MIN_RECEIVE, dom.PRE_VIDEO);
    }

    /**
     * Ajusta a exibição das funções da barra de controles de mídia para os espectadores
     */
    adjustEspectador() {

        this._prepareFileMenu(dom.CTL_PEDIR, dom.DIV_UPLOADED_FILES, dom.MIN_SEND, dom.PRE_APRESENTACAO);
    }

    /**
     * Ajusta a exibição das funções de controle de mídia para todos os tipos de usuários
     * @param {Obj} pedir Objeto do DOM do botão de pedir/atribuir vez
     * @param {Obj} files Objeto do DOM do botão de envio/recebimento de arquivos
     * @param {Obj} filesMin Objeto do DOM do botão do painel de arquivos enviados/recebidos 
     * @param {Obj} preview Objeto do DOM do painel de vídeo principal
     */
    _prepareFileMenu(pedir, files, filesMin, preview) {

        GeneralHelper.hideit(dom.DIV_CONNECT);
        GeneralHelper.hideit(pedir);
        GeneralHelper.hideit(files);
        GeneralHelper.hideit(filesMin);
        GeneralHelper.showit(preview, 500);
    }

    /**
     * Apresenta a tela de pré-visualização após o início da transmissão
     * @param {Obj} preVideo Objeto do DOM da tela de pré-visualização do vídeo principal
     * @param {Obj} preLoader Objeto do DOM da tela de contagem regressiva para início da transmissão
     * @param {Boolean} count Utilização da contagem regressiva (Sim/Não)
     */
    initPreVideo(preVideo, preLoader, count) {

        GeneralHelper.hideit(preVideo);
        this.prepareToInitiate(preLoader, count);
    }

    /**
     * Apresenta a tela de pré-visualização com contagem regressiva após o início da transmissão
     * @param {Obj} preLoader Objeto do DOM da tela de contagem regressiva
     * @param {Boolean} count Utilização da contagem regressiva (Sim/Não) 
     */
    prepareToInitiate(preLoader, count) {

        GeneralHelper.showit(preLoader, 300);
        if (count) this._startCountDown();
    }

    /**
     * Altera a apresentação do botão de finalização de transmissão do apresentador
     * @param {Obj} btn Objeto do DOM do botão de finalização de transmissão
     * @param {String} title Título atribuído ao botão de finalização de transmissão 
     * @param {String} icon Ícone atribuído ao botão de finalização de transmissão 
     */
    changeTransmition(btn, title, icon) {

        btn.title = title;
        btn.innerHTML = icon;
    }

    /**
     * Remove Objeto do DOM indicado da estrutura HTML
     * @param {Obj} elem Objeto do DOM a ser removido 
     */
    removeElement(elem) {

        $(elem).remove();
    }

    /**
     * Ajusta e exibe a tela de finalização de transmissão 
     */
    stopTransmition() {

        this.hideControlElements();
        GeneralHelper.showit(dom.PRE_VIDEO_FINISHED, 1000);
        GeneralHelper.hideit(dom.LI_SCREEN);
        GeneralHelper.hideit(dom.LI_VOLUME);
        GeneralHelper.hideit(dom.LI_SHARE);
        GeneralHelper.hideit(dom.LI_PERDIR);
        GeneralHelper.hideit(dom.SOL_PEDIR);
        GeneralHelper.hideit(dom.CTL_PEDIR);
        try { this.removeElement(dom.FRAME_LAYER) } catch (e) { /* Não faz nada */ };
    }

    /**
     * Cria e apresenta o link para download da aula transmitida ao térmido da transmissão
     * @param {String} roomid Identificador da sala criada
     */
    createVideoLink(roomid) {

        let videoLink = doc.TAG(dom.DOWNLOAD_VIDEO);
        videoLink.href = conf.con.SOCKET_DOWNLOAD + btoa(roomid) + '.mp4';
        videoLink.setAttribute('download', btoa(roomid));
        GeneralHelper.hideit(dom.WAITING_LINK);
        GeneralHelper.showit(dom.DIV_DOWNLOAD_VIDEO, 300);
    }

    /**
     * Finalização do da tela de pré-visualização e apresentação da tela do vídeo principal e controles de mídia
     */
    endPreVideo() {

        GeneralHelper.hideit(dom.PRE_LOAD_VIDEO);
        GeneralHelper.hideit(dom.EMBEDDED_FRAME);
        GeneralHelper.showit(dom.DIV_CONTROLLER, 300);
    }

    /**
     * Inicia a contagem regressiva na tela de prévisualização do vídeo principal
     */
    _startCountDown() {

        let count = conf.str.COUNTDOWN_TO_START;
        this._countdown.innerHTML = count;
        let interval = setInterval(() => {
            count--;
            this._countdown.innerHTML = count;
            if (count <= 0) clearInterval(interval);
        }, 1000);
    }

    /**
     * Apresenta mensagem de transmissão enquanto a transmissão para o servidor ded mídia estiver ativa
     * @param {Obj} webRTCadpt Objeto WebRTCAdaptor que valida e verifica a sala indicada
     * @param {String} roomid Identificador da sala criada e da mídia criada no servidor ded mídia
     */
    startAnimation(webRTCadpt, roomid) {

        $(dom.BROADCASTING_INFO).fadeIn(800, () => {
            $(dom.BROADCASTING_INFO).fadeOut(800, () => {
                let state = webRTCadpt.signallingState(btoa(roomid));
                if (state != null && state != "closed") {
                    let iceState = webRTCadpt.iceConnectionState(btoa(roomid));
                    if (iceState != null && iceState != "failed" && iceState != "disconnected") {
                        this.startAnimation(webRTCadpt, roomid);
                    }
                }
            });
        });
    }

    /**
     * Apresenta objeto do DOM em forma de animação (blinking)
     * @param {Obj} elem Objeto do DOM a ser apresentado durante os processos de animação
     */
    recordAnimation(elem) {

        $(elem).fadeIn(800, () => {
            $(elem).fadeOut(800, () => {
                this.recordAnimation(elem);
            });
        });
    }

    /**
     * Controla a animação de blink de um elemento indicado a partir de um evento
     * @param {Obj} elem Objeto do DOM a ser animado
     * @param {String} triggerElem Selector do elemento (# + identificador)
     * @param {String} trigger Evento a ser verificado
     */
    _blinkControl(elem, triggerElem, trigger) {

        let stop = false;
        $(triggerElem).on(trigger, () => stop = true);
        blink();

        function blink() {
            $(elem).fadeIn(800, () => {
                $(elem).fadeOut(800, () => {
                    if (!stop) blink();
                });
            });
        }
    }

    /**
     * Inicia apresentação de vídeo principal em iframe para os espectadores
     * @param {String} roomid Identificador da sala
     * @param {Obj} media Objeto MediaController 
     */
    initBroadcasterVideo(roomid, media) {

        let name = btoa(roomid);
        let frame = doc.TAG(dom.EMBEDDED_FRAME);
        GeneralHelper.hideit(dom.VIDEOS);
        GeneralHelper.hideit(dom.PRE_APRESENTACAO);
        GeneralHelper.hideit(dom.PRE_LOAD_APRESENTACAO);
        if (!conf.con.LOW_LATENCY) {
            let addr = `<iframe id="embedded_player" class="embedded-video" src="${ conf.con.SOCKET_PLAYER_SSL }?name=${ name }" frameborder="0" allowfullscreen></iframe>`;
            frame.innerHTML = addr;
        }
        GeneralHelper.showit(dom.DIV_MAIN_VIDEO);
        doc.TAG(dom.DIV_MAIN_VIDEO).classList.remove("obj-invisible");
        GeneralHelper.showit(dom.EMBEDDED_FRAME, 300);
        GeneralHelper.showit(dom.DIV_CONTROLLER, 300);
        this._blinkControl(dom.TOOLTIP_ENABLE_SOUND, dom.VOL, 'mouseenter');

        if (conf.con.LOW_LATENCY) this._initNewPlayer(name, dom.REMOTE_VIDEO_ID, media, dom.PLAY_IT);
    }

    /**
     * Inicializa o vídeo de um participante como um vídeo secundário em um iframe
     * @param {String} participant Identificador da mídia do participante
     * @param {String} name Nome do participante
     * @param {Obj} media Objeto MediaController 
     */
    initParticipantVideo(participant, name, media) {

        let rash = btoa(participant);
        let addr = `<iframe id="embedded_player_v3" data-active="participant" class="embedded-video" src="${ conf.con.SOCKET_PLAYER_2_SSL }?name=${ rash }" frameborder="0" allowfullscreen></iframe>`;
        let participantName = doc.TAG(dom.PARTICIPATION_NAME);
        participantName.innerHTML = name;
        this._controlEmbeddedVideo(
            addr,
            dom.EMBEDDED_FRAME_III,
            dom.INCOMMING_VIDEO_PARTICIPANT,
            dom.PARTICIPATION_CONTROL,
            dom.PARTICIPATION_SWAP,
            dom.PARTICIPATION_MUTE,
            dom.FRAME_LAYER_III
        );
        if (conf.con.LOW_LATENCY) {
            this._initNewPlayer(rash, dom.SECOND_VIDEO_ID, media, dom.PLAY_PARTICIPANT);
            GeneralHelper.showit(dom.VIDEO_SECOND, 300);
        }
    }

    /**
     * Inicializa o vídeo de compartilhamento de tela como um vídeo secundário em um iframe
     * @param {String} screen Identificador do vídeo de compartilhamento de tela
     * @param {Obj} media Objeto MediaController
     */
    initScreenVideo(screen, media) {

        let rash = btoa(screen);
        let addr = `<iframe id="embedded_player_v2" data-active="participant" class="embedded-video" src="${ conf.con.SOCKET_PLAYER_2_SSL }?name=${ rash }" frameborder="0" allowfullscreen></iframe>`;
        this._controlEmbeddedVideo(
            addr,
            dom.EMBEDDED_FRAME_II,
            dom.INCOMMING_VIDEO_SCREEN,
            dom.SCREEN_CONTROL,
            dom.SCREEN_SWAP,
            false,
            dom.FRAME_LAYER_II
        );
        if (conf.con.LOW_LATENCY) {
            this._initNewPlayer(rash, dom.THIRD_VIDEO_ID, media, dom.PLAY_SCREEN);
            GeneralHelper.showit(dom.VIDEO_THIRD, 300);
        }
    }

    /**
     * trata e gerencia eventos de inicialização de vídeos através de uma ferramenta de vídeo JS  
     * @param {String} name Identificador da sala
     * @param {String} video Identificador do vídeo
     * @param {Obj} media Objeto MediaController
     * @param {Obj} btnPlay Objeto do DOM com a função de inicializador do vídeo 
     */
    _initNewPlayer(name, video, media, btnPlay) {

        let newplayer = new NewerPlayerController(name, video, media);
        newplayer.startConfig();
        doc.TAG(btnPlay).onclick = () => newplayer.startPlaying(name);
        setTimeout(() => $(btnPlay).click(), 2000);
    }

    /**
     * Trata a apresentação dos dos elementos de controle de mídias embutidas em iframe
     * @param {String} content Conteúdo do iframe a ser implementado
     * @param {String} embedded Identificador do objeto do DOM que irá receber o iframe
     * @param {String} container Identificador do container que irá ser tratado para apresentar a mídia com o iframe aninhado
     * @param {String} control Identificador do objeto do DOM que apresenta os controles de mídias embutidas
     * @param {String} itemSwap Identificador do objeto do DOM que atende a função de botão de swap de vídeos embutidos
     * @param {String} itemMute Identificador do objeto do DOM que atende a função de botão de mute de vídeos embutidos 
     * @param {String} layer Identificador do objeto do DOM que representa o elemento a ser tratado nos
     */
    _controlEmbeddedVideo(content, embedded, container, control, itemSwap, itemMute, layer) {

        if (!conf.con.LOW_LATENCY) {
            let frame = doc.TAG(embedded);
            frame.innerHTML = content;

            GeneralHelper.showit(container, 300);
            GeneralHelper.showit(embedded, 300);
            GeneralHelper.showit(control, 300);
        }
        GeneralHelper.showit(dom.DIV_INCOMING_VIDEO);
        doc.TAG(dom.DIV_INCOMING_VIDEO).classList.remove("obj-invisible");

        setTimeout(() => {
            let mute;
            if (itemMute) {
                mute = doc.TAG(itemMute);
                this._toggleMute(mute, layer);
            }
            let swap = doc.TAG(itemSwap);
            let mainMute = doc.TAG(dom.VOL);
            this._swapParticipant(swap, mute, mainMute, layer, itemMute);

        }, 300);
    }

    _swapParticipant(swap, mute, mainMute, layer, audioEnabled) {

        swap.onclick = () => {
            let main = doc.TAG(dom.FRAME_LAYER);
            let incomming = doc.TAG(layer);
            let swapScr = main.src;
            main.src = incomming.src;
            incomming.src = swapScr;
            let active = swap.getAttribute(misc.ATTR_ACTIVE);
            active == 'other' ?
                swap.setAttribute(misc.ATTR_ACTIVE, 'main') :
                swap.setAttribute(misc.ATTR_ACTIVE, 'other');

            if (audioEnabled) {
                setTimeout(() => {
                    let status = mute.getAttribute(misc.ATTR_ACTIVE);
                    if (status == 'unmute') this.embeddedMessage(layer, status);
                    status = mainMute.getAttribute(misc.ATTR_ACTIVE);
                    if (status == 'unmute') this.embeddedMessage(dom.FRAME_LAYER, status);
                }, 1000);
            }
        };
    }

    _toggleMute(mute, layer) {

        mute.onclick = () => {
            let active = mute.getAttribute(misc.ATTR_ACTIVE);
            let value;
            active == 'mute' ? value = 'unmute' : value = 'mute';
            mute.setAttribute(misc.ATTR_ACTIVE, value);
            this._targetVolumeToggle(mute, value);
            if (!conf.con.LOW_LATENCY) this.embeddedMessage(layer, value);
        }
    }

    _targetVolumeToggle(vol, status) {

        if (status == 'unmute') {
            vol.classList.remove(misc.OFF_COLOR);
            vol.innerHTML = misc.ICON_VOL_ON;
            this._alerta.initiateMessage(conf.message.VOL_UP);
        } else {
            vol.classList.add(misc.OFF_COLOR);
            vol.innerHTML = misc.ICON_VOL_OFF;
            this._alerta.initiateMessage(conf.message.VOL_DOWN);
        }
    }

    embeddedMessage(frameid, message) {

        if (conf.con.LOW_LATENCY) {
            let setvolume;
            message == 'unmute' ? setvolume = false : setvolume = true;
            doc.TAG(dom.REMOTE_VIDEO).muted = setvolume;
        } else {
            let framePlay = doc.TAG(frameid);
            framePlay.contentWindow.postMessage(message, '*');
        }
    }

    createProgressBar(file) {

        this._fileTransfering.innerHTML += `<b>Recebendo:</b> ${ file }<br/>
                                            <div class="progress">
                                                <div class="indeterminate"></div>
                                            </div>`;
    }

    transferCompleted() {

        this._countReceiveFiles++;
        doc.TAG(dom.COUNT_RECEIVE_FILES).innerHTML = this._countReceiveFiles;
        this._fileTransfering.innerHTML = '';
    }

    createSendedFiles(name, size) {

        let filesSended = doc.TAG(dom.DIV_SEND_FILES);
        let div = document.createElement('div');
        this._countSendFiles++;
        doc.TAG(dom.COUNT_SEND_FILES).innerHTML = this._countSendFiles;
        div.innerHTML = `<div class="p-5 rounded-borders grey darken-4 truncate" title="${name}">
                            <span class="fa fa-cloud text-darken-1"></span> <b>${name}</b><br/>
                            Tamanho: ${this._convertSize(size)}
                        </div>`;
        filesSended.insertBefore(div, filesSended.firstChild);
    }

    createDownloadLink(file, connection) {

        file.url = URL.createObjectURL(file);
        let div = document.createElement('div');
        div.innerHTML = `<div class="p-5 rounded-borders grey darken-4 truncate">
                            <a class="shared-file blue-text" href="${file.url}" download="${file.name}" title="${file.name}">
                                <span class="fa fa-download text-darken-1"></span> <b>${file.name}</b><br>
                                Tamanho: ${this._convertSize(file.size)}<br>
                            </a>
                        </div>`;
        connection.filesContainer.insertBefore(div, connection.filesContainer.firstChild);
        this._alerta.initiateMessage(conf.message.FILE_RECEIVED, file.name);
    }

    _convertSize(bytes) {

        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    };

}
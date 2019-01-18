/**
 * Classe voltada ao controle de mecanismos de elementos de mídia como vídeos, volume e câmeras
 *  ->  Controla também as funções de operações relativas às mídias como
 *      pedir a vez e compartilhamento de tela
 * 
 * Instancia:
 * MediaView
 * Media
 */
class MediaController {

    constructor() {

        this._mediaView = new MediaView();

        this._videoPreview = doc.TAG(dom.FIRST_VIDEO);
        this._secondVideoPreview = doc.TAG(dom.SECOND_VIDEO);
        this._thirdVideoPreview = doc.TAG(dom.THIRD_VIDEO);
        this._previewVideo = doc.TAG(dom.PREVIEW);
        this._mute = doc.TAG(dom.MUTE);
        this._screen = doc.TAG(dom.SCREEN);
        this._exitscreen = doc.TAG(dom.EXIT_SCREEN);
        this._vol = doc.TAG(dom.VOL);
        this._solPedir = doc.TAG(dom.SOL_PEDIR);
        this._cam = doc.TAG(dom.CAM);
        this._pedir = doc.TAG(dom.PEDIR);
        this._ctlPedir = doc.TAG(dom.CTL_PEDIR);
        this._share = doc.TAG(dom.SHARE);
        this._videoSecond = doc.TAG(dom.VIDEO_SECOND);
        this._swapSecond = doc.TAG(dom.SWAP_SECOND);
        this._sessionAccess = doc.TAG(dom.SESSION_ACCESS);
        this._endSessionAccess = doc.TAG(dom.END_SESSION_ACCESS);
        this._divEndBtn = doc.TAG(dom.DIV_BTN_END);
        this._toggleChat = doc.TAG(dom.TOGGLE_CHAT);
        this._textMessage = doc.TAG(dom.TEXT_MESSAGE);
        this._sideNavbar = doc.TAG(dom.SIDE_NAVBAR);
        this._fullsize = doc.TAG(dom.TOGGLE_VIDEO_SIZE);
        this._sharedFile = doc.TAG(dom.BTN_FILE_SHARING);
        this._spanSecondVideo = doc.TAG(dom.VIDEO_SECOND);
        this._downloadedFiles = doc.TAG(dom.DIV_FILE_SHARING);
        this._finish = doc.TAG(dom.FINISH);

        this._controlCam = true;
        this._controlVoice = true;
        this._controlVolume = false;
        this._controlSharing = false;
        this._session = false;
        this._videoIsMain = false;

        this._divMainVideo = doc.TAG(dom.DIV_MAIN_VIDEO);
        this._spanMainVideo = doc.TAG(dom.VIDEO_MAIN);
        this._pageMainContainer = doc.TAG(dom.PAGE_MAIN_CONTENT);
        this._divIncomingVideo = doc.TAG(dom.DIV_INCOMING_VIDEO);
        this.startTransmition = doc.TAG(dom.START_TRANSMITION);
        this._otherVideos = {
            screen: '',
            user: ''
        };
    }

    /**
     * Inicializa instância de Media()
     * @returns {Obj} Instância de Media()
     */
    initiateMedia() {

        return new Media(
            this._videoPreview,
            this._secondVideoPreview,
            this._thirdVideoPreview,
            this._previewVideo,
            this._mute,
            this._screen,
            this._exitscreen,
            this._vol,
            this._cam,
            this._solPedir,
            this._pedir,
            this._ctlPedir,
            this._share,
            this._videoSecond,
            this._swapSecond,
            this._sessionAccess,
            this._endSessionAccess,
            this._divEndBtn,
            this._toggleChat,
            this._textMessage,
            this._fullsize,
            this._sharedFile,
            this._spanSecondVideo,
            this._downloadedFiles,
            this._finish
        );
    }

    /**
     * Cria listeners para a função de tela cheia
     */
    initListeners() {

        document.addEventListener('fullscreenchange', this.escFullScreen);
        document.addEventListener('webkitfullscreenchange', this.escFullScreen);
        document.addEventListener('mozfullscreenchange', this.escFullScreen);
        document.addEventListener('MSFullscreenChange', this.escFullScreen);
    }

    /**
     * Cria array para utilização de requisições internas via DataChanel
     * @param {String} command Comando da requisição previamente definidos
     * @param {String} firstData Informação da requisição
     * @param {String} secondData Informação da requisição
     * @param {String} thirdData Informação da requisição
     * @param {String} fourthData Informação da requisição
     * @returns {Array}
     */
    createSolicitationArray(command, firstData, secondData, thirdData, fourthData) {

        return [
            command,
            firstData,
            secondData,
            thirdData,
            fourthData
        ];
    }

    /**
     * Troca valor de um boolean
     * @param {Boolean} value  
     * @returns {Boolean}
     */
    _switchValue(value) {

        return value ? false : true;
    }

    /**
     * Remove elemento indicado da view
     * @param {Obj} elem Elemento do DOM 
     */
    removeElement(elem) {

        this._mediaView.removeElement(elem);
    }

    /**
     * Ajusta tela de apresentação para inicializar transmissão
     */
    initiateStream() {

        this._mediaView.adjustStreamScreen();
        this._mediaView.adjustChatFilePanel();
    }

    /**
     * Apresenta controles de mídia na view no início da transmissão
     */
    initiateControls() {

        this._mediaView.showControlElements();
    }

    /**
     * !!DESUSO!!
     * Coleta valor de this._controlSharing
     * @returns {Boolean}
     */
    getControlSharing() {

        return this._controlSharing;
    }

    /**
     * Inicializa o vídeo selecionado
     * @param {Obj} targetVideo Elemento HTML de vídeo 
     */
    initiateVideo(targetVideo) {

        let playPromise = targetVideo.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                    targetVideo.play();
                })
                .catch(error => {
                    this.initiateVideo(targetVideo);
                });
            return;
        }
    }

    /**
     * Atribui aparência para o botão de áudio de acordo com o status do mesmo
     */
    controlVolume() {

        if (this._controlVolume) {
            this._mediaView.embeddedMessage(dom.FRAME_LAYER, 'mute');
            this._mediaView.setVolumeOff();
            this._controlVolume = false;
        } else {
            this._mediaView.embeddedMessage(dom.FRAME_LAYER, 'unmute');
            this._mediaView.setVolumeOn();
            this._controlVolume = true;
        }
    }

    /**
     * Atribui aparência de desabilitado ao botão de áudio
     */
    disableVolume() {

        this._mediaView.volumeOff();
    }

    /**
     * !!DESUSO!!
     * Desabilita microfone e atribui aparência do botão de microfone de acordo com seu status
     * @param {*} currentStream Obj Stream RTCMultiConnection
     */
    controlVoice(currentStream) {

        if (this._controlVoice) {
            currentStream.forEach((stream) => {
                if (!stream.isScreen) {
                    stream.mute('audio');
                }
            });
            this._mediaView.setVoiceOff();
            this._controlVoice = false;
        } else {
            currentStream.forEach((stream) => {
                if (!stream.isScreen) {
                    stream.unmute({
                        audio: true,
                        video: false,
                        type: 'remote'
                    });
                }
            });
            this._mediaView.setVoiceOn();
            this._controlVoice = true;
        }
    }

    /**
     * !!DESUSO!!
     * Atribui aparência de desabilitado ao botão de microfone
     */
    disableMute() {

        this._mediaView.voiceOff();
    }

    /**
     * !!DESUSO!!
     * Desabilita imagem e atribui aparência do botão de câmera de acordo com seu status
     * @param {*} currentStream Obj Stream RTCMultiConnection
     */
    controlCam(currentStream) {

        if (this._controlCam) {
            currentStream.forEach((stream) => {
                if (!stream.isScreen) {
                    stream.mute('video');
                    stream.mute('audio');
                }
            });
            this._mediaView.setCamOff();
            this._controlCam = false;
            if (this._controlVoice) {
                this._mediaView.setVoiceOff();
                this._controlVoice = false;
            }
        } else {
            currentStream.forEach((stream) => {
                if (!stream.isScreen) {
                    stream.unmute('video');
                    stream.unmute('audio');
                }
            });
            this._mediaView.setCamOn();
            this._controlCam = true;
            if (!this._controlVoice) {
                this._mediaView.setVoiceOn();
                this._controlVoice = true;
            }
        }
    }

    /**
     * !!DESUSO!!
     * Atribui aparência de desabilitado ao botão de câmera
     */
    disableCam() {

        this._mediaView.camOff();
    }

    /**
     * Inverte as streams de vídeos entre o vídeo pricipal e os vídeos secundários
     */
    controlSwapVideo() {

        let mVideoP = this._videoPreview;
        let sVideoP = this._secondVideoPreview;
        mVideoP.classList.add("obj-invisible");
        sVideoP.classList.add("obj-invisible");
        let mainVideoSrc;

        this._videoIsMain ? mVideoP.classList.remove(misc.CLASS_WIDTH_LIMIT) : mVideoP.classList.add(misc.CLASS_WIDTH_LIMIT);
        this._videoIsMain = this._switchValue(this._videoIsMain);

        mainVideoSrc = mVideoP.srcObject;
        mVideoP.pause();
        sVideoP.pause();
        mVideoP.srcObject = sVideoP.srcObject;
        sVideoP.srcObject = mainVideoSrc;

        setTimeout(function() {
            let playSecReady = sVideoP.play();
            let playReady = mVideoP.play();
            if (playSecReady !== undefined && playReady !== undefined) {
                playSecReady.then(_ => {
                        sVideoP.play();
                    })
                    .catch(error => {
                        console.log('Iniciando vídeo...', error);
                    });
                playReady.then(_ => {
                        mVideoP.play();
                    })
                    .catch(error => {
                        console.log('Iniciando vídeo...', error);
                    });
            }
            mVideoP.classList.remove("obj-invisible");
            sVideoP.classList.remove("obj-invisible");
        }, 500);
    }

    /**
     * Inicializa vídeos recebidos além do vídeo do apresentador
     * Altera a apresentação da view para comportar os demais vídeos
     * @param {Obj} stream Obj Stream RTCMultiConnection
     */
    openIncomingVideos(stream) {

        if (stream) {
            stream.isScreen ? this._otherVideos.screen = stream.id : this._otherVideos.user = stream.id;
            this._mediaView.openIncomingVideos(this._divMainVideo, this._divIncomingVideo);
        } else {
            return;
        }
    }

    /**
     * Finaliza apresentação de vídeos recebidos
     * Altera a apresentação da view para remover as telas apresentadas
     * @param {Obj} stream Obj Stream RTCMultiConnection
     */
    closeIncomingVideos(stream) {

        if (stream) {
            stream.isScreen ? this._otherVideos.screen = '' : this._otherVideos.user = '';
            if (this._otherVideos.screen == '' && this._otherVideos.user == '') {
                this._mediaView.closeIncomingVideos(this._divMainVideo, this._divIncomingVideo);
            } else {
                return;
            }
        } else {
            return;
        }
    }

    /**
     * Coleta status da posição do vídeo de compartilhamento de tela (principal/secundário)
     * @returns {Boolean}
     */
    getSharedValue() {

        return this._videoIsMain;
    }

    /**
     * Altera a apresentação para vídeos de compartilhamento de tela e apresenta na view
     */
    switchShare() {

        this._controlSharing = this._switchValue(this._controlSharing);
        console.log(this._controlSharing);
        this._controlSharing ? this._mediaView.startShare() : this._mediaView.exitShare();
    }

    /**
     * Altera aparência do botão de compartilhamento de tela e o define como ativo
     */
    setShareEnabled() {

        this._controlSharing = false;
        this._mediaView.shareEnabled();
    }

    /**
     * Altera a apresentação do botão de compartilhamento de tela para desabilitado
     */
    disableShare() {

        this._mediaView.shareOff();
    }

    /**
     * Altera a aparência do botão de finalizar participações e apresenta em view 
     */
    startParticipation() {

        this._session = true;
        this._mediaView.startParticipation();
    }

    /**
     * Altera a aparência do botão de finalizar apresentações e o remove da view
     */
    endParticipation() {

        this._session = false;
        this._mediaView.endParticipation();
    }

    /**
     * Altera a aparência do botão de finalizar apresentações e o desabilita
     */
    disableParticipation() {

        this._session = false;
        this._mediaView.participationOff();
    }

    /**
     * Apresenta mensagem de acesso concedido como participante
     * Trata os atributos e controles de de acesso à apresentações e apresenta alterações na view
     */
    allow() {

        this._mediaView.allowSolicitation();
    }

    /**
     * Apresenta mensagem de acesso negado como participante
     * Trata os atributos e controles de acesso à apresentação
     */
    deny() {

        this._mediaView.denySolicitation();
    }

    /**
     * Altera a apresentação do botão pedir a vez como desabilitado
     */
    disablePedir() {

        this._mediaView.pedirOff();
    }

    /**
     * Altera vídeo principal do Apresentador para fullscreen
     * Funcional apenas para o Broadcaster
     */
    toggleFullScreenOn() {

        if (this._spanMainVideo.mozRequestFullScreen) {
            this._spanMainVideo.mozRequestFullScreen();
        } else if (this._spanMainVideo.requestFullScreen) {
            this._spanMainVideo.requestFullScreen();
            document.requestFullScreen();
        } else if (this._spanMainVideo.webkitRequestFullScreen) {
            this._spanMainVideo.webkitRequestFullScreen();
        }
        this._mediaView.enterFullscreen();
    }

    /**
     * Altera vídeo principal em fullscreen do Apresentador para o tamanho normal
     * Funcional apenas para o Broadcaster
     */
    toggleFullScreenOff() {

        let documento = document.documentElement,
            state = (document.webkitIsFullScreen || document.isFullScreen),
            requestFunc = (documento.requestFullScreen || documento.webkitRequestFullScreen),
            cancelFunc = (document.cancelFullScreen || document.webkitCancelFullScreen);
        (!state) ? requestFunc.call(documento): cancelFunc.call(document);

        this._mediaView.exitFullscreen();
    }

    /**
     * Altera vídeo principal dos espectadores para fullscreen
     * Funcional apenas para os espectadores
     */
    enterFullScreen() {

        this._mediaView.embeddedMessage('#embedded_player', 'fullscreen');
    }

    /**
     * Altera vídeo principal em fullscreen dos espectadores para o tamanho normal
     * Funcional apenas para os espectadores
     */
    exitFullScreen() {

        this._mediaView.embeddedMessage('#embedded_player', 'exitfullscreen');
    }

    /**
     * Atribui à tecla ESC a função de finalização de fullscreen
     */
    escFullScreen() {

        if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            if (document.fullscreen) {
                document.cancelFullScreen();
            } else if (document.mozFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitIsFullScreen) {
                document.webkitCancelFullScreen();
            }
            $(dom.DIV_EXIT_FSCREEN).fadeOut(500);
            let videoContainer = doc.TAG(dom.VIDEO_MAIN);
            videoContainer.classList.remove(misc.TURNOFF_COLOR);
            videoContainer.classList.add(misc.CLASS_WIDTH_LIMIT);
            videoContainer.style.height = misc.STYLE_HEIGHT_INHERIT;
        }
        return;
    }

    /**
     * Controle de expansão de tela a partir do botão expandir
     */
    toggleFullSize() {

        if (GeneralHelper.hasClass(this._pageMainContainer, misc.CLASS_MAIN_CONTAINER)) {
            this._mediaView.expandVideoSize();
        } else {
            this._mediaView.shrinkVideoSize();
        }
    }

    /**
     * Altera a visibilidade de um elemento indicado (visível ou invisível)
     * @param {Obj} elem Elemento HTML
     */
    toggleVisibility(elem) {

        GeneralHelper.hasClass(elem, misc.CLASS_INVISIBLE) ?
            this._mediaView.setVisible(elem) :
            this._mediaView.setInvisible(elem);
    }

    /**
     * Modela e apresenta mensagens de texto Enviadas pelo chat 
     * @param {String} user 
     * @param {String} message
     * @returns {String}
     */
    writeChatMessage(user, message) {

        return this._mediaView.writeChatMessage(user, message);
    }

    /**
     * Modela e apresenta mensagens de texto Recebidas pelo chat 
     * @param {String} msg Mensagem de texto
     * @param {Boolean} rmt Status do painel de chat (Aberto ou fechado)
     */
    writeMessage(msg, rmt) {

        let msgbox;
        let message = atob(msg);
        let instance = M.Sidenav.getInstance(this._sideNavbar);

        rmt ? msgbox = misc.DEFAULT_MSGBOX_OUT : msgbox = misc.DEFAULT_MSGBOX_IN;
        this._mediaView.writeReceiveMessage(message, msgbox, instance.isOpen);
    }

    /**
     * Altera apresentação do botão de envio de arquivos para desabilitado
     */
    disableFileSharing() {

        this._mediaView.fileSharingOff();
    }

    /**
     * Desabilita botão de listagem de arquivos recebidos/enviados
     */
    disableFileSharingList() {

        this._mediaView.fileSharingListOff();
    }

    /**
     * Constroi listagem de arquivos enviados e seus atributos: nome, tipo, tamanho e data de modificação
     * @param {Obj} connection Instância do RTCMulticonnection 
     * @param {Number} count Total de arquivos enviados
     */
    fileSharing(connection, count) {

        if (count > 0) {
            let fileSelector = new FileSelector();
            fileSelector.selectSingleFile(file => {
                this._getDataURL(file, dataURL => {
                    connection.send([
                        btoa(conf.req.RECEIVE_FILE),
                        file.name,
                        file.type,
                        file.size,
                        file.lastModified
                    ]);
                    setTimeout(() => {
                        connection.send({
                            fileName: file.name,
                            fileType: file.type,
                            dataURL: dataURL
                        });
                        this._mediaView.createSendedFiles(file.name, file.size);
                    }, 500);
                });
            });
        } else {
            this._mediaView.noFileSharing();
        }
    }

    /**
     * Trata e apresenta o recebimento de arquivos pelo usuário
     * @param {Obj} event Obj recebido pelo evento de entrada de mensagens pelo DataChanel 
     * @param {Obj} connection Instância do RTCMultiConnection
     */
    incomingFile(event, connection) {

        let blob = this._dataURItoBlob(event.data.dataURL);
        let file = new File([blob], event.data.fileName, {
            type: event.data.fileType
        });
        this._mediaView.transferCompleted();
        this._mediaView.createDownloadLink(file, connection);
        return;
    }

    /**
     * Apresenta barra de progresso indeterminada para o recebimento de arquivos
     * @param {String} file 
     */
    createProgressBar(file) {

        this._mediaView.createProgressBar(file);
    }

    /**
     * Coleta informações de arquivo encaminhada pelo DataChanel e o reconstrói em um Blob
     * @param {String} dataURI URI do arquivo recebido
     * @returns {Blob} 
     */
    _dataURItoBlob(dataURI) {

        let byteString = atob(dataURI.split(',')[1]);
        let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        let buffer = new ArrayBuffer(byteString.length);
        let intArray = new Uint8Array(buffer);
        for (var i = 0; i < byteString.length; i++) {
            intArray[i] = byteString.charCodeAt(i);
        }
        let blob = new Blob([buffer], {
            type: mimeString
        });
        return blob;
    }

    /**
     * Define chamada de método para tratamento de envio de arquivos
     * @param {Obj} file Arquivo selecionado
     * @param {Function} callback Função de retorno
     */
    _getDataURL(file, callback) {

        let reader = new FileReader();
        reader.onload = event => callback(event.target.result);
        reader.readAsDataURL(file);
    }

    /**
     * Apresenta mensagem de solicitações de participação efetuadas para o apresentador
     * @param {Number} value Quantitativo de solicitações
     */
    trataSolicitacao(value) {

        if (value > 0) this._mediaView.showSolicitation(value);
        else this._mediaView.hideSolicitation();
    }

    /**
     * Trata e apresenta lista de solicitações de participação efetuadas para o apresentador
     * @param {Array} text Informações sobre o solicitante
     * @param {Number} count Contador de solicitações efetuadas
     */
    listBox(text, count, userId) {

        if (text[1] === userId) {
            count++
            this.trataSolicitacao(count);
            this._mediaView.listSolicitation(count, text[0], text[2]);
        }
        return count;
    }

    /**
     * Reconstrói e apresenta a listagem de solicitações de participação após alguma interação 
     * @param {String} username Identificador do solicitante
     */
    reconstructList(username) {

        let responseList = doc.ALL(dom.SOL_RESPONSE);
        this._mediaView.clearSolicitationLis();
        if (responseList.length <= 1) this._mediaView.noSolicitation();
        else {
            responseList.forEach(response => {
                console.log(response.id, username);
                if (response.id != username) {
                    this._mediaView.newSolicitation(response);
                }
            });
        }
        this._mediaView.constructSolicitationList();
    }

    /**
     * Ajusta a apresentação dos controles de mídia para cada tipo de conexão (Apresentador e espectadores)
     * @param {String} type Tipo de conexão efetuada (Local ou Remota)
     */
    adjustMediaMenu(type) {

        if (type === conf.con.STREAM_LOCAL) {
            this.disableVolume();
            if (DetectRTC.isMobileDevice) this.disableShare();
            this._mediaView.adjustBroadCaster();
        } else {
            this.disableCam();
            this.disableMute();

            this.disableShare();
            this.disableFileSharing();
            this._mediaView.adjustEspectador();
        }
    }

    /**
     * Constrói, inicializa e apresenta container de vídeo do apresentador ao iniciar a transmissão
     * @param {String} roomid Identificador da sala
     * @param {Obj} media Instância do MediaController()
     */
    initBroadcasterVideo(roomid, media) {

        this._mediaView.initBroadcasterVideo(roomid, media);
    }

    /**
     * Constrói, inicializa e apresenta container de vídeo de um participante
     * @param {String} roomid 
     * @param {String} participant 
     * @param {String} name 
     */
    initParticipantVideo(roomid, participant, name) {

        this._mediaView.initParticipantVideo(roomid, participant, name);
    }

    /**
     * Constrói, inicializa e apresenta container de vídeo de compartilhamento de tela
     * @param {String} screen Identificador de mídia 
     * @param {Obj} media Instância do MediaController()
     */
    initScreenVideo(screen, media) {

        this._mediaView.initScreenVideo(screen, media);
    }

    /**
     * Ajusta, constrói e apresenta telas e vídeo principal a partir da inicialização de uma transmissão
     * @param {String} roomid Identificador da sala 
     * @param {String} preVideo Identificador do vídeo
     * @param {String} preLoader Identificador da tela de pré-load
     * @param {Numeral} count Contagem regrassiva
     */
    initTransmition(roomid, preVideo, preLoader, count) {

        this._mediaView.initPreVideo(preVideo, preLoader, count);
        if (roomid) {
            setTimeout(() => {
                //this.getMediaServerStream(roomid);
            }, 5000);
        }

    }

    /**
     * Verifica status de transmissão (Ativa/Inativa) e apresenta em view a mensagem correspondente
     * @param {Obj} webRTCadpt Instância de WebRTCAdaptor() 
     * @param {String} roomid Identificador da sala
     */
    startAnimation(webRTCadpt, roomid) {

        this._mediaView.startAnimation(webRTCadpt, roomid);
    }

    /**
     * Apresenta status de gravação de tela (Ativo/Inativo) e apresenta em view a mensagem correspondente
     * @param {String} elem identificador do elemento HTML 
     */
    recordAnimation(elem) {

        this._mediaView.recordAnimation(elem);
    }

    /**
     * !!DESUSO!!
     * Informa o status de transmissão da sala criada a partir do retorno da consulta à API Rest do serviço de mídia
     * @param {String} roomid Identificador da sala
     */
    getMediaServerStream(roomid) {

        $.ajax({
            url: conf.con.SOCKET_PLAYER,
            type: 'GET',
            data: { name: btoa(roomid) },
            success: (data) => console.log(data),
            error: (data) => console.error(data)
        });
    }

    /**
     * Ajusta a apresentação de telas e vídeos ao finalizar a transmissão do apresentador
     * Cria link para acesso ao video gravado durante a transmissão para acesso do apresentador
     * @param {String} roomid Identificador da sala
     * @param {Obj} broadcaster Instância do RTCMultiConnection()
     */
    stopTransmition(roomid, broadcaster) {

        try { roomid = atob(roomid) } catch (e) { /* Não faz nada */ }
        if (roomid.startsWith('screen') || roomid.startsWith('participant')) return;
        this._mediaView.stopTransmition();
        if (broadcaster)
            setTimeout(() => this._mediaView.createVideoLink(roomid), 3000);
        else GeneralHelper.hideit(dom.WAITING_LINK);
    }

    /**
     * Altera botão de finalização de transmissão e o apresenta como finalização da conexão
     * @param {String} title Título do botão
     * @param {String} icon Ícone do botão
     */
    changeTransmition(title, icon) {

        this._mediaView.changeTransmition(this._finish, title, icon);
    }

    /**
     * Finaliza a tela de preparação para a transmissão e inicializa a tela de apresentação de vídeo e os controles de mídias
     */
    endPreTransmition() {

        this._mediaView.endPreVideo();
    }

}
class webrtcController {

    constructor() {

        this._connectController = new ConnectController();
        this._mediaController = new MediaController();
        this._structureController = new StructureController();
        this._roomInfoController = new RoomInfoController();
        this._alerta = new MessageController();
        this._roomController = new RoomController();
        this._roomDataController = new RoomDataController();
        this._roomView = new RoomView();
        this._connection = new RTCMultiConnection();
        this._broadcaster;
        this._espectador;

        this._publicRoomIdentifier = conf.con.ROOM_IDENTIFIER;
        this._connect = this._connectController.initiateConnection();
        this._media = this._mediaController.initiateMedia();
        this._structure = this._structureController.initiateStructure();
        this._roomInfo = this._roomInfoController.initiateRoomInfo();
        this._roomData;
        this._room;

        this._retransmiting = false;
        this._retransmitingWho;
        this._roomId;
        this._currentUsers;
        this._mainEventStream;
        this._self;
        this._videoConstraints;
        this._audioConstraints;
    }

    /**
     * Configura padrões
     */
    configureDefaults() {

        // Configura padrões de conexão
        this._initiateConnection();
        // Inicia listeners de video
        this._initiateListeners();
        // Inicia listeners de sockets
        this._connectSocket();
    }

    /**
     * Inicializa eventos de devices
     */
    manageRoom() {

        this._initiateDevices();
    }

    /**
     * Inicializa tratamento de eventos de mensagens de chat
     */
    operateRoom() {

        this._chatSendMessage();
    }

    /**
     * Formata dados de apresentação da sala
     */
    formatRoom() {

        // Inicia Tratamento de URI
        this._treatURI();
        // Inicia definições de abertura de sala
        this._setRoomBroadcastId();
    }

    /**
     * Efetua chamada para registro/atualização em Banco de salas criadas
     * @param {Object} postData 
     * @param {String} targetUrl 
     */
    _saveRoom(postData, targetUrl) {

        // Setup para permitir integração Laravel x Ajax 
        $.ajaxSetup({
            headers: { 'X-CSRF-TOKEN': $(dom.TK_OBJ).attr('data-content') }
        });
        // Post para registro de eventos
        $.ajax({
            url: targetUrl,
            type: 'POST',
            data: postData,
            dataType: 'json',
            success: (data) => this._alerta.initiateMessage(conf.message.SUCCESS_SAVE_CLASS),
            error: (data) => this._alerta.initiateMessage(conf.message.FAIL_SAVE_CLASS)
        });
    }

    /**
     * Configurações de inicialização de conexões
     */
    _initiateConnection() {

        this._initiatePersonalConnection(this._connection);
        this._connection.enableScalableBroadcast = this._connect.enableScalableBroadcast;
        //this._connection.maxRelayLimitPerUser = this._connect.maxRelayLimitPerUser;

    }

    /**
     * Configurações de inicialização de conexões personalizadas
     * @param {Obj RTCMultiConnection} connection
     */
    _initiatePersonalConnection(connection) {

        connection.socketURL = this._connect.urlSocket;
        connection.autoCloseEntireSession = true;
    }

    /**
     * Inicialização de listeners de eventos de tela
     */
    _initiateListeners() {

        this._mediaController.initListeners();
        this._roomInfoController.initiateClock();
    }

    /**
     * Inicialização de sockets
     */
    _connectSocket() {

        this._connection.connectSocket((socket) => {

            // Socket - Join (espectador)
            socket.on(conf.socket.MSG_JOIN, (hintsToJoinBroadcast) => {

                console.log('join-broadcaster', hintsToJoinBroadcast);
                this._structure.broadcastStatus = 1;
                this._espectador.session = hintsToJoinBroadcast.typeOfStreams;
                this._espectador.sdpConstraints.mandatory = {
                    OfferToReceiveVideo: true,
                    OfferToReceiveAudio: true
                };
                this._espectador.extra.modifiedValue = this._roomInfo.currentRoomId.value + '-' + this._roomInfo.currentUser.value;
                this._espectador.broadcastId = hintsToJoinBroadcast.broadcastId;

                this._onStream(this._espectador);
                this._espectador.join(hintsToJoinBroadcast.userid);
                this._alerta.initiateMessage(conf.message.START_TRANSMITION);
            });

            /*
            // Socket - Rejoin
            socket.on(conf.socket.MSG_REJOIN, (getBroadcasterId) => {
                console.log('rejoin-broadcaster');
                this._structure.broadcastStatus = 1;
                this._connection.attachStreams = [];
                this._connection.extra.modifiedValue = this._roomInfo.currentRoomId.value + '-' + this._roomInfo.currentUser.value;
                this._connection.updateExtraData();
                // Socket - check presence
                socket.emit(conf.socket.MSG_CHK_PRESENCE, getBroadcasterId, (isBroadcastExists) => {
                    if (!isBroadcastExists) {
                        this._connection.userid = getBroadcasterId;
                    }
                    // Socket - Join to broadcast
                    console.log('emit join-broadcaster');
                    socket.emit(conf.socket.MSG_JOIN_BROADCAST, {
                        broadcastId: getBroadcasterId,
                        userid: this._connection.userid,
                        typeOfStreams: this._connection.session
                    });
                });
            });
            // Socket - Stoped
            socket.on(conf.socket.MSG_BROADCAST_STOP, (getBroadcasterId) => {
                console.log('stop-broadcaster');
                this._structure.broadcastStatus = 0;
                this._alerta.initiateMessage(conf.message.END_TRANSMITION);
            });
            */
            // Socket - Starting (broadcaster)
            socket.on(conf.socket.MSG_BROADCAST_START, (typeOfStreams) => {
                console.log('start-broadcasting', typeOfStreams);
                this._broadcaster.direction = this._connect.direction;

                this._structure.broadcastStatus = 1;

                this._broadcaster.sdpConstraints.mandatory = {
                    OfferToReceiveVideo: true,
                    OfferToReceiveAudio: true
                };
                this._broadcaster.session = typeOfStreams;

                this._onStream(this._broadcaster);
                this._broadcaster.open(this._broadcaster.userid, (isRoomOpened, roomid, error) => {
                    if (error) {
                        console.error("Falha ao iniciar a sala", error);
                        return;
                    } else {
                        let cursos = this._roomController.createList();
                        let $postData = { author: this._room.name, name: this._room.tema, theme: this._room.assunto, hash: this._room.hash, courses: cursos }
                        let $resource = doc.URL_SALAS_SAVE;
                        this._saveRoom($postData, $resource);
                        // Inicia contagem de tempo
                        this._roomInfoController.stoped = false;
                        // Inicializa verificação de token caso não seja um dispositivo Mobile
                        if (!DetectRTC.isMobileDevice && conf.con.TK_DETECT) {
                            $(dom.TK_DETEC).show();
                            $(dom.CALL_TK).click();
                        }
                        console.info("Sala criada com sucesso.", roomid);
                    }
                });
            });
            /*
            // Socket - Leaving
            socket.on(conf.socket.MSG_LEAVE_ROOM, (targetconnection) => {
                console.log('leave-broadcaster');
                if (targetconnection.remoteUserId != this._connection.userid) return;
                this._connection.leave();
            });
            */
        });

    }

    /**
     * Inicialização/Validação de plugin de compartilhamento de tela
     * @param {Obj RTCMultiConnection} connection
     */
    _getScreenConstraints(connection) {

        connection.getScreenConstraints = (callback) => {
            getScreenConstraints((error, screen_constraints) => {
                if (!error) {
                    screen_constraints = connection.modifyScreenConstraints(screen_constraints);
                    callback(error, screen_constraints);
                    $(dom.SHARE_ALERT).slideDown(300);
                    this._mediaController.switchShare();
                    return;
                }
                if (error !== conf.con.SHARE_DENIED) {
                    let elem = doc.TAG(dom.MSG_SHARE);
                    let instance = M.Modal.getInstance(elem);
                    instance.open();
                } else if (error === conf.con.SHARE_DENIED) {
                    this._mediaController.displayElem(dom.SHARE, 300);
                }
                throw error;
            });
        }
    }

    /**
     * Verifica a conexão e finaliza a participação de um usuário na transmissão
     * @param {Obj RTCMultiConnection} connection 
     */
    _closeParticipantStream(connection) {

        let streamToRemove = null;
        let newArray = [];
        connection.attachStreams.forEach((stream) => {
            console.info(stream.streamid, this._structure.userVideo.streamid);
            if (stream.streamid === this._structure.userVideo.streamid) {
                streamToRemove = stream;
                stream.stop();
            } else newArray.push(stream);
        });
        if (streamToRemove != null) {
            this._retransmiting = false;
            connection.attachStreams = newArray;
            connection.getAllParticipants().forEach((p) => {
                let peer = connection.peers[p].peer;
                try {
                    peer.removeStream(streamToRemove);
                    connection.renegotiate(p);
                } catch (e) { console.error(e) }
            });
        }
    }

    /**
     * Trata eventos de incialização de stream e demais eventos vinculados ao controle de mídias
     * @param {Obj RTCMultiConnection} connection 
     */
    _onStream(connection) {

        let counter = 0;
        // Inicia listener para abertura de conexão
        this._onOpen(connection);

        connection.onstream = (event) => {

            console.warn('EVENT ---->', event, event.type === 'remote' && connection.isInitiator);
            let currentStream;
            if (!this._structure.onParticipation && !event.extra.modifiedValue) this._roomInfo.inRoom.value = event.userid;
            if (this._mainEventStream == undefined && !event.extra.self) this._mainEventStream = event.stream;

            // Marca container onde serão exibidos os arquivos enviados e recebidos
            connection.filesContainer = doc.TAG(dom.DIV_FILE_SHARING);

            // Inicializa a tela de apresentação
            this._mediaController.initiateControls();

            /**==============================================================================
             * Tratamento de conexões REMOTAS e LOCAIS
             * ==============================================================================
             */
            if (event.type === 'local' && !connection.isInitiator) return;

            if (event.type === 'remote' && connection.isInitiator) {

                counter++;
                //if (counter == 1) return;
                if (this._retransmiting) return;

                let operators = [];
                console.warn("EVENT RETRANSMITINDO: ", event);
                // Conexão remota de transmissão com o broadcaster
                if (this._structure.mainVideo != conf.str.WAITING_FOR_VIDEO) {

                    this._structure.incomingCon = event.stream.streamid;
                    this._media.thirdVideoPreview.srcObject = event.stream;
                    this._structure.userVideo = event.stream;
                    connection.extra.remote = event.stream.streamid;

                    //event.mediaElement.srcObject.isVideo = 1;
                    connection.dontCaptureUserMedia = true;
                    connection.attachStreams.push(event.stream);
                    connection.getAllParticipants().forEach((p) => {
                        //console.log(p);
                        if (p + '' != event.userid + '' && operators.indexOf(p) == -1) {
                            operators.push(p);
                            connection.dontAttachStream = true;
                            //console.warn("RENEGOCIANDO COM ", p, event.stream.isAudio, event.stream.isVideo);
                            connection.renegotiate(p);
                            connection.dontAttachStream = false;
                        }
                    });
                    //console.log(connection.attachStreams, this._media.thirdVideoPreview.srcObject);


                    this._mediaController.initiateVideo(this._media.thirdVideoPreview);
                    this._alerta.initiateMessage(conf.message.START_PARTICIPATION);
                    this._mediaController.displayElem(dom.VIDEO_THIRD, 300);

                    this._retransmitingWho = event.userid;
                    this._retransmiting = true;
                    this._structure.streamVideos = event.stream;
                    this._mediaController.openIncomingVideos(event.stream);

                    this._mediaController.displayElem(dom.DIV_BTN_END, 300);
                    this._media.endSessionAccess.onclick = () => {
                        console.log('---> REMOTO', event.userid, this._structure.targetUser);

                        // Remoção da stream do usuário
                        this._closeParticipantStream(connection);

                        this._mediaController.hideElem(dom.DIV_BTN_END);
                        this._structure.emptyStreamVideos();
                        this._structure.incomingCon = '';
                        this._mediaController.closeIncomingVideos(event.stream);

                        let msgrash = this._mediaController.createSolicitationArray(
                            btoa(conf.req.END_PARTICIPATION),
                            this._roomInfo.currentUser.value,
                            this._structure.targetUser,
                            this._roomInfo.inRoom.value,
                            event.userid
                        );
                        connection.send(msgrash);
                        msgrash = [];
                        this._structure.lockSolicitation = false;
                    }
                } else {
                    return;
                }


            } else if (!this._structure.onParticipation && (event.type === 'remote' && event.stream.isScreen === true)) {

                console.log('REMOTO COM SCREEN --> ', event.stream);
                this._screenStream(event.stream);

            } else if (!this._structure.onParticipation && (event.type === 'remote' && !event.stream.isScreen)) {

                console.log('REMOTO SEM SCREEN --> ', event, event.stream, event.extra.remote, event.stream.streamid);

                // Identifica mídia do broadcaster
                let isBroadcasterMidia = true;
                // Valida dispositívos de áudio e vídeo
                let devices = new DevicesController();
                devices.participantInitiateDevices();

                if (event.extra.broadcastStream == event.stream.streamid) isBroadcasterMidia = false;
                if (isBroadcasterMidia) {

                    //console.warn("I'M A PEER - Recebendo vídeo de usuário: ", connection.userid, event, isBroadcasterMidia, event.stream.isAudio, event.stream.isVideo);
                    this._participateScreen(event.stream);
                } else {
                    this._structure.incomingCon = event.stream.streamid;
                    this._structure.onParticipation = false;
                    this._media.videoPreview.srcObject = event.stream;
                    this._roomData.transmiting = true;
                    this._structure.mainVideo = event.stream;
                    currentStream = [event.stream];
                    this._mediaController.initiateVideo(this._media.videoPreview);
                }
                // Ajusta elementos de exibição (define o menu de áudio e video para espectadores)
                // Desabilita botão de ação para câmera/microfone/compartilhamento de tela
                this._mediaController.adjustMediaMenu(event.type);
                this._structure.viewers = connection.getAllParticipants().length;

                // Tratamento de ação de controles de mídia==================================
                this._media.vol.onclick = () => this._mediaController.controlVolume([event.stream]);

                this._media.solPedir.onclick = () => {

                    let validadeDevices = devices.checkParticipation();
                    let altText = [];
                    if (!validadeDevices) return;
                    if (this._structure.broadcastStatus == 1 && (this._structure.solicita === 0 && !this._structure.lockSolicitation)) {
                        let msgrash = this._mediaController.createSolicitationArray(
                            btoa(conf.req.PEDE_VEZ),
                            this._roomInfo.currentUser.value,
                            connection.userid,
                            this._roomInfo.inRoom.value,
                            this._roomInfo.currentRoomId.value
                        );
                        try {
                            connection.send(msgrash, this._roomInfo.inRoom.value);
                            this._structure.solicita += 1;
                            altText = conf.message.SEND_SOLICITATION;
                        } catch (err) {
                            altText = conf.message.ERROR_SOLICITATION;
                        }
                        msgrash = [];
                    } else if (this._structure.solicita > 0) {
                        altText = conf.message.DUP_SOLICITATION;
                    } else if (this._structure.lockSolicitation) {
                        altText = conf.message.ERR_ACP_SOLICITATION;
                    } else {
                        altText = conf.message.NO_CONNECTION;
                    }
                    this._alerta.initiateMessage(altText);
                };
                //===========================================================================

            } else if (!this._structure.onParticipation && (event.type === 'local' && (!event.stream.isScreen && !event.extra.self))) {

                console.log('TRANSMISSÃO LOCAL <---', this._structure.mainVideo, event.userid, event.stream.streamid, event, connection);
                if (this._structure.incomingCon == event.stream.streamid) return;

                this._structure.onParticipation = true;
                connection.isUpperUserLeft = false;
                connection.extra.broadcastStream = event.stream.streamid;
                this._structure.mainVideo = event.stream;
                this._structure.incomingCon = event.stream.streamid;
                currentStream = [event.stream];
                this._media.videoPreview.srcObject = event.stream;
                this._media.videoPreview.userid = event.userid;
                this._media.videoPreview.muted = true;
                this._mediaController.initiateVideo(this._media.videoPreview);
                this._connectController.points.push(btoa(conf.req.USERS_STATUS));

                // Ajusta elementos de exibição (define contadores de solicitações e remove 'pedir vez')
                if (this._structure.solicita <= 0) this._mediaController.hideElem(dom.COUNT_PEDIR);
                if (!connection.isInitiator) this._mediaController.disablePedir();

                // Ajusta elementos de exibição (define o menu de áudio e video para broadcaster)
                this._mediaController.adjustMediaMenu(event.type);

                // Apresenta o número de espectadores conectados
                this._mediaController.displayElem(dom.UL_CON_USERS, 300);

                // Tratamento de ação de controles de mídia==================================
                this._media.mute.onclick = () => this._mediaController.controlVoice(currentStream);
                this._media.cam.onclick = () => this._mediaController.controlCam(currentStream);
                this._media.sharedFile.onclick = () => this._mediaController.fileSharing(connection, this._structure.viewers);

                this._media.ctlPedir.onclick = () => {
                    // Tratamento de respostas (permitir / negar)
                    let response = doc.ALL(dom.CLASS_RESPONSES);
                    for (var j = 0; j < response.length; j++) {
                        let thisId = response[j].id;
                        response[j].onclick = () => {

                            console.log(thisId);
                            setTimeout(() => {
                                let admResponse = thisId.split('_');
                                let msgrash = this._mediaController.createSolicitationArray(
                                    btoa(conf.req.RESP_PEDE_VEZ + admResponse[0]),
                                    this._roomInfo.currentUser.value,
                                    admResponse[1],
                                    this._roomInfo.inRoom.value,
                                    this._roomInfo.currentRoomId.value
                                );
                                if (admResponse[0] == conf.req.REQ_ALLOW && this._structure.lockSolicitation) {
                                    this._alerta.initiateMessage(conf.message.ACCEPT_SOLICITATION);
                                } else {
                                    this._structure.solicita -= 1;
                                    connection.send(msgrash);
                                    this._mediaController.reconstructList(admResponse[1]);
                                    this._mediaController.trataSolicitacao(this._structure.solicita);
                                    if (admResponse[0] == conf.req.REQ_ALLOW) {
                                        this._structure.lockSolicitation = true
                                        this._structure.targetUser = admResponse[1];
                                        this._media.divEndBtn.setAttribute('data-target', admResponse[1]);
                                        this._mediaController.displayElem(dom.DIV_BTN_END, 300);
                                    }
                                }
                                msgrash = [];
                            }, 1000);
                        }
                    }
                    this._media.endSessionAccess.onclick = () => {

                        // Remoção da stream do usuário
                        this._closeParticipantStream(connection);

                        this._mediaController.hideElem(dom.DIV_BTN_END);
                        this._structure.emptyStreamVideos();
                        this._structure.incomingCon = '';
                        let targetId = this._structure.targetUser;
                        let msgrash = this._mediaController.createSolicitationArray(
                            btoa(conf.req.END_PARTICIPATION),
                            this._roomInfo.currentUser.value,
                            connection.userid,
                            this._roomInfo.inRoom.value,
                            targetId
                        );
                        connection.send(msgrash, targetId);
                        this._structure.lockSolicitation = false;
                        msgrash = [];
                        console.log('---> LOCAL', targetId, event.userid);
                    }
                };
                this._media.share.onclick = () => {

                    if (!this._mediaController.getControlSharing()) {
                        this._mediaController.hideElem(dom.SHARE);
                        connection.addStream({
                            screen: true,
                            oneway: true,
                            streamCallback: (stream) => {
                                setTimeout(() => {
                                    connection.getAllParticipants().forEach((p) => {

                                        connection.renegotiate(p, {
                                            screen: true,
                                            oneway: true
                                        });
                                        console.log("Renegociando com " + p);
                                    });
                                    this._screenStream(stream);
                                }, 2000);
                                this._roomInfo.inScreen.value = stream.streamid;
                            }
                        });
                    } else {
                        let streamConnection = this._roomInfo.inScreen.value;
                        let streamToRemove = null;
                        let newArray = [];
                        connection.attachStreams.forEach((stream) => {
                            if (stream.id === streamConnection) {
                                streamToRemove = stream;
                                stream.stop();
                            } else newArray.push(stream);
                        });
                        connection.attachStreams = newArray;
                        connection.getAllParticipants().forEach((p) => {
                            let peer = connection.peers[p].peer;
                            try {
                                peer.removeStream(streamToRemove);
                                connection.renegotiate(p, {
                                    screen: false,
                                    oneway: true
                                });
                            } catch (e) { console.log(e) }
                        });
                        let msgrash = this._mediaController.createSolicitationArray(
                            btoa(conf.req.END_SHARE),
                            this._roomInfo.currentUser.value,
                            streamConnection,
                            this._roomInfo.inRoom.value,
                            this._roomInfo.currentRoomId.value
                        );
                        connection.send(msgrash);
                        msgrash = [];
                    }
                };
                //===========================================================================
            }

            // Tratamento das funções MUTE e UNMUTE
            connection.onmute = event => event.mediaElement.setAttribute(misc.ATTR_POSTER, conf.str.POSTER_IMG);
            connection.onunmute = event => event.mediaElement.removeAttribute(misc.ATTR_POSTER);
            // Botão de maximizar o video -> toggle on:off
            this._media.screen.onclick = () => this._mediaController.enterFullScreen();
            this._media.exitscreen.onclick = () => this._mediaController.exitFullScreen();
            // Tratamento da função de ampliar e reduzir vídeo
            this._media.fullsize.onclick = () => this._mediaController.toggleFullSize();
            // Tratamento da função de chat da barra de controle de mídia
            this._media.toggleChat.onclick = () => this._media.textMessage.focus();

            // Tratamento de ingresso na transmissão: Botão "Ingressar" -> Ingressa e participa da apresentação
            this._media.sessionAccess.onclick = () => {

                if (!this._mediaController._session && !this._structure.onParticipation) {
                    this._mediaController.startParticipation();
                    this._structure.onParticipation = true;
                    try {
                        if (this._structure.singleConnection) {
                            connection.extra.alteredValue = true;
                            connection.updateExtraData();
                        }
                        this._startParticipation(connection);
                    } catch (e) {
                        this._mediaController.endParticipation();
                        this._structure.onParticipation = false;
                    }
                } else if (this._mediaController._session && this._structure.onParticipation) {
                    this._mediaController.disableParticipation();
                    this._structure.onParticipation = false;
                    try {
                        connection.attachStreams.forEach((stream) => {
                            connection.getAllParticipants().forEach((p) => {
                                let peer = connection.peers[p].peer;
                                stream.stop();
                                peer.removeStream(stream);
                            });
                        });
                        let msgrash = this._mediaController.createSolicitationArray(
                            btoa(conf.req.END_PARTICIPANT),
                            this._roomInfo.currentUser.value,
                            connection.userid,
                            this._roomInfo.inRoom.value,
                            this._roomInfo.currentRoomId.value
                        );
                        connection.send(msgrash, this._roomInfo.inRoom.value);
                        this._structure.lockSolicitation = false;
                        msgrash = [];
                        connection.extra.alteredValue = false;
                        connection.updateExtraData();
                        this._alerta.initiateMessage(conf.message.END_PARTICIPATION);
                        setTimeout(() => {
                            if (this._structure.singleConnection)
                                this._connectController.cancelFullMeshConnection(connection, this._roomId);
                        }, 500);
                    } catch (e) {
                        this._mediaController.startParticipation();
                        this._structure.onParticipation = true;
                    }
                }
            };
        }
    }

    /**
     * Trata elementos de mídia para apresentação de tela compartilhada
     * @param {Obj MediaStream} stream 
     */
    _screenStream(stream) {

        // Conexão remota com compartilhamento de tela
        this._mediaController.openIncomingVideos(stream);
        this._media.secondVideoPreview.srcObject = stream;
        this._structure.incomingCon = stream.streamid;
        this._mediaController.initiateVideo(this._media.secondVideoPreview);
        this._mediaController.displayElem(dom.VIDEO_SECOND, 300);
        // Tratamento Botão "Swap" -> Toggle Main/Second Video
        this._media.spanSecondVideo.onmouseenter = () => this._mediaController.toggleVisibility(this._media.swapSecond);
        this._media.spanSecondVideo.onmouseleave = () => this._mediaController.toggleVisibility(this._media.swapSecond);
        this._media.swapSecond.onclick = () => this._mediaController.controlSwapVideo();
    }

    /**
     * Trata elementos de mídia para paresentação de vídeo de participação de usuário
     * @param {Obj MediaStream} stream 
     */
    _participateScreen(stream) {

        this._mediaController.displayElem(dom.VIDEO_THIRD, 300);
        if (this._structure.incomingCon != stream.streamid) {
            this._structure.incomingCon = stream.streamid;
            this._structure.userVideo = stream;
            setTimeout(() => {
                this._media.thirdVideoPreview.srcObject = stream;
                console.warn('Video source: ', this._media.thirdVideoPreview.srcObject);
                this._mediaController.initiateVideo(this._media.thirdVideoPreview);
                this._mediaController.openIncomingVideos(stream);
            }, 500);
        } else {
            return;
        }
    }

    /**
     * Tratamento de abertura de conexão com a sala criada
     * @param {Obj RTCMultiConnection} connection 
     */
    _onOpen(connection) {

        connection.onopen = (event) => {
            console.log("Abrindo conexão ", event);
            if (connection.isInitiator) {
                this._connectController.points.push(event.userid + '|' + event.extra.modifiedValue);
                this._currentUsers = this._connectController.points;
                this.setUsersInformation();
            }
            if (event.userid == this._roomId || connection.isInitiator)
                return;
            else if (!connection.isInitiator) {
                if (this._roomData.transmiting) return;
            }
        };

        // Inicia listener para tratamento de compartilhamento de tela
        this._getScreenConstraints(connection);
        // Inicia listener para recebimento de mensagens de chat
        this._onMessage(connection);
        // Inicia listener para atualização de acessos à sala
        this._onNumberOfBroadcastViewersUpdated(connection);
        // Inicia listener para fechamento de stream
        this._onStreamEnded(connection);
        // Inicia listener para finalização de conexão
        this._onLeave(connection);
    }

    /**
     * Tratamento de encerramento de stream em uma sala criada
     * @param {Obj RTCMultiConnection} connection
     */
    _onStreamEnded(connection) {

        connection.onstreamended = (event) => {
            console.log(event.streamid, this._structure.userVideo.streamid);
            if (event.stream.isScreen) {
                if (this._mediaController.getSharedValue()) this._media.swapSecond.click();
                this._mediaController.hideElem(dom.VIDEO_SECOND);
                this._mediaController.switchShare();
                $(dom.SHARE_ALERT).slideUp(300);

            } else if (event.streamid == this._structure.userVideo.streamid) {
                if (connection.isInitiator) {
                    this._mediaController.hideElem(dom.DIV_BTN_END, 300);
                    this._closeParticipantStream(connection);
                };
                this._mediaController.hideElem(dom.VIDEO_THIRD);
                this._structure.userVideo = conf.str.WAITING_FOR_VIDEO;
                this._structure.lockSolicitation = false;
            } else {
                return;
            }
            this._mediaController.closeIncomingVideos(event.stream);
        }
    }

    /**
     * Tratamento de encerramento de uma conexão com uma sala criada
     * @param {Obj RTCMultiConnection} connection
     */
    _onLeave(connection) {

        connection.onleave = (event) => {
            console.error('Deixando sala...', event);
            //this._reloadRoom(event.userid);
            this.alertDisconnection(event.userid);
        };
    }

    /**
     * Tratamento de URI
     * @param {String} s 
     */
    _decodeURI(s) {

        return decodeURIComponent(s.replace(/\+/g, ' '));
    }

    /**
     * Tratamento e padronização de URI
     */
    _treatURI() {

        let params = {},
            r = /([^&=]+)=?([^&]*)/g;
        let match, search = window.location.search;
        while (match = r.exec(search.substring(1)))
            params[this._decodeURI(match[1])] = this._decodeURI(match[2]);
        window.params = params;
    }

    /**
     * Definição de ID do criador da sala (Broadcaster)
     */
    _setRoomBroadcastId() {

        let broadcastId = '';
        if (localStorage.getItem(this._connection.socketMessageEvent)) {
            broadcastId = localStorage.getItem(this._connection.socketMessageEvent);
        } else {
            broadcastId = this._connection.token();
        }
        this._roomInfo.currentRoomId.onkeyup = function() {
            localStorage.setItem(this._connection.socketMessageEvent, this.value);
        };
        let hashString = location.hash.replace('#', '');
        if (hashString.length && hashString.indexOf('comment-') == 0) {
            hashString = '';
        }
        if (broadcastId && broadcastId.length) {
            this._roomInfo.currentRoomId.value = broadcastId;
            localStorage.setItem(this._connection.socketMessageEvent, broadcastId);
        }
    }

    /**
     * Tratamento da atualização do contador de usuários conectados
     * @param {Obj RTCMultiConnection} connection
     */
    _onNumberOfBroadcastViewersUpdated(connection) {

        connection.onNumberOfBroadcastViewersUpdated = (event) => {
            //if (!connection.isInitiator) return;
            console.info('Number of broadcast (', event.broadcastId, ') viewers', event.numberOfBroadcastViewers);
            this._structure.viewers = event.numberOfBroadcastViewers;
        };
    }

    /**
     * Informa espectadores conectados
     */
    setUsersInformation() {

        if (this._broadcaster) {
            if (this._broadcaster.isInitiator && this._connectController.points.length > 1) {
                this._broadcaster.send(this._connectController.points);
                this._updateUsersList();
            }
        } else return;
    }

    /**
     * Tratamento de recebimento de dados: arquivos/mensagens
     * @param {Obj RTCMultiConnection} connection 
     */
    _onMessage(connection) {

        connection.onmessage = (event) => {
            if (event.data.fileName) this._mediaController.incomingFile(event, connection);
            else this._incomingMessage(event, connection);
        }
    }

    /**
     * Tratamento de mensagens recebidas
     * @param {Obj} event 
     * @param {Obj RTCMultiConnection} connection 
     */
    _incomingMessage(event, connection) {

        if (event.data.userRemoved === true) {
            connection.disconnectWith(event.data.removedUserId);
            return;
        } else if ((connection.isInitiator && (event.data && !event.data.userRemoved))) {
            if (!Array.isArray(event.data)) {
                connection.getAllParticipants().forEach((p) => {
                    if (p + '' != event.userid + '') connection.send(event.data, p);
                });
            }
            this._messageSetting(event);
        } else {
            this._messageSetting(event);
        }
    }

    /**
     * Tratamento de de eventos de envio de mensagens
     */
    _chatSendMessage() {

        this._media.textMessage.onkeyup = event => this._formatChatMessage(event);
        doc.TAG(dom.BTN_SEND_MSG).onclick = () => this._formatChatMessage();
    }

    /**
     * Formatação de mensagem de texto
     * @param {Obj} event 
     */
    _formatChatMessage(event) {

        let value = this._media.textMessage.value;
        if (event)
            if (event.keyCode != 13) return;
        value = value.replace(/^\s+|\s+$/g, '');
        if (!value.length) return;
        let texto = this._mediaController.writeChatMessage(this._structure.usuario, value);
        let connection = this._broadcaster || this._espectador;
        connection.send(texto);
        this._messageSetting(texto);
        this._media.textMessage.value = '';
    }

    /**
     * Tratamento de mensagens enviadas/recebidas a partir do seu conteúdo
     * @param {Obj} event 
     */
    _messageSetting(event) {

        let remoto;
        event.data ? remoto = true : remoto = false;
        var text = event.data || event;
        // Informações de usuários conectados à sala
        if (remoto && (Array.isArray(text) && (text.length >= 2 && text[0] == btoa(conf.req.USERS_STATUS)))) {
            this._currentUsers = event.data;
            this._updateUsersList();
            return;
        }
        // Definição de mensagem sistêmicas (Requisições Específicas)
        if (remoto && (Array.isArray(text) && text.length >= 5)) {
            let chkrash = event.data;
            let msgData = [];
            let myRoom = doc.TAG(dom.ROOM).value;

            if (chkrash[0] === btoa(conf.req.PEDE_VEZ)) {
                // Pedir vez para participação
                msgData[0] = chkrash[1];
                msgData[1] = chkrash[3].split('|')[1];
                msgData[2] = chkrash[4];
                this._structure.solicita = this._mediaController.listBox(msgData, this._structure.solicita);
                return;

            } else if (chkrash[0] === btoa(conf.req.RESP_PEDE_VEZ + conf.req.REQ_ALLOW)) {
                // Permissão de participação concedida
                if (chkrash[2] === myRoom) {
                    this._structure.solicita -= 1;
                    this._mediaController.allow();
                    this._structure.lockSolicitation = true;
                }
                return;

            } else if (chkrash[0] === btoa(conf.req.RESP_PEDE_VEZ + conf.req.REQ_DENY)) {
                // Permissão de participação negada
                if (chkrash[2] === myRoom) {
                    this._structure.solicita -= 1;
                    this._mediaController.deny();
                    this._structure.lockSolicitation = false;
                }
                return;

            } else if (chkrash[0] === btoa(conf.req.END_SHARE)) {
                // Finalização de compartilhamento de tela
                if (this._mediaController._videoIsMain) {
                    this._media.swapSecond.click();
                }
                setTimeout(() => {
                    this._mediaController.hideElem(dom.VIDEO_SECOND);
                }, 1000);

            } else if (chkrash[0] === btoa(conf.req.END_PARTICIPATION)) {
                // Finalização de participação
                if (!this._structure.onParticipation) {
                    this._structure.onParticipation = true;
                    this._mediaController._session = true;
                }
                if (chkrash[2] == myRoom) this._media.sessionAccess.click();
                else {
                    this._mediaController.hideElem(dom.VIDEO_THIRD);
                    this._structure.userVideo = conf.str.WAITING_FOR_VIDEO;
                    this._structure.lockSolicitation = false;
                }

            } else if (chkrash[0] === btoa(conf.req.END_PARTICIPANT)) {
                // Finalização de participação (Remoto)
                this._mediaController.hideElem(dom.DIV_BTN_END);
                this._retransmiting = false;
                this._retransmitingWho = undefined;

            } else if (chkrash[0] === btoa(conf.req.RECEIVE_FILE)) {
                // Recebimento de arquivo
                this._mediaController.createProgressBar(chkrash[1]);

            } else {
                // Mensagem sistêmica não definida
                return;
            }
        } else {
            // Tratamento de mensagens comuns (fora do padrão de mensagem com solicitação)    
            this._mediaController.writeMessage(text, remoto);
        }
    }

    /**
     * Inicialização dos dispositívos de mídia e criação de vídeo de preview
     */
    _initiateDevices() {

        let confirm = doc.TAG(dom.CONFIRM_DEVICES);
        confirm.onclick = () => {

            this._finishSelfVideo();

            setTimeout(() => {
                if (this._roomController.checkDevices() && this._self == undefined) {
                    $(dom.SHOW_PREVIEW).fadeIn(300);

                    let self = new RTCMultiConnection();
                    //let self = this._connection;
                    this._initiatePersonalConnection(self);

                    this._setConnectionDevices(self);
                    this._afterOpenSelfVideo(self);

                    self.session = {
                        audio: false,
                        video: true,
                        type: 'local'
                    }
                    self.sdpConstraints.mandatory = {
                        OfferToReceiveVideo: false,
                        OfferToReceiveAudio: false
                    };

                    self.extra.self = true;
                    self.open('self');
                    this._self = self;
                }
            }, 500);

        }
    }

    /**
     * Tratamento de evento de stream de vídeo de preview
     * @param {Obj RTCMultiConnection} connection 
     */
    _afterOpenSelfVideo(connection) {

        connection.onstream = (event) => {
            console.log('SELF -> LOCAL--->', event, connection);
            this._media.previewVideo.srcObject = event.stream;
            this._media.previewVideo.muted = true;
            this._mediaController.initiateVideo(this._media.previewVideo);
        }
    }

    /**
     * Finalização de vídeo de preview
     */
    _finishSelfVideo() {

        if (this._self != undefined) {
            this._self.extra.self = false;
            this._self.attachStreams.forEach(function(localStream) {
                localStream.stop();
            });
            let socket = io.connect(this._connect.urlSocket + '?userid=admin');
            socket.emit('admin', {
                deleteUser: true,
                userid: this._self.userid
            });
            this._media.previewVideo.pause();
            this._self = undefined;
        }
    }

    /**
     * Definição dos dispositívos selecionados para abertura de sala
     * @param {Obj RTCMultiConnection} connection 
     */
    _setConnectionDevices(connection) {

        if (connection.DetectRTC.browser.name === 'Firefox') {
            this._videoConstraints = { deviceId: this._roomController.videoList.value };
            this._audioConstraints = { deviceId: this._roomController.audioList.value };
        } else {
            this._videoConstraints = {
                mandatory: {},
                optional: [{
                    sourceId: this._roomController.videoList.value
                }]
            }
            this._audioConstraints = {
                mandatory: {},
                optional: [{
                    sourceId: this._roomController.audioList.value
                }]
            }
        }
        connection.mediaConstraints = {
            video: this._videoConstraints,
            audio: this._audioConstraints
        }
    }

    /**
     * Tratamento de evento de criação de uma nova sala
     */
    createRoom() {

        this._structure.startRoom.onclick = () => {

            this._room = this._roomController.initiateRoom();

            if (this._roomController.validade()) {

                let broadcastId = this._room.hash.toString();
                this._broadcaster = new RTCMultiConnection();
                //this._broadcaster = this._connection;
                this._broadcaster.extra.assunto = this._roomController._inputAssunto.value;
                this._broadcaster.extra.materia = this._roomController._inputMateria.value;
                this._broadcaster.extra.nome = this._roomController._inputName.value;

                this._initiatePersonalConnection(this._broadcaster);
                this._broadcaster.publicRoomIdentifier = this._publicRoomIdentifier;
                this._broadcaster.socketMessageEvent = this._publicRoomIdentifier;
                this._broadcaster.enableFileSharing = this._connect.fileSharing;

                // Define elementos de inicialização da sessão criada
                let audioConf = conf.con.SESSION_AUDIO;
                let videoConf = conf.con.SESSION_VID;

                // Define configuração de sessão
                this._broadcaster.session = {
                    audio: audioConf,
                    video: videoConf,
                    data: conf.con.SESSION_DATA,
                    oneway: conf.con.SESSION_ONEWAY,
                    broadcast: conf.con.SESSION_BROADCAST
                };

                // Controle da utilização de banda
                if (conf.con.SET_BAND_LIMIT) {
                    this._broadcaster.bandwidth = {
                        audio: conf.con.BAND_AUDIO,
                        video: conf.con.BAND_VIDEO
                    }
                }

                this._finishSelfVideo();
                this._structure.usuario = this._room.name;
                this._structure.onlobby = false;
                // Verificação de dispositivos de entrada de áudio e vídeo
                if (!GeneralHelper.detectmob() && this._structure.roomType.value == 0) {
                    if (!this._roomController.checkDevices()) {
                        this._alerta.initiateMessage(conf.message.DEVICE_ALERT);
                        this._structure.configDev.click();
                        return;
                    } else {
                        this._setConnectionDevices(this._broadcaster);
                    }
                }
                // Inicializa a tela de apresentação
                this._mediaController.initiateStream();
                // Modela e apresenta cabeçalho do video
                this._roomController.setRoomLabel(misc.ICON_FA_VIDEOCAM, this._room.tema, this._room.assunto);
                this._structure.startRoom.disabled = true;
                this._structure.broadcastStatus = 1;

                let socket = this._connection.getSocket();
                socket.emit('check-broadcast-presence', broadcastId, (isBroadcastExists) => {
                    if (!isBroadcastExists) this._broadcaster.userid = broadcastId;
                    if (conf.con.SET_BAND_LIMIT) {
                        socket.emit('join-broadcast', {
                            broadcastId: broadcastId,
                            userid: this._broadcaster.userid,
                            typeOfStreams: this._broadcaster.session,
                            bandwidth: this._broadcaster.bandwidth
                        });
                    } else {
                        socket.emit('join-broadcast', {
                            broadcastId: broadcastId,
                            userid: this._broadcaster.userid,
                            typeOfStreams: this._broadcaster.session
                        });
                    }
                });

            } else {
                this._alerta.initiateMessage(conf.message.FORM_ALERT);
            }
        }
    }

    /**
     * Coleta lista de salas abertas
     */
    getPublicModerators() {

        this._connection.socket.emit('get-public-rooms', this._publicRoomIdentifier, listOfRooms => {
            this._checkRooms(listOfRooms);
        });
        return this._structure.onlobby;
    }

    /**
     * Gera listagem de salas abertas
     * @param {Obj} rooms 
     */
    _checkRooms(rooms) {

        if (this._structure.onlobby) {
            //Verifica a existência des salas públicas
            if (rooms.length <= 0) {
                this._structure.publicRoomsList.innerHTML = '';
                this._roomController.noRooms();
                return
            }
            rooms.forEach((array) => {
                this._structure.publicRoomsList.innerHTML = '';
                let moderatorId = array.sessionid;
                this._connection.getNumberOfBroadcastViewers(moderatorId, numberOfBroadcastViewers => this._structure.viewers = numberOfBroadcastViewers);

                let labelRoom = this._roomDataController.validateRoomName(moderatorId, array);
                if (!labelRoom) {
                    array.length > 1 ? null : this._roomController.noRooms();
                    return;
                }
                if (moderatorId == this._connection.userid) return;
                this._roomData = this._roomDataController.initiateRoomData(labelRoom, array.extra.assunto, array.extra.materia, array.extra.nome);
                this._roomData.allowed = this._roomDataController.validateAccess(this._roomData.curso, this._roomData.classes);

                if (this._roomData.allowed) {
                    // Cria rótulo de sala se o acesso a ela for permitido
                    this._structure.countRooms += 1;
                    this._structure.usuario = this._roomInfo.currentUser.value;
                    let divOpen = doc.ADD('div');
                    let button = doc.ADD('a');
                    let card = this._roomController.constructAccessList(this._roomData.classe, this._roomData.assunto, this._roomData.apresentador, this._structure.viewers, moderatorId);
                    this._roomController.initiateRoomCard(moderatorId, card, divOpen, button);

                    //Função de entrada na sala a partir do botão ENTRAR
                    button.onclick = () => {
                        this._roomId = moderatorId;
                        this._roomController.setRoomLabel(misc.ICON_FA_TV, this._roomData.classe, this._roomData.assunto);
                        // Trata botão de modal de espectadores presentes
                        doc.TAG(dom.INFORM_VIEWS).onclick = () => {
                            let validate = this._roomController.validateViews();
                            if (validate) this._roomEntered(moderatorId, this._roomData.whois, this._connection);
                            else this._alerta.initiateMessage(conf.message.INVALID_VALUE);
                        }
                        setTimeout(() => doc.TAG(dom.NUMBER_VIEWS).focus(), 300);
                    }
                }
                if (this._structure.countRooms == 0) this._roomController.noRooms();
            });
        }
        return this._structure.onlobby;
    }


    _updateUsersList() {

        // Tratamento de conexões de espectadores ao entrar em uma sala
        this._roomController.clearConList();

        if (!this._currentUsers) return;

        let connection = this._broadcaster || this._espectador;
        // Número de espectadores conectados
        this._structure.viewers = this._currentUsers.length - 1;

        // Criação de rótulos para listagem de usuários ativos
        this._currentUsers.forEach((espectador) => {
            if (espectador == btoa(conf.req.USERS_STATUS)) return;
            let participant = espectador.split('|');
            let target = participant[0];
            let itsMe = false;
            let label;
            let user;
            if (connection.extra.modifiedValue) itsMe = (connection.extra.modifiedValue === participant[1]);
            if (itsMe) {
                label = this._roomInfo.currentUser.value;
                user = this._roomInfo.currentRoomId.value;
            } else {
                label = participant[1].split('-')[1];
                user = participant[1];
            }
            this._roomController.constructConnectionList(user, label, target, itsMe);
        });
        if (this._structure.viewers >= 0) {
            if (this._roomInfo.countUsers.getAttribute(misc.ATTR_USER_TYPE) == 0) {
                this._roomController.inputConList();
                this._mediaController.displayElem(dom.UL_CON_USERS, 300);
            }
            this._roomView.changeCounter(this._structure.viewers);
            let btnDisconnect = doc.ALL(dom.DISCONNECT_BTN);
            for (var j = 0; j < btnDisconnect.length; j++) {
                let thisId = doc.TAG('#' + btnDisconnect[j].id);
                let thisName = btnDisconnect[j].name;
                btnDisconnect[j].onclick = () => this._disconnectUser(connection, thisId, thisName);
            }
        }
    }

    /**
     * Tratamento de eventos de solicitação de remoção de usuário da sala 
     * @param {Obj RTCMultiConnection} connection 
     * @param {String} thisId 
     * @param {String} thisName 
     */
    _disconnectUser(connection, thisId, thisName) {

        let disconnectId = thisId.getAttribute(misc.ATTR_USER_ANNOUNCE);
        if (connection.isInitiator) connection.disconnectWith(disconnectId);
        else {
            connection.send({
                userRemoved: true,
                removedUserId: disconnectId
            });
        }
        this._alerta.initiateMessage(conf.message.DISCONNECT_USER, thisName);
    }

    /**
     * Configuração e tratamento de eventos de acasso a uma sala
     * @param {String} moderator 
     * @param {String} whois 
     */
    _roomEntered(moderator, whois) {

        try {
            this._finishSelfVideo();
        } catch (e) { /* Ignora erro */ }
        this._mediaController.initiateStream();
        this._structure.onlobby = false;
        this._structure.isModerator = false;
        this._structure.connectedAt = moderator;
        this._roomInfo.broadcaster.value = whois;
        let numViewers = doc.TAG(dom.NUMBER_VIEWS).value;

        let $postData = { turmaHash: moderator, numViews: numViewers }
        let $resource = doc.URL_SALAS_UPDATE;
        this._saveRoom($postData, $resource);

        // Inicia instância de conexão
        this._espectador = new RTCMultiConnection();
        //this._espectador = this._connection;

        this._initiatePersonalConnection(this._espectador);
        this._espectador.publicRoomIdentifier = this._publicRoomIdentifier;
        this._espectador.socketMessageEvent = this._publicRoomIdentifier;
        this._espectador.enableFileSharing = this._connect.fileSharing;

        // Define elementos de inicialização da sessão criada
        this._espectador.session = {
            audio: false,
            video: false
        };

        this._espectador.extra.modifiedValue = this._roomInfo.currentRoomId.value + '-' + this._roomInfo.currentUser.value;
        this._structure.broadcastStatus = 1;

        let roomid = moderator.toString();
        let socket = this._connection.getSocket();
        socket.emit(conf.socket.MSG_JOIN_BROADCAST, {
            broadcastId: roomid,
            userid: this._espectador.userid,
            typeOfStreams: this._espectador.session
        });
        // Inicia contagem de tempo
        this._roomInfoController.stoped = false;

        // Inicializa verificação de token caso não seja um dispositivo Mobile
        if (!DetectRTC.isMobileDevice && conf.con.TK_DETECT) {
            $(dom.TK_DETEC).show();
            $(dom.CALL_TK).click();
        }
    }

    /**
     * Finaliza e reinicia a conexão do usuário sem atualizar a página
     */
    _reconnect() {

        //this._setReconnect(true);
        setTimeout(() => {
            this._connection.leave();
            //this._connection.close();
            setTimeout(() => {
                //this._setReconnect(false);
                this._connection.connect(this._roomId);
            }, 1000);
        }, 200);
    }

    /**
     * Inicializa a transmissão de um usuário em participação
     */
    _startParticipation(connection) {

        //this._connection.peers[this._roomId].addStream({
        connection.addStream({
            audio: true,
            video: true,
            streamCallback: (stream) => {
                this._participateScreen(stream);
                this._media.thirdVideoPreview.muted = true;
                this._roomData.transmiting = true;
                console.log("Compartilhando vídeo ------>", stream);
            }
        });
    }

    /**
     * Define a variável de tratamento de conexão
     * @param {Boolean} reconnect 
     */
    _setReconnect(reconnect) {

        this._connection.extra.reconnect = reconnect;
        this._connection.updateExtraData();
    }

    /**
     * Tratamento de desconexões de uma sala criada
     * @param {String} userid 
     */
    alertDisconnection(userid) {

        if (this._broadcaster) {
            if (this._broadcaster.isInitiator) this._removeUser(this._connectController.points, userid);
        }
        this._reloadRoom(userid, true);
    }

    /**
     * Tratamento dos valores contidos no array de usuários ativos
     * @param {Array:String} array 
     * @param {String} user 
     */
    _removeUser(array, user) {

        for (var i = 0; i < array.length; i++) {
            if (array[i].split('|')[0] == user) {
                array.splice(i, 1);
                this.setUsersInformation();
                return;
            }
        }
    }

    /**
     * Tratamento de reload após a finalização de uma sala
     * @param {String} user 
     * @param {Boolean} message 
     */
    _reloadRoom(user, message) {

        if (user === this._roomId && !this._connection.extra.reconnect) {
            message ? this._alerta.initiateMessage(conf.message.ALERT_DISCONNECTION) : null;
            setTimeout(location.reload.bind(location), conf.con.DISCONNECTION_TIMER);
        }
    }

}
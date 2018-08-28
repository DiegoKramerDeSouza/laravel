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
        this._connect = this._connectController.initiateConnection();
        this._media = this._mediaController.initiateMedia();
        this._structure = this._structureController.initiateStructure();
        this._roomInfo = this._roomInfoController.initiateRoomInfo();
        this._origin = location.origin;
    }

    configureDefaults() {

        // Configura padrões de conexão
        this._initiateConnection();
        // Inicia listeners de video
        this._initiateListeners();
        // Inicia listeners de sockets
        this._connectSocket();
    }

    manageRoom() {

        // Inicia listener para tratamento de compartilhamento de tela
        this._getScreenConstraints();
        // Inicia listener para inicialização de stream
        this._onStream();
        // Inicia listener para abertura de conexão
        this._onOpen();
        // Inicia listener para fechamento de stream
        this._onStreamEnded();
        // Inicia listener para finalização de conexão
        this._onLeave();
    }

    operateRoom() {

        // Inicia listener para atualização de acessos à sala
        this._onNumberOfBroadcastViewersUpdated();
        // Inicia listener para recebimento de mensagens de chat
        this._onMessage();
        // Inicia listener para envio de mensagens de chat
        this._chatSendMessage();
    }

    formatRoom() {

        // Inicia Tratamento de URI
        this._treatURI();
        // Inicia definições de abertura de sala
        this._setRoomBroadcastId();
    }

    _saveRoom(autor, tema, assunto, hash) {

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('#token').attr('data-content')
            }
        });
        $.ajax({
            url: `${ this._origin }/salas/salvar`,
            type: 'POST',
            data: { hash: hash, name: tema, theme: assunto, author: autor },
            dataType: 'json',
            success: () => {
                this._alerta.initiateMessage(conf.message.SUCCESS_SAVE_CLASS);
            },
            error: () => {
                this._alerta.initiateMessage(conf.message.FAIL_SAVE_CLASS);
            }
        });
    }

    _initiateConnection() {

        this._connection.enableScalableBroadcast = this._connect.enableScalableBroadcast;
        this._connection.maxRelayLimitPerUser = this._connect.maxRelayLimitPerUser;
        this._connection.socketMessageEvent = this._connect.socketMessageEvent;
        this._connection.socketURL = this._connect.urlSocket;
        this._connection.enableFileSharing = this._connect.fileSharing;
    }

    _initiateListeners() {

        this._mediaController.initListeners();
    }

    _connectSocket() {

        this._connection.connectSocket((socket) => {
            // Socket - Join: 'join-broadcaster'
            socket.on(conf.socket.MSG_JOIN, (hintsToJoinBroadcast) => {
                this._structure.broadcastStatus = 1;
                this._connection.session = hintsToJoinBroadcast.typeOfStreams;
                this._connection.sdpConstraints.mandatory = {
                    OfferToReceiveVideo: false,
                    OfferToReceiveAudio: false
                };
                this._connection.extra.modifiedValue = this._roomInfo.currentRoomId.value + '-' + this._roomInfo.currentUser.value;
                this._connection.updateExtraData();
                this._connection.broadcastId = hintsToJoinBroadcast.broadcastId;
                this._connection.direction = this._connect.direction;
                this._connection.join(hintsToJoinBroadcast.userid);
                this._alerta.initiateMessage(conf.message.START_TRANSMITION);
                console.log(this._connection);
            });
            // Socket - Rejoin: 'rejoin-broadcast'
            socket.on(conf.socket.MSG_REJOIN, (getBroadcasterId) => {
                this._structure.broadcastStatus = 1;
                this._connection.attachStreams = [];
                this._connection.extra.modifiedValue = this._roomInfo.currentRoomId.value + '-' + this._roomInfo.currentUser.value;
                this._connection.updateExtraData();
                // Socket - check presence: 'check-broadcast-presence'
                socket.emit(conf.socket.MSG_CHK_PRESENCE, getBroadcasterId, (isBroadcastExists) => {
                    if (!isBroadcastExists) {
                        this._connection.userid = getBroadcasterId;
                    }
                    // Socket - Join to broadcast: 'join-broadcast'
                    socket.emit(conf.socket.MSG_JOIN_BROADCAST, {
                        broadcastId: getBroadcasterId,
                        userid: this._connection.userid,
                        typeOfStreams: this._connection.session
                    });
                });
            });
            // Socket - Parado: 'broadcast-stopped'
            socket.on(conf.socket.MSG_BROADCAST_STOP, (getBroadcasterId) => {
                this._structure.broadcastStatus = 0;
                this._alerta.initiateMessage(conf.message.END_TRANSMITION);
            });
            // Socket - Iniciando: 'start-broadcasting
            socket.on(conf.socket.MSG_BROADCAST_START, (typeOfStreams) => {
                this._structure.broadcastStatus = 1;
                this._connection.sdpConstraints.mandatory = {
                    OfferToReceiveVideo: false,
                    OfferToReceiveAudio: false
                };
                this._connection.session = typeOfStreams;
                this._connection.open(this._connection.userid, this._connect.isPublicModerator);
            });
            // Socket - Saindo: 'leave-the-room'
            socket.on(conf.socket.MSG_LEAVE_ROOM, (targetconnection) => {
                if (targetconnection.remoteUserId != this._connection.userid) return;
                this._connection.leave();
            });
        });
    }

    _getScreenConstraints() {

        this._connection.getScreenConstraints = (callback) => {
            getScreenConstraints((error, screen_constraints) => {
                if (!error) {
                    screen_constraints = this._connection.modifyScreenConstraints(screen_constraints);
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

    _onStream() {

        this._connection.onstream = (event) => {
            let currentStream;
            if (!this._structure.onParticipation && !event.extra.modifiedValue) {
                this._roomInfo.inRoom.value = event.userid;
            }
            // Marca container onde serão exibidos os arquivos enviados e recebidos
            this._connection.filesContainer = doc.TAG(dom.DIV_FILE_SHARING);

            /**==============================================================================
             * Tratamento de conexões REMOTAS e LOCAIS
             * ==============================================================================
             */
            if (event.type === 'remote' && this._connection.isInitiator) {

                // Remove qualquer conexão duplicada
                this._connectController.checkDuplicatedCon(this._structure.incomingCon, event, this._connection);

                // Conexão remota de transmissão com o broadcaster
                if (this._structure.mainVideo != conf.str.WAITING_FOR_VIDEO) {
                    this._structure.incomingCon = event.stream.streamid;
                    this._media.thirdVideoPreview.srcObject = event.stream;
                    this._structure.userVideo = event.stream;

                    this._mediaController.initiateVideo(this._media.thirdVideoPreview);
                    this._alerta.initiateMessage(conf.message.START_PARTICIPATION);
                    this._mediaController.displayElem(dom.VIDEO_THIRD, 300);

                    setTimeout(() => {
                        this._connection.getAllParticipants().forEach((p) => {
                            if (p + '' != event.userid + '') {
                                let peer = this._connection.peers[p].peer;
                                event.stream.getTracks().forEach((track) => {
                                    try {
                                        peer.addTrack(track, event.stream);
                                    } catch (e) {}
                                });
                                this._connection.dontAttachStream = true;
                                this._connection.renegotiate(p);
                                this._connection.dontAttachStream = false;
                            }
                        });
                        this._structure.streamVideos = event.stream;
                        this._mediaController.openIncomingVideos(event.stream);
                    }, 500);

                    this._mediaController.displayElem(dom.DIV_BTN_END, 300);
                    this._media.endSessionAccess.onclick = () => {
                        console.log('------------->     REMOTO', event.userid, this._structure.targetUser);
                        this._structure.streamVideos.forEach((stream) => {
                            this._connection.getAllParticipants().forEach((p) => {
                                let peer = this._connection.peers[p].peer;
                                stream.stop();
                                peer.removeStream(stream);
                            });
                        });
                        this._mediaController.hideElem(dom.DIV_BTN_END);
                        this._structure.emptyStreamVideos();
                        this._structure.incomingCon = '';
                        this._mediaController.closeIncomingVideos(event.stream);

                        let msgrash = this._mediaController.createSolicitationArray(
                            btoa(conf.req.END_PARTICIPATION),
                            this._roomInfo.currentUser.value,
                            this._connection.userid,
                            this._roomInfo.inRoom.value,
                            event.userid
                        );
                        this._connection.send(msgrash, event.userid);
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

                console.log('REMOTO SEM SCREEN --> ' + event.stream.streamid);
                if (this._structure.mainVideo != conf.str.WAITING_FOR_VIDEO || event.extra.modifiedValue) {
                    this._participateScreen(event.stream);
                } else {
                    this._structure.incomingCon = event.stream.streamid;
                    this._structure.onParticipation = false;
                    this._media.videoPreview.srcObject = event.stream;
                    this._structure.mainVideo = event.stream;
                    currentStream = [event.stream];
                    this._mediaController.initiateVideo(this._media.videoPreview);
                }
                /**
                 * Ajusta elementos de exibição (define o menu de áudio e video para espectadores)
                 * Desabilita botão de ação para câmera/microfone/compartilhamento de tela
                 */
                this._mediaController.adjustMediaMenu(event.type);
                this._structure.viewers = this._connection.getAllParticipants().length;
                this._roomView.changeCounter(this._structure.viewers);
                /**
                 * Tratamento de ação de controles de mídia==================================
                 */
                this._media.vol.onclick = () => this._mediaController.controlVolume(currentStream);

                this._media.solPedir.onclick = () => {
                    let altText = [];
                    if (this._structure.broadcastStatus == 1 && (this._structure.solicita === 0 && !this._structure.lockSolicitation)) {
                        let msgrash = this._mediaController.createSolicitationArray(
                            btoa(conf.req.PEDE_VEZ),
                            this._roomInfo.currentUser.value,
                            this._connection.userid,
                            this._roomInfo.inRoom.value,
                            this._roomInfo.currentRoomId.value
                        );
                        try {
                            this._connection.send(msgrash, this._roomInfo.inRoom.value);
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

            } else if (!this._structure.onParticipation && (event.type === 'local' && !event.stream.isScreen)) {

                console.log('TRANSMISSÃO LOCAL------', this._structure.mainVideo);
                if (this._structure.incomingCon == event.stream.streamid) return;

                this._structure.onParticipation = true;
                this._connection.isUpperUserLeft = false;
                this._structure.mainVideo = event.stream;
                this._structure.incomingCon = event.stream.streamid;
                currentStream = [event.stream];
                this._media.videoPreview.srcObject = event.stream;
                this._media.videoPreview.userid = event.userid;
                this._media.videoPreview.muted = true;
                this._mediaController.initiateVideo(this._media.videoPreview);

                /**
                 * Ajusta elementos de exibição (define contadores de solicitações e remove 'pedir vez')
                 */
                if (this._structure.solicita <= 0) this._mediaController.hideElem(dom.COUNT_PEDIR);
                if (!this._connection.isInitiator) this._mediaController.disablePedir();
                /**
                 * Ajusta elementos de exibição (define o menu de áudio e video para broadcaster)
                 */
                this._mediaController.adjustMediaMenu(event.type);
                /**
                 * Apresenta o número de espectadores conectados
                 */
                this._mediaController.displayElem(dom.UL_CON_USERS, 300);
                /**
                 * Tratamento de ação de controles de mídia==================================
                 */
                this._media.mute.onclick = () => this._mediaController.controlVoice(currentStream);
                this._media.cam.onclick = () => this._mediaController.controlCam(currentStream);
                this._media.sharedFile.onclick = () => this._mediaController.fileSharing(this._connection, this._structure.viewers);

                this._media.ctlPedir.onclick = () => {
                    // Tratamento de respostas (permitir / negar)
                    let response = doc.ALL(dom.CLASS_RESPONSES);
                    for (var j = 0; j < response.length; j++) {
                        let thisId = response[j].id;
                        response[j].onclick = () => {
                            console.log(thisId);
                            let admResponse = thisId.split('_');
                            let msgrash = this._mediaController.createSolicitationArray(
                                btoa(conf.req.RESP_PEDE_VEZ + admResponse[0]),
                                this._roomInfo.currentUser.value,
                                admResponse[1],
                                this._roomInfo.inRoom.value,
                                this._roomInfo.currentRoomId.value
                            );
                            if (admResponse[0] == 'allow' && this._structure.lockSolicitation) {
                                this._alerta.initiateMessage(conf.message.ACCEPT_SOLICITATION);
                            } else {
                                this._structure.solicita -= 1;
                                this._connection.send(msgrash);
                                this._mediaController.reconstructList(admResponse[1]);
                                this._mediaController.trataSolicitacao(this._structure.solicita);
                                if (admResponse[0] == 'allow') {
                                    this._structure.lockSolicitation = true
                                    this._structure.targetUser = admResponse[1];
                                    this._media.divEndBtn.setAttribute('data-target', admResponse[1]);
                                    this._mediaController.displayElem(dom.DIV_BTN_END, 300);
                                }
                            }
                            msgrash = [];
                        }
                    }
                    this._media.endSessionAccess.onclick = () => {

                        this._mediaController.hideElem(dom.DIV_BTN_END);
                        this._structure.emptyStreamVideos();
                        this._structure.incomingCon = '';
                        let targetId = this._structure.targetUser;
                        let msgrash = this._mediaController.createSolicitationArray(
                            btoa(conf.req.END_PARTICIPATION),
                            this._roomInfo.currentUser.value,
                            this._connection.userid,
                            this._roomInfo.inRoom.value,
                            targetId
                        );
                        this._connection.send(msgrash, targetId);
                        this._structure.lockSolicitation = false;
                        msgrash = [];
                        console.log('------------->     LOCAL', targetId, event.userid);
                    }
                };
                this._media.share.onclick = () => {

                    if (!this._mediaController.getControlSharing()) {
                        this._mediaController.hideElem(dom.SHARE);
                        this._connection.addStream({
                            screen: true,
                            oneway: true,
                            streamCallback: (stream) => {
                                setTimeout(() => {
                                    this._connection.getAllParticipants().forEach((p) => {

                                        this._connection.renegotiate(p, {
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
                        this._connection.attachStreams.forEach((stream) => {
                            if (stream.id === streamConnection) {
                                streamToRemove = stream;
                                stream.stop();
                            } else newArray.push(stream);
                        });
                        this._connection.attachStreams = newArray;
                        this._connection.getAllParticipants().forEach((p) => {
                            let peer = this._connection.peers[p].peer;
                            try {
                                peer.removeStream(streamToRemove);
                                this._connection.renegotiate(p, {
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
                        this._connection.send(msgrash);
                        msgrash = [];
                    }
                };
                //===========================================================================
            }

            // Tratamento das funções MUTE e UNMUTE
            this._connection.onmute = event => event.mediaElement.setAttribute(misc.ATTR_POSTER, conf.str.POSTER_IMG);
            this._connection.onunmute = event => event.mediaElement.removeAttribute(misc.ATTR_POSTER);
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
                    setTimeout(() => {
                        try {
                            this._connection.peers[this._roomInfo.inRoom.value].addStream({
                                video: true,
                                streamCallback: (stream) => {
                                    this._participateScreen(stream);
                                    this._media.thirdVideoPreview.muted = true;
                                }
                            });
                        } catch (e) {
                            this._mediaController.endParticipation();
                            this._structure.onParticipation = false;
                        }
                    }, 500);
                } else if (this._mediaController._session && this._structure.onParticipation) {
                    this._mediaController.disableParticipation();
                    this._structure.onParticipation = false;
                    try {
                        this._connection.attachStreams.forEach((stream) => {
                            this._connection.getAllParticipants().forEach((p) => {
                                let peer = this._connection.peers[p].peer;
                                stream.stop();
                                peer.removeStream(stream);
                            });
                        });
                        let msgrash = this._mediaController.createSolicitationArray(
                            btoa(conf.req.END_PARTICIPANT),
                            this._roomInfo.currentUser.value,
                            this._connection.userid,
                            this._roomInfo.inRoom.value,
                            this._roomInfo.currentRoomId.value
                        );
                        this._connection.send(msgrash, this._roomInfo.inRoom.value);
                        this._structure.lockSolicitation = false;
                        msgrash = [];
                        this._alerta.initiateMessage(conf.message.END_PARTICIPATION);
                    } catch (e) {
                        this._mediaController.startParticipation();
                        this._structure.onParticipation = true;
                    }
                }
            };
        }
    }

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

    _participateScreen(stream) {

        this._mediaController.displayElem(dom.VIDEO_THIRD, 300);
        if (this._structure.incomingCon != stream.streamid) {
            this._structure.incomingCon = stream.streamid;
            this._media.thirdVideoPreview.srcObject = stream;
            this._structure.userVideo = stream;
            this._mediaController.initiateVideo(this._media.thirdVideoPreview);
            this._mediaController.openIncomingVideos(stream);
        } else {
            return;
        }
    }

    _onOpen() {

        this._connection.onopen = (event) => {
            if (this._structure.singleConnection && (!this._connection.isInitiator && event.extra.modifiedValue))
                this._connection.disconnectWith(event.userid);
        };
    }

    _onStreamEnded() {

        this._connection.onstreamended = (event) => {
            if (event.stream.isScreen) {
                if (this._mediaController.getSharedValue()) this._media.swapSecond.click();
                this._mediaController.hideElem(dom.VIDEO_SECOND);
                this._mediaController.switchShare();
                $(dom.SHARE_ALERT).slideUp(300);
            } else if (event.streamid == this._structure.userVideo.streamid) {
                if (this._connection.isInitiator) this._mediaController.hideElem(dom.DIV_BTN_END, 300);
                this._mediaController.hideElem(dom.VIDEO_THIRD);
                this._structure.userVideo = conf.str.WAITING_FOR_VIDEO;
                this._structure.lockSolicitation = false;
            } else {
                return;
            }
            this._mediaController.closeIncomingVideos(event.stream);
        }
    }

    _onLeave() {

        this._connection.onleave = (event) => {
            console.log('DEIXANDO CONEXÃO...', event);
        };
    }

    _decodeURI(s) {

        return decodeURIComponent(s.replace(/\+/g, ' '));
    }

    _treatURI() {

        let params = {},
            r = /([^&=]+)=?([^&]*)/g;
        let match, search = window.location.search;
        while (match = r.exec(search.substring(1)))
            params[this._decodeURI(match[1])] = this._decodeURI(match[2]);
        window.params = params;
    }

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

    _onNumberOfBroadcastViewersUpdated() {

        this._connection.onNumberOfBroadcastViewersUpdated = (event) => {
            if (!this._connection.isInitiator) return;
            this._structure.viewers = event.numberOfBroadcastViewers;
            this._roomView.changeCounter(this._structure.viewers);
        };
    }

    _onMessage() {

        this._connection.onmessage = (event) => {
            if (event.data.fileName) {
                this._mediaController.incomingFile(event, this._connection);
            } else {
                this._incomingMessage(event);
            }
        }
    }

    _incomingMessage(event) {

        if (event.data.userRemoved === true) {
            if (event.data.removedUserId == this._connection.userid) {
                this._connection.close();
                setTimeout(location.reload.bind(location), 3000);
            }
            return;
        } else if (this._structure.singleConnection && (this._connection.isInitiator && (event.data && !event.data.userRemoved))) {
            if (!Array.isArray(event.data)) {
                this._connection.getAllParticipants().forEach((p) => {
                    if (p != event.userid) {
                        this._connection.send(event.data, p);
                    }
                });
            }
            this._appendDIV(event);
        } else {
            this._appendDIV(event);
        }
    }

    _chatSendMessage() {

        this._media.textMessage.onkeyup = event => this._formatChatMessage(event);
        doc.TAG(dom.BTN_SEND_MSG).onclick = () => this._formatChatMessage();
    }

    _formatChatMessage(event) {

        let value = this._media.textMessage.value;
        let texto;
        if (event)
            if (event.keyCode != 13) return;
        value = value.replace(/^\s+|\s+$/g, '');
        if (!value.length) return;
        texto = `<b class='small'>${this._structure.usuario}</b> :<br>${value}`;
        texto = btoa(texto);
        this._connection.send(texto);
        this._appendDIV(texto);
        this._media.textMessage.value = '';
    }

    _appendDIV(event) {

        let remoto;
        event.data ? remoto = true : remoto = false;
        var text = event.data || event;
        // Definição do padrão de mensagens com solicitação (array de 5 índices)
        if (remoto && (Array.isArray(text) && text.length == 5)) {
            let chkrash = event.data;
            let msgData = [];
            let myRoom = doc.TAG(dom.ROOM).value;
            if (chkrash[0] === btoa(conf.req.PEDE_VEZ)) {
                msgData[0] = chkrash[1];
                msgData[1] = (atob(chkrash[3])).split('|')[4];
                msgData[2] = chkrash[4];
                this._structure.solicita = this._mediaController.listBox(msgData, this._structure.solicita);
                return;
            } else if (chkrash[0] === btoa(conf.req.RESP_PEDE_VEZ + 'allow')) {
                if (chkrash[2] === myRoom) {
                    this._structure.solicita -= 1;
                    this._mediaController.allow();
                    this._structure.lockSolicitation = true;
                }
                return;
            } else if (chkrash[0] === btoa(conf.req.RESP_PEDE_VEZ + 'deny')) {
                if (chkrash[2] === myRoom) {
                    this._structure.solicita -= 1;
                    this._mediaController.deny();
                    this._structure.lockSolicitation = false;
                }
                return;
            } else if (chkrash[0] === btoa(conf.req.END_SHARE)) {
                if (this._mediaController._videoIsMain) {
                    this._media.swapSecond.click();
                }
                setTimeout(() => {
                    this._mediaController.hideElem(dom.VIDEO_SECOND);
                }, 1000);
            } else if (chkrash[0] === btoa(conf.req.END_PARTICIPATION)) {
                if (!this._structure.onParticipation) {
                    this._structure.onParticipation = true;
                    this._mediaController._session = true;
                }
                this._media.sessionAccess.click();
            } else if (chkrash[0] === btoa(conf.req.END_PARTICIPANT)) {
                this._mediaController.hideElem(dom.DIV_BTN_END);
            } else if (chkrash[0] === btoa(conf.req.RECEIVE_FILE)) {
                this._mediaController.createProgressBar(chkrash[1]);
            } else {
                return;
            }
        } else {
            // Tratamento de mensagens comuns (fora do padrão de mensagem com solicitação)
            this._mediaController.writeMessage(text, remoto);
        }
    }

    createRoom() {

        this._structure.startRoom.onclick = () => {
            let room = this._roomController.initiateRoom();
            if (this._roomController.validade()) {
                this._structure.usuario = room.name;
                this._structure.onlobby = false;
                // Verificação de dispositivos de entrada de áudio e vídeo
                if (!GeneralHelper.detectmob() && this._structure.roomType.value == 0) {
                    /*
                    if (!this._roomController.checkDevices()) {
                        this._alerta.initiateMessage(conf.message.DEVICE_ALERT);
                        this._structure.configDev.click();
                        return;
                    }
                    */
                    if (this._roomController.checkDevices()) {
                        let videoConstraints;
                        let audioConstraints;
                        if (this._connection.DetectRTC.browser.name === 'Firefox') {
                            videoConstraints = {
                                deviceId: this._roomController.videoList.value
                            };
                            audioConstraints = {
                                deviceId: this._roomController.audioList.value
                            };
                        } else {
                            videoConstraints = {
                                mandatory: {},
                                optional: [{
                                    sourceId: this._roomController.videoList.value
                                }]
                            }
                            audioConstraints = {
                                mandatory: {},
                                optional: [{
                                    sourceId: this._roomController.audioList.value
                                }]
                            }
                        }
                        this._connection.mediaConstraints = {
                            video: videoConstraints,
                            audio: audioConstraints
                        }
                    }
                }
                // Inicializa a tela de apresentação
                this._mediaController.initiateStream();
                // Modela e apresenta cabeçalho do video
                this._roomController.setRoomLabel(misc.ICON_FA_VIDEOCAM, room.tema, room.assunto);
                this._structure.startRoom.disabled = true;
                // Define elementos de inicialização da sessão criada
                let audioConf = conf.con.SESSION_AUDIO;
                let videoConf = conf.con.SESSION_VIDEO;
                this._connection.session = {
                    audio: audioConf,
                    video: videoConf,
                    data: conf.con.SESSION_DATA,
                    broadcast: conf.con.SESSION_BROADCAST,
                    oneway: conf.con.SESSION_ONEWAY
                }

                // Controle da utilização de banda
                this._connection.bandwidth = {
                    audio: conf.con.BAND_AUDIO,
                    video: conf.con.BAND_VIDEO
                }

                // Inicializa Socket / Verifica existência do broadcast
                let socket = this._connection.getSocket();
                socket.emit(conf.socket.MSG_CHK_PRESENCE, room.hash, (isBroadcastExists) => {
                    if (!isBroadcastExists) this._connection.userid = room.hash;
                    socket.emit(conf.socket.MSG_JOIN_BROADCAST, {
                        broadcastId: room.hash,
                        userid: this._connection.userid,
                        typeOfStreams: this._connection.session,
                        bandwidth: this._connection.bandwidth
                    });
                });
                //this._saveRoom(room.name, room.tema, room.assunto, room.hash);
            } else {
                this._alerta.initiateMessage(conf.message.FORM_ALERT);
            }
        }
    }

    checkRooms() {

        if (this._structure.onlobby) {
            //Verifica a existência des salas públicas
            this._connection.getPublicModerators((array) => {
                this._structure.publicRoomsList.innerHTML = '';
                if (array.length > 0) {
                    array.forEach((moderator) => {
                        let moderatorId = moderator.userid;
                        this._connection.getNumberOfBroadcastViewers(moderatorId, (numberOfBroadcastViewers) => {
                            this._structure.viewers = numberOfBroadcastViewers;
                        });
                        let labelRoom = this._roomDataController.validateRoomName(moderatorId, array);
                        if (!labelRoom) {
                            array.length > 1 ? null : this._roomController.noRooms();
                            return;
                        }
                        if (moderatorId == this._connection.userid) return;
                        let roomData = this._roomDataController.initiateRoomData(labelRoom);
                        roomData.allowed = this._roomDataController.validateAccess(roomData.curso, roomData.classes);

                        if (roomData.allowed) {
                            // Cria rótulo de sala se o acesso a ela for permitido
                            this._structure.countRooms += 1;
                            this._structure.usuario = this._roomInfo.currentUser.value;

                            let divOpen = doc.ADD('div');
                            let button = doc.ADD('a');
                            let card = this._roomController.constructAccessList(roomData.classe, roomData.assunto, roomData.apresentador, this._structure.viewers, moderatorId);
                            this._roomController.initiateRoomCard(moderatorId, card, divOpen, button);
                            //Função de entrada na sala a partir do botão ENTRAR
                            button.onclick = () => {
                                this._mediaController.initiateStream();
                                this._roomController.setRoomLabel(misc.ICON_FA_TV, roomData.classe, roomData.assunto);
                                this._structure.onlobby = false;
                                this._structure.isModerator = false;
                                this._structure.connectedAt = moderatorId;
                                this._roomInfo.broadcaster.value = roomData.whois;

                                this._connection.session = {
                                    audio: false,
                                    video: false
                                };

                                let socket = this._connection.getSocket();
                                socket.emit(conf.socket.MSG_JOIN_BROADCAST, {
                                    broadcastId: this._structure.connectedAt,
                                    userid: this._connection.userid,
                                    typeOfStreams: this._connection.session
                                });
                            };
                        }
                        if (this._structure.countRooms == 0) this._roomController.noRooms();

                    });
                } else {
                    this._roomController.noRooms();
                }
            });
        } else {
            // Tratamento de conexões de espectadores
            this._roomController.clearConList();
            let allParticipants = this._connection.getAllParticipants();
            this._structure.viewers = allParticipants.length;
            allParticipants.forEach((participantId) => {
                let myId = this._roomInfo.currentRoomId.value;
                let user = this._connection.peers[participantId];
                user.extra.modifiedValue ?
                    this._roomController.constructConnectionList(user.extra.modifiedValue, user.extra.modifiedValue.split('-')[1], user.userid, true) :
                    this._roomController.constructConnectionList(myId, this._roomInfo.currentUser.value + ' (você)', this._connection.userid, false);
            });
            if (this._structure.viewers > 0) {
                if (this._roomInfo.countUsers.getAttribute(misc.ATTR_USER_TYPE) == 0) {
                    this._roomController.inputConList();
                    this._roomView.changeCounter(this._structure.viewers);
                    this._mediaController.displayElem(dom.UL_CON_USERS, 300);
                }
                let disconnectId;
                let btnDisconnect = doc.ALL(dom.DISCONNECT_BTN);
                for (var j = 0; j < btnDisconnect.length; j++) {
                    let thisId = doc.TAG('#' + btnDisconnect[j].id);
                    let thisName = btnDisconnect[j].name;
                    btnDisconnect[j].onclick = () => {
                        disconnectId = thisId.getAttribute(misc.ATTR_USER_ANNOUNCE);
                        this._connection.send({
                            userRemoved: true,
                            removedUserId: disconnectId
                        });
                        this._alerta.initiateMessage(conf.message.DISCONNECT_USER, thisName);
                    }
                }
            }
        }
        return this._structure.onlobby;
    }

    alertDisconnection(userid) {

        if (userid === this._roomInfo.inRoom.value) {
            this._alerta.initiateMessage(conf.message.ALERT_DISCONNECTION);
            setTimeout(location.reload.bind(location), 3000);
        } else {
            try {
                for (var j = 0; j < Object.keys(this._structure.connections).length; j++) {
                    if (this._structure.connections[j].split('|')[2] == userid) {
                        this._structure.connections.splice(j, 1);
                    }
                }
            } catch (e) {
                return;
            }
            this._roomController.constructConnectionExpList(userid);
            this._roomView.changeCounter(Object.keys(this._structure.connections).length);
        }
    }
}
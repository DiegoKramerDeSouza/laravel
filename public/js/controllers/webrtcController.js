/**
 * Classe voltada a inicialização, tratamento e gerenciamento de todos os métodos e atribuições 
 * referentes a publicação e interação entre usuários e mídias utilizando WebRTC e Websocket
 * 
 * Instancia:
 * ConnectController
 * MediaController
 * StructureController
 * RoomInfoController
 * MessageController
 * RoomController
 * RoomDataController
 * RTCMultiConnection
 * WebRTCAdaptor
 * DevicesController
 */
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
        this._caller;

        this._publicRoomIdentifier = conf.con.ROOM_IDENTIFIER;
        this._disconnectionMessage = conf.message.END_TRANSMITION;
        this._connect = this._connectController.initiateConnection();
        this._media = this._mediaController.initiateMedia();
        this._structure = this._structureController.initiateStructure();
        this._roomInfo = this._roomInfoController.initiateRoomInfo();
        this._btnFinish = this._media.finish;
        this._roomData;
        this._room;
        this._startedAt;

        this._startedStream = false;
        this._retransmiting = false;
        this._desktopShared = false;
        this._autologout = true;
        this._isLowLatency = true;
        this._adaptors = [];
        this._streams = [];

        this._retransmitingWho;
        this._roomId;
        this._currentUsers;
        this._self;
        this._videoConstraints = true;
        this._audioConstraints = true;
        this._webRTCAdaptor;
        this._participantIs;
        this._imParticipant = false;
        this._screenId;
    }

    /**
     * Configura padrões
     */
    configureDefaults() {

        // Configura padrões de conexão
        this._initiateConnection();
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
     * Efetua chamada para registro/atualização de DB para Salas
     * @param {Object} postData 
     * @param {String} targetUrl 
     */
    _saveRoom(postData, targetUrl) {

        let url = targetUrl;
        let type = 'POST';
        let data = postData;
        let dataType = 'json';
        let req = new RequestController(url, type, data, dataType);
        req.saveRoom();
    }

    /**
     * Efetua requisição ao rest do serviço de mídia
     */
    _listRoom() {

        let url = 'https://med2.lrbtecnologia.com:5443/WebRTCApp/rest/broadcast/getList/0/10';
        let type = 'GET';
        let dataType = 'json';
        let req = new RequestController(url, type, null, dataType);
        req.listRoom();
    }

    /**
     * Efetua a requisição para a construção da lista de espectadores presentes na apresentação
     * @param { Array Int } arr 
     * @param { Array list } all 
     * @param { Int } turmaId 
     * @param { Int } aula 
     */
    _generateAttendance(arr, all, turmaId, aula) {

        GeneralHelper.hideit(dom.CHAMADA);
        let url = `${location.origin}/rest/listaPresenca`;
        let type = 'POST';
        let data = { turmaId: turmaId, aula: aula, allData: all, presentes: arr };
        let req = new RequestController(url, type, data, null);
        req.generateAttendance();
    }

    /**
     * Simula requisições Ajax
     */
    _simulaRequest() {

        doc.TAG(dom.CLASS_LIST).onclick = () => {

            let especPresentes;
            let total;
            let turmaId;
            let aula;

            if (this._room) {
                aula = this._room.assunto;
                turmaId = this._room.con;
            } else {
                aula = 'Aula de teste';
                turmaId = 11;
            }

            especPresentes = [];
            total = [
                ['Aasdfg', 1],
                ['Basdfg', 2],
                ['Casdfg', 3],
                ['Dasdfg', 4],
                ['Easdfg', 9],
                ['Fasdfg', 6],
                ['Gasdfg', 7],
                ['Hasdfg', 5]
            ];
            this._generateAttendance(especPresentes, total, turmaId, aula);
        }
    }

    /**
     * Configurações de inicialização de conexões
     * Inicialização de listeners de eventos de tela
     */
    _initiateConnection() {

        this._initiatePersonalConnection(this._connection);
        this._connection.enableScalableBroadcast = this._connect.enableScalableBroadcast;
        //this._connection.maxRelayLimitPerUser = this._connect.maxRelayLimitPerUser;
        this._mediaController.initListeners();

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
     * Inicialização de sockets para interação do serviço de Sinalização
     */
    _connectSocket() {

        this._connection.connectSocket((socket) => {

            // Socket - Espectador junta-se à sala
            socket.on(conf.socket.MSG_JOIN, (hintsToJoinBroadcast) => {

                console.log('join-broadcaster', hintsToJoinBroadcast);
                let connection = this._espectador;
                this._structure.broadcastStatus = 1;
                connection.session = hintsToJoinBroadcast.typeOfStreams;
                connection.sdpConstraints.mandatory = {
                    OfferToReceiveVideo: true,
                    OfferToReceiveAudio: true
                };
                connection.extra.modifiedValue = this._roomInfo.currentRoomId.value + '-' + this._roomInfo.currentUser.value;
                connection.broadcastId = hintsToJoinBroadcast.broadcastId;

                this._onStream(connection);
                connection.join(hintsToJoinBroadcast.userid);
                this._alerta.initiateMessage(conf.message.START_TRANSMITION);
            });

            // Socket - Broadcaster (apresentador) inicia uma nova sala
            socket.on(conf.socket.MSG_BROADCAST_START, (typeOfStreams) => {

                console.log('start-broadcasting', typeOfStreams);
                let connection = this._broadcaster;
                connection.direction = this._connect.direction;
                connection.sdpConstraints.mandatory = {
                    OfferToReceiveVideo: true,
                    OfferToReceiveAudio: true
                };
                connection.session = typeOfStreams;

                this._onStream(connection);
                connection.open(connection.userid, (isRoomOpened, roomid, error) => {
                    if (error) {
                        console.error("Falha ao iniciar a sala: ", error, e);
                        return;
                    } else {
                        this._structure.broadcastStatus = 1;
                        let cursos = this._roomController.createList();
                        let $postData = { author: this._room.name, name: this._room.tema, theme: this._room.assunto, hash: this._room.hash, courses: cursos }
                        let $resource = doc.URL_SALAS_SAVE;
                        this._saveRoom($postData, $resource);
                        this._openPreStream(connection, roomid, true, false);

                        // Inicializa verificação de token caso não seja um dispositivo Mobile
                        if (!DetectRTC.isMobileDevice && conf.con.TK_DETECT) {
                            GeneralHelper.showit(dom.TK_DETEC);
                            $(dom.CALL_TK).click();
                        }
                        console.info("Sala criada com sucesso.", roomid);
                    }
                });
            });
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
                    GeneralHelper.showit(dom.SHARE, 300);
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

        // Inicia listener para abertura de conexão
        this._onOpen(connection);

        connection.onstream = (event) => {

            if (!this._structure.onParticipation && !event.extra.modifiedValue) this._roomInfo.inRoom.value = event.userid;

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

                if (this._retransmiting) return;

                console.warn("EVENT RETRANSMITINDO: ", event);

                this._structure.incomingCon = event.stream.streamid;
                this._media.thirdVideoPreview.srcObject = event.stream;
                this._structure.userVideo = event.stream;
                connection.extra.remote = event.stream.streamid;

                this._mediaController.initiateVideo(this._media.thirdVideoPreview);
                this._alerta.initiateMessage(conf.message.START_PARTICIPATION);
                GeneralHelper.showit(dom.VIDEO_THIRD, 300);

                this._participantIs = event.extra.modifiedValue.split('-')[1];
                this._retransmitingWho = 'participant' + event.userid;
                this._retransmiting = true;
                this._structure.streamVideos = event.stream;
                this._mediaController.openIncomingVideos(event.stream);

                GeneralHelper.showit(dom.DIV_BTN_END, 300);
                GeneralHelper.showit(dom.CLOSE_PARTICIPATION, 300);

                console.log('Recebendo video em ', event, event.file);

                let msgnewrash = this._mediaController.createSolicitationArray(
                    btoa(conf.req.NEW_PARTICIPATION),
                    this._participantIs,
                    this._roomInfo.inRoom.value,
                    this._structure.targetUser,
                    this._retransmitingWho
                );
                connection.send(msgnewrash);

                this._media.endSessionAccess.onclick = () => {
                    console.log('---> REMOTO', event.userid, this._structure.targetUser);

                    // Remoção da stream do usuário
                    this._closeParticipantStream(connection);

                    GeneralHelper.hideit(dom.DIV_BTN_END);
                    GeneralHelper.hideit(dom.CLOSE_PARTICIPATION, 300);
                    this._structure.emptyStreamVideos();
                    this._structure.incomingCon = '';
                    this._mediaController.closeIncomingVideos(event.stream);

                    this._removeStreams(connection);

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
                };

            } else if (!this._structure.onParticipation && (event.type === 'remote' && event.stream.isScreen === true)) {

                console.log('REMOTO COM SCREEN --> ', event.stream);

            } else if (event.type === 'remote') {

                console.warn('REMOTO SEM SCREEN --> ', event, event.stream, event.extra.remote, event.stream.streamid, connection.userid, this._imParticipant);

                if (this._imParticipant) {
                    GeneralHelper.hideit(dom.EMBEDDED_FRAME, 300);
                    this._mediaController.removeElement(dom.FRAME_LAYER);
                    GeneralHelper.hideit(dom.FIRST_VIDEO, 300);
                    GeneralHelper.showit(dom.VIDEOS);
                    GeneralHelper.showit(dom.INCOMMING_VIDEO, 300);

                    let incommingVideo = doc.TAG(dom.INCOMMING_VIDEO);
                    incommingVideo.srcObject = event.stream;
                    this._mediaController.initiateVideo(incommingVideo);
                }

            } else if (!this._structure.onParticipation && (event.type === 'local' && (!event.stream.isScreen && !event.extra.self))) {

                console.log('TRANSMISSÃO LOCAL <---', this._structure.mainVideo, event.userid, event.stream.streamid, event, connection);
            }
        }
    }

    /**
     * Inicia o adaptador para transmissão com WebRTC
     * @param {String} roomid 
     * @param {String} videoLayer 
     * @param {Obj WebRTCAdaptor} connection 
     */
    _initAdaptor(roomid, videoLayer, connection) {

        let mediaConstraints;
        let sdpConstraints;
        let websocketURL;
        let pc_config = null;
        let localVideo = dom.MAIN_VIDEO_ID;

        if (connection) localVideo = dom.SECOND_VIDEO_ID;
        if (conf.con.LOW_LATENCY) {
            location.protocol.startsWith("https") ?
                websocketURL = 'wss://test.antmedia.io:5443/WebRTCAppEE/websocket' :
                websocketURL = 'ws://test.antmedia.io:5080/WebRTCAppEE/websocket';
        } else {
            location.protocol.startsWith("https") ? websocketURL = conf.con.SOCKET_SSL : websocketURL = conf.con.SOCKET_URL;
            if (connection || videoLayer)
                location.protocol.startsWith("https") ? websocketURL = conf.con.SOCKET_2_SSL : websocketURL = conf.con.SOCKET_2_URL;
        }
        if (videoLayer || connection) {
            mediaConstraints = {
                video: true,
                audio: true
            }
        } else {
            mediaConstraints = {
                video: this._videoConstraints,
                audio: this._audioConstraints
            }
        }
        sdpConstraints = {
            OfferToReceiveAudio: false,
            OfferToReceiveVideo: false
        };
        this._webRTCAdaptor = new WebRTCAdaptor({
            websocket_url: websocketURL,
            mediaConstraints: mediaConstraints,
            peerconnection_config: pc_config,
            sdp_constraints: sdpConstraints,
            localVideoId: localVideo,
            debug: true,
            callback: (info, description) => {

                if (info == "initialized") {
                    console.info("Conexão inicializada!");
                } else if (info == "publish_started") {
                    console.info("Iniciando Transmissão");
                    if (!connection) this._mediaController.startAnimation(this._webRTCAdaptor, roomid);
                } else if (info == "publish_finished") {
                    console.warn("Finalizando Transmissão");
                } else if (info == "closed") {
                    if (typeof description != "undefined")
                        console.warn("Conexão fechada: " + JSON.stringify(description));
                } else if (info == "screen_share_extension_available") {
                    console.log("Compartilhamento de tela disponível");
                }
            },
            callbackError: (error) => {

                let errorMessage = JSON.stringify(error);
                if (error.indexOf("NotFoundError") != -1) {
                    errorMessage = conf.message.DEVICES_MISSING;
                } else if (error.indexOf("NotReadableError") != -1 || error.indexOf("TrackStartError") != -1) {
                    errorMessage = conf.message.DEVICES_BUSY;
                } else if (error.indexOf("OverconstrainedError") != -1 || error.indexOf("ConstraintNotSatisfiedError") != -1) {
                    errorMessage = conf.message.DEVICES_NOT_FOUND;
                } else if (error.indexOf("NotAllowedError") != -1 || error.indexOf("PermissionDeniedError") != -1) {
                    errorMessage = conf.message.DEVICES_NOT_ALLOWED;
                } else if (error.indexOf("TypeError") != -1) {
                    errorMessage = conf.message.DEVICES_REQUIRED;
                }
                this._alerta.initiateMessage(errorMessage);
            }
        });
        this._streams['adaptor'] = this._webRTCAdaptor;
        this._streams['id'] = roomid;
        if (!videoLayer) this._adaptors.push(this._streams);
    }

    /**
     * Inicia publicação da mídia capturada para o socket do serviço de mídia 
     * (informado em websocketURL) 
     * @param {String} roomid 
     */
    _startPublishing(roomid) {

        this._webRTCAdaptor.publish(btoa(roomid));
    }

    /**
     * Finaliza a publicação de mídia para o serviço de mídia
     * @param {String} roomid 
     * @param {Boolean} isBroadcaster 
     * @param {Obj WebRTCAdaptor} adaptor 
     */
    _stopPublishing(roomid, isBroadcaster, adaptor) {

        console.warn('Finalizando transmissão...', roomid, isBroadcaster);
        if (isBroadcaster) {
            this._startedStream = false;
            this._media.previewVideo.pause();
            this._mediaController.changeTransmition(misc.TITLE_FINISH_ROOM, misc.ICON_END_ROOM);
            this._mediaController.stopTransmition(roomid, this._broadcaster);
        }
        adaptor.stop(btoa(roomid));
    }

    /**
     * Altera a captura de mídia para a ferramenta de compartilhamento de tela
     * @param {String} streamId 
     */
    _enableDesktopCapture(streamId) {

        this._webRTCAdaptor.switchDesktopCapture(btoa(streamId));
    }

    /**
     * Apresenta a própria tela compartilhada para o apresentador
     */
    startDesktopCapture() {

        GeneralHelper.showit(dom.VIDEO_SECOND, 300);
        this._mediaController.recordAnimation(dom.RECORDING);
        //this._mediaController.switchShare();

        let msgrash = this._mediaController.createSolicitationArray(
            btoa(conf.req.NEW_SHARE),
            this._roomInfo.currentUser.value,
            this._screenId,
            this._roomInfo.inRoom.value,
            this._roomInfo.currentRoomId.value
        );
        this._broadcaster.send(msgrash);
        msgrash = [];
    }

    /**
     * Ajusta a apresentação dos botões e controles referentes ao compartilhamento de tela
     */
    returnDesktopCapture() {

        this._screenId = undefined;
        this._media.share.click();
        this._mediaController.setShareEnabled();
    }

    /**
     * Finaliza a apresentação para todos os usuários e finaliza o stream de mídia para os serviços de mídia
     * @param {Obj RTCMultiConnection} connection 
     */
    _finishTransmition(connection) {

        this._btnFinish.onclick = () => {
            if (this._startedStream && connection.isInitiator) {
                connection.extra.streamEnded = true;
                this._adaptors.forEach(adaptor => {
                    console.error('Finalizando: ', adaptor['id']);
                    this._stopPublishing(adaptor['id'], true, adaptor['adaptor']);
                });
                if (this._retransmiting) this._media.endSessionAccess.click();
                return;
            }
            this._alerta.initiateMessage(conf.message.ALERT_DISCONNECTION);
            setTimeout(location.reload.bind(location), 500);
        }
    }

    /**
     * Trata e gerencia as conexões abertas entre espectadores e o apresentador a partir da entrada na sala
     * @param {Obj RTCMultiConnection} connection 
     * @param {String} roomid 
     * @param {Boolean} isLocal 
     */
    _openPreStream(connection, roomid, isLocal) {

        console.info('ABERTA A CONEXÃO: ', connection, roomid, connection.extra);

        this._simulaRequest();

        let index;
        this._roomInfo.inRoom.value = roomid;
        this._finishTransmition(connection, roomid);
        // Marca container onde serão exibidos os arquivos enviados e recebidos
        connection.filesContainer = this._media.downloadedFiles;

        if (connection.isInitiator && isLocal) {

            this._structure.onParticipation = true;
            connection.isUpperUserLeft = false;

            this._media.videoPreview.muted = true;
            this._mediaController.initiateVideo(this._media.videoPreview);
            this._connectController.points.push(btoa(conf.req.USERS_STATUS));

            // Ajusta elementos de exibição (define contadores de solicitações e remove 'pedir vez')
            if (this._structure.solicita <= 0) GeneralHelper.hideit(dom.COUNT_PEDIR);
            if (!connection.isInitiator) this._mediaController.disablePedir();

            // Ajusta elementos de exibição (define o menu de áudio e video para broadcaster)
            this._mediaController.adjustMediaMenu(conf.con.STREAM_LOCAL);
            this._mediaController.startTransmition.onclick = () => {
                this._initAdaptor(roomid, false);
                this._mediaController.initTransmition(false, dom.PRE_VIDEO, dom.PRE_LOAD_VIDEO, true);
                setTimeout(() => {
                    this._mediaController.endPreTransmition();
                    this._startPublishing(roomid);
                    this._mediaController.initiateControls();
                    connection.extra.onair = true;
                    connection.extra.streamEnded = false;
                    this._mediaController.changeTransmition(misc.TITLE_END_TRANSMITION, misc.ICON_END_TRANSMITION);

                    // Controles de tempo de transmissão
                    this._roomInfoController.stoped = false;
                    let timestamp = new Date();
                    let parsed = Date.parse(timestamp);
                    this._startedAt = parsed;
                    this._roomInfoController.initiateClock(this._startedAt);

                    // Informa início de stream para todos os participantes
                    let msgrash = this._mediaController.createSolicitationArray(
                        btoa(conf.req.NEW_ROOM),
                        this._startedAt,
                        roomid,
                        this._startedStream,
                        connection.extra.streamEnded
                    );
                    setTimeout(() => {
                        connection.send(msgrash);
                        this._startedStream = true;
                    }, 3000);
                }, 4000);
            }

            // Apresenta o número de espectadores conectados
            GeneralHelper.showit(dom.UL_CON_USERS, 300);

            // Tratamento de ação de controles de mídia==================================

            // Tratamento para entrar e sair do modo fullscreen
            this._media.screen.onclick = () => this._mediaController.toggleFullScreenOn();
            this._media.exitscreen.onclick = () => this._mediaController.toggleFullScreenOff();

            //Tratamento de controle de envio de arquivos
            this._media.sharedFile.onclick = () => this._mediaController.fileSharing(connection, this._structure.viewers);

            this._media.ctlPedir.onclick = () => {
                // Tratamento de respostas (permitir / negar)
                let response = doc.ALL(dom.CLASS_RESPONSES);
                let userid;
                let username;
                for (var j = 0; j < response.length; j++) {
                    let thisId = response[j].id;
                    response[j].onclick = () => {

                        console.log(thisId);
                        let admResponse = thisId.split('_');
                        userid = admResponse[0];
                        username = admResponse[1];
                        let msgrash = this._mediaController.createSolicitationArray(
                            btoa(conf.req.RESP_PEDE_VEZ + userid),
                            this._roomInfo.currentUser.value,
                            username,
                            this._roomInfo.inRoom.value,
                            this._roomInfo.currentRoomId.value
                        );
                        if (userid == conf.req.REQ_ALLOW && this._structure.lockSolicitation) {
                            this._alerta.initiateMessage(conf.message.ACCEPT_SOLICITATION);
                        } else {
                            this._structure.solicita -= 1;
                            connection.send(msgrash);
                            this._mediaController.reconstructList(username);
                            this._mediaController.trataSolicitacao(this._structure.solicita);
                            if (userid == conf.req.REQ_ALLOW) {
                                this._receiveNewParticipant();
                                this._structure.lockSolicitation = true
                                this._structure.targetUser = username;
                                this._media.divEndBtn.setAttribute('data-target', username);
                                GeneralHelper.showit(dom.DIV_BTN_END, 300);
                                GeneralHelper.showit(dom.CLOSE_PARTICIPATION, 300);
                            }
                        }
                        msgrash = [];

                    }
                }
                this._media.endSessionAccess.onclick = () => {

                    // Remoção da stream do usuário
                    this._closeParticipantStream(connection);

                    GeneralHelper.hideit(dom.DIV_BTN_END);
                    GeneralHelper.hideit(dom.CLOSE_PARTICIPATION, 300);
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

                index = this._adaptors.length - 1;
                if (index < 1) {
                    this._mediaController.disableShare();
                    let timestamp = +new Date();
                    this._screenId = 'screen' + timestamp;
                    this._initAdaptor(this._screenId, false, connection);
                    setTimeout(() => this._enableDesktopCapture(this._screenId), 1000);
                } else {
                    let msgrash = this._mediaController.createSolicitationArray(
                        btoa(conf.req.END_SHARE),
                        this._roomInfo.currentUser.value,
                        this._adaptors[index]['id'],
                        this._roomInfo.inRoom.value,
                        this._roomInfo.currentRoomId.value
                    );
                    connection.send(msgrash);
                    msgrash = [];
                    this._adaptors.splice(index, 1);
                    GeneralHelper.hideit(dom.VIDEO_SECOND, 300);
                }
            };
        } else if (!connection.isInitiator && !isLocal) {

            // Redefine id video-preview
            this._media.videoPreview.muted = true;

            // Valida dispositívos de áudio e vídeo
            let devices = new DevicesController();
            devices.participantInitiateDevices();

            this._structure.onParticipation = false;
            this._roomData.transmiting = true;
            this._mediaController.initiateVideo(this._media.videoPreview);

            // Ajusta elementos de exibição (define o menu de áudio e video para espectadores)
            // Desabilita botão de ação para câmera/microfone/compartilhamento de tela
            this._mediaController.adjustMediaMenu(conf.con.STREAM_REMOTE);
            this._structure.viewers = connection.getAllParticipants().length;

            // Tratamento para controle de mute e unmute
            this._media.vol.onclick = () => this._mediaController.controlVolume();

            // Tratamento para entrar e sair do modo fullscreen
            this._media.screen.onclick = () => this._mediaController.enterFullScreen();
            this._media.exitscreen.onclick = () => this._mediaController.exitFullScreen();

            this._media.solPedir.onclick = () => {

                let altText = [];
                let validadeDevices = devices.checkParticipation();
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
        }

        // Tratamento da função de ampliar e reduzir vídeo
        this._media.fullsize.onclick = () => {
            this._mediaController.toggleFullSize();
        }

        this._media.sessionAccess.onclick = () => {

            console.log(this._mediaController._session, this._structure.onParticipation);

            if (!this._mediaController._session && !this._structure.onParticipation) {
                this._mediaController.startParticipation();
                this._structure.onParticipation = true;
                try {
                    if (this._structure.singleConnection) connection.extra.alteredValue = true;
                    this._startParticipation(connection);
                } catch (e) {
                    this._mediaController.endParticipation();
                    this._structure.onParticipation = false;
                }
            } else if (this._mediaController._session && this._structure.onParticipation) {

                this._imParticipant = false;
                GeneralHelper.hideit(dom.EMBEDDED_FRAME, 300);
                this._mediaController.initBroadcasterVideo(roomid, this._mediaController);
                GeneralHelper.hideit(dom.VIDEOS);
                GeneralHelper.hideit(dom.INCOMMING_VIDEO, 300);
                GeneralHelper.hideit(dom.VIDEO_THIRD, 300);

                this._mediaController.disableParticipation();
                this._structure.onParticipation = false;
                this._stopPublishing(roomid, false, this._webRTCAdaptor);
                try {
                    //this._removeStreams(connection);
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

    /**
     * Remove todas as streams adicionadas à conexão
     * @param {Obj RTCMulticonnection} connection 
     */
    _removeStreams(connection) {

        connection.attachStreams.forEach((stream) => {
            connection.getAllParticipants().forEach((p) => {
                let peer = connection.peers[p].peer;
                stream.stop();
                peer.removeStream(stream);
            });
        });
    }

    /**
     * Redefine as configuração de sessão da conexão
     */
    _redefineStream() {

        if (this._broadcaster) {
            this._broadcaster.session = {
                video: this._videoConstraints,
                audio: this._audioConstraints,
                oneway: true
            }

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
        GeneralHelper.showit(dom.VIDEO_SECOND, 300);
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

        GeneralHelper.showit(dom.VIDEO_THIRD, 300);
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
     * Trata o recebimento de mensagens vindas de elementos aninhados:
     * * Mensagem recebida pelo o vídeo principal;
     * * Mensagem recebida pelo vídeo de compartilhamento de tela;
     * * Mensagens recebidas pelos vídeos de participantes.
     * @param {String} data 
     */
    checkEmbeddedMessages(data) {

        let roomid = this._roomInfo.inRoom.value;
        let msg = data.split('|');
        let cmd = msg[0];
        let mid;
        try { mid = atob(msg[1]) } catch (e) { return };
        // Vídeo principal
        if (cmd === 'ended' && mid == roomid) this._mediaController.stopTransmition(roomid, this._broadcaster);
        else if (cmd === 'ended' && mid.startsWith("screen")) {
            // Compartilhamento de tela
            this._forceSwap(doc.TAG(dom.SCREEN_SWAP));
            GeneralHelper.hideit(dom.INCOMMING_VIDEO_SCREEN);
            this._mediaController.removeElement(dom.FRAME_LAYER_II);
        } else if (cmd === 'ended' && mid.startsWith("participant")) {
            // Participantes
            this._forceSwap(doc.TAG(dom.PARTICIPATION_SWAP));
            if (!this._structure.onParticipation) {
                this._structure.onParticipation = true;
                this._mediaController._session = true;
            }
            GeneralHelper.hideit(dom.INCOMMING_VIDEO_PARTICIPANT);
            this._structure.userVideo = conf.str.WAITING_FOR_VIDEO;
            this._structure.lockSolicitation = false;
            this._mediaController.removeElement(dom.FRAME_LAYER_III);
        }
    }

    /**
     * Efetua a troca entre vídeos principal/participante
     * @param {String} elem 
     */
    _forceSwap(elem) {

        let participation = elem.getAttribute(misc.ATTR_ACTIVE);
        if (participation == 'main') elem.click();
    }

    /**
     * Tratamento de abertura de conexão com a sala criada
     * @param {Obj RTCMultiConnection} connection 
     */
    _onOpen(connection) {

        connection.onopen = (event) => {
            console.warn("Abrindo conexão ", event);
            if (connection.isInitiator) {
                this._connectController.points.push(event.userid + '|' + event.extra.modifiedValue);
                this._currentUsers = this._connectController.points;
                this.setUsersInformation(event.userid, this._participantIs, this._screenId);
            } else {
                if (event.extra.onair === true) this._openPreStream(connection, event.userid, false, true, event.extra.streamEnded);
                else this._openPreStream(connection, event.userid, false, false, event.extra.streamEnded);
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
            //console.log(event.streamid, this._structure.userVideo.streamid);
            if (event.stream.isScreen) {
                if (this._mediaController.getSharedValue()) this._media.swapSecond.click();
                GeneralHelper.hideit(dom.VIDEO_SECOND);
                this._mediaController.switchShare();
                $(dom.SHARE_ALERT).slideUp(300);

            } else if (event.streamid == this._structure.userVideo.streamid) {
                if (connection.isInitiator) {
                    GeneralHelper.hideit(dom.DIV_BTN_END, 300);
                    GeneralHelper.hideit(dom.CLOSE_PARTICIPATION, 300);
                    this._closeParticipantStream(connection);
                };
                GeneralHelper.hideit(dom.VIDEO_THIRD);
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
            console.warn('Deixando sala: ', event.userid, connection.extra);
            this.alertDisconnection(event.userid);
        };
    }

    /**
     * Tratamento de URI
     * @param {String} source 
     */
    _decodeURI(source) {

        return decodeURIComponent(source.replace(/\+/g, ' '));
    }

    /**
     * Tratamento e padronização de URI
     */
    _treatURI() {

        let params = {},
            regular = /([^&=]+)=?([^&]*)/g;
        let match, search = window.location.search;
        while (match = regular.exec(search.substring(1)))
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
     * Informa espectadores conectados
     * @param {String} userid 
     */
    setUsersInformation(userid, participant, screen) {

        if (this._broadcaster) {
            if (this._connectController.points.length > 1) {

                let msgrash = this._mediaController.createSolicitationArray(
                    btoa(conf.req.NEW_ROOM),
                    this._startedAt,
                    this._roomInfo.inRoom.value,
                    this._startedStream,
                    this._broadcaster.extra.streamEnded
                );

                let msgnewrash = this._mediaController.createSolicitationArray(
                    btoa(conf.req.NEW_PARTICIPATION),
                    participant,
                    this._roomInfo.inRoom.value,
                    this._structure.targetUser,
                    this._retransmitingWho
                );

                let msgscnrash = this._mediaController.createSolicitationArray(
                    btoa(conf.req.NEW_SHARE),
                    this._roomInfo.currentUser.value,
                    screen,
                    this._roomInfo.inRoom.value,
                    this._roomInfo.currentRoomId.value
                );

                if (userid && (this._startedStream || this._broadcaster.extra.streamEnded)) this._broadcaster.send(msgrash, userid);
                if (this._retransmiting && participant) this._broadcaster.send(msgnewrash, userid);
                if (screen) this._broadcaster.send(msgscnrash, userid);
                this._broadcaster.send(this._connectController.points);
            }
            this._updateUsersList();
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
            this._sendDisconnectionReq(connection, event.data.removedUserId);
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
     * Tratamento de mensagens e requisições enviadas/recebidas a partir do seu conteúdo
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
            let checkrash = event.data;
            let msgData = [];
            let myRoom = doc.TAG(dom.ROOM).value;

            if (checkrash[0] === btoa(conf.req.PEDE_VEZ)) {
                // Pedir vez para participação
                msgData[0] = checkrash[1];
                msgData[1] = checkrash[3].split('|')[1];
                msgData[2] = checkrash[4];
                this._structure.solicita = this._mediaController.listBox(msgData, this._structure.solicita);
                return;

            } else if (checkrash[0] === btoa(conf.req.RESP_PEDE_VEZ + conf.req.REQ_ALLOW)) {
                // Permissão de participação concedida
                if (checkrash[2] === myRoom) {
                    this._imParticipant = true;
                    this._structure.solicita -= 1;
                    this._mediaController.allow();
                    this._structure.lockSolicitation = true;
                }
                return;

            } else if (checkrash[0] === btoa(conf.req.RESP_PEDE_VEZ + conf.req.REQ_DENY)) {
                // Permissão de participação negada
                if (checkrash[2] === myRoom) {
                    this._structure.solicita -= 1;
                    this._mediaController.deny();
                    this._structure.lockSolicitation = false;
                }
                return;

            } else if (checkrash[0] === btoa(conf.req.NEW_SHARE)) {
                // Inicialização do compartilhamento de tela
                setTimeout(() => this._mediaController.initScreenVideo(checkrash[2], this._mediaController), 2000);

            } else if (checkrash[0] === btoa(conf.req.END_SHARE)) {
                // Finalização de compartilhamento de tela
                if (this._mediaController._videoIsMain) this._media.swapSecond.click();
                setTimeout(() => GeneralHelper.hideit(dom.VIDEO_SECOND), 1000);

            } else if (checkrash[0] === btoa(conf.req.END_PARTICIPATION)) {
                // Finalização de participação
                if (!this._structure.onParticipation) {
                    this._structure.onParticipation = true;
                    this._mediaController._session = true;
                }
                if (checkrash[2] == myRoom) this._media.sessionAccess.click();
                else {
                    GeneralHelper.hideit(dom.VIDEO_THIRD);
                    this._structure.userVideo = conf.str.WAITING_FOR_VIDEO;
                    this._structure.lockSolicitation = false;
                }

            } else if (checkrash[0] === btoa(conf.req.END_PARTICIPANT)) {
                // Finalização de participação (Remoto)
                //if (this._broadcaster) this._removeStreams(this._broadcaster);
                if (this._broadcaster) {
                    this._finishVideo(this._caller, this._media.thirdVideoPreview);
                    this._structure.lockSolicitation = false;
                }
                GeneralHelper.hideit(dom.DIV_BTN_END);
                GeneralHelper.hideit(dom.CLOSE_PARTICIPATION, 300);
                this._retransmiting = false;
                this._retransmitingWho = undefined;

            } else if (checkrash[0] === btoa(conf.req.RECEIVE_FILE)) {
                // Recebimento de arquivo
                this._mediaController.createProgressBar(checkrash[1]);

            } else if (checkrash[0] === btoa(conf.req.NEW_ROOM)) {
                // Informativo de nova transmissão de sala iniciada e tratamento de tempo de transmissão
                this._roomInfoController.stoped = false;
                this._startedAt = new Date(checkrash[1]);
                this._roomInfoController.initiateClock(this._startedAt);

                if (checkrash[3] === true) this._initateRoomStream(checkrash[2]);
                else if (checkrash[4] === true) this._initateRoomStream(checkrash[2], true);
                else {
                    this._mediaController.initTransmition(checkrash[2], dom.PRE_APRESENTACAO, dom.PRE_LOAD_APRESENTACAO, false);
                    setTimeout(() => this._initateRoomStream(checkrash[2]), 4000);
                }

            } else if (checkrash[0] === btoa(conf.req.END_CONNECTION)) {
                // Solicita a desconexão do usuário
                this._disconnectionMessage = conf.message.ALERT_DISCONNECTION;
                setTimeout(location.reload.bind(location), conf.con.DISCONNECTION_TIMER);

            } else if (checkrash[0] === btoa(conf.req.NEW_PARTICIPATION)) {
                // Participação de um espectador na transmissão
                if (checkrash[3] != myRoom) {
                    setTimeout(() => this._mediaController.initParticipantVideo(checkrash[4], checkrash[1]), 2000);
                }

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
     * Inicialização da apresentação do vídeo principal
     * @param {String} room 
     * @param {Boolean} isFinished 
     */
    _initateRoomStream(room, isFinished) {

        this._mediaController.initBroadcasterVideo(room, this._mediaController);
        this._mediaController.initiateControls();
        this._autologout = false;
        if (isFinished) {
            this._mediaController.stopTransmition(room, this._broadcaster);
            return;
        }
    }

    /**
     * Inicialização dos dispositívos de mídia e criação de vídeo de preview
     */
    _initiateDevices() {

        let confirm = doc.TAG(dom.CONFIRM_DEVICES);

        this._simulaRequest();

        confirm.onclick = () => {

            this._finishVideo(this._self, this._media.previewVideo);

            setTimeout(() => {
                if (this._roomController.checkDevices() && this._self == undefined) {
                    let session = {
                        audio: false,
                        video: true,
                        type: 'local'
                    };
                    this._startRTCLocal(dom.SHOW_PREVIEW, true, this._media.previewVideo, session);
                }
            }, 500);

        }
    }

    /**
     * Inicializa dos dispositivos selecionados para exibição local, para o próprio usuário em forma de vídeo de preview
     * @param {String} preview 
     * @param {Boolean} isVideo 
     * @param {Obj HTML} videoObj 
     * @param {Obj RTCMultiConnection} session 
     */
    _startRTCLocal(preview, isVideo, videoObj, session) {

        GeneralHelper.showit(preview, 300);
        let timestamp = +new Date();
        let room = 'self' + timestamp;
        let self = new RTCMultiConnection();

        this._initiatePersonalConnection(self);
        if (isVideo) this._setConnectionDevices(self);
        this._afterOpenSelfVideo(self, videoObj);

        self.session = session;

        self.sdpConstraints.mandatory = {
            OfferToReceiveVideo: false,
            OfferToReceiveAudio: false
        };

        self.extra.self = true;
        self.open(room);
        this._self = self;
    }

    /**
     * Tratamento de evento de stream de vídeo de preview
     * @param {Obj RTCMultiConnection} connection 
     * @param {Obj} obj
     */
    _afterOpenSelfVideo(connection, obj) {

        connection.onstream = (event) => {

            obj.srcObject = event.stream;
            obj.muted = true;
            this._mediaController.initiateVideo(obj);
        }
    }

    _afterJoinCallVideo(connection) {

        connection.onstream = (event) => {

            if (event.type === 'local') {

                GeneralHelper.hideit(dom.EMBEDDED_FRAME, 300);
                this._mediaController.removeElement(dom.FRAME_LAYER);
                GeneralHelper.hideit(dom.FIRST_VIDEO, 300);
                GeneralHelper.showit(dom.VIDEOS);
                GeneralHelper.showit(dom.INCOMMING_VIDEO, 300);
                // Apresenta o vídeo do usuário
                this._media.thirdVideoPreview.srcObject = event.stream;
                this._media.thirdVideoPreview.muted = true;
                this._mediaController.initiateVideo(this._media.thirdVideoPreview);
                GeneralHelper.showit(dom.VIDEO_THIRD, 300);

            } else if (event.type === 'remote') {

                let incommingVideo = doc.TAG(dom.INCOMMING_VIDEO);
                incommingVideo.srcObject = event.stream;
                incommingVideo.muted = true;
                this._mediaController.initiateVideo(incommingVideo);
            }
        }
    }

    _afterOpenCallVideo(connection) {

        connection.onstream = (event) => {

            if (event.type === 'local') return;
            if (this._retransmiting) return;

            this._structure.incomingCon = event.stream.streamid;
            this._media.thirdVideoPreview.srcObject = event.stream;
            this._structure.userVideo = event.stream;
            this._broadcaster.extra.remote = event.stream.streamid;

            this._mediaController.initiateVideo(this._media.thirdVideoPreview);
            this._alerta.initiateMessage(conf.message.START_PARTICIPATION);
            GeneralHelper.showit(dom.THIRD_VIDEO);
            GeneralHelper.showit(dom.VIDEO_THIRD, 300);

            this._participantIs = event.extra.modifiedValue.split('-')[1];
            this._retransmitingWho = 'participant' + event.userid;
            this._retransmiting = true;
            this._structure.streamVideos = event.stream;
            this._mediaController.openIncomingVideos(event.stream);

            GeneralHelper.showit(dom.DIV_BTN_END, 300);
            GeneralHelper.showit(dom.CLOSE_PARTICIPATION, 300);

            console.log('Recebendo video em ', event, event.file);

            let msgnewrash = this._mediaController.createSolicitationArray(
                btoa(conf.req.NEW_PARTICIPATION),
                this._participantIs,
                this._roomInfo.inRoom.value,
                this._structure.targetUser,
                this._retransmitingWho
            );
            this._broadcaster.send(msgnewrash);

            this._media.endSessionAccess.onclick = () => {
                console.log('---> REMOTO', event.userid, this._structure.targetUser);

                // Remoção da stream do usuário
                this._closeParticipantStream(this._broadcaster);

                GeneralHelper.hideit(dom.DIV_BTN_END);
                GeneralHelper.hideit(dom.CLOSE_PARTICIPATION, 300);
                this._structure.emptyStreamVideos();
                this._structure.incomingCon = '';
                this._mediaController.closeIncomingVideos(event.stream);
                this._structure.lockSolicitation = false;
                //this._removeStreams(this._broadcaster);

                let msgrash = this._mediaController.createSolicitationArray(
                    btoa(conf.req.END_PARTICIPATION),
                    this._roomInfo.currentUser.value,
                    this._structure.targetUser,
                    this._roomInfo.inRoom.value,
                    event.userid
                );
                this._broadcaster.send(msgrash);
                msgrash = [];

            };
        }
    }

    /**
     * Finalização de vídeo indicado
     */
    _finishVideo(target, video) {

        if (target != undefined) {
            let userId = target.userid;
            let socket = io.connect(`${ conf.con.URL }?userid=admin`);
            target.attachStreams.forEach(localStream => localStream.stop());
            if (target.extra.self) {
                target.extra.self = false;
                this._self = undefined;
            }
            target.sessionid.startsWith("call") ? GeneralHelper.hideit('#' + video.id, 300) : null;
            socket.emit('admin', {
                deleteUser: true,
                userid: userId
            });
            video.pause();
        }
    }

    /**
     * Definição dos dispositívos selecionados para abertura de sala
     * @param {Obj RTCMultiConnection} connection 
     */
    _setConnectionDevices(connection) {

        if (connection.DetectRTC.browser.name === 'Firefox') {
            this._videoConstraints = {
                deviceId: this._roomController.videoList.value,
                frameRate: 30
            };
            this._audioConstraints = { deviceId: this._roomController.audioList.value };
        } else {
            this._videoConstraints = {
                mandatory: {
                    minFrameRate: 30,

                    minWidth: 1280,
                    minHeight: 720,
                    minAspectRatio: 1.77

                },
                optional: [{
                    sourceId: this._roomController.videoList.value
                }]
            }
            console.log(this._roomController.videoList.value);
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

                // Define o ID da sala que será criada
                let broadcastId = this._room.hash.toString();
                // Istancia a conexão para o broadcaster 
                this._broadcaster = new RTCMultiConnection();
                this._broadcaster.extra.assunto = this._roomController._inputAssunto.value;
                this._broadcaster.extra.materia = this._roomController._inputMateria.value;
                this._broadcaster.extra.nome = this._roomController._inputName.value;
                this._broadcaster.extra.onair = false;
                this._broadcaster.extra.streamEnded = false;

                this._initiatePersonalConnection(this._broadcaster);
                this._broadcaster.publicRoomIdentifier = this._publicRoomIdentifier;
                this._broadcaster.socketMessageEvent = this._publicRoomIdentifier;
                this._broadcaster.enableFileSharing = this._connect.fileSharing;

                // Define elementos de inicialização da sessão criada
                let audioConf = conf.con.SESSION_AUDIO;
                let videoConf = conf.con.SESSION_VIDEO;

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

                this._finishVideo(this._self, this._media.previewVideo);
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

            // Limpa listagem de salas pré-existentes
            this._roomController.cleanRoomList(this._structure.publicRoomsList);

            // Verifica a existência des salas públicas, se não houver cancela operação
            if (rooms.length <= 0) {
                this._roomController.noRooms();
                return
            }

            // Cria o card de cada sala disponível
            rooms.forEach((array) => {

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

                    // Tratamento de ação de entrada na sala a partir do botão ENTRAR
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
                GeneralHelper.showit(dom.UL_CON_USERS, 300);
            }
            //this._roomView.changeCounter(this._structure.viewers);
            this._roomController.changeCounter(this._structure.viewers);
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
        if (connection.isInitiator) {
            this._sendDisconnectionReq(connection, disconnectId);
        } else {
            connection.send({
                userRemoved: true,
                removedUserId: disconnectId
            });
        }
        this._alerta.initiateMessage(conf.message.DISCONNECT_USER, thisName);
    }

    /**
     * Mensagem de solicitação de remoção de espectador
     * @param {Obj RTCMultiConnection} connection 
     * @param {String} disconnectId 
     */
    _sendDisconnectionReq(connection, disconnectId) {

        let msgrash = this._mediaController.createSolicitationArray(
            btoa(conf.req.END_CONNECTION),
            this._roomInfo.currentUser.value,
            this._roomInfo.inRoom.value
        );
        connection.send(msgrash, disconnectId);
        setTimeout(() => {
            connection.disconnectWith(disconnectId);
        }, 500);
    }

    /**
     * Configuração e tratamento de eventos de acasso a uma sala
     * @param {String} moderator 
     * @param {String} whois 
     */
    _roomEntered(moderator, whois) {

        try {
            this._finishVideo(this._self, this._media.previewVideo);
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

        // Inicializa verificação de token caso não seja um dispositivo Mobile
        if (!DetectRTC.isMobileDevice && conf.con.TK_DETECT) {
            GeneralHelper.showit(dom.TK_DETEC);
            $(dom.CALL_TK).click();
        }
    }

    /**
     * Inicializa a transmissão de um usuário em participação
     * @param {Obj RTCMultiConnection} connection 
     */
    _startParticipation(connection) {

        let caller = new RTCMultiConnection();
        caller.userid = this._roomInfo.currentRoomId.value;
        let targetRoomId = 'call' + this._roomId;
        this._initiatePersonalConnection(caller);
        this._afterJoinCallVideo(caller);

        // Define elementos de inicialização da sessão criada
        caller.session = {
            audio: true,
            video: true
        };
        caller.mediaConstraints = {
            video: true,
            audio: true
        };
        caller.sdpConstraints.mandatory = {
            OfferToReceiveVideo: true,
            OfferToReceiveAudio: true
        };
        caller.extra.caller = caller.userid;
        caller.extra.modifiedValue = caller.userid + '-' + this._roomInfo.currentUser.value;
        caller.checkPresence(targetRoomId, (isRoomExist, roomid) => {
            if (isRoomExist) {
                caller.join(targetRoomId, (stream) => {
                    this._roomData.transmiting = true;
                    this._sendParticipation(caller);
                    console.log("Compartilhando vídeo ------>", stream);
                });
                this._caller = caller;
            } else {
                console.warn('Sala requisitada não encontrada!', targetRoomId);
                this._media.sessionAccess.click();
            }
        });

        /*
        connection.addStream({
            audio: false,
            video: true,
            streamCallback: (stream) => {
                this._participateScreen(stream);
                this._media.thirdVideoPreview.muted = true;
                this._roomData.transmiting = true;
                console.log("Compartilhando vídeo ------>", stream);
                this._sendParticipation(connection);
                this._mediaController.initiateVideo(this._media.thirdVideoPreview);
            }
        });
        */
    }

    /**
     * Inicia uma chamada com um participante
     */
    _receiveNewParticipant() {

        let room = 'call' + this._broadcaster.userid;
        let caller = new RTCMultiConnection();

        this._initiatePersonalConnection(caller);
        this._setConnectionDevices(caller);
        this._afterOpenCallVideo(caller);

        caller.session = {
            audio: true,
            video: true
        };

        caller.mediaConstraints = {
            audio: this._audioConstraints,
            video: this._videoConstraints
        };

        caller.sdpConstraints.mandatory = {
            OfferToReceiveVideo: true,
            OfferToReceiveAudio: true
        };

        caller.extra.receiver = true;
        caller.open(room);
        this._caller = caller;

        /*

        // Define o ID da sala de chamada que será criada
        let broadcastId;
        broadcastId = 'call' + this._broadcaster.userid;
        // Istancia a conexão para o broadcaster 
        this._caller = new RTCMultiConnection();
        this._caller.userid = broadcastId;
        this._caller.extra.chamada = true;
        this._caller.extra.streamEnded = false;
        this._initiatePersonalConnection(this._caller);
        // Define configuração de sessão, stream, dispositívos e uso de banda
        this._caller.session = {
            audio: conf.con.SESSION_AUDIO,
            video: conf.con.SESSION_VIDEO
        };
        this._caller.direction = 'one-to-one';
        this._caller.mediaConstraints = {
            video: this._videoConstraints,
            audio: this._audioConstraints
        };
        this._caller.bandwidth = {
            audio: conf.con.BAND_AUDIO,
            video: conf.con.BAND_VIDEO
        };
        this._caller.checkPresence(broadcastId, (isRoomExist, broadcastId) => {
            isRoomExist ?
                console.error('A sala informada já existe.') :
                this._caller.open(broadcastId, () => {
                    console.warn('Camada criada com sucesso!', broadcastId);
                });
        })
        */
    }

    /**
     * Inicializa a apresentação e a publicação da mídia para todos os participantes e apresentadores
     * @param {Obj RTCMulticonnection} connection 
     */
    _sendParticipation(connection) {

        let roomid = 'participant' + connection.userid;
        let publishing = doc.TAG(dom.PUBLISH_PARTICIPANT);
        GeneralHelper.showit(dom.VIDEO_THIRD, 300);
        this._initAdaptor(roomid, true);
        publishing.onclick = () => {
            this._startPublishing(roomid);
        };
        setTimeout(() => {
            publishing.click();
        }, 2000);
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
            this._removeUser(this._connectController.points, userid);
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
                this.setUsersInformation(false);
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

        if (user === this._roomId) {
            message ? this._alerta.initiateMessage(this._disconnectionMessage) : null;
            if (this._autologout) setTimeout(location.reload.bind(location), conf.con.DISCONNECTION_TIMER);
        }
    }

}
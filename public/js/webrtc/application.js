/**
 *  Javascript + JQuery + WebRTC
 *  Controle de transmissão de mídia com stream;
 *  Configurações do WebRTC -> Sockets e RTCMulticonnection
 *                          -> Transmissão escalável em Broadcast
 *                          -> Controles do Chat
 *                          -> Controles de envio e recebimento de mensagens;
 *  Controle e tratamento das funções dos botões da barra de controle de mídia;
 *  Utilizado EXCLUSIVAMENTE para "salas";
 */
//-------------------------------------------------------------------------------------------------


let tag = document.querySelector.bind(document);
let allTags = document.querySelectorAll.bind(document);
let addTag = document.createElement.bind(document);

// Instâncias
let connectController = new ConnectController();
let connect = connectController.initiateConnection();

let mediaController = new MediaController();
let media = mediaController.initiateMedia();

let structureController = new StructureController();
let structure = structureController.initiateStructure();

let roomInfoController = new RoomInfoController();
let roomInfo = roomInfoController.initiateRoomInfo();

let alerta = new MessageController();

let roomController = new RoomController();
let roomDataController = new RoomDataController();
let roomView = new RoomView();

let connection = new RTCMultiConnection();

$(document).ready(function() {

    window.enableAdapter = true;

    //Application - Inicia a chamada e tratamento de multiconexão
    connection.enableScalableBroadcast = connect.enableScalableBroadcast;
    connection.maxRelayLimitPerUser = connect.maxRelayLimitPerUser;
    connection.socketMessageEvent = connect.socketMessageEvent;
    connection.socketURL = connect.urlSocket;

    // Listeners de tratamento de tamanho de tela do video (Detecta Fullscreen OFF)
    mediaController.initListeners();

    // Tratamento de mensagem de emit de sockets
    connection.connectSocket((socket) => {
        // Socket - Join: 'join-broadcaster'
        socket.on(conf.socket.MSG_JOIN, (hintsToJoinBroadcast) => {
            structure.broadcastStatus = 1;
            connection.session = hintsToJoinBroadcast.typeOfStreams;
            connection.sdpConstraints.mandatory = {
                OfferToReceiveVideo: false,
                OfferToReceiveAudio: false
            };
            connection.extra.modifiedValue = roomInfo.currentRoomId.value + '-' + roomInfo.currentUser.value;
            connection.updateExtraData();
            connection.broadcastId = hintsToJoinBroadcast.broadcastId;
            connection.join(hintsToJoinBroadcast.userid);
            alerta.initiateMessage(conf.message.START_TRANSMITION);
        });
        // Socket - Rejoin: 'rejoin-broadcast'
        socket.on(conf.socket.MSG_REJOIN, (getBroadcasterId) => {
            structure.broadcastStatus = 1;
            connection.attachStreams = [];
            connection.extra.modifiedValue = roomInfo.currentRoomId.value + '-' + roomInfo.currentUser.value;
            connection.updateExtraData();
            // Socket - check presence: 'check-broadcast-presence'
            socket.emit(conf.socket.MSG_CHK_PRESENCE, getBroadcasterId, (isBroadcastExists) => {
                if (!isBroadcastExists) {
                    connection.userid = getBroadcasterId;
                }
                // Socket - Join to broadcast: 'join-broadcast'
                socket.emit(conf.socket.MSG_JOIN_BROADCAST, {
                    broadcastId: getBroadcasterId,
                    userid: connection.userid,
                    typeOfStreams: connection.session
                });
            });
        });
        // Socket - Parado: 'broadcast-stopped'
        socket.on(conf.socket.MSG_BROADCAST_STOP, (getBroadcasterId) => {
            structure.broadcastStatus = 0;
            alerta.initiateMessage(conf.message.END_TRANSMITION);
        });
        // Socket - Iniciando: 'start-broadcasting
        socket.on(conf.socket.MSG_START_BROADCAST, (typeOfStreams) => {
            structure.broadcastStatus = 1;
            connection.sdpConstraints.mandatory = {
                OfferToReceiveVideo: false,
                OfferToReceiveAudio: false
            };
            connection.session = typeOfStreams;
            connection.open(connection.userid, connect.isPublicModerator);
        });
        // Socket - Saindo: 'leave-the-room'
        socket.on(conf.socket.MSG_LEAVE_ROOM, (targetconnection) => {
            if (targetconnection.remoteUserId != connection.userid) return;
            connection.leave();
        });
    });

    // Tratamento de erro para compartilhamento de tela
    connection.getScreenConstraints = (callback) => {
        getScreenConstraints((error, screen_constraints) => {
            if (!error) {
                screen_constraints = connection.modifyScreenConstraints(screen_constraints);
                callback(error, screen_constraints);
                $('#screen-share-alert').slideDown(300);
                mediaController.switchShare();
                return;
            }
            if (error !== 'permission-denied') {
                let elem = tag('#msg-share');
                let instance = M.Modal.getInstance(elem);
                instance.open();
            } else if (error === 'permission-denied') {
                mediaController.switchShare();
            }
            throw error;
        });
    }

    // Inicia a transmissão
    connection.onstream = (event) => {

        let currentStream;
        if (!structure.onParticipation && !event.extra.modifiedValue) {
            roomInfo.inRoom.value = event.userid;
        }
        /**==================================================================================================
         * Tratamento de conexões REMOTAS e LOCAIS
         * -> Identificação de compartilhamentos de tela e ingressos em transmissões
         * ==================================================================================================
         */
        if (event.type === 'remote' && connection.isInitiator) {

            // Remove qualquer conexão duplicada
            if (structure.incomingCon == event.stream.streamid) {
                connection.getAllParticipants().forEach((p) => {
                    if (p + '' == event.userid + '') {
                        let peer = connection.peers[p].peer;
                        stream.stop();
                        peer.removeStream(event.stream);
                        p.close();
                    }
                });
                return;
            }

            // Conexão remota de transmissão com o broadcaster
            if (structure.mainVideo != conf.structure.WAITING_FOR_VIDEO) {
                structure.incomingCon = event.stream.streamid;
                media.thirdVideoPreview.srcObject = event.stream;
                structure.userVideo = event.stream;

                mediaController.initiateVideo(media.thirdVideoPreview);
                alerta.initiateMessage(conf.message.START_PARTICIPATION);

                $('#span-video-preview-3rd').fadeIn(300);

                setTimeout(function() {
                    connection.getAllParticipants().forEach((p) => {
                        if (p + '' != event.userid + '') {
                            let peer = connection.peers[p].peer;
                            event.stream.getTracks().forEach((track) => {
                                try {
                                    peer.addTrack(track, event.stream);
                                } catch (e) {}
                            });
                            connection.dontAttachStream = true;
                            connection.renegotiate(p);
                            connection.dontAttachStream = false;
                        }
                    });
                    structure.streamVideos = event.stream;
                    mediaController.openIncomingVideos(event.stream);
                }, 500);

                $(conf.dom.DIV_BTN_END).fadeIn(300);
                media.endSessionAccess.onclick = function() {
                    console.log('------------->     REMOTO', event.userid, structure.targetUser);
                    structure.streamVideos.forEach((stream) => {
                        connection.getAllParticipants().forEach((p) => {
                            let peer = connection.peers[p].peer;
                            stream.stop();
                            peer.removeStream(stream);
                        });
                    });
                    $(conf.dom.DIV_BTN_END).hide();
                    structure.emptyStreamVideos();
                    structure.incomingCon = '';
                    mediaController.closeIncomingVideos(event.stream);
                    let msgrash = [
                        btoa('@Finaliza-Participacao'),
                        roomInfo.currentUser.value,
                        connection.userid,
                        roomInfo.inRoom.value,
                        event.userid
                    ];
                    connection.send(msgrash, event.userid);
                    structure.lockSolicitation = false;
                }
            } else {
                return;
            }

        } else if (!structure.onParticipation && (event.type === 'remote' && event.stream.isScreen === true)) {

            console.log('REMOTO COM SCREEN --> ', event.stream.streamid);

            // Conexão remota com compartilhamento de tela
            $('#span-video-preview-2nd').fadeIn(300);
            mediaController.openIncomingVideos(event.stream);
            media.secondVideoPreview.srcObject = event.stream;
            structure.incomingCon = event.stream.streamid;

            mediaController.initiateVideo(media.secondVideoPreview);

            // Tratamento de telas: Botão "Swap" -> Toggle Main/Second Video
            media.swapSecond.onclick = function() {
                mediaController.controlSwapVideo();
            }

        } else if (!structure.onParticipation && (event.type === 'remote' && !event.stream.isScreen)) {

            console.log('REMOTO SEM SCREEN --> ' + event.stream.streamid);

            // Conexão remota sem compartilhamento de tela
            if (structure.mainVideo != conf.structure.WAITING_FOR_VIDEO || event.extra.modifiedValue) {
                $('#span-video-preview-3rd').fadeIn(300);
                structure.incomingCon = event.stream.streamid;
                media.thirdVideoPreview.srcObject = event.stream;
                structure.userVideo = event.stream;

                mediaController.initiateVideo(media.thirdVideoPreview);

                mediaController.openIncomingVideos(event.stream);
            } else {
                structure.incomingCon = event.stream.streamid;
                structure.onParticipation = false;
                media.videoPreview.srcObject = event.stream;
                structure.mainVideo = event.stream;
                currentStream = [event.stream];

                mediaController.initiateVideo(media.videoPreview);
            }
            // Ajusta elementos de exibição (define o menu de áudio e video para espectadores)
            $('#div-connect').hide();
            $('#control-pedir-vez').hide();
            // Desabilita botão de ação para microfone
            mediaController.disableCam();
            // Desabilita botão de ação para camera
            mediaController.disableMute();
            // Desabilita botão de ação para compartilhar tela
            mediaController.disableShare();
            // Habilita barra de controle de mídia
            $('#div-controller').fadeIn(300);

            // Tratamento de áudio: Botão "Áudio" -> Toggle on/off
            media.vol.onclick = function() {
                mediaController.controlVolume(currentStream);
            };

            structure.viewers = connection.getAllParticipants().length;
            roomView.changeCounter(structure.viewers);

            // Tratamento do botão de pedir a vez
            media.solPedir.onclick = function() {
                let altText = [];
                if (structure.broadcastStatus == 1 && (structure.solicita === 0 && !structure.lockSolicitation)) {
                    // Constroi e envia mensagem solicitando a vez
                    let myIdentity = roomInfo.currentRoomId.value;
                    let msgrash = [
                        btoa('@PedeAVez'),
                        roomInfo.currentUser.value,
                        connection.userid,
                        roomInfo.inRoom.value,
                        myIdentity
                    ];
                    try {
                        connection.send(msgrash, roomInfo.inRoom.value);
                        structure.solicita += 1;
                        altText = conf.message.SEND_SOLICITATION;
                    } catch (err) {
                        altText = conf.message.ERROR_SOLICITATION;
                    }
                } else if (structure.solicita > 0) {
                    altText = conf.message.DUP_SOLICITATION;
                } else if (structure.lockSolicitation) {
                    altText = conf.message.ERR_ACP_SOLICITATION;
                } else {
                    altText = conf.message.NO_CONNECTION;
                }
                alerta.initiateMessage(altText);
            };

            // Broadcaster executando uma conexão local =====================================================
        } else if (!structure.onParticipation && (event.type === 'local' && !event.stream.isScreen)) {

            console.log('TRANSMISSÃO LOCAL------', structure.mainVideo);

            if (structure.incomingCon == event.stream.streamid) return;
            // Conexão local sem compartilhamento de tela
            structure.onParticipation = true;
            connection.isUpperUserLeft = false;
            structure.mainVideo = event.stream;
            structure.incomingCon = event.stream.streamid;
            currentStream = [event.stream];

            media.videoPreview.srcObject = event.stream;
            media.videoPreview.userid = event.userid;
            media.videoPreview.muted = true;

            mediaController.initiateVideo(media.videoPreview);

            // Trata contador de solicitações
            $('#div-connect').hide();
            $('#li-pedir-vez').hide();
            if (structure.solicita <= 0) {
                $('#count-pedir-vez').hide();
            }
            // Desabilita botão de ação para áudio
            mediaController.disableVolume();
            if (!connection.isInitiator) {
                mediaController.disablePedir();
            }
            // Habilita barra de controle de mídia
            $('#div-controller').fadeIn(300);

            // Tratamento de áudio: Botão "Microfone" -> Toggle on/off
            media.mute.onclick = function() {
                mediaController.controlVoice(currentStream);
            };
            // Tratamento de áudio e video: Botão "Camera" -> Toggle on/off
            media.cam.onclick = function() {
                mediaController.controlCam(currentStream);
            }

            // Tratamento de solicitações: Botão "Solicitações" -> Abra listagem de solicitações e respostas
            media.ctlPedir.onclick = function() {
                // Tratamento de respostas (permitir / negar)
                //let response = document.getElementsByClassName('responses');
                let response = allTags('.responses');
                for (var j = 0; j < response.length; j++) {
                    response[j].onclick = function() {
                        let admResponse = this.id.split('_');
                        let myIdentity = roomInfo.currentRoomId.value;
                        let msgrash = [
                            btoa('@PedeAVez:' + admResponse[0]),
                            roomInfo.currentUser.value,
                            admResponse[1],
                            roomInfo.inRoom.value,
                            myIdentity
                        ];
                        if (admResponse[0] == 'allow' && structure.lockSolicitation) {
                            alerta.initiateMessage(conf.message.ACCEPT_SOLICITATION);
                        } else {
                            structure.solicita -= 1;
                            connection.send(msgrash);
                            mediaController.reconstructList(admResponse[1]);
                            mediaController.trataSolicitacao(structure.solicita);
                            if (admResponse[0] == 'allow') {
                                structure.lockSolicitation = true
                                structure.targetUser = admResponse[1];
                                media.divEndBtn.setAttribute('data-target', admResponse[1]);
                                $(conf.dom.DIV_BTN_END).fadeIn(300);
                            }

                        }
                    }
                }
                media.endSessionAccess.onclick = function() {

                    $(conf.dom.DIV_BTN_END).hide();
                    structure.emptyStreamVideos();
                    structure.incomingCon = '';
                    let targetId = structure.targetUser;
                    let msgrash = [
                        btoa('@Finaliza-Participacao'),
                        roomInfo.currentUser.value,
                        connection.userid,
                        roomInfo.inRoom.value,
                        targetId
                    ];
                    connection.send(msgrash, targetId);
                    structure.lockSolicitation = false;
                    console.log('------------->     LOCAL', targetId, event.userid);
                }
            };
            // Tratamento de solicitações: Botão "Compartilhar" -> Compartilha a tela do apresentador: Toggle On/Off
            media.share.onclick = function() {
                if (!mediaController._controlSharing) {
                    $('#share-screen').hide();
                    connection.addStream({
                        screen: true,
                        oneway: true,
                        streamCallback: (stream) => {
                            setTimeout(function() {
                                connection.getAllParticipants().forEach((p) => {
                                    connection.renegotiate(p, {
                                        screen: true,
                                        oneway: true
                                    });
                                });
                            }, 2000);
                            roomInfo.inScreen.value = stream.streamid;
                        }
                    });
                } else {
                    $('#screen-share-alert').slideUp(300);
                    mediaController.switchShare();
                    var streamConnection = roomInfo.inScreen.value;
                    var streamToRemove = null;
                    var newArray = [];
                    connection.attachStreams.forEach((stream) => {
                        if (stream.id === streamConnection) {
                            streamToRemove = stream;
                            stream.stop();
                        } else newArray.push(stream);
                    });
                    connection.attachStreams = newArray;
                    connection.getAllParticipants().forEach((p) => {
                        var peer = connection.peers[p].peer;
                        try {
                            peer.removeStream(streamToRemove);
                            connection.renegotiate(p, {
                                screen: false,
                                oneway: true
                            });
                        } catch (e) { console.log(e) }
                    });
                    // Mensagem de finalização de screen sharing
                    let myIdentity = roomInfo.currentRoomId.value;
                    let msgrash = [
                        btoa('@Finaliza-Share'),
                        roomInfo.currentUser.value,
                        streamConnection,
                        roomInfo.inRoom.value,
                        myIdentity
                    ];
                    connection.send(msgrash);
                }
            }

            // Apresenta o número de espectadores conectados
            $(conf.dom.UL_CON_USERS).fadeIn(300);
        }
        /**==================================================================================================
         * Tratamentos e controles complementares
         */
        // Botão de maximizar o video -> toggle on:off
        media.screen.onclick = () => mediaController.enterFullScreen();
        media.exitscreen.onclick = () => mediaController.exitFullScreen();

        // Tratamento das funções MUTE e UNMUTE
        connection.onmute = event => event.mediaElement.setAttribute('poster', conf.structure.POSTER_IMG);
        connection.onunmute = event => event.mediaElement.removeAttribute('poster');

        // Tratamento da função de chat da barra de controle de mídia
        media.toggleChat.onclick = () => media.textMessage.focus();

        // Tratamento de ingresso na transmissão: Botão "Ingressar" -> Ingressa e participa da apresentação
        media.sessionAccess.onclick = function() {

            if (!mediaController._session && !structure.onParticipation) {
                mediaController.startParticipation();
                structure.onParticipation = true;
                setTimeout(function() {
                    try {
                        connection.peers[roomInfo.inRoom.value].addStream({
                            video: true
                        });

                    } catch (e) {
                        mediaController.endParticipation();
                        structure.onParticipation = false;
                    }
                }, 500);
            } else if (mediaController._session && structure.onParticipation) {
                mediaController.disableParticipation();
                structure.onParticipation = false;
                try {
                    connection.attachStreams.forEach((stream) => {
                        connection.getAllParticipants().forEach((p) => {
                            let peer = connection.peers[p].peer;
                            stream.stop();
                            peer.removeStream(stream);
                        });
                    });
                    let myIdentity = roomInfo.currentRoomId.value;
                    let msgrash = [
                        btoa('@Finaliza-Participante'),
                        roomInfo.currentUser.value,
                        connection.userid,
                        roomInfo.inRoom.value,
                        myIdentity
                    ];
                    connection.send(msgrash, roomInfo.inRoom.value);
                    structure.lockSolicitation = false;
                    alerta.initiateMessage(conf.message.END_PARTICIPATION);
                } catch (e) {
                    mediaController.startParticipation();
                    structure.onParticipation = true;
                }
            }
        };
        let fullsize = tag(conf.dom.TOGGLE_VIDEO_SIZE);
        fullsize.onclick = function() {
            mediaController.toggleFullSize();
        };
    };
    //=======================================================================================================
    // Listener para abertura de conexões
    connection.onopen = (event) => {

        console.log(event);
        if (event.userid != structure.connectedAt) {
            connection.getAllParticipants().forEach((p) => {
                //connection.disconnectWith(event.userid);
            });
        }
    };
    // Listener para finalização de streams
    connection.onstreamended = (event) => {

        if (event.stream.isScreen) {
            $('#span-video-preview-2nd').hide();
            //mediaController.closeIncomingVideos(event.stream);
        } else if (event.streamid == structure.userVideo.streamid) {
            console.log('EVENTO: ', event);
            $('#span-video-preview-3rd').hide();
            structure.userVideo = conf.structure.WAITING_FOR_VIDEO;
            structure.lockSolicitation = false;

        }
        mediaController.closeIncomingVideos(event.stream);
    };
    // Listener para fim de conexões
    connection.onleave = (event) => {
        console.log('DEIXANDO CONEXÃO...', event);
    };

    // Ação de criar uma sala ao clicar em 'btn-join-as-productor' ==========================================
    structure.startRoom.onclick = function() {

        let room = roomController.initiateRoom();

        let values = $('#cursos-list').val();
        let strValues = values.join(';');

        if (roomController.validade()) {
            structure.usuario = room.name;
            structure.onlobby = false;
            // Inicializa a tela de apresentação
            mediaController.initiateStream();
            // Modela e apresenta cabeçalho do video
            roomController.setRoomLabel(conf.misc.ICON_FA_VIDEOCAM, room.tema, room.assunto);

            structure.startRoom.disabled = true;
            // Define inicialização de sessão
            // -> Permite Audio, Video e Dados
            connection.session = {
                audio: true,
                video: true,
                data: true,
                broadcast: true,
                oneway: true
            };
            // Controle da utilização de banda
            /*
            connection.bandwidth = {
                audio: 100,
                video: 200
            };
            */
            // Inicializa Socket
            var socket = connection.getSocket();
            // Verifica existência do broadcast
            socket.emit('check-broadcast-presence', room.hash, (isBroadcastExists) => {
                if (!isBroadcastExists) {
                    connection.userid = room.hash;
                }
                //start-broadcasting
                socket.emit('join-broadcast', {
                    broadcastId: room.hash,
                    userid: connection.userid,
                    typeOfStreams: connection.session
                        //bandwidth: connection.bandwidth
                });
            });
        } else {
            alerta.initiateMessage(conf.message.FORM_ALERT);
        }
    };
    //=======================================================================================================

    // Tratamento do Id da sala e dos links para acesso -> Basea-se no URI
    /**
     *  var params      string
     *  var match       string
     *  var broadcastId string
     *  var hashString  string
     */

    (function() {
        var params = {},
            r = /([^&=]+)=?([^&]*)/g;

        function d(s) {
            return decodeURIComponent(s.replace(/\+/g, ' '));
        }
        var match, search = window.location.search;
        while (match = r.exec(search.substring(1)))
            params[d(match[1])] = d(match[2]);
        window.params = params;
    })();
    let broadcastId = '';
    if (localStorage.getItem(connection.socketMessageEvent)) {
        broadcastId = localStorage.getItem(connection.socketMessageEvent);
    } else {
        broadcastId = connection.token();
    }

    roomInfo.currentRoomId.onkeyup = function() {
        localStorage.setItem(connection.socketMessageEvent, this.value);
    };
    let hashString = location.hash.replace('#', '');
    if (hashString.length && hashString.indexOf('comment-') == 0) {
        hashString = '';
    }

    if (broadcastId && broadcastId.length) {
        roomInfo.currentRoomId.value = broadcastId;
        localStorage.setItem(connection.socketMessageEvent, broadcastId);
        // Efetua o join automático na sala em caso de desconexão do espectador
        // ->Verificação a cada 5 segundos
        (function reCheckRoomPresence() {
            connection.checkPresence(broadcastId, (isRoomExists) => {
                if (isRoomExists) {
                    tag('#' + broadcastId).onclick();
                    return;
                }
                setTimeout(reCheckRoomPresence, 5000);
            });
        })();
    }
    // Verifica quantas conexões estão ativas nesse broadcast
    connection.onNumberOfBroadcastViewersUpdated = (event) => {
        if (!connection.isInitiator) return;
        structure.viewers = event.numberOfBroadcastViewers;
        roomView.changeCounter(structure.viewers);
    };
    // Verifica listagem de de salas públicas que se enquadrem no perfil do usuário
    // ->A cada 3 segundos
    (function looper() {

        if (structure.onlobby) {
            //Verifica a existência des salas públicas
            connection.getPublicModerators((array) => {

                structure.publicRoomsList.innerHTML = '';
                if (array.length > 0) {
                    array.forEach((moderator) => {
                        let moderatorId = moderator.userid;

                        connection.getNumberOfBroadcastViewers(moderatorId, (numberOfBroadcastViewers) => {
                            structure.viewers = numberOfBroadcastViewers;
                        });

                        let labelRoom = roomDataController.validateRoomName(moderatorId, array);
                        if (!labelRoom) return;
                        if (moderatorId == connection.userid) return;

                        let roomData = roomDataController.initiateRoomData(labelRoom);
                        roomData.allowed = roomDataController.validateAccess(roomData.curso, roomData.classes);

                        if (roomData.allowed) {

                            // Cria rótulo de sala se o acesso a ela for permitido
                            structure.countRooms += 1;
                            structure.usuario = roomInfo.currentUser.value;

                            let divOpen = addTag('div');
                            let button = addTag('a');
                            let card = roomController.constructAccessList(roomData.classe, roomData.assunto, roomData.apresentador, structure.viewers, moderatorId);

                            roomController.initiateRoomCard(moderatorId, card, divOpen, button);

                            //Função de entrada na sala a partir do botão ENTRAR
                            button.onclick = function() {
                                mediaController.initiateStream();
                                roomController.setRoomLabel(conf.misc.ICON_FA_TV, roomData.classe, roomData.assunto);

                                structure.onlobby = false;
                                structure.isModerator = false;
                                structure.connectedAt = this.id;
                                roomInfo.broadcaster.value = roomData.whois;

                                connection.session = {
                                    audio: false,
                                    video: false
                                };

                                let socket = connection.getSocket();
                                socket.emit('join-broadcast', {
                                    broadcastId: structure.connectedAt,
                                    userid: connection.userid,
                                    typeOfStreams: connection.session
                                });
                            };
                        }
                        if (structure.countRooms == 0) {
                            roomController.noRooms();
                        }
                    });
                } else {
                    roomController.noRooms();
                }
            });
        } else {
            // Tratamento de conexões de espectadores
            let htmlList = '';
            let allParticipants = connection.getAllParticipants();
            structure.viewers = allParticipants.length;
            allParticipants.forEach((participantId) => {
                let myId = roomInfo.currentRoomId.value;
                let user = connection.peers[participantId];
                let userextra = user.extra;
                if (userextra.modifiedValue) {
                    htmlList += constructConnectionList(userextra.modifiedValue, userextra.modifiedValue.split('-')[1], user.userid, true);
                } else {
                    if (!structure.isModerator) {
                        htmlList += constructConnectionList(myId, roomInfo.currentUser.value + ' (você)', connection.userid, false);
                    }
                }
            });
            if (structure.viewers > 0) {
                if (roomInfo.countUsers.getAttribute('data-target') == 0) {
                    structure.connectList.innerHTML = htmlList;
                    roomView.changeCounter(structure.viewers);
                    $('#connected-users').fadeIn(300);
                }
                let disconnectId;
                let btnDisconnect = allTags('.disconnect-btn');
                for (var j = 0; j < btnDisconnect.length; j++) {
                    btnDisconnect[j].onclick = function() {
                        disconnectId = this.getAttribute('data-announced');
                        connection.send({
                            userRemoved: true,
                            removedUserId: disconnectId
                        });
                        alerta.initiateMessage(conf.message.DISCONNECT_USER, this.name);
                    }
                }
            }
        }
        setTimeout(looper, 3000);
    })();

    /**
     *  CHAT---------------------------------------------------------
     */
    // Controles de envio e recebimento de mensagens
    // -> Efetua tratando entrada de texto
    /**
     *  var texto String
     */
    media.textMessage.onkeyup = function(e) {
        if (e.keyCode != 13) return;
        this.value = this.value.replace(/^\s+|\s+$/g, '');
        if (!this.value.length) return;
        var texto = "<b class='small'>" + structure.usuario + "</b>:<br>" + this.value;
        texto = btoa(texto);
        connection.send(texto);
        appendDIV(texto);
        this.value = '';
    };
    /**
     *  var texto String
     */
    tag('#send-message-btn').onclick = function() {
        var texto = media.textMessage.value
        texto = texto.replace(/^\s+|\s+$/g, '');
        if (!texto.length) return;
        texto = "<b class='small'>" + structure.usuario + "</b>:<br>" + texto;
        texto = btoa(texto);
        connection.send(texto);
        appendDIV(texto);
        media.textMessage.value = '';
    };
    // Recebimento de mensagens
    connection.onmessage = (event) => {
        if (event.data.userRemoved === true) {
            if (event.data.removedUserId == connection.userid) {
                connection.close();
                setTimeout(location.reload.bind(location), 3000);
            }
            return;
        } else {
            appendDIV(event);
        }
    };

});
/**
 * FUNÇÕES-------------------------------------------------------------------
 */
//Trata e escreve mensagem de chat e trata solicitações
/*
 * Param event: Mensagem recebida via connection.send (event || event.data)
 *       -> mensagens em formato de array[4+] (length > 4) são tratadas como solicitações;
 *       -> solicitações tem como padrão no array[0] o indicativo da solicitação;
 *       -> os indicativos sempre iniciam com @, como @PedeAVez.
 *   
 * var chatContainer elem. html
 * var text          string
 * var message       string
 */
function appendDIV(event) {
    let chatContainer = tag('#chat-panel');
    let accessBtn = tag('#enter-session');
    var remoto = false;
    // Recebe mensagens de origem externa ou interna
    if (event.data) remoto = true;
    var text = event.data || event;
    // Verifica a origem da mensagem, se a menssagem é um array e se este array possui mais de 4 índices
    // -> Definição do padrão de solicitação
    if (remoto && (Array.isArray(text) && text.length > 4)) {
        var chkrash = event.data;
        var msgData = [];
        var myRoom = tag('#room-id').value;
        // Identifica se a mensagem é uma solicitação de serviço
        if (chkrash[0] === btoa('@PedeAVez')) {
            // Indica que algum usuário solicita a permissão para falar
            msgData[0] = chkrash[1];
            msgData[1] = (atob(chkrash[3])).split('|')[4];
            msgData[2] = chkrash[4];
            structure.solicita = mediaController.listBox(msgData, structure.solicita);
            return;
        } else if (chkrash[0] === btoa('@PedeAVez:allow')) {
            // Indica que o broadcaster atendeu à solicitação do usuário
            // Verifica se o destinatário é o criador da solicitação para entregar a resposta
            if (chkrash[2] === myRoom) {
                structure.solicita -= 1;
                mediaController.allow();
                structure.lockSolicitation = true;
            }
            return;
        } else if (chkrash[0] === btoa('@PedeAVez:deny')) {
            // Indica que o broadcaster negou a solicitação do usuário
            // Verifica se o destinatário é o criador da solicitação para entregar a resposta
            if (chkrash[2] === myRoom) {
                structure.solicita -= 1;
                mediaController.deny();
                structure.lockSolicitation = false;
            }
            return;
        } else if (chkrash[0] === btoa('@Finaliza-Share')) {
            if (mediaController._videoIsMain) {
                media.swapSecond.click();
            }
            setTimeout(function() {
                $('#span-video-preview-2nd').hide();
                alerta.initiateMessage(conf.message.STOP_SHARE);
            }, 1000);
        } else if (chkrash[0] === btoa('@Finaliza-Participacao')) {
            if (!structure.onParticipation) {
                structure.onParticipation = true;
                mediaController._session = true;
            }
            media.sessionAccess.click();
        } else if (chkrash[0] === btoa('@Finaliza-Participante')) {
            $(conf.dom.DIV_BTN_END).hide();
        } else {
            return;
        }
    } else {
        // Tratamento de mensagens comuns (fora do padrão de solicitação)
        mediaController.writeMessage(text, remoto);
    }
}

// Emite alerta de conexão.
/**
 * Param userid: String de dados de quem efetuou a conexão
 */
function alertConnection(userid) {
    setTimeout(() => {
        console.log('Sala ' + userid + ' se conectou a você.');
        var htmlList = '';
        //var broadcaster = tag('#in-room').value;
        for (var j = 0; j < Object.keys(structure.connections).length; j++) {
            var roomaccount = structure.connections[j].split('|')[0];
            var roomname = structure.connections[j].split('|')[1];
            var roomanounce = structure.connections[j].split('|')[2];
            htmlList += constructConnectionList(roomaccount, roomname, roomanounce, true);
        }
        tag('#connection-list').innerHTML = htmlList;
    }, 1000);
}

// Emite alerta de desconexão.
/**
 * Param userid: String de dados de quem foi desconectado
 */
function alertDisconnection(userid) {

    if (userid === roomInfo.inRoom.value) {
        alerta.initiateMessage(conf.message.ALERT_DISCONNECTION);
        setTimeout(location.reload.bind(location), 3000);
    } else {
        try {
            for (var j = 0; j < Object.keys(structure.connections).length; j++) {
                if (structure.connections[j].split('|')[2] == userid) {
                    structure.connections.splice(j, 1);
                }
            }
        } catch (e) {
            return;
        }
        constructConnectionExpList(userid);
        roomView.changeCounter(Object.keys(structure.connections).length);
    }
}
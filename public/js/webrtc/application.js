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

let roomController = new RoomController();
let roomDataController = new RoomDataController();
let alerta = new MessageView();

let connection = new RTCMultiConnection();


$(document).ready(function() {

    window.enableAdapter = true;

    //Application - Inicia a chamada e tratamento de multiconexão
    connection.enableScalableBroadcast = connect.enableScalableBroadcast;
    connection.maxRelayLimitPerUser = connect.maxRelayLimitPerUser;
    connection.socketMessageEvent = connect.socketMessageEvent;
    connection.socketURL = connect.urlSocket;

    // Listeners de tratamento de tamanho de tela do video (Detecta Fullscreen OFF)
    RoomHelper.initListeners();

    // Dom actions
    let startRoom = tag('#btn-join-as-productor');
    let textMessage = tag('#text-message');
    let contaUsuarios = tag('#users-counter');
    let publicRoomsDiv = tag('#public-conference');
    let connectList = tag('#connected-users-list');

    connection.connectSocket((socket) => {
        // Socket - Join
        socket.on('join-broadcaster', (hintsToJoinBroadcast) => {
            console.log('--> join-broadcaster', hintsToJoinBroadcast);
            structure.broadcastStatus = 1;
            connection.session = hintsToJoinBroadcast.typeOfStreams;
            connection.sdpConstraints.mandatory = {
                OfferToReceiveVideo: false,
                OfferToReceiveAudio: false
            };
            console.log(roomInfo.currentRoomId.value);
            connection.extra.modifiedValue = roomInfo.currentRoomId.value + '-' + roomInfo.currentUser.value;
            connection.updateExtraData();
            connection.broadcastId = hintsToJoinBroadcast.broadcastId;
            connection.join(hintsToJoinBroadcast.userid);
            console.log('--> Joined at: ' + hintsToJoinBroadcast.userid);

            alerta.update(conf.message.START_TRANSMITION);
        });
        // Socket - Rejoin
        socket.on('rejoin-broadcast', (getBroadcasterId) => {
            console.log('--> rejoin-broadcast', getBroadcasterId);
            structure.broadcastStatus = 1;
            connection.attachStreams = [];
            connection.extra.modifiedValue = roomInfo.currentRoomId.value + '-' + roomInfo.currentUser.value;
            connection.updateExtraData();
            socket.emit('check-broadcast-presence', getBroadcasterId, (isBroadcastExists) => {
                console.log('check-existente');
                if (!isBroadcastExists) {
                    connection.userid = getBroadcasterId;
                }
                socket.emit('join-broadcast', {
                    broadcastId: getBroadcasterId,
                    userid: connection.userid,
                    typeOfStreams: connection.session
                });
            });
        });
        // Socket - Parado
        socket.on('broadcast-stopped', (getBroadcasterId) => {
            console.error('--> Broadcast finalizada', getBroadcasterId);
            structure.broadcastStatus = 0;

            alerta.update(conf.message.END_TRANSMITION);
        });
        // Socket - Iniciando
        socket.on('start-broadcasting', (typeOfStreams) => {
            console.log('--> Iniciando broadcasting', typeOfStreams);
            structure.broadcastStatus = 1;
            connection.sdpConstraints.mandatory = {
                OfferToReceiveVideo: false,
                OfferToReceiveAudio: false
            };
            connection.session = typeOfStreams;
            connection.open(connection.userid, connect.isPublicModerator);
            console.log('--> Abrindo: ' + connection.userid);
        });
        // Socket - Saindo
        socket.on('leave-the-room', (targetconnection) => {
            console.log('--> Saindo...' + targetconnection.remoteUserId + ' -> ' + connection.userid);
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
                setShare('off');
                return;
            }
            if (error !== 'permission-denied') {
                var elem = tag('#msg-share');
                var instance = M.Modal.getInstance(elem);
                instance.open();
            } else if (error === 'permission-denied') {
                setShare('on');
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
         */
        // Broadcaster recebendo uma conexão remota==========================================================
        if (event.type === 'remote' && connection.isInitiator) {

            let msgrash = [];

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
            if (structure.mainVideo != 'waiting') {
                structure.incomingCon = event.stream.streamid;
                media.thirdVideoPreview.srcObject = event.stream;
                structure.userVideo = event.stream;

                mediaController.initiateVideo(media.thirdVideoPreview);

                alerta.update(conf.message.START_PARTICIPATION);

                $('#span-video-preview-3rd').fadeIn(300);

                setTimeout(function() {
                    connection.getAllParticipants().forEach((p) => {
                        if (p + '' != event.userid + '') {
                            let peer = connection.peers[p].peer;
                            event.stream.getTracks().forEach((track) => {
                                try {
                                    peer.addTrack(track, event.stream);
                                } catch (e) {
                                    console.log('Track já existe: ', e);
                                }
                            });
                            connection.dontAttachStream = true;
                            connection.renegotiate(p);
                            connection.dontAttachStream = false;
                        }
                    });
                    //streamVideos.push(event.stream);
                    structure.streamVideos = event.stream;
                    RoomHelper.toggleIncomingVideos('in');
                }, 500);

                $('#div-end').fadeIn(300);
                media.endSessionAccess.onclick = function() {

                    structure.streamVideos.forEach((stream) => {
                        connection.getAllParticipants().forEach((p) => {
                            let peer = connection.peers[p].peer;
                            stream.stop();
                            peer.removeStream(stream);
                        });
                    });
                    $('#div-end').hide();
                    structure.emptyStreamVideos();
                    structure.incomingCon = '';
                    RoomHelper.toggleIncomingVideos('out');
                    msgrash[0] = btoa('@Finaliza-Participacao');
                    msgrash[1] = roomInfo.currentUser.value;
                    msgrash[2] = connection.userid;
                    msgrash[3] = roomInfo.inRoom.value;
                    msgrash[4] = event.userid;
                    connection.send(msgrash, event.userid);
                    structure.lockSolicitation = false;
                }

            } else {
                return;
            }
            // Usuário recebendo uma conexão remota com compartilhamento de tela=============================
        } else if (!structure.onParticipation && (event.type === 'remote' && event.stream.isScreen === true)) {

            console.log('REMOTO COM SCREEN --> ', event.stream.streamid);

            /*
            if (structure.incomingCon == event.stream.streamid && structure.incomingCon != structure.connectedAt) {
                connection.getAllParticipants().forEach((p) => {
                    if (p + '' == event.userid + '') {
                        var peer = connection.peers[p].peer;
                        //event.stream.stop();
                        //peer.removeStream(event.stream);
                    }
                });
                //return;
            }
            */

            // Conexão remota com compartilhamento de tela
            $('#span-video-preview-2nd').fadeIn(300);
            RoomHelper.toggleIncomingVideos('in');
            media.secondVideoPreview.srcObject = event.stream;
            structure.incomingCon = event.stream.streamid;

            mediaController.initiateVideo(media.secondVideoPreview);

            // Tratamento de telas: Botão "Swap" -> Toggle Main/Second Video
            media.swapSecond.onclick = function() {
                mediaController.controlSwapVideo();
            }

            // Usuário recebendo uma conexão remota sem compartilhamento de tela=============================
        } else if (!structure.onParticipation && (event.type === 'remote' && !event.stream.isScreen)) {

            console.log('REMOTO SEM SCREEN --> ' + event.stream.streamid);

            if (structure.incomingCon == event.stream.streamid) {
                connection.getAllParticipants().forEach((p) => {
                    if (p + '' == event.userid + '') {
                        var peer = connection.peers[p].peer;
                        //event.stream.stop();
                        //peer.removeStream(event.stream);
                    }
                });
                //return;
            }
            // Conexão remota sem compartilhamento de tela
            if (structure.mainVideo != 'waiting' || event.extra.modifiedValue) {
                $('#span-video-preview-3rd').fadeIn(300);
                structure.incomingCon = event.stream.streamid;
                media.thirdVideoPreview.srcObject = event.stream;
                structure.userVideo = event.stream;

                mediaController.initiateVideo(media.thirdVideoPreview);

                RoomHelper.toggleIncomingVideos('in');
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
            setCam('dis');
            // Desabilita botão de ação para camera
            setMute('dis');
            // Desabilita botão de ação para compartilhar tela
            setShare('dis');
            // Habilita barra de controle de mídia
            $('#div-controller').fadeIn(300);

            // Tratamento de áudio: Botão "Áudio" -> Toggle on/off
            media.vol.onclick = function() {
                mediaController.controlVolume(currentStream);
            };

            let numberOfUsers = connection.getAllParticipants().length;
            changeCounter(numberOfUsers);

            // Tratamento do botão de pedir a vez
            media.solPedir.onclick = function() {
                let altText = [];
                if (structure.broadcastStatus == 1 && (structure.solicita === 0 && !structure.lockSolicitation)) {
                    // Constroi e envia mensagem solicitando a vez
                    let msgrash = [];
                    let myIdentity = roomInfo.currentRoomId.value;
                    msgrash[0] = btoa('@PedeAVez');
                    msgrash[1] = roomInfo.currentUser.value;
                    msgrash[2] = connection.userid;
                    msgrash[3] = roomInfo.inRoom.value;
                    msgrash[4] = myIdentity;
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
                alerta.update(altText);
            };

            // Broadcaster executando uma conexão local =====================================================
        } else if (!structure.onParticipation && (event.type === 'local' && !event.stream.isScreen)) {

            console.log('TRANSMISSÃO LOCAL------', structure.mainVideo);

            if (structure.incomingCon == event.stream.streamid) {
                connection.getAllParticipants().forEach((p) => {
                    if (p + '' == event.userid + '') {
                        var peer = connection.peers[p].peer;
                        //stream.stop();
                        //peer.removeStream(event.stream);
                    }
                });
                return;
            }
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
            setVol('dis');
            if (!connection.isInitiator) {
                setPedir('dis');
            }
            // Habilita barra de controle de mídia
            $('#div-controller').fadeIn(300);

            // Tratamento de áudio: Botão "Microfone" -> Toggle on/off
            media.mute.onclick = function() {
                mediaController.controlMute(currentStream);
            };
            // Tratamento de áudio e video: Botão "Camera" -> Toggle on/off
            media.cam.onclick = function() {
                mediaController.controlCam(currentStream);
            }

            // Tratamento de solicitações: Botão "Solicitações" -> Abra listagem de solicitações e respostas
            media.ctlPedir.onclick = function() {
                // Tratamento de respostas (permitir / negar)
                let response = document.getElementsByClassName('responses');
                for (var j = 0; j < response.length; j++) {
                    response[j].onclick = function() {
                        var admResponse = this.id.split('_');
                        var msgrash = [];
                        var myIdentity = roomInfo.currentRoomId.value;
                        msgrash[0] = btoa('@PedeAVez:' + admResponse[0]);
                        msgrash[1] = roomInfo.currentUser.value;
                        msgrash[2] = admResponse[1];
                        msgrash[3] = roomInfo.inRoom.value;
                        msgrash[4] = myIdentity;
                        if (admResponse[0] == 'allow' && structure.lockSolicitation) {
                            alerta.update(conf.message.ACCEPT_SOLICITATION);
                        } else {
                            structure.solicita -= 1;
                            connection.send(msgrash);
                            constructList(admResponse[1]);
                            trataSolicitacao(structure.solicita);
                            if (admResponse[0] == 'allow') {
                                structure.lockSolicitation = true
                                media.divEndBtn.setAttribute('data-target', admResponse[1]);
                                $('#div-end').fadeIn(300);
                            }

                        }
                    }
                }
                media.endSessionAccess.onclick = function() {
                    console.log('---> Chamada via LOCAL');
                    $('#div-end').hide();

                    structure.emptyStreamVideos();
                    structure.incomingCon = '';
                    RoomHelper.toggleIncomingVideos('out');

                    let targetId = media.divEndBtn.getAttribute('data-target');
                    let msgrash = [];
                    msgrash[0] = btoa('@Finaliza-Participacao');
                    msgrash[1] = roomInfo.currentUser.value;
                    msgrash[2] = connection.userid;
                    msgrash[3] = roomInfo.inRoom.value;
                    msgrash[4] = targetId;
                    connection.send(msgrash, targetId);
                    structure.lockSolicitation = false;
                }
            };
            // Tratamento de solicitações: Botão "Compartilhar" -> Compartilha a tela do apresentador: Toggle On/Off
            media.share.onclick = function() {
                if (media.share.getAttribute('data-active') == 'enabled') {
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
                    setShare('on');
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
                    var msgrash = [];
                    var myIdentity = roomInfo.currentRoomId.value;
                    msgrash[0] = btoa('@Finaliza-Share');
                    msgrash[1] = roomInfo.currentUser.value;
                    msgrash[2] = streamConnection;
                    msgrash[3] = roomInfo.inRoom.value;
                    msgrash[4] = myIdentity;
                    connection.send(msgrash);
                }
            }

            // Apresenta o número de espectadores conectados
            $('#connected-users').fadeIn(300);
        }
        /**==================================================================================================
         * Tratamentos e controles complementares
         */
        // Botão de maximizar o video -> toggle on:off
        media.screen.onclick = function() { fullscreen(); };
        media.exitscreen.onclick = function() { fullscreen(); };
        // Tratamento das funções MUTE e UNMUTE
        connection.onmute = (event) => {
            event.mediaElement.setAttribute('poster', '/img/bg.jpg');
        };
        connection.onunmute = (event) => {
            event.mediaElement.removeAttribute('poster');
        };
        // Tratamento da função de chat da barra de controle de mídia
        media.toggleChat.onclick = function() {
            textMessage.focus();
        };
        // Tratamento de ingresso na transmissão: Botão "Ingressar" -> Ingressa e participa da apresentação
        // ->Toggle On/Off
        media.sessionAccess.onclick = function() {
            if (media.sessionAccess.getAttribute('data-active') == 'disabled' && !structure.onParticipation) {
                setParticipation('off');
                structure.onParticipation = true;
                setTimeout(function() {
                    try {
                        connection.peers[roomInfo.inRoom.value].addStream({
                            video: true
                        });

                    } catch (e) {
                        setParticipation('on');
                        structure.onParticipation = false;
                    }
                }, 500);
            } else if (media.sessionAccess.getAttribute('data-active') == 'enabled' && structure.onParticipation) {
                setParticipation('dis');
                structure.onParticipation = false;
                try {
                    connection.attachStreams.forEach((stream) => {
                        connection.getAllParticipants().forEach((p) => {
                            var peer = connection.peers[p].peer;
                            stream.stop();
                            peer.removeStream(stream);
                        });
                    });
                    var msgrash = [];
                    var myIdentity = roomInfo.currentRoomId.value;
                    msgrash[0] = btoa('@Finaliza-Participante');
                    msgrash[1] = roomInfo.currentUser.value;
                    msgrash[2] = connection.userid;
                    msgrash[3] = roomInfo.inRoom.value;
                    msgrash[4] = myIdentity;
                    connection.send(msgrash, roomInfo.inRoom.value);
                    structure.lockSolicitation = false;
                    alerta.update(conf.message.END_TRANSMITION);
                } catch (e) {
                    setParticipation('off');
                    structure.onParticipation = true;
                }
            }
        };
        let fullsize = tag('#toggle-size');
        fullsize.onclick = function() {
            toggleFullsize();
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
        console.log(event);
        console.log(structure.userVideo);

        if (event.stream.isScreen) {
            $('#span-video-preview-2nd').hide();
            RoomHelper.toggleIncomingVideos('out');
        } else if (event.streamid == structure.userVideo.streamid) {
            console.log('EVENTO: ', event);
            $('#span-video-preview-3rd').hide();
            structure.userVideo = 'waiting';
            structure.lockSolicitation = false;
            RoomHelper.toggleIncomingVideos('out');
        }
    };
    // Listener para fim de conexões
    connection.onleave = (event) => {
        console.log('DEIXANDO CONEXÃO...', event);
    };

    // Ação de criar uma sala ao clicar em 'btn-join-as-productor' ==========================================
    startRoom.onclick = function() {

        let room = roomController.initiateRoom();

        let values = $('#cursos-list').val();
        let strValues = values.join(';');

        if (roomController.validade()) {
            structure.usuario = room.name;
            structure.onlobby = false;
            // Inicializa a tela de apresentação
            callTeacherStream();
            // Modela e apresenta cabeçalho do video
            setRoomLabel('video-camera', room.tema, room.assunto);

            startRoom.disabled = true;
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
            alerta.update(conf.message.FORM_ALERT);
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
        changeCounter(structure.viewers);
    };
    // Verifica listagem de de salas públicas que se enquadrem no perfil do usuário
    // ->A cada 3 segundos
    (function looper() {
        // Se ainda estiver no lobby das salas
        if (structure.onlobby) {
            //Verifica a existência de uma sala pública
            connection.getPublicModerators((array) => {
                publicRoomsDiv.innerHTML = '';
                // Se existir alguma sala pública execute
                if (array.length > 0) {
                    array.forEach((moderator) => {
                        let moderatorId = moderator.userid;

                        connection.getNumberOfBroadcastViewers(moderatorId, (numberOfBroadcastViewers) => {
                            structure.viewers = numberOfBroadcastViewers;
                        });

                        if (moderatorId == connection.userid) return;

                        // Verifica se a sala criada atende às especificações do sistema
                        let labelRoom = moderatorId;
                        try {
                            labelRoom = atob(labelRoom);
                            // PALEATIVO - ARRUMAR!
                            if (labelRoom.length < 10) return;
                        } catch (exp) {
                            if (array.length < 2) RoomHelper.noRooms();
                            return;
                        }

                        let roomData = roomDataController.initiateRoomData(labelRoom);

                        let countRooms = roomData.activeRoom;
                        let allowed = roomData.allowed;
                        let classes = roomData.classes;

                        // Permissão de visualização do conteúdo em broadcast
                        if (roomData.curso !== undefined && roomData.curso !== '') {
                            classes.forEach((cls) => {
                                if (roomData.curso.indexOf(cls) > -1) allowed = true;
                            });
                        }
                        if (allowed) {
                            countRooms++;
                            // Cria elemento div para exibição de salas disponíveis em bloco
                            /*
                             *	var card    elem. html
                             *  var divOpen elem. html
                             *  var button  elem. html
                             */
                            structure.usuario = roomInfo.currentUser.value;
                            let divOpen = addTag('div');
                            let card = RoomHelper.constructAccessList(roomData.classe, roomData.assunto, roomData.apresentador, structure.viewers, moderatorId);

                            divOpen.innerHTML = card;
                            divOpen.className = "card-panel hoverable";
                            let button = addTag('a');
                            button.id = moderatorId;
                            button.title = 'Entrar';
                            button.className = 'btn-floating room-enter blue darken-1';
                            button.innerHTML = '<i class="material-icons large">play_arrow</i>';

                            button.onclick = function() {
                                callTeacherStream();
                                setRoomLabel('television', roomData.classe, roomData.assunto);

                                structure.onlobby = false;
                                structure.isModerator = false;
                                roomInfo.broadcaster.value = roomData.whois;

                                let getRoomId = this.id;
                                structure.connectedAt = this.id;

                                connection.session = {
                                    audio: false,
                                    video: false
                                };
                                // Inicializa socket
                                let socket = connection.getSocket();
                                socket.emit('join-broadcast', {
                                    broadcastId: getRoomId,
                                    userid: connection.userid,
                                    typeOfStreams: connection.session
                                });
                            };
                            //Append de elementos html
                            publicRoomsDiv.appendChild(divOpen);
                            let divClose = document.getElementById('_' + moderatorId);
                            divClose.appendChild(button);
                        }
                        if (countRooms == 0) RoomHelper.noRooms();
                    });
                } else {
                    RoomHelper.noRooms();
                }
            });
        } else {
            // Tratamento de conexões de espectadores
            let htmlList = '';
            let allParticipants = connection.getAllParticipants();
            let numberOfUsers = allParticipants.length;
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
            if (numberOfUsers > 0) {
                if (contaUsuarios.getAttribute('data-target') == 0) {
                    connectList.innerHTML = htmlList;
                    changeCounter(numberOfUsers);
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
                        alerta.update(conf.message.DISCONNECT_USER, this.name);
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
    textMessage.onkeyup = function(e) {
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
        var texto = textMessage.value
        texto = texto.replace(/^\s+|\s+$/g, '');
        if (!texto.length) return;
        texto = "<b class='small'>" + structure.usuario + "</b>:<br>" + texto;
        texto = btoa(texto);
        connection.send(texto);
        appendDIV(texto);
        textMessage.value = '';
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

        console.log(chkrash[3], atob(chkrash[0]));

        var msgData = [];
        var myRoom = tag('#room-id').value;
        // Identifica se a mensagem é uma solicitação de serviço
        if (chkrash[0] === btoa('@PedeAVez')) {
            // Indica que algum usuário solicita a permissão para falar
            msgData[0] = chkrash[1];
            msgData[1] = (atob(chkrash[3])).split('|')[4];
            msgData[2] = chkrash[4];
            listBox(msgData);
            return;
        } else if (chkrash[0] === btoa('@PedeAVez:allow')) {
            // Indica que o broadcaster atendeu à solicitação do usuário
            // Verifica se o destinatário é o criador da solicitação para entregar a resposta
            if (chkrash[2] === myRoom) {
                //solicita--;
                structure.solicita -= 1;
                setPedir('allow');
                structure.lockSolicitation = true;
            }
            return;
        } else if (chkrash[0] === btoa('@PedeAVez:deny')) {
            // Indica que o broadcaster negou a solicitação do usuário
            // Verifica se o destinatário é o criador da solicitação para entregar a resposta
            if (chkrash[2] === myRoom) {
                //solicita--;
                structure.solicita -= 1;
                setPedir('deny');
                structure.lockSolicitation = false;
            }
            return;
        } else if (chkrash[0] === btoa('@Finaliza-Share')) {
            //var swapSecond = tag('#swap-video');
            var position = media.videoSecond.getAttribute('data-position');
            if (position == 'main') {
                media.swapSecond.click();
            }
            setTimeout(function() {
                $('#span-video-preview-2nd').hide();
                alerta.update(conf.message.STOP_SHARE);
            }, 1000);
        } else if (chkrash[0] === btoa('@Finaliza-Participacao')) {
            if (!structure.onParticipation) {
                structure.onParticipation = true;
                accessBtn.setAttribute('data-active', 'enabled');
                alerta.update(conf.message.CANCEL_SOLICITATION);
            }
            accessBtn.click();
        } else if (chkrash[0] === btoa('@Finaliza-Participante')) {
            $('#div-end').hide();
        } else {
            return;
        }
    } else {
        // Tratamento de mensagens comuns (fora do padrão de solicitação)
        RoomHelper.writeMessage(text, remoto);
    }
}
// Lista todas as solicitações de "Pedir a vez" e incrementa contador
/**
 * Param text: Array contando o nome so solicitante, o Id da conexão da sala e o Id da conexão do solicitante
 */
function listBox(text) {
    let msg = text;
    let receiver = tag('#room-id');
    let solList = tag('#solicita-list');
    let htmlList;
    // Verifica se o destinatário é o broadcaster para entregar a solicitação
    if (msg[1] === receiver.value) {
        //solicita++;
        structure.solicita += 1;
        trataSolicitacao(structure.solicita);
        if (structure.solicita === 1) { solList.innerHTML = '' };
        htmlList = constructSolicitationList(msg[2], msg[0]);
        solList.innerHTML += htmlList;
        alerta.update(conf.message.NEW_SOLICITATION, msg[0]);
    }
    return;
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

    console.log(userid, roomInfo.inRoom.value);
    if (userid === roomInfo.inRoom.value) {
        alerta.update(conf.message.ALERT_DISCONNECTION);
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
        changeCounter(Object.keys(structure.connections).length);
    }
}
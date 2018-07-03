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

// Instâncias
let bindConnectController = new ConnectController();
let bindConnect = bindConnectController.initiateConnection();

let bindMediaController = new MediaController();
let bindMedia = bindMediaController.initiateMedia();

let bindDocumentController = new DocumentController();
let bindDocument = bindDocumentController.initiateDocument();

let createRoom = new RoomController();
let viewerData = new ViewerController();
let connection = new RTCMultiConnection();

$(document).ready(function() {

    window.enableAdapter = true;

    //Application - Inicia a chamada e tratamento de multiconexão
    // Definições de conexão
    connection.enableScalableBroadcast = bindConnect.enableScalableBroadcast;
    connection.maxRelayLimitPerUser = bindConnect.maxRelayLimitPerUser;
    connection.socketMessageEvent = bindConnect.socketMessageEvent;
    connection.socketURL = bindConnect.urlSocket;

    // Listeners de tratamento de tamanho de tela do video (Detecta Fullscreen OFF)
    ComponentSalaHelper.initListeners();

    // Room Form
    let currentRoomId = bindDocumentController.getTag('#room-id');
    let broadcaster = bindDocumentController.getTag('#broadcaster');
    let inRoom = bindDocumentController.getTag('#in-room');
    let inScreen = bindDocumentController.getTag('#in-screen');
    let currentUser = bindDocumentController.getTag('#current-user');
    let myClass = bindDocumentController.getTag('#target');

    // Dom actions
    let startRoom = bindDocumentController.getTag('#btn-join-as-productor');
    let textMessage = bindDocumentController.getTag('#text-message');
    let contaUsuarios = bindDocumentController.getTag('#users-counter');
    let publicRoomsDiv = bindDocumentController.getTag('#public-conference');
    let connectList = bindDocumentController.getTag('#connected-users-list');

    connection.connectSocket((socket) => {
        // Socket - Join
        socket.on('join-broadcaster', (hintsToJoinBroadcast) => {
            console.log('--> join-broadcaster', hintsToJoinBroadcast);
            bindDocument.broadcastStatus = 1;
            connection.session = hintsToJoinBroadcast.typeOfStreams;
            connection.sdpConstraints.mandatory = {
                OfferToReceiveVideo: false,
                OfferToReceiveAudio: false
            };
            console.log(currentRoomId.value);
            connection.extra.modifiedValue = currentRoomId.value + '-' + currentUser.value;
            connection.updateExtraData();
            connection.broadcastId = hintsToJoinBroadcast.broadcastId;
            connection.join(hintsToJoinBroadcast.userid);
            console.log('--> Joined at: ' + hintsToJoinBroadcast.userid);
            callToast('<i class="fa fa-play-circle fa-lg"></i> Transmissão iniciada!', 'blue');
        });
        // Socket - Rejoin
        socket.on('rejoin-broadcast', (getBroadcasterId) => {
            console.log('--> rejoin-broadcast', getBroadcasterId);
            bindDocument.broadcastStatus = 1;
            connection.attachStreams = [];
            connection.extra.modifiedValue = currentRoomId.value + '-' + currentUser.value;
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
            bindDocument.broadcastStatus = 0;
            callToast('<i class="fa fa-stop-circle fa-lg"></i> Transmissão finalizada!', 'red darken-3');
        });
        // Socket - Iniciando
        socket.on('start-broadcasting', (typeOfStreams) => {
            console.log('--> Iniciando broadcasting', typeOfStreams);
            bindDocument.broadcastStatus = 1;
            connection.sdpConstraints.mandatory = {
                OfferToReceiveVideo: false,
                OfferToReceiveAudio: false
            };
            connection.session = typeOfStreams;
            connection.open(connection.userid, bindConnect.isPublicModerator);
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
                var elem = bindDocumentController.getTag('#msg-share');
                var instance = M.Modal.getInstance(elem);
                instance.open();
            } else if (error === 'permission-denied') {
                setShare('on');
            }
            throw error;
        });
    };
    // Inicia a transmissão
    connection.onstream = (event) => {

        let currentStream;
        if (!bindDocument.onParticipation) {
            inRoom.value = event.userid;
        }
        /**==================================================================================================
         * Tratamento de conexões REMOTAS e LOCAIS
         * -> Identificação de compartilhamentos de tela e ingressos em transmissões
         */
        // Broadcaster recebendo uma conexão remota==========================================================
        if (event.type === 'remote' && connection.isInitiator) {

            console.log('PARTICIPAÇÃO REMOTA--------');

            // Remove qualquer conexão duplicada
            if (bindDocument.incomingCon == event.stream.streamid) {
                connection.getAllParticipants().forEach((p) => {
                    console.log('Transmitindo: ', event.stream.streamid, p, bindDocument.incomingCon);
                    if (p + '' == event.userid + '') {
                        var peer = connection.peers[p].peer;
                        stream.stop();
                        peer.removeStream(event.stream);
                    }
                });
                return;
            }
            // Conexão remota de transmissão com o broadcaster
            if (bindDocument.arrVideos['main']) {
                bindDocument.incomingCon = event.stream.streamid;
                bindMedia.thirdVideoPreview.srcObject = event.stream;
                bindDocument.arrVideos['user'] = event.stream;

                bindMediaController.initiateVideo(bindMedia.thirdVideoPreview);

                callToast('<i class="material-icons">videocam</i> Participação iniciada!', 'blue darken-2');
                $('#span-video-preview-3rd').fadeIn(300);

                setTimeout(function() {
                    connection.getAllParticipants().forEach((p) => {
                        if (p + '' != event.userid + '') {
                            var peer = connection.peers[p].peer;
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
                    bindDocument.streamVideos = event.stream;
                    ComponentSalaHelper.toggleIncomingVideos('in');
                }, 500);

                $('#div-end').fadeIn(300);
                bindMedia.endSessionAccess.onclick = function() {
                    bindDocument.streamVideos.forEach((stream) => {
                        connection.getAllParticipants().forEach((p) => {
                            var peer = connection.peers[p].peer;
                            stream.stop();
                            peer.removeStream(stream);
                        });
                    });
                    $('#div-end').hide();
                    ComponentSalaHelper.toggleIncomingVideos('out');
                    var msgrash = [];
                    msgrash[0] = btoa('@Finaliza-Participacao');
                    msgrash[1] = currentUser.value;
                    msgrash[2] = connection.userid;
                    msgrash[3] = inRoom.value;
                    msgrash[4] = event.userid;
                    connection.send(msgrash, event.userid);
                    bindDocument.lockSolicitation = false;
                }

            }
            // Usuário recebendo uma conexão remota com compartilhamento de tela=============================
        } else if (!bindDocument.onParticipation && (event.type === 'remote' && event.stream.isScreen === true)) {

            console.log('REMOTO COM SCREEN --> ', event.stream.streamid);

            if (bindDocument.incomingCon == event.stream.streamid && bindDocument.incomingCon != bindDocument.connectedAt) {
                connection.getAllParticipants().forEach((p) => {
                    if (p + '' == event.userid + '') {
                        var peer = connection.peers[p].peer;
                        //event.stream.stop();
                        //peer.removeStream(event.stream);
                    }
                });
                //return;
            }

            // Conexão remota com compartilhamento de tela
            $('#span-video-preview-2nd').fadeIn(300);
            ComponentSalaHelper.toggleIncomingVideos('in');
            bindMedia.secondVideoPreview.srcObject = event.stream;
            bindDocument.arrVideos['screen'] = event.stream;
            bindDocument.incomingCon = event.stream.streamid;

            bindMediaController.initiateVideo(bindMedia.secondVideoPreview);

            // Tratamento de telas: Botão "Swap" -> Toggle Main/Second Video
            bindMedia.swapSecond.onclick = function() {
                bindMediaController.controlSwapVideo();
            }

            // Usuário recebendo uma conexão remota sem compartilhamento de tela=============================
        } else if (!bindDocument.onParticipation && (event.type === 'remote' && !event.stream.isScreen)) {

            console.log('REMOTO SEM SCREEN --> ' + event.stream.streamid);

            if (bindDocument.incomingCon == event.stream.streamid) {
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
            if (bindDocument.arrVideos['main']) {
                $('#span-video-preview-3rd').fadeIn(300);
                bindDocument.incomingCon = event.stream.streamid;
                bindMedia.thirdVideoPreview.srcObject = event.stream;
                bindDocument.arrVideos['user'] = event.stream;

                bindMediaController.initiateVideo(bindMedia.thirdVideoPreview);

                ComponentSalaHelper.toggleIncomingVideos('in');
            } else {
                bindDocument.incomingCon = event.stream.streamid;
                bindDocument.onParticipation = false;
                bindMedia.videoPreview.srcObject = event.stream;
                bindDocument.arrVideos['main'] = event.stream;
                currentStream = [event.stream];

                bindMediaController.initiateVideo(bindMedia.videoPreview);
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
            bindMedia.vol.onclick = function() {
                bindMediaController.controlVolume(currentStream);
            };

            let numberOfUsers = connection.getAllParticipants().length;
            changeCounter(numberOfUsers);

            // Tratamento do botão de pedir a vez
            bindMedia.solPedir.onclick = function() {
                if (bindDocument.broadcastStatus == 1 && (bindDocument.solicita === 0 && !bindDocument.lockSolicitation)) {
                    // Constroi e envia mensagem solicitando a vez
                    var msgrash = [];
                    var myIdentity = currentRoomId.value;
                    msgrash[0] = btoa('@PedeAVez');
                    msgrash[1] = currentUser.value;
                    msgrash[2] = connection.userid;
                    msgrash[3] = inRoom.value;
                    msgrash[4] = myIdentity;
                    try {
                        connection.send(msgrash, inRoom.value);
                        bindDocument.solicita += 1;
                        callToast('<i class="fa fa-check"></i> Solicitação enviada!', 'blue darken-2');
                    } catch (err) {
                        callToast('<i class="fa fa-times"></i> Não foi possível solicitar a vez: ' + err + '.', 'red darken-3');
                    }
                } else if (bindDocument.solicita > 0) {
                    callToast('<i class="fa fa-exclamation-triangle"></i> Você já encaminhou uma solicitação.<br>Aguarde a resposta.', 'amber darken-4');
                } else if (bindDocument.lockSolicitation) {
                    callToast('<i class="fa fa-exclamation-triangle"></i> Sua solicitação já foi aceita.<br>Acesse clicando no botão ao lado.', 'amber darken-4');
                } else {
                    callToast('<i class="fa fa-times"></i> Não há conexão com a sala!', 'red darken-3');
                }
            };

            // Broadcaster executando uma conexão local =====================================================
        } else if (!bindDocument.onParticipation && (event.type === 'local' && !event.stream.isScreen)) {

            console.log('TRANSMISSÃO LOCAL------');

            if (bindDocument.incomingCon == event.stream.streamid) {
                connection.getAllParticipants().forEach((p) => {
                    if (p + '' == event.userid + '') {
                        var peer = connection.peers[p].peer;
                        stream.stop();
                        peer.removeStream(event.stream);
                    }
                });
                return;
            }
            // Conexão local sem compartilhamento de tela
            bindDocument.onParticipation = true;
            connection.isUpperUserLeft = false;
            bindDocument.arrVideos['main'] = event.stream;
            bindDocument.incomingCon = event.stream.streamid;
            currentStream = [event.stream];

            bindMedia.videoPreview.srcObject = event.stream;
            bindMedia.videoPreview.userid = event.userid;
            bindMedia.videoPreview.muted = true;

            bindMediaController.initiateVideo(bindMedia.videoPreview);

            // Trata contador de solicitações
            $('#div-connect').hide();
            $('#li-pedir-vez').hide();
            if (bindDocument.solicita <= 0) {
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
            bindMedia.mute.onclick = function() {
                bindMediaController.controlMute(currentStream);
            };
            // Tratamento de áudio e video: Botão "Camera" -> Toggle on/off
            bindMedia.cam.onclick = function() {
                bindMediaController.controlCam(currentStream);
            }

            // Tratamento de solicitações: Botão "Solicitações" -> Abra listagem de solicitações e respostas
            bindMedia.ctlPedir.onclick = function() {
                // Tratamento de respostas (permitir / negar)
                let response = document.getElementsByClassName('responses');
                for (var j = 0; j < response.length; j++) {
                    response[j].onclick = function() {
                        var admResponse = this.id.split('_');
                        var msgrash = [];
                        var myIdentity = currentRoomId.value;
                        msgrash[0] = btoa('@PedeAVez:' + admResponse[0]);
                        msgrash[1] = currentUser.value;
                        msgrash[2] = admResponse[1];
                        msgrash[3] = inRoom.value;
                        msgrash[4] = myIdentity;
                        if (admResponse[0] == 'allow' && bindDocument.lockSolicitation) {
                            callToast('<i class="fa fa-times"></i> Já existe uma solicitação aceita!<br>Finalize-a para aceitar outra.', 'red darken-3');
                        } else {
                            //solicita--;
                            bindDocument.solicita -= 1;
                            connection.send(msgrash);
                            constructList(admResponse[1]);
                            trataSolicitacao(bindDocument.solicita);
                            if (admResponse[0] == 'allow') {
                                bindDocument.lockSolicitation = true
                                bindMedia.divEndBtn.setAttribute('data-target', admResponse[1]);
                                $('#div-end').fadeIn(300);
                            }

                        }
                    }
                }
                bindMedia.endSessionAccess.onclick = function() {
                    $('#div-end').hide();
                    var targetId = bindMedia.divEndBtn.getAttribute('data-target');
                    var msgrash = [];
                    msgrash[0] = btoa('@Finaliza-Participacao');
                    msgrash[1] = currentUser.value;
                    msgrash[2] = connection.userid;
                    msgrash[3] = inRoom.value;
                    msgrash[4] = targetId;
                    connection.send(msgrash, targetId);
                    bindDocument.lockSolicitation = false;
                }
            };
            // Tratamento de solicitações: Botão "Compartilhar" -> Compartilha a tela do apresentador: Toggle On/Off
            bindMedia.share.onclick = function() {
                if (bindMedia.share.getAttribute('data-active') == 'enabled') {
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
                            inScreen.value = stream.streamid;
                        }
                    });
                } else {
                    $('#screen-share-alert').slideUp(300);
                    setShare('on');
                    var streamConnection = inScreen.value;
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
                    var myIdentity = currentRoomId.value;
                    msgrash[0] = btoa('@Finaliza-Share');
                    msgrash[1] = currentUser.value;
                    msgrash[2] = streamConnection;
                    msgrash[3] = inRoom.value;
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
        bindMedia.screen.onclick = function() { fullscreen(); };
        bindMedia.exitscreen.onclick = function() { fullscreen(); };
        // Tratamento das funções MUTE e UNMUTE
        connection.onmute = (event) => {
            event.mediaElement.setAttribute('poster', '/img/bg.jpg');
        };
        connection.onunmute = (event) => {
            event.mediaElement.removeAttribute('poster');
        };
        // Tratamento da função de chat da barra de controle de mídia
        bindMedia.toggleChat.onclick = function() {
            textMessage.focus();
        };
        // Tratamento de ingresso na transmissão: Botão "Ingressar" -> Ingressa e participa da apresentação
        // ->Toggle On/Off
        bindMedia.sessionAccess.onclick = function() {
            if (bindMedia.sessionAccess.getAttribute('data-active') == 'disabled' && !bindDocument.onParticipation) {
                setParticipation('off');
                bindDocument.onParticipation = true;
                setTimeout(function() {
                    try {
                        connection.peers[inRoom.value].addStream({
                            video: true
                        });
                        callToast('<i class="material-icons left">videocam</i> Transmissão Iniciada.', 'blue darken-2');
                    } catch (e) {
                        setParticipation('on');
                        bindDocument.onParticipation = false;
                    }
                }, 500);
            } else if (bindMedia.sessionAccess.getAttribute('data-active') == 'enabled' && bindDocument.onParticipation) {
                setParticipation('dis');
                bindDocument.onParticipation = false;
                try {
                    connection.attachStreams.forEach((stream) => {
                        connection.getAllParticipants().forEach((p) => {
                            var peer = connection.peers[p].peer;
                            stream.stop();
                            peer.removeStream(stream);
                        });
                    });
                    var msgrash = [];
                    var myIdentity = currentRoomId.value;
                    msgrash[0] = btoa('@Finaliza-Participante');
                    msgrash[1] = currentUser.value;
                    msgrash[2] = connection.userid;
                    msgrash[3] = inRoom.value;
                    msgrash[4] = myIdentity;
                    connection.send(msgrash, inRoom.value);
                    bindDocument.lockSolicitation = false;
                    callToast('<i class="material-icons left">videocam_off</i> Transmissão finalizada.', 'red darken-3');
                } catch (e) {
                    setParticipation('off');
                    bindDocument.onParticipation = true;
                }
            }
        };
        let fullsize = bindDocumentController.getTag('#toggle-size');
        fullsize.onclick = function() {
            toggleFullsize();
        };
    };
    //=======================================================================================================
    // Listener para abertura de conexões
    connection.onopen = (event) => {
        console.log(event);
        if (event.userid != bindDocument.connectedAt) {
            connection.getAllParticipants().forEach((p) => {
                //connection.disconnectWith(event.userid);
            });
        }
    };
    // Listener para finalização de streams
    connection.onstreamended = (event) => {
        if (event.stream.isScreen) {
            $('#span-video-preview-2nd').hide();
            ComponentSalaHelper.toggleIncomingVideos('out');
        } else {
            $('#span-video-preview-3rd').hide();
            bindDocument.lockSolicitation = false;
            ComponentSalaHelper.toggleIncomingVideos('out');
        }
    };
    // Listener para fim de conexões
    connection.onleave = (event) => {
        console.log('DEIXANDO CONEXÃO...', event);
    };

    // Ação de criar uma sala ao clicar em 'btn-join-as-productor' ==========================================
    startRoom.onclick = function() {

        let newRoom = createRoom.initiateRoom();

        let values = $('#cursos-list').val();
        let strValues = values.join(';');

        if (createRoom.validade()) {
            bindDocument.usuario = newRoom.name;
            bindDocument.onlobby = false;
            // Inicializa a tela de apresentação
            callTeacherStream();
            // Modela e apresenta cabeçalho do video
            setRoomLabel('video-camera', newRoom.tema, newRoom.assunto);

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
            socket.emit('check-broadcast-presence', newRoom.hash, (isBroadcastExists) => {
                if (!isBroadcastExists) {
                    connection.userid = newRoom.hash;
                }
                //start-broadcasting
                socket.emit('join-broadcast', {
                    broadcastId: newRoom.hash,
                    userid: connection.userid,
                    typeOfStreams: connection.session
                        //bandwidth: connection.bandwidth
                });
            });
        } else {
            callToast('<i class="fa fa-exclamation-triangle fa-lg"></i> Por favor informe todos os campos indicados!', 'red darken-3');
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

    currentRoomId.onkeyup = function() {
        localStorage.setItem(connection.socketMessageEvent, this.value);
    };
    let hashString = location.hash.replace('#', '');
    if (hashString.length && hashString.indexOf('comment-') == 0) {
        hashString = '';
    }

    if (broadcastId && broadcastId.length) {
        currentRoomId.value = broadcastId;
        localStorage.setItem(connection.socketMessageEvent, broadcastId);
        // Efetua o join automático na sala em caso de desconexão do espectador
        // ->Verificação a cada 5 segundos
        (function reCheckRoomPresence() {
            connection.checkPresence(broadcastId, (isRoomExists) => {
                if (isRoomExists) {
                    bindDocumentController.getTag('#' + broadcastId).onclick();
                    return;
                }
                setTimeout(reCheckRoomPresence, 5000);
            });
        })();
    }
    // Verifica quantas conexões estão ativas nesse broadcast
    connection.onNumberOfBroadcastViewersUpdated = (event) => {
        if (!connection.isInitiator) return;
        bindDocument.viewers = event.numberOfBroadcastViewers;
        changeCounter(bindDocument.viewers);
    };
    // Verifica listagem de de salas públicas que se enquadrem no perfil do usuário
    // ->A cada 3 segundos
    (function looper() {
        // Se ainda estiver no lobby das salas
        if (bindDocument.onlobby) {
            //Verifica a existência de uma sala pública
            connection.getPublicModerators((array) => {
                publicRoomsDiv.innerHTML = '';
                // Se existir alguma sala pública execute
                if (array.length > 0) {
                    array.forEach((moderator) => {
                        let moderatorId = moderator.userid;

                        connection.getNumberOfBroadcastViewers(moderatorId, (numberOfBroadcastViewers) => {
                            bindDocument.viewers = numberOfBroadcastViewers;
                        });

                        if (moderatorId == connection.userid) return;

                        // Verifica se a sala criada atende às especificações do sistema
                        let labelRoom = moderatorId;
                        try {
                            labelRoom = atob(labelRoom);
                            // PALEATIVO - ARRUMAR!
                            if (labelRoom.length < 10) return;
                        } catch (exp) {
                            if (array.length < 2) ComponentSalaHelper.noRooms();
                            return;
                        }

                        let newViewer = viewerData.initiateViewer(labelRoom);

                        let countRooms = newViewer.activeRoom;
                        let allowed = newViewer.allowed;
                        let classes = newViewer.classes;

                        // Permissão de visualização do conteúdo em broadcast
                        if (newViewer.curso !== undefined && newViewer.curso !== '') {
                            classes.forEach((cls) => {
                                if (newViewer.curso.indexOf(cls) > -1) allowed = true;
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
                            bindDocument.usuario = currentUser.value;
                            let divOpen = bindDocumentController.createTag('div');
                            let card = ComponentSalaHelper.constructAccessList(newViewer.classe, newViewer.assunto, newViewer.apresentador, bindDocument.viewers, moderatorId);

                            divOpen.innerHTML = card;
                            divOpen.className = "card-panel hoverable";
                            let button = bindDocumentController.createTag('a');
                            button.id = moderatorId;
                            button.title = 'Entrar';
                            button.className = 'btn-floating room-enter blue darken-1';
                            button.innerHTML = '<i class="material-icons large">play_arrow</i>';

                            button.onclick = function() {
                                callTeacherStream();
                                setRoomLabel('television', newViewer.classe, newViewer.assunto);

                                bindDocument.onlobby = false;
                                bindDocument.isModerator = false;
                                broadcaster.value = newViewer.whois;

                                let getRoomId = this.id;
                                bindDocument.connectedAt = this.id;

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
                        if (countRooms == 0) ComponentSalaHelper.noRooms();
                    });
                } else {
                    ComponentSalaHelper.noRooms();
                }
            });
        } else {
            // Tratamento de conexões de espectadores
            let htmlList = '';
            let allParticipants = connection.getAllParticipants();
            let numberOfUsers = allParticipants.length;
            allParticipants.forEach((participantId) => {
                let myId = currentRoomId.value;
                let user = connection.peers[participantId];
                let userextra = user.extra;
                if (userextra.modifiedValue) {
                    htmlList += constructConnectionList(userextra.modifiedValue, userextra.modifiedValue.split('-')[1], user.userid, true);
                } else {
                    if (!bindDocument.isModerator) {
                        htmlList += constructConnectionList(myId, currentUser.value + ' (você)', connection.userid, false);
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
                let btnDisconnect = bindDocumentController.getAllTags('.disconnect-btn');
                for (var j = 0; j < btnDisconnect.length; j++) {
                    btnDisconnect[j].onclick = function() {
                        disconnectId = this.getAttribute('data-announced');
                        connection.send({
                            userRemoved: true,
                            removedUserId: disconnectId
                        });
                        callToast('<i class="fa fa-times"></i> ' + this.name + ' foi desconectado!', 'red darken-4');
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
        var texto = "<b class='small'>" + bindDocument.usuario + "</b>:<br>" + this.value;
        texto = btoa(texto);
        connection.send(texto);
        appendDIV(texto);
        this.value = '';
    };
    /**
     *  var texto String
     */
    bindDocumentController.getTag('#send-message-btn').onclick = function() {
        var texto = textMessage.value
        texto = texto.replace(/^\s+|\s+$/g, '');
        if (!texto.length) return;
        texto = "<b class='small'>" + bindDocument.usuario + "</b>:<br>" + texto;
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
    let chatContainer = bindDocumentController.getTag('#chat-panel');
    let accessBtn = bindDocumentController.getTag('#enter-session');
    var remoto = false;
    // Recebe mensagens de origem externa ou interna
    if (event.data) remoto = true;
    var text = event.data || event;
    // Verifica a origem da mensagem, se a menssagem é um array e se este array possui mais de 4 índices
    // -> Definição do padrão de solicitação
    if (remoto && (Array.isArray(text) && text.length > 4)) {
        var chkrash = event.data;
        var msgData = [];
        var myRoom = bindDocumentController.getTag('#room-id').value;
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
                bindDocument.solicita -= 1;
                setPedir('allow');
                bindDocument.lockSolicitation = true;
            }
            return;
        } else if (chkrash[0] === btoa('@PedeAVez:deny')) {
            // Indica que o broadcaster negou a solicitação do usuário
            // Verifica se o destinatário é o criador da solicitação para entregar a resposta
            if (chkrash[2] === myRoom) {
                //solicita--;
                bindDocument.solicita -= 1;
                setPedir('deny');
                bindDocument.lockSolicitation = false;
            }
            return;
        } else if (chkrash[0] === btoa('@Finaliza-Share')) {
            //var swapSecond = bindDocumentController.getTag('#swap-video');
            var position = bindMedia.videoSecond.getAttribute('data-position');
            if (position == 'main') {
                bindMedia.swapSecond.click();
            }
            setTimeout(function() {
                $('#span-video-preview-2nd').hide();
                callToast('<span class="white-text"><i class="material-icons left">stop_screen_share</i> Compartilhamento de tela finalizado.</span>', 'red darken-3');
            }, 1000);
        } else if (chkrash[0] === btoa('@Finaliza-Participacao')) {
            if (!bindDocument.onParticipation) {
                bindDocument.onParticipation = true;
                accessBtn.setAttribute('data-active', 'enabled');
                callToast('<i class="fa fa-times"></i> Solicitação cancelada.', 'red darken-3');
            }
            accessBtn.click();
        } else if (chkrash[0] === btoa('@Finaliza-Participante')) {
            $('#div-end').hide();
        } else {
            return;
        }
    } else {
        // Tratamento de mensagens comuns (fora do padrão de solicitação)
        ComponentSalaHelper.writeMessage(text, remoto);
    }
}
// Lista todas as solicitações de "Pedir a vez" e incrementa contador
/**
 * Param text: Array contando o nome so solicitante, o Id da conexão da sala e o Id da conexão do solicitante
 */
function listBox(text) {
    let msg = text;
    let receiver = bindDocumentController.getTag('#room-id');
    let solList = bindDocumentController.getTag('#solicita-list');
    let htmlList;
    // Verifica se o destinatário é o broadcaster para entregar a solicitação
    if (msg[1] === receiver.value) {
        //solicita++;
        bindDocument.solicita += 1;
        trataSolicitacao(bindDocument.solicita);
        if (bindDocument.solicita === 1) { solList.innerHTML = '' };
        htmlList = constructSolicitationList(msg[2], msg[0]);
        solList.innerHTML += htmlList;
        callToast('<i class="material-icons">pan_tool</i> ' + msg[0] + ' solicita a vez!', 'blue darken-2');
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
        var broadcaster = bindDocumentController.getTag('#in-room').value;
        for (var j = 0; j < Object.keys(bindDocument.connections).length; j++) {
            var roomaccount = bindDocument.connections[j].split('|')[0];
            var roomname = bindDocument.connections[j].split('|')[1];
            var roomanounce = bindDocument.connections[j].split('|')[2];
            htmlList += constructConnectionList(roomaccount, roomname, roomanounce, true);
        }
        bindDocumentController.getTag('#connection-list').innerHTML = htmlList;
    }, 1000);
}

// Emite alerta de desconexão.
/**
 * Param userid: String de dados de quem foi desconectado
 */
function alertDisconnection(userid) {
    var broadcaster = bindDocumentController.getTag('#in-room').value;
    if (userid === broadcaster) {
        callToast('<i class="fa fa-times"></i> Você foi desconectado!', 'red darken-3');
        setTimeout(location.reload.bind(location), 3000);
    } else {
        try {
            for (var j = 0; j < Object.keys(bindDocument.connections).length; j++) {
                if (bindDocument.connections[j].split('|')[2] == userid) {
                    bindDocument.connections.splice(j, 1);
                }
            }
        } catch (e) {
            return;
        }
        constructConnectionExpList(userid);
        changeCounter(Object.keys(bindDocument.connections).length);
    }
}
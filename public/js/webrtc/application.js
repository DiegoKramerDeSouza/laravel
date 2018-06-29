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

// Variáveis globais - Controle de solicitações, conexões e status
/**
 *  let solicita            integer:0       -> Conta a quantidade de solicitações de um usuário (max. 1)
 *  let broadcastStatus     integer:0       -> Indetifica o status da transmissão em broadcast (0 off, 1 on)
 *  let isModerator         Boolean:true    -> Identifica se a conexão permite moderador (Broadcaster)
 *  let onlobby             Boolean:true    -> Identifica se o usuário está no "Lobby" de salas
 *  let onParticipation     Boolean:false   -> Identifica se o usuário já está participando de uma transmissão
 *  let lockSolicitation    Boolean:false   -> Bloqueia aceitação de novas solicitações
 *  let connections         Array           -> Listasa de conexões ativas
 *  let arrVideos           Array           -> Lista de tipos de vídeo a partir de sua origem ('main', 'user' e 'screen')
 *  let streamVideos        Array           -> Lista de vídeos exibidos
 *  let incomingCon         String          -> Registra quem está efetuando a conexão no momento
 *  let connectedAt         String          -> Registra o ID do Broadcaster
 *  const urlSocket         String:SSL URL  -> URL para conexão com o serviço de sinalização
 */
let solicita = 0;
let broadcastStatus = 0;
let isModerator = true;
let onlobby = true;
let onParticipation = false;
let lockSolicitation = false;
let connections = [];
let arrVideos = [];
let streamVideos = [];
let incomingCon;
let connectedAt;

// Instancias
let bindConnect = new Connect();
let bindDocument = new Document();
let connection = new RTCMultiConnection();

const urlSocket = bindConnect.urlSocket;

$(document).ready(function() {

    //bindConnect.exibeConexao();
    window.enableAdapter = true;
    //Application - Inicia a chamada e tratamento de multiconexão
    /**
     *  inst    connection          RTCMultiConnection
     *  const   enableRecordings    Boolean:false
     *  const   isPublicModerator   Boolean:true
     */

    const enableRecordings = false;
    const isPublicModerator = true;

    // Definições de conexão
    connection.enableScalableBroadcast = bindConnect.enableScalableBroadcast;
    connection.maxRelayLimitPerUser = bindConnect.maxRelayLimitPerUser;
    connection.socketMessageEvent = bindConnect.socketMessageEvent;

    // Conexão com serviço de websocket
    connection.socketURL = urlSocket;

    // Listeners de tratamento de tamanho de tela do video (Detecta Fullscreen OFF)
    ComponentSalaHelper.initListeners();

    // Inicialização de variáveis de controle de elementos in-page
    /**
     *  var publicRoomsDiv      elem. html
     *  var inRoom              elem. html
     *  var videoPreview        elem. html
     *  var mute                elem. html
     *  var screen              elem. html
     *  var exitscreen          elem. html
     *  var vol                 elem. html
     *  var cam                 elem. html
     *  var pedir               elem. html
     *  var ctlPedir            elem. html
     *  var share               elem. html
     *  var videoFirst          elem. html
     *  var videoSecond         elem. html
     *  var swapFirst           elem. html
     *  var swapSecond          elem. html
     *  var broadcaster         elem. html
     *  var sessionAccess       elem. html
     *  var endSessionAccess    elem. html
     *  let currentRoomId       elem. html
     *  let startRoom           elem. html
     *  var currentUser         String
     *  var viewers             String
     *  var usuario             String
     *  var msgrash             String
     *  var myIdentity          String
     *  var width               integer
     */

    var publicRoomsDiv = bindDocument.getTag('#public-conference');
    var inRoom = bindDocument.getTag('#in-room');
    var videoPreview = bindDocument.getTag('#video-preview');
    var secondVideoPreview = bindDocument.getTag('#secondvideo-preview');
    var thirdVideoPreview = bindDocument.getTag('#thirdvideo-preview');
    var mute = bindDocument.getTag('#toggle-mute');
    var screen = bindDocument.getTag('#toggle-screen');
    var exitscreen = bindDocument.getTag('#exit-fullscreen');
    var vol = bindDocument.getTag('#toggle-volume');
    var cam = bindDocument.getTag('#toggle-camera');
    var pedir = bindDocument.getTag('#pedir-vez');
    var ctlPedir = bindDocument.getTag('#control-pedir-vez');
    var share = bindDocument.getTag('#share-screen');
    var videoFirst = bindDocument.getTag('#span-video-preview');
    var videoSecond = bindDocument.getTag('#span-video-preview-2nd');
    var videoThird = bindDocument.getTag('#span-video-preview-3rd');
    var swapSecond = bindDocument.getTag('#swap-video');
    var broadcaster = bindDocument.getTag('#broadcaster');
    var sessionAccess = bindDocument.getTag('#enter-session');
    var endSessionAccess = bindDocument.getTag('#end-session');
    let currentRoomId = bindDocument.getTag('#room-id');
    let startRoom = bindDocument.getTag('#btn-join-as-productor');
    let myClass = bindDocument.getTag('#target');
    var currentUser = bindDocument.getTag('#current-user').value;
    var viewers = 'Calculando...';
    var usuario = '';
    var width;

    // Tratamento de conexões Socket
    connection.connectSocket((socket) => {
        // Socket - Join
        socket.on('join-broadcaster', (hintsToJoinBroadcast) => {
            console.log('--> join-broadcaster', hintsToJoinBroadcast);
            broadcastStatus = 1;
            connection.session = hintsToJoinBroadcast.typeOfStreams;
            connection.sdpConstraints.mandatory = {
                OfferToReceiveVideo: false,
                OfferToReceiveAudio: false
            };
            connection.extra.modifiedValue = currentRoomId.value;
            connection.updateExtraData();
            connection.broadcastId = hintsToJoinBroadcast.broadcastId;
            connection.join(hintsToJoinBroadcast.userid);
            console.log('--> Joined at: ' + hintsToJoinBroadcast.userid);
            callToast('<i class="fa fa-play-circle fa-lg"></i> Transmissão iniciada!', 'blue');
        });
        // Socket - Rejoin
        socket.on('rejoin-broadcast', (getBroadcasterId) => {
            console.log('--> rejoin-broadcast', getBroadcasterId);
            broadcastStatus = 1;
            connection.attachStreams = [];
            connection.extra.modifiedValue = currentRoomId.value;
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
            broadcastStatus = 0;
            callToast('<i class="fa fa-stop-circle fa-lg"></i> Transmissão finalizada!', 'red darken-3');
        });
        // Socket - Iniciando
        socket.on('start-broadcasting', (typeOfStreams) => {
            console.log('--> Iniciando broadcasting', typeOfStreams);
            broadcastStatus = 1;
            connection.sdpConstraints.mandatory = {
                OfferToReceiveVideo: false,
                OfferToReceiveAudio: false
            };
            connection.session = typeOfStreams;
            connection.open(connection.userid, isPublicModerator);
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
                var elem = document.getElementById('msg-share');
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
        if (!onParticipation) {
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
            if (incomingCon == event.stream.streamid) {
                connection.getAllParticipants().forEach((p) => {
                    console.log('Transmitindo: ', event.stream.streamid, p, incomingCon);
                    if (p + '' == event.userid + '') {
                        var peer = connection.peers[p].peer;
                        stream.stop();
                        peer.removeStream(event.stream);
                    }
                });
                return;
            }
            // Conexão remota de transmissão com o broadcaster
            if (arrVideos['main']) {
                incomingCon = event.stream.streamid;
                thirdVideoPreview.srcObject = event.stream;
                arrVideos['user'] = event.stream;
                var playPromise = thirdVideoPreview.play();
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                            thirdVideoPreview.play();
                        })
                        .catch(error => {
                            console.log('Carregando vídeo 3...');
                        });
                }
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
                    streamVideos.push(event.stream);
                    ComponentSalaHelper.toggleIncomingVideos('in');
                }, 500);
                $('#div-end').fadeIn(300);
                endSessionAccess.onclick = function() {
                    streamVideos.forEach((stream) => {
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
                    msgrash[1] = currentUser;
                    msgrash[2] = connection.userid;
                    msgrash[3] = inRoom.value;
                    msgrash[4] = event.userid;
                    connection.send(msgrash, event.userid);
                    lockSolicitation = false;
                }

            }
            // Usuário recebendo uma conexão remota com compartilhamento de tela=============================
        } else if (!onParticipation && (event.type === 'remote' && event.stream.isScreen === true)) {
            console.log('REMOTO COM SCREEN --> ', event.stream.streamid);
            if (incomingCon == event.stream.streamid && incomingCon != connectedAt) {
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
            secondVideoPreview.srcObject = event.stream;
            arrVideos['screen'] = event.stream;
            incomingCon = event.stream.streamid

            var playPromise = secondVideoPreview.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                        secondVideoPreview.play();
                    })
                    .catch(error => {
                        console.log('Carregando vídeo 2...');
                    });
            }
            // Tratamento de telas: Botão "Swap" -> Toggle Main/Second Video
            swapSecond.onclick = function() {
                var mvideoSrc;
                var svideoSrc;
                var position = videoSecond.getAttribute('data-position');
                if (position == 'second') {
                    videoSecond.setAttribute('data-position', 'main');
                    videoPreview.classList.add('width-limit');
                } else {
                    videoSecond.setAttribute('data-position', 'second');
                    videoPreview.classList.remove('width-limit');
                }
                // Inversão de src de vídeos
                mvideoSrc = videoPreview.srcObject;
                svideoSrc = secondVideoPreview.srcObject;
                videoPreview.pause();
                secondVideoPreview.pause();
                videoPreview.srcObject = svideoSrc;
                secondVideoPreview.srcObject = mvideoSrc;
                setTimeout(function() {
                    var playSecReady = secondVideoPreview.play();
                    var playReady = videoPreview.play();
                    if (playSecReady !== undefined && playReady !== undefined) {
                        playSecReady.then(_ => {
                                secondVideoPreview.play();
                            })
                            .catch(error => {
                                console.log('Carregando vídeo 2...');
                            });
                        playReady.then(_ => {
                                videoPreview.play();
                            })
                            .catch(error => {
                                console.log('Carregando vídeo 1...');
                            });
                    }
                }, 500);
            };
            // Usuário recebendo uma conexão remota sem compartilhamento de tela=============================
        } else if (!onParticipation && (event.type === 'remote' && !event.stream.isScreen)) {
            console.log('REMOTO SEM SCREEN --> ' + event.stream.streamid);
            if (incomingCon == event.stream.streamid) {
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
            if (arrVideos['main']) {
                $('#span-video-preview-3rd').fadeIn(300);
                incomingCon = event.stream.streamid;
                thirdVideoPreview.srcObject = event.stream;
                arrVideos['user'] = event.stream;
                var playPromise = thirdVideoPreview.play();
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                            thirdVideoPreview.play();
                        })
                        .catch(error => {
                            console.log('Carregando vídeo 3...');
                        });
                }
                ComponentSalaHelper.toggleIncomingVideos('in');
            } else {
                incomingCon = event.stream.streamid;
                onParticipation = false;
                videoPreview.srcObject = event.stream;
                arrVideos['main'] = event.stream;
                try {
                    videoPreview.play();
                } catch (e) {
                    var playPromise = videoPreview.play();
                    if (playPromise !== undefined) {
                        playPromise.then(_ => {
                                videoPreview.play();
                            })
                            .catch(error => {
                                console.log('Carregando vídeo 1...');
                            });
                    }
                }

            }
            // Ajusta elementos de exibição (define o menu de áudio e video para espectadores)
            $('#div-connect').hide();
            ctlPedir.innerHTML = constructBtnActionPedir();
            //$('#pedir-vez').tooltip();
            pedir = document.getElementById('pedir-vez');
            // Desabilita botão de ação para microfone
            setCam('dis');
            // Desabilita botão de ação para camera
            setMute('dis');
            // Desabilita botão de ação para compartilhar tela
            setShare('dis');
            // Habilita barra de controle de mídia
            $('#div-controller').fadeIn(300);

            // Tratamento do botão de pedir a vez
            pedir.onclick = function() {
                if (broadcastStatus == 1 && (solicita === 0 && !lockSolicitation)) {
                    // Constroi e envia mensagem solicitando a vez
                    var msgrash = [];
                    var myIdentity = currentRoomId.value;
                    msgrash[0] = btoa('@PedeAVez');
                    msgrash[1] = currentUser;
                    msgrash[2] = connection.userid;
                    msgrash[3] = inRoom.value;
                    msgrash[4] = myIdentity;
                    try {
                        connection.send(msgrash, inRoom.value);
                        solicita++;
                        callToast('<i class="fa fa-check"></i> Solicitação enviada!', 'blue darken-2');
                    } catch (err) {
                        callToast('<i class="fa fa-times"></i> Não foi possível solicitar a vez: ' + err + '.', 'red darken-3');
                    }
                } else if (solicita > 0) {
                    callToast('<i class="fa fa-exclamation-triangle"></i> Você já encaminhou uma solicitação.<br>Aguarde a resposta.', 'amber darken-4');
                } else if (lockSolicitation) {
                    callToast('<i class="fa fa-exclamation-triangle"></i> Sua solicitação já foi aceita.<br>Acesse clicando no botão ao lado.', 'amber darken-4');
                } else {
                    callToast('<i class="fa fa-times"></i> Não há conexão com a sala!', 'red darken-3');
                }
            };

            // Tratamento de áudio: Botão "Áudio" -> Toggle on/off
            vol.onclick = function() {
                if (vol.getAttribute('data-active') == 'enabled') {
                    [event.stream].forEach((stream) => {
                        stream.mute('audio');
                    });
                    setVol('off');
                } else {
                    [event.stream].forEach((stream) => {
                        stream.unmute('audio');
                    });
                    setVol('on');
                }
            };
            // Contagem de usuários conectados
            connection.getAllParticipants().forEach((participantId) => {
                var user = connection.peers[participantId];
                var userextra = user.extra;
            });
            var numberOfUsers = connection.getAllParticipants().length;
            changeCounter(numberOfUsers);
            // Broadcaster executando uma conexão local =====================================================
        } else if (!onParticipation && (event.type === 'local' && !event.stream.isScreen)) {
            console.log('TRANSMISSÃO LOCAL------');
            if (incomingCon == event.stream.streamid) {
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
            onParticipation = true;
            connection.isUpperUserLeft = false;
            arrVideos['main'] = event.stream;
            incomingCon = event.stream.streamid;
            var currentStream = [event.stream];

            videoPreview.srcObject = event.stream;
            videoPreview.userid = event.userid;
            videoPreview.muted = true;
            videoPreview.play();

            // Trata contador de solicitações
            $('#div-connect').hide();
            if (solicita <= 0) {
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
            mute.onclick = function() {
                if (mute.getAttribute('data-active') == 'enabled') {
                    currentStream.forEach((stream) => {
                        if (!stream.isScreen) {
                            stream.mute('audio');
                        }
                    });
                    setMute('off');
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
                    setMute('on');
                }
            };
            // Tratamento de áudio e video: Botão "Camera" -> Toggle on/off
            cam.onclick = function() {
                if (cam.getAttribute('data-active') == 'enabled') {
                    currentStream.forEach((stream) => {
                        if (!stream.isScreen) {
                            stream.mute('video');
                            stream.mute('audio');
                        }
                    });
                    setCam('off');
                    setMute('off');
                } else {
                    currentStream.forEach((stream) => {
                        if (!stream.isScreen) {
                            stream.unmute('video');
                            stream.unmute('audio');
                        }
                    });
                    setCam('on');
                    setMute('on');
                }
            };
            // Tratamento de solicitações: Botão "Solicitações" -> Abra listagem de solicitações e respostas
            ctlPedir.onclick = function() {
                var response;
                // Tratamento de respostas (permitir / negar)
                response = document.getElementsByClassName('responses');
                for (var j = 0; j < response.length; j++) {
                    response[j].onclick = function() {
                        var admResponse = this.id.split('_');
                        var msgrash = [];
                        var myIdentity = currentRoomId.value;
                        msgrash[0] = btoa('@PedeAVez:' + admResponse[0]);
                        msgrash[1] = currentUser;
                        msgrash[2] = admResponse[1];
                        msgrash[3] = inRoom.value;
                        msgrash[4] = myIdentity;
                        if (admResponse[0] == 'allow' && lockSolicitation) {
                            callToast('<i class="fa fa-times"></i> Já existe uma solicitação aceita!<br>Finalize-a para aceitar outra.', 'red darken-3');
                        } else {
                            solicita--;
                            connection.send(msgrash);
                            constructList(admResponse[1]);
                            trataSolicitacao(solicita);
                            if (admResponse[0] == 'allow') {
                                lockSolicitation = true
                                document.getElementById('div-end').setAttribute('data-target', admResponse[1]);
                                $('#div-end').fadeIn(300);
                            }

                        }
                    }
                }
                endSessionAccess.onclick = function() {
                    $('#div-end').hide();
                    var targetId = document.getElementById('div-end').getAttribute('data-target');
                    var msgrash = [];
                    msgrash[0] = btoa('@Finaliza-Participacao');
                    msgrash[1] = currentUser;
                    msgrash[2] = connection.userid;
                    msgrash[3] = inRoom.value;
                    msgrash[4] = targetId;
                    connection.send(msgrash, targetId);
                    lockSolicitation = false;
                }
            };
            // Tratamento de solicitações: Botão "Compartilhar" -> Compartilha a tela do apresentador: Toggle On/Off
            share.onclick = function() {
                if (share.getAttribute('data-active') == 'enabled') {
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
                            document.getElementById('in-screen').value = stream.streamid;
                        }
                    });
                } else {
                    $('#screen-share-alert').slideUp(300);
                    setShare('on');
                    var streamConnection = document.getElementById('in-screen').value;
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
                    msgrash[1] = currentUser;
                    msgrash[2] = streamConnection;
                    msgrash[3] = inRoom.value;
                    msgrash[4] = myIdentity;
                    connection.send(msgrash);
                }
            };
            // Apresenta o número de espectadores conectados
            $('#connected-users').fadeIn(300);
        }
        /**==================================================================================================
         * Tratamentos e controles complementares
         */
        // Botão de maximizar o video -> toggle on:off
        screen.onclick = function() { fullscreen(); };
        exitscreen.onclick = function() { fullscreen(); };
        // Tratamento das funções MUTE e UNMUTE
        connection.onmute = (event) => {
            event.mediaElement.setAttribute('poster', '/img/bg.jpg');
        };
        connection.onunmute = (event) => {
            event.mediaElement.removeAttribute('poster');
        };
        // Tratamento da função de chat da barra de controle de mídia
        document.getElementById('toggle-chat').onclick = function() {
            $('#text-message').focus();
        };
        // Tratamento de ingresso na transmissão: Botão "Ingressar" -> Ingressa e participa da apresentação
        // ->Toggle On/Off
        sessionAccess.onclick = function() {
            if (sessionAccess.getAttribute('data-active') == 'disabled' && !onParticipation) {
                setParticipation('off');
                onParticipation = true;
                setTimeout(function() {
                    try {
                        connection.peers[inRoom.value].addStream({
                            video: true
                        });
                        callToast('<i class="material-icons left">videocam</i> Transmissão Iniciada.', 'blue darken-2');
                    } catch (e) {
                        setParticipation('on');
                        onParticipation = false;
                    }
                }, 500);
            } else if (sessionAccess.getAttribute('data-active') == 'enabled' && onParticipation) {
                setParticipation('dis');
                onParticipation = false;
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
                    msgrash[1] = currentUser;
                    msgrash[2] = connection.userid;
                    msgrash[3] = inRoom.value;
                    msgrash[4] = myIdentity;
                    connection.send(msgrash, inRoom.value);
                    lockSolicitation = false;
                    callToast('<i class="material-icons left">videocam_off</i> Transmissão finalizada.', 'red darken-3');
                } catch (e) {
                    setParticipation('off');
                    onParticipation = true;
                }
            }
        };
        let fullsize = document.getElementById('toggle-size');
        fullsize.onclick = function() {
            toggleFullsize();
        };
    };
    //=======================================================================================================
    // Listener para abertura de conexões
    connection.onopen = (event) => {
        console.log(event);
        if (event.userid != connectedAt) {
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
            lockSolicitation = false;
            ComponentSalaHelper.toggleIncomingVideos('out');
        }
    };
    // Listener para fim de conexões
    connection.onleave = (event) => {
        console.log('DEIXANDO CONEXÃO...', event);
    };

    // Ação de criar uma sala ao clicar em 'btn-join-as-productor' ==========================================
    startRoom.onclick = function() {

        let createRoom = new RoomController();
        let newRoom = createRoom.setRoom();

        let values = $('#cursos-list').val();
        let strValues = values.join(';');

        if (createRoom.validade()) {
            usuario = newRoom.name;
            onlobby = false;
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
                    document.getElementById(broadcastId).onclick();
                    return;
                }
                setTimeout(reCheckRoomPresence, 5000);
            });
        })();
    }
    // Verifica quantas conexões estão ativas nesse broadcast
    connection.onNumberOfBroadcastViewersUpdated = (event) => {
        if (!connection.isInitiator) return;
        viewers = event.numberOfBroadcastViewers;
        changeCounter(viewers);
    };
    // Verifica listagem de de salas públicas que se enquadrem no perfil do usuário
    // ->A cada 3 segundos
    (function looper() {
        // Se ainda estiver no lobby das salas
        if (onlobby) {
            //Verifica a existência de uma sala pública
            connection.getPublicModerators((array) => {
                publicRoomsDiv.innerHTML = '';
                // Se existir alguma sala pública execute
                if (array.length > 0) {
                    array.forEach((moderator) => {
                        //Coleta o número de espectadores conectados à sala
                        connection.getNumberOfBroadcastViewers(moderator.userid, (numberOfBroadcastViewers) => {
                            viewers = numberOfBroadcastViewers;
                        });
                        // Verifica se quem conecta é o próprio moderador
                        if (moderator.userid == connection.userid) return;
                        // Cria labels para exibição de salas disponíveis
                        // Verifica se a sala criada atende às especificações do sistema
                        // -> Usado enquanto o connection.socketURL 
                        var labelRoom = moderator.userid;
                        try {
                            labelRoom = atob(labelRoom);
                        } catch (exp) {
                            if (array.length < 2) ComponentSalaHelper.noRooms();
                            return;
                        }

                        let viewerData = new ViewerController();
                        let newViewer = viewerData.setViewer(labelRoom);

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
                            usuario = currentUser;
                            let divOpen = bindDocument.createTag('div');
                            let card = ComponentSalaHelper.constructAccessList(newViewer.classe, newViewer.assunto, newViewer.apresentador, viewers, moderator.userid);

                            divOpen.innerHTML = card;
                            divOpen.className = "card-panel hoverable";
                            let button = bindDocument.createTag('a');
                            button.id = moderator.userid;
                            button.title = 'Entrar';
                            button.className = 'btn-floating room-enter blue darken-1';
                            button.innerHTML = '<i class="material-icons large">play_arrow</i>';
                            // Atribui função para ingressar na sala disponível
                            button.onclick = function() {
                                callTeacherStream();
                                setRoomLabel('television', newViewer.classe, newViewer.assunto);

                                onlobby = false;
                                isModerator = false;
                                broadcaster.value = newViewer.whois;

                                let getRoomId = this.id;
                                connectedAt = this.id;

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

                                // Toggle de funções de Chat
                                bindDocument.tag('#toggle-chat').onclick = function() {
                                    bindDocument.tag('#text-message').focus();
                                };
                            };
                            //Append de elementos html
                            publicRoomsDiv.appendChild(divOpen);
                            let divClose = bindDocument.tag("#_" + moderator.userid);
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
                    let username = userextra.modifiedValue.split('-')[1];
                    htmlList += constructConnectionList(userextra.modifiedValue, username, user.userid, true);
                } else {
                    if (!isModerator) {
                        htmlList += constructConnectionList(myId, currentUser + ' (você)', connection.userid, false);
                    }
                }
            });
            if (numberOfUsers > 0) {
                var contaUsuarios = document.getElementById('users-counter');
                if (contaUsuarios.getAttribute('data-target') == 0) {
                    document.getElementById('connected-users-list').innerHTML = htmlList;
                    changeCounter(numberOfUsers);
                    $('#connected-users').fadeIn(300);
                }
                var disconnectId;
                var btnDisconnect = document.getElementsByClassName('disconnect-btn');
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
    document.getElementById('text-message').onkeyup = function(e) {
        if (e.keyCode != 13) return;
        this.value = this.value.replace(/^\s+|\s+$/g, '');
        if (!this.value.length) return;
        var texto = "<b class='small'>" + usuario + "</b>:<br>" + this.value;
        texto = btoa(texto);
        connection.send(texto);
        appendDIV(texto);
        this.value = '';
    };
    /**
     *  var texto String
     */
    document.getElementById('send-message-btn').onclick = function() {
        var texto = document.getElementById('text-message').value
        texto = texto.replace(/^\s+|\s+$/g, '');
        if (!texto.length) return;
        texto = "<b class='small'>" + usuario + "</b>:<br>" + texto;
        texto = btoa(texto);
        connection.send(texto);
        appendDIV(texto);
        document.getElementById('text-message').value = '';
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
    var chatContainer = document.getElementById('chat-panel');
    var remoto = false;
    // Recebe mensagens de origem externa ou interna
    if (event.data) remoto = true;
    var text = event.data || event;
    // Verifica a origem da mensagem, se a menssagem é um array e se este array possui mais de 4 índices
    // -> Definição do padrão de solicitação
    if (remoto && (Array.isArray(text) && text.length > 4)) {
        var chkrash = event.data;
        var msgData = [];
        var myRoom = document.getElementById('room-id').value;
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
                solicita--;
                setPedir('allow');
                lockSolicitation = true;
            }
            return;
        } else if (chkrash[0] === btoa('@PedeAVez:deny')) {
            // Indica que o broadcaster negou a solicitação do usuário
            // Verifica se o destinatário é o criador da solicitação para entregar a resposta
            if (chkrash[2] === myRoom) {
                solicita--;
                setPedir('deny');
                lockSolicitation = false;
            }
            return;
        } else if (chkrash[0] === btoa('@Finaliza-Share')) {
            var videoSecond = document.getElementById('span-video-preview-2nd');
            var swapSecond = document.getElementById('swap-video');
            var position = videoSecond.getAttribute('data-position');
            if (position == 'main') {
                swapSecond.click();
            }
            setTimeout(function() {
                $('#span-video-preview-2nd').hide();
                callToast('<span class="white-text"><i class="material-icons left">stop_screen_share</i> Compartilhamento de tela finalizado.</span>', 'red darken-3');
            }, 1000);
        } else if (chkrash[0] === btoa('@Finaliza-Participacao')) {
            if (!onParticipation) {
                onParticipation = true;
                document.getElementById('enter-session').setAttribute('data-active', 'enabled');
                callToast('<i class="fa fa-times"></i> Solicitação cancelada.', 'red darken-3');
            }
            document.getElementById('enter-session').click();
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
    var msg = text;
    var receiver = document.getElementById('room-id').value
    var solList = document.getElementById('solicita-list');
    var htmlList;
    // Verifica se o destinatário é o broadcaster para entregar a solicitação
    if (msg[1] === receiver) {
        solicita++;
        trataSolicitacao(solicita);
        if (solicita === 1) { solList.innerHTML = '' };
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
    setTimeout(function() {
        console.log('Sala ' + userid + ' se conectou a você.');
        var htmlList = '';
        var broadcaster = document.getElementById('in-room').value;
        for (var j = 0; j < Object.keys(connections).length; j++) {
            var roomaccount = connections[j].split('|')[0];
            var roomname = connections[j].split('|')[1];
            var roomanounce = connections[j].split('|')[2];
            htmlList += constructConnectionList(roomaccount, roomname, roomanounce, true);
        }
        document.getElementById('connection-list').innerHTML = htmlList;
    }, 1000);
}

// Emite alerta de desconexão.
/**
 * Param userid: String de dados de quem foi desconectado
 */
function alertDisconnection(userid) {
    var broadcaster = document.getElementById('in-room').value;
    if (userid === broadcaster) {
        callToast('<i class="fa fa-times"></i> Você foi desconectado!', 'red darken-3');
        setTimeout(location.reload.bind(location), 3000);
    } else {
        try {
            for (var j = 0; j < Object.keys(connections).length; j++) {
                if (connections[j].split('|')[2] == userid) {
                    connections.splice(j, 1);
                }
            }
        } catch (e) {
            return;
        }
        constructConnectionExpList(userid);
        changeCounter(Object.keys(connections).length);
    }
}
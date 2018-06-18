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
/**
 *  Variáveis Globais
 * 
 *  var solicita        integer
 *  var broadcastStatus integer
 *  var connections     Array
 *  var isModerator     Boolean
 *  var onlobby         Boolean
 *  var onParticipation Boolean
 */
// Controle de solicitações abertas para o broadcaster
// ->limita a 1 a quantidade máxima de solicitações de um usuário
var solicita = 0;
// Define se o status da conexão está ativa (1) ou inativa (0)
var broadcastStatus = 0;
// Array de viewers conectados à sala
var connections = [];
// Controles gerais
var isModerator = true;
var onlobby = true;
var onParticipation = false;
var lockSolicitation = false;
var arrVideos = [];
var streamVideos = [];
var incomingCon;

$(document).ready(function() {

    window.enableAdapter = true;
    //Application - Inicia a chamada e tratamento de multiconexão
    /**
     *  const connection          RTCMultiConnection
     *  const enableRecordings    Boolean
     *  const isPublicModerator   Boolean
     */
    var enableRecordings = false;
    var isPublicModerator = true;
    var connection = new RTCMultiConnection();

    // Definições de conexão
    connection.enableScalableBroadcast = true;
    connection.maxRelayLimitPerUser = 0;
    connection.socketMessageEvent = 'inicia-apresentacao';
    //connection.autoCloseEntireSession = true;
    //connection.dontCaptureUserMedia = true;

    // Elemento alvo para iniciar o stream de video
    connection.teacherVideosContainer = document.getElementById('main-video');
    connection.videoContainer = document.getElementById('span-video-preview');
    connection.videosContainer = document.getElementById('span-secondvideo-preview');

    // Listeners de tratamento de tamanho de tela do video (Detecta Fullscreen OFF)
    document.addEventListener('fullscreenchange', exitHandler);
    document.addEventListener('webkitfullscreenchange', exitHandler);
    document.addEventListener('mozfullscreenchange', exitHandler);
    document.addEventListener('MSFullscreenChange', exitHandler);

    // Inicialização de variáveis de controle de elementos in-page
    /**
     *  var width               integer
     *  var status              Boolean
     *  var usuario             string
     *  var broadcastId         string
     *  var viewers             integer
     *  var cameras             Boolean
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
     *  var currentUser         string
     *  var sessionAccess       elem. html
     *  var endSessionAccess    elem. html
     */
    var width;
    var status = false;
    var usuario = '';
    var viewers = 'Calculando...';
    var cameras;
    var publicRoomsDiv = document.getElementById('public-conference');
    var inRoom = document.getElementById('in-room');
    var videoPreview = document.getElementById('video-preview');
    var secondVideoPreview = document.getElementById('secondvideo-preview');
    var thirdVideoPreview = document.getElementById('thirdvideo-preview');
    var mute = document.getElementById('toggle-mute');
    var screen = document.getElementById('toggle-screen');
    var exitscreen = document.getElementById('exit-fullscreen');
    var vol = document.getElementById('toggle-volume');
    var cam = document.getElementById('toggle-camera');
    var pedir = document.getElementById('pedir-vez');
    var ctlPedir = document.getElementById('control-pedir-vez');
    var share = document.getElementById('share-screen');
    var videoFirst = document.getElementById('span-video-preview');
    var videoSecond = document.getElementById('span-video-preview-2nd');
    var videoThird = document.getElementById('span-video-preview-3rd');
    var swapSecond = document.getElementById('swap-video');
    var broadcaster = document.getElementById('broadcaster');
    var currentUser = document.getElementById('current-user').value;
    var sessionAccess = document.getElementById('enter-session');
    var endSessionAccess = document.getElementById('end-session');

    // Conexão com serviço de websocket
    connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

    // Socket Connections
    connection.connectSocket(function(socket) {
        // Socket - Join
        socket.on('join-broadcaster', function(hintsToJoinBroadcast) {
            console.log('--> join-broadcaster', hintsToJoinBroadcast);
            broadcastStatus = 1;
            connection.session = hintsToJoinBroadcast.typeOfStreams;
            connection.sdpConstraints.mandatory = {
                OfferToReceiveVideo: false,
                OfferToReceiveAudio: false
            };
            connection.extra.modifiedValue = document.getElementById('room-id').value;
            connection.updateExtraData();
            connection.broadcastId = hintsToJoinBroadcast.broadcastId;
            connection.join(hintsToJoinBroadcast.userid);
            console.log('--> Joined at: ' + hintsToJoinBroadcast.userid);
            callToast('<i class="fa fa-play-circle fa-lg"></i> Transmissão iniciada!', 'blue');
        });
        // Socket - Rejoin
        socket.on('rejoin-broadcast', function(broadcastId) {
            console.log('--> rejoin-broadcast', broadcastId);
            broadcastStatus = 1;
            connection.attachStreams = [];
            connection.extra.modifiedValue = document.getElementById('room-id').value;
            connection.updateExtraData();
            socket.emit('check-broadcast-presence', broadcastId, function(isBroadcastExists) {
                console.log('check-existente');
                if (!isBroadcastExists) {
                    connection.userid = broadcastId;
                }
                socket.emit('join-broadcast', {
                    broadcastId: broadcastId,
                    userid: connection.userid,
                    typeOfStreams: connection.session
                });
            });
        });
        // Socket - Stopped
        socket.on('broadcast-stopped', function(broadcastId) {
            console.error('--> Broadcast finalizada', broadcastId);
            broadcastStatus = 0;
            callToast('<i class="fa fa-stop-circle fa-lg"></i> Transmissão finalizada!', 'red darken-3');
        });
        // Socket - Started
        socket.on('start-broadcasting', function(typeOfStreams) {
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
        // Socket - Leaving
        socket.on('leave-the-room', function(targetconnection) {
            console.log('--> Saindo...' + targetconnection.remoteUserId + ' -> ' + connection.userid);
            if (targetconnection.remoteUserId != connection.userid) return;
            connection.leave();
        });
    });
    // Tratamento de erro para compartilhamento de tela
    connection.getScreenConstraints = function(callback) {
        getScreenConstraints(function(error, screen_constraints) {
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
    connection.onstream = function(event) {
        if (!onParticipation) {
            inRoom.value = event.userid;
        }
        /**
         * Tratamento de conexões REMOTAS e LOCAIS
         * -> Identificação de compartilhamentos de tela e ingressos em transmissões
         */
        if (event.type === 'remote' && connection.isInitiator) {
            console.log('PARTICIPAÇÃO REMOTA--------');
            // Remove qualquer conexão duplicada
            if (incomingCon == event.stream.streamid) {
                connection.getAllParticipants().forEach(function(p) {
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
                thirdVideoPreview.title = event.userid;
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
                showIncomingVideos();
                $('#span-video-preview-3rd').fadeIn(300);
                setTimeout(function() {
                    connection.getAllParticipants().forEach(function(p) {
                        if (p + '' != event.userid + '') {
                            var peer = connection.peers[p].peer;
                            event.stream.getTracks().forEach(function(track) {
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
                }, 500);
                $('#div-end').fadeIn(300);
                endSessionAccess.onclick = function() {
                    streamVideos.forEach(function(stream) {
                        connection.getAllParticipants().forEach(function(p) {
                            var peer = connection.peers[p].peer;
                            stream.stop();
                            peer.removeStream(stream);
                        });
                    });
                    $('#div-end').hide();
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
        } else if (!onParticipation && (event.type === 'remote' && event.stream.isScreen === true)) {
            console.log('REMOTO COM SCREEN----------');
            if (incomingCon == event.stream.streamid) {
                connection.getAllParticipants().forEach(function(p) {
                    if (p + '' == event.userid + '') {
                        var peer = connection.peers[p].peer;
                        stream.stop();
                        peer.removeStream(event.stream);
                    }
                });
                return;
            }
            // Conexão remota com compartilhamento de tela
            $('#span-video-preview-2nd').fadeIn(300);
            secondVideoPreview.srcObject = event.stream;
            arrVideos['screen'] = event.stream;
            incomingCon = event.stream.streamid
            showIncomingVideos();

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
        } else if (!onParticipation && (event.type === 'remote' && !event.stream.isScreen)) {
            console.log('REMOTO SEM SCREEN----------');
            if (incomingCon == event.stream.streamid) {
                connection.getAllParticipants().forEach(function(p) {
                    if (p + '' == event.userid + '') {
                        var peer = connection.peers[p].peer;
                        stream.stop();
                        peer.removeStream(event.stream);
                    }
                });
                return;
            }
            // Conexão remota sem compartilhamento de tela
            if (arrVideos['main']) {
                $('#span-video-preview-3rd').fadeIn(300);
                thirdVideoPreview.srcObject = event.stream;
                arrVideos['user'] = event.stream;
                thirdVideoPreview.title = event.userid;
                var playPromise = thirdVideoPreview.play();
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                            thirdVideoPreview.play();
                        })
                        .catch(error => {
                            console.log('Carregando vídeo 3...');
                        });
                }
                showIncomingVideos();
            } else {
                onParticipation = false;
                videoPreview.srcObject = event.stream;
                arrVideos['main'] = event.stream;
                videoPreview.title = event.userid;
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
            // Ajusta elementos de exibição (define o menu de áudio e video para ESPECTADORES)
            $('#div-connect').hide();
            ctlPedir.innerHTML = constructBtnActionPedir();
            $('#pedir-vez').tooltip();
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
                    /**
                     *  var msgrash     string
                     *  var myIdentity  string
                     */
                    var msgrash = [];
                    var myIdentity = document.getElementById('room-id').value;
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
                    [event.stream].forEach(function(stream) {
                        stream.mute('audio');
                    });
                    setVol('off');
                } else {
                    [event.stream].forEach(function(stream) {
                        stream.unmute('audio');
                    });
                    setVol('on');
                }
            };
            // Contagem de usuários conectados
            connection.getAllParticipants().forEach(function(participantId) {
                var user = connection.peers[participantId];
                var userextra = user.extra;
            });
            var numberOfUsers = connection.getAllParticipants().length;
            changeCounter(numberOfUsers);

        } else if (!onParticipation && (event.type === 'local' && !event.stream.isScreen)) {
            console.log('TRANSMISSÃO LOCAL------');
            if (incomingCon == event.stream.streamid) {
                connection.getAllParticipants().forEach(function(p) {
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
            var currentStream = [event.stream];

            videoPreview.srcObject = event.stream;
            videoPreview.title = event.userid;
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
                    currentStream.forEach(function(stream) {
                        if (!stream.isScreen) {
                            stream.mute('audio');
                        }
                    });
                    setMute('off');
                } else {
                    currentStream.forEach(function(stream) {
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
                    currentStream.forEach(function(stream) {
                        if (!stream.isScreen) {
                            stream.mute('video');
                            stream.mute('audio');
                        }
                    });
                    setCam('off');
                    setMute('off');
                } else {
                    currentStream.forEach(function(stream) {
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
                        var myIdentity = document.getElementById('room-id').value;
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
                        streamCallback: function(stream) {
                            setTimeout(function() {
                                connection.getAllParticipants().forEach(function(p) {
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
                    connection.attachStreams.forEach(function(stream) {
                        if (stream.id === streamConnection) {
                            streamToRemove = stream;
                            stream.stop();
                        } else newArray.push(stream);
                    });
                    connection.attachStreams = newArray;
                    connection.getAllParticipants().forEach(function(p) {
                        var peer = connection.peers[p].peer;
                        try {
                            peer.removeStream([streamToRemove]);
                            connection.renegotiate(p, {
                                screen: false,
                                oneway: true
                            });
                        } catch (e) { console.log([streamToRemove]) }
                    });
                    // Mensagem de finalização de screen sharing
                    var msgrash = [];
                    var myIdentity = document.getElementById('room-id').value;
                    msgrash[0] = btoa('@Finaliza-Share');
                    msgrash[1] = currentUser;
                    msgrash[2] = streamConnection;
                    msgrash[3] = inRoom.value;
                    msgrash[4] = myIdentity;
                    connection.send(msgrash);
                }
            };
        }
        // Botão de maximizar o video -> toggle on:off
        screen.onclick = function() { fullscreen(); };
        exitscreen.onclick = function() { fullscreen(); };
        // Tratamento das funções MUTE e UNMUTE
        connection.onmute = function(event) {
            event.mediaElement.setAttribute('poster', '/img/bg.jpg');
        };
        connection.onunmute = function(event) {
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
                console.log(connection.attachStreams);
            } else if (sessionAccess.getAttribute('data-active') == 'enabled' && onParticipation) {
                setParticipation('dis');
                onParticipation = false;
                try {
                    connection.attachStreams.forEach(function(stream) {
                        connection.getAllParticipants().forEach(function(p) {
                            var peer = connection.peers[p].peer;
                            stream.stop();
                            peer.removeStream(stream);
                        });
                    });
                    var msgrash = [];
                    var myIdentity = document.getElementById('room-id').value;
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
        // Apresentação e tratamento da barra de controle de mídia
        $('#nav-footer').slideDown(500);
    };
    // Listener para finalização de streams
    connection.onstreamended = function(event) {
        console.log('FINALIZADO...', event);
        if (event.stream.isScreen) {
            $('#span-video-preview-2nd').hide();
        } else {
            $('#span-video-preview-3rd').hide();
            lockSolicitation = false;
        }
    };
    //  Listener para fim de conexões
    connection.onleave = function(event) {
        console.log('DEIXANDO CONEXÃO...', event);
    };

    // Ação de criar uma sala ao clicar em 'btn-join-as-productor'
    document.getElementById('btn-join-as-productor').onclick = function() {
        /*
         *    var elem          html elem.
         *    var roomId        integer
         *    var materia       string
         *    var assunto       string
         *    var roomName      string
         *    var roomCursos    string
         *    var roomHash      string
         *    var values        array
         *    var strValues     string
         *    var broadcastId   string
         */
        var elem = document.getElementById(this.id);
        var roomId = document.getElementById('room-id').value;
        var materia = document.querySelector('#tema').value;
        var assunto = document.querySelector('#assunto').value;
        var roomName = currentUser;
        var values = $('#cursos-list').val();
        var strValues = '';
        for ($i = 0; $i < values.length; $i++) {
            strValues += values[$i];
            if ($i != (values.length - 1)) {
                strValues += ';';
            }
        }
        if (strValues != '' && (materia != '' && assunto != '')) {
            // Definição do Hash da sala criada
            var roomCursos = strValues;
            var roomHash = btoa(materia + "|" + roomName + "|" + assunto + "|" + roomCursos + "|" + roomId);
            usuario = roomName;
            var broadcastId = roomHash;
            onlobby = false;
            // Inicializa a tela de apresentação (video)
            callTeacherStream();
            // Modela e apresenta cabeçalho do video
            setRoomLabel('video-camera', materia, assunto);

            document.getElementById('btn-join-as-productor').disabled = true;
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
                audio: 300,
                video: 700
            };
            */
            // Inicializa Socket
            var socket = connection.getSocket();
            // Verifica existência do broadcast
            socket.emit('check-broadcast-presence', broadcastId, function(isBroadcastExists) {
                if (!isBroadcastExists) {
                    connection.userid = broadcastId;
                    console.log('Definindo userid broadcaster: ' + connection.userid);
                }
                console.log('check-broadcast-presence', broadcastId, isBroadcastExists);
                //start-broadcasting
                socket.emit('join-broadcast', {
                    broadcastId: broadcastId,
                    userid: connection.userid,
                    typeOfStreams: connection.session
                        //bandwidth: connection.bandwidth
                });
            });
        } else {
            callToast('<i class="fa fa-exclamation-triangle fa-lg"></i> Por favor informe todos os campos indicados!', 'red darken-3');
        }
    };

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
    var broadcastId = '';
    if (localStorage.getItem(connection.socketMessageEvent)) {
        broadcastId = localStorage.getItem(connection.socketMessageEvent);
    } else {
        broadcastId = connection.token();
    }
    //document.getElementById('room-id').value = broadcastId;
    document.getElementById('room-id').onkeyup = function() {
        localStorage.setItem(connection.socketMessageEvent, this.value);
    };
    var hashString = location.hash.replace('#', '');
    if (hashString.length && hashString.indexOf('comment-') == 0) {
        hashString = '';
    }
    var broadcastId = params.broadcastId;
    if (!broadcastId && hashString.length) {
        broadcastId = hashString;
    }

    if (broadcastId && broadcastId.length) {
        document.getElementById('room-id').value = broadcastId;
        localStorage.setItem(connection.socketMessageEvent, broadcastId);
        // Efetua o join automático na sala em caso de desconexão do espectador
        // ->Verificação a cada 5 segundos
        (function reCheckRoomPresence() {
            connection.checkPresence(broadcastId, function(isRoomExists) {
                if (isRoomExists) {
                    document.getElementById(broadcastId).onclick();
                    return;
                }
                setTimeout(reCheckRoomPresence, 5000);
            });
        })();
    }
    // Verifica quantas conexões estão ativas nesse broadcast
    connection.onNumberOfBroadcastViewersUpdated = function(event) {
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
            connection.getPublicModerators(function(array) {
                publicRoomsDiv.innerHTML = '';
                // Se existir alguma sala pública execute
                if (array.length > 0) {
                    array.forEach(function(moderator) {
                        //Coleta o número de espectadores conectados à sala
                        connection.getNumberOfBroadcastViewers(moderator.userid, function(numberOfBroadcastViewers) {
                            viewers = numberOfBroadcastViewers;
                        });
                        // Verifica se quem conecta é o próprio moderador
                        if (moderator.userid == connection.userid) return;
                        // Cria labels para exibição de salas disponíveis
                        /**
                         *  var labelRoom           string
                         *  var labelClasse         string
                         *  var labelAssunto        string
                         *  var labelApresentador   string
                         *  var labelCurso          string
                         *  var labelWhois          string
                         *  var myClass             string
                         *  var allowed             Boolean
                         *  var countRooms          integer
                         *  var classes             array
                         *  var broadcastId         string
                         *  var socket              connection.socket
                         *  var message             string
                         */
                        // Verifica se a sala criada atende às especificações do sistema
                        // -> Usado enquanto o connection.socketURL 
                        var labelRoom = moderator.userid;
                        try {
                            labelRoom = atob(labelRoom);
                        } catch (exp) {
                            if (array.length < 2) {
                                noRooms();
                            }
                            return;
                        }
                        var labelClasse = labelRoom.split('|')[0];
                        var labelApresentador = labelRoom.split('|')[1];
                        var labelAssunto = labelRoom.split('|')[2];
                        var labelCurso = labelRoom.split('|')[3];
                        var labelWhois = labelRoom.split('|')[4];
                        var myClass = document.getElementById('target').value;
                        var countRooms = 0;
                        var allowed = false;
                        var classes = myClass.split(';');

                        // Permissão de visualização do conteúdo em broadcast
                        if (labelCurso !== undefined && labelCurso !== '') {
                            for ($i = 0; $i < classes.length; $i++) {
                                if (labelCurso.indexOf(classes[$i]) > -1) {
                                    allowed = true;
                                }
                            }
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
                            var divOpen = document.createElement('div');
                            // Cria objeto de lista com as transmissões disponíveis
                            var card = constructAccessList(labelClasse, labelAssunto, labelApresentador, viewers, moderator.userid);

                            divOpen.innerHTML = card;
                            divOpen.className = "card-panel hoverable";
                            // Cria objeto botão para ingressar na transmissão selecionada
                            var button = document.createElement('a');
                            button.id = moderator.userid;
                            button.title = 'Entrar';
                            button.className = 'btn-floating room-enter blue darken-1';
                            // Atribui função para ingressar na sala disponível
                            button.onclick = function() {
                                onlobby = false;
                                isModerator = false;
                                broadcaster.value = labelWhois;
                                // Desabilita botão de ingresso
                                this.disabled = true;
                                document.getElementById(this.id).disabled = true;

                                // Inicializa apresentação
                                callTeacherStream();

                                var broadcastId = this.id;
                                // Definições de sessão
                                connection.session = {
                                    audio: false,
                                    video: false
                                };
                                // Inicializa socket
                                var socket = connection.getSocket();
                                socket.emit('join-broadcast', {
                                    broadcastId: broadcastId,
                                    userid: connection.userid,
                                    typeOfStreams: connection.session
                                });

                                // Toggle de funções de Chat
                                document.getElementById('toggle-chat').onclick = function() {
                                    $('#text-message').focus();
                                };
                                // Modela e apresenta título do video
                                setRoomLabel('television', labelClasse, labelAssunto);
                            };
                            button.innerHTML = '<i class="material-icons large">play_arrow</i>';
                            if (moderator.userid == connection.sessionid) {
                                // Se já estiver conectado na sala desabilite o botão de integração
                                button.disabled = true;
                            }
                            //Append de elementos html
                            publicRoomsDiv.appendChild(divOpen);
                            var divClose = document.getElementById("_" + moderator.userid);
                            divClose.appendChild(button);
                        }
                        if (countRooms == 0) {
                            noRooms();
                        }
                    });
                } else {
                    noRooms();
                }
            });
        } else {
            // Tratamento de conexões de espectadores
            var htmlList = '';
            var allParticipants = connection.getAllParticipants();
            var numberOfUsers = allParticipants.length;
            allParticipants.forEach(function(participantId) {
                var myId = document.getElementById('room-id').value;
                var user = connection.peers[participantId];
                var userextra = user.extra;
                if (userextra.modifiedValue) {
                    var username = userextra.modifiedValue.split('-')[1];
                    htmlList += constructConnectionList(userextra.modifiedValue, username, user.userid, true);
                } else {
                    if (!isModerator) {
                        htmlList += constructConnectionList(myId, currentUser + ' (você)', connection.userid, false);
                    }
                }
            });
            if (numberOfUsers > 0) {
                //document.getElementById('connection-list').innerHTML = htmlList;
                var contaUsuarios = document.getElementById('users-counter');
                if (contaUsuarios.getAttribute('data-target') == 0) {
                    document.getElementById('connected-users-list').innerHTML = htmlList;
                    changeCounter(numberOfUsers);
                } else {
                    $('#connected-users').hide();
                }
                var disconnectId;
                var btnDisconnect = document.getElementsByClassName('disconnect-btn');
                for (var j = 0; j < btnDisconnect.length; j++) {
                    btnDisconnect[j].onclick = function() {
                        disconnectId = this.getAttribute('data-announced');
                        if (isModerator) {
                            connection.disconnectWith(disconnectId);
                        } else {
                            connection.send({
                                userRemoved: true,
                                removedUserId: disconnectId
                            });
                        }
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
     *  var texto string
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
     *  var texto string
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
    connection.onmessage = function(event) {
        if (event.data.userRemoved === true) {
            if (event.data.removedUserId == connection.userid) {
                connection.close();
            }
            return;
        } else {
            appendDIV(event);
        }
    };

});
/**
 * FUNCTIONS-------------------------------------------------------------------
 */
//Trata e escreve mensagem de chat e trata solicitações
/*
 *    event: mensagem recebida.
 *      -> mensagens em formato de array[4+] (length > 4) são tratadas como solicitações;
 *      -> solicitações tem como padrão no array[0] o indicativo da solicitação;
 *      -> os indicativos sempre iniciam com @, como @PedeAVez.
 *   
 *    var chatContainer elem. html
 *    var text          string
 *    var message       string
 */
function appendDIV(event) {
    var chatContainer = document.getElementById('chat-panel');
    var remoto = false;
    // Recebe mensagens externas ou internas
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
            console.log(solicita);
            if (solicita === 0) {
                //document.getElementById('solicita-list').innerHTML = '';
            }
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
        // Identifica e exibe mensagem
        writeMessage(text, remoto);
    }
}
// Lista todas as solicitações de "Pedir a vez" e incrementa contador
/**
 * text: Array contando o nome so solicitante, o Id da conexão da sala e o Id da conexão do solicitante
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

// Emite alerta de desconexão.
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
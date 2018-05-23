/**
 *  Javascript + JQuery + WebRTC
 *  Controle de transmissão de mídia com stream;
 *  Controle de acesso de usuários por perfil;
 *  Configurações do WebRTC -> Sockets e RTCMulticonnection
 *                          -> Transmissão escalável em Broadcast
 *                          -> Controles do Chat
 *                          -> Controles de envio e recebimento de mensagens;
 *  Validação de campos de formulários;
 *  Controle e tratamento das funções dos botões da barra de funções de video;
 *  Utilizado EXCLUSIVAMENTE para rotas "salas/*";
 */
//-------------------------------------------------------------------------------------------------
/**
 *  Variáveis Globais
 * 
 *  var solicita        integer
 *  var broadcastStatus integer
 */
// Controle de solicitações abertas para o broadcaster
// ->limita a 1 a quantidade máxima de solicitações de um usuário
var solicita = 0;
// broadcasteStatus: define se o status da conexão está ativa (1) ou inativa (0)
var broadcastStatus = 0;
// Array de viewers conectados à sala
var connections = [];
// Controles gerais
var isModerator = true;
var onlobby = true;
var canShare = false;

$(document).ready(function() {
    // Inicializa adapter.js
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
    //connection.maxRelayLimitPerUser = 1;
    //connection.autoCloseEntireSession = true;
    //connection.dontCaptureUserMedia = true;
    connection.socketMessageEvent = 'inicia-apresentacao';

    // Elemento alvo para iniciar o stream de video
    connection.teacherVideosContainer = document.getElementById('main-video');
    connection.videoContainer = document.getElementById('span-video-preview');
    connection.videosContainer = document.getElementById('span-secondvideo-preview');

    // Listeners de tratamento de tamanho de tela do video
    document.addEventListener('fullscreenchange', exitHandler);
    document.addEventListener('webkitfullscreenchange', exitHandler);
    document.addEventListener('mozfullscreenchange', exitHandler);
    document.addEventListener('MSFullscreenChange', exitHandler);

    // Inicialização de variáveis de controle de elementos in-page
    /**
     *  var width           integer
     *  var status          Boolean
     *  var usuario         string
     *  var broadcastId     string
     *  var viewers         integer
     *  var cameras         Boolean
     *  var publicRoomsDiv  elem. html
     *  var inRoom          elem. html
     *  var videoPreview    elem. html
     *  var mute            elem. html
     *  var screen          elem. html
     *  var exitscreen      elem. html
     *  var vol             elem. html
     *  var cam             elem. html
     *  var pedir           elem. html
     *  var ctlPedir        elem. html
     *  var share           elem. html
     *  var videoFirst      elem. html
     *  var videoSecond     elem. html
     *  var swapFirst       elem. html
     *  var swapSecond      elem. html
     *  var broadcaster     elem. html
     *  var currentUser     string
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
    var swapSecond = document.getElementById('swap-video');
    var broadcaster = document.getElementById('broadcaster');
    var currentUser = document.getElementById('current-user').value;

    // Conexão com serviço de websocket
    // Servidor de signaling de teste gratúito:
    connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

    connection.connectSocket(function(socket) {
        // Socket - Join
        // Evento emitido para acessar uma transmissão
        socket.on('join-broadcaster', function(hintsToJoinBroadcast) {
            console.log('--> join-broadcaster', hintsToJoinBroadcast);
            broadcastStatus = 1;
            connection.session = hintsToJoinBroadcast.typeOfStreams;
            connection.sdpConstraints.mandatory = {
                OfferToReceiveVideo: true,
                OfferToReceiveAudio: true
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
                if (!isBroadcastExists) {
                    // O broadcaster TEM de definir seu user-id
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
            // Transmissão interrompida 
            console.error('--> broadcast-stopped', broadcastId);
            broadcastStatus = 0;
            callToast('<i class="fa fa-stop-circle fa-lg"></i> Transmissão finalizada!', 'red darken-3');
        });
        // Socket - Started -> Quando não há um broadcast inicia-se esse evento
        socket.on('start-broadcasting', function(typeOfStreams) {
            console.log('--> start-broadcasting', typeOfStreams);
            broadcastStatus = 1;
            // O broadcaster sempre utilizará essas configurações
            connection.sdpConstraints.mandatory = {
                OfferToReceiveVideo: true,
                OfferToReceiveAudio: true
            };
            connection.session = typeOfStreams;
            // Início da captura de mídia
            connection.open(connection.userid, isPublicModerator);
            console.log('--> Open: ' + connection.userid);
        });
        socket.on('leave-the-room', function(targetconnection) {
            console.log('Leaving...' + targetconnection.remoteUserId + '|' + connection.userid);
            if (targetconnection.remoteUserId != connection.userid) return;
            connection.leave();
        });
    });
    // Tratamento de erro para compartilhamento de tela
    connection.getScreenConstraints = function(callback) {
        getScreenConstraints(function(error, screen_constraints) {
            if (!error) {
                canShare = true;
                screen_constraints = connection.modifyScreenConstraints(screen_constraints);
                callback(error, screen_constraints);
                return;
            }
            if (error !== 'permission-denied') {
                var elem = document.getElementById('msg-share');
                var instance = M.Modal.getInstance(elem);
                instance.open();
            }
            //throw error;
        });
    };
    // Inicia a transmissão
    connection.onstream = function(event) {
        console.log('--> Conectando à stream.');
        //Apresentação da barra de funções de video
        $('#main-footer').hide();
        $('#nav-footer').slideDown(500);
        inRoom.value = event.userid;
        if (connection.isInitiator && event.type !== 'local') return;

        //event.mediaElement.removeAttribute('src');
        //event.mediaElement.removeAttribute('srcObject');

        if (event.type === 'remote' && event.stream.isScreen === true) {
            $('#span-video-preview-2nd').fadeIn(300);
            secondVideoPreview.srcObject = event.stream;
            var playPromise = secondVideoPreview.play();
            // Verifica disponibilidade de vídeo para transmissão
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                        secondVideoPreview.play();
                    })
                    .catch(error => {
                        console.log('Carregando vídeo...');
                    });
            }
            // Tratamento de telas: Botão "Swap" -> Toggle Main/Second Video
            videoSecond.onmouseenter = function() {
                $('#swap-video').show();
            }
            videoSecond.onmouseleave = function() {
                $('#swap-video').hide(200);
            }
            swapSecond.onclick = function() {
                var mvideoSrc;
                var svideoSrc;
                var position = videoSecond.getAttribute('data-position');
                if (position == 'second') {
                    videoSecond.setAttribute('data-position', 'main');
                    videoPreview.classList.add('width-limit');
                    //secondVideoPreview.classList.remove('min-video');
                } else {
                    videoSecond.setAttribute('data-position', 'second');
                    videoPreview.classList.remove('width-limit');
                }
                $('#swap-video').hide(200);
                mvideoSrc = videoPreview.srcObject;
                svideoSrc = secondVideoPreview.srcObject;
                // Pausa transmissão
                videoPreview.pause();
                secondVideoPreview.pause();
                // Inverte o caminho de fonte dos vídeo
                videoPreview.srcObject = svideoSrc;
                secondVideoPreview.srcObject = mvideoSrc;
                setTimeout(function() {
                    var playSecReady = secondVideoPreview.play();
                    var playReady = videoPreview.play();
                    // Verifica disponibilidade de vídeo para transmissão
                    if (playSecReady !== undefined && playReady !== undefined) {
                        playSecReady.then(_ => {
                                secondVideoPreview.play();
                            })
                            .catch(error => {
                                console.log('Carregando vídeo...');
                            });
                        playReady.then(_ => {
                                videoPreview.play();
                            })
                            .catch(error => {
                                console.log('Carregando vídeo...');
                            });
                    }
                }, 500);
            };
        }
        if (event.type === 'remote' && !event.stream.isScreen) {
            /**
             *  Ações para conexão REMOTA para controle de funções de áudio e video do webRTC
             */
            videoPreview.srcObject = event.stream;
            videoPreview.play();

            // Ajusta elementos de exibição (define o menu de áudio e video para ESPECTADORES)
            $('#div-connect').hide();
            ctlPedir.innerHTML = constructBtnActionPedir();
            pedir = document.getElementById('pedir-vez');

            //Controle de elementos da conexão
            if (connection.isInitiator == false && event.type === 'remote') {
                //connection.attachStreams = [event.stream];
            };

            // Constroi e envia MSG de conexão efetuada e se identifica
            /**
             *  var msgrash         array
             *  var myIdentity      string
             */
            var msgrash = [];
            var myIdentity = document.getElementById('room-id').value;
            msgrash[0] = btoa('@acessou');
            msgrash[1] = currentUser;
            msgrash[2] = broadcaster.value;
            msgrash[3] = inRoom.value;
            msgrash[4] = myIdentity;
            msgrash[5] = connection.userid;
            //connection.send(msgrash, inRoom.value);

            // Ação padrão para conexões remotas:
            /**
             * Desabilita botão de ação para microfone
             * Desabilita botão de ação para camera
             */
            setCam('dis');
            setMute('dis');
            setShare('dis');
            /**
             * Tratamento dos botões da barra de funções de video----------------------------------
             */
            // Tratamento do botão de pedir a vez
            pedir.onclick = function() {
                if (broadcastStatus == 1 && solicita === 0) {
                    // Constroi e envia MSG solicitando a vez
                    /**
                     *  var msgrash     string
                     *  var myIdentity  string
                     */
                    var msgrash = [];
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
                } else {
                    callToast('<i class="fa fa-times"></i> Não há conexão com a sala!', 'red darken-3');
                }
            };

            // Tratamento de áudio: Botão "Áudio" -> Toggle on/off
            vol.onclick = function() {
                if (vol.getAttribute('data-active') == 'enabled') {
                    // Alteração de conexão -> Set audio: false
                    [event.stream].forEach(function(stream) {
                        stream.mute('audio');
                    });
                    setVol('off');
                } else {
                    // Alteração de conexão -> Set audio: true
                    [event.stream].forEach(function(stream) {
                        stream.unmute('audio');
                    });
                    setVol('on');
                }
            };
            connection.getAllParticipants().forEach(function(participantId) {
                var user = connection.peers[participantId];
                var userextra = user.extra;
            });
            var numberOfUsers = connection.getAllParticipants().length;
            changeCounter(numberOfUsers);

        } else if (event.type === 'local' && !event.stream.isScreen) {
            /**
             *  Ações para conexão LOCAL para controle de funções de áudio e video do webRTC
             */
            connection.isUpperUserLeft = false;
            videoPreview.srcObject = event.stream;
            videoPreview.userid = event.userid;
            videoPreview.muted = true;
            videoPreview.play();

            $('#div-connect').hide();
            if (solicita <= 0) {
                $('#count-pedir-vez').hide();
            }
            // Ação padrão para conexões locais:
            /**
             * Desabilita botão de ação para áudio
             */
            setVol('dis');
            if (!connection.isInitiator) {
                setPedir('dis');
            }
            /**
             * Tratamento dos botões da barra de funções de video----------------------------------
             */
            // Tratamento de áudio: Botão "Microfone" -> Toggle on/off
            mute.onclick = function() {
                if (mute.getAttribute('data-active') == 'enabled') {
                    // Alteração de conexão -> Set audio: false
                    connection.attachStreams.forEach(function(stream) {
                        stream.mute('audio');
                    });
                    setMute('off');
                } else {
                    // Alteração de conexão -> Set audio: true
                    connection.attachStreams.forEach(function(stream) {
                        stream.unmute({
                            audio: true,
                            video: false,
                            type: 'remote'
                        });
                    });
                    setMute('on');
                }
            };
            // Tratamento de áudio e video: Botão "Camera" -> Toggle on/off
            cam.onclick = function() {
                if (cam.getAttribute('data-active') == 'enabled') {
                    // Alteração de conexão -> Set audio: false, video: false
                    connection.attachStreams.forEach(function(stream) {
                        stream.mute('video');
                        stream.mute('audio');
                    });
                    setCam('off');
                    setMute('off');
                } else {
                    // Alteração de conexão -> Set audio: true, video: true
                    connection.attachStreams.forEach(function(stream) {
                        stream.unmute('video');
                        stream.unmute('audio');
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
                        try {
                            solicita--;
                            connection.send(msgrash);
                            constructList(admResponse[1]);
                            trataSolicitacao(solicita);
                        } catch (err) {
                            callToast('<i class="fa fa-times"></i> Não foi possível responder a esta solicitação:<br>' + err + '.', 'red darken-3');
                        }
                    }
                }
            };
            // Tratamento de solicitações: Botão "Compartilhar" -> Compartilha a tela do apresentador
            share.onclick = function() {
                if (share.getAttribute('data-active') == 'enabled') {
                    if (canShare) {
                        setShare('off');
                    }
                    connection.addStream({
                        screen: true,
                        oneway: true,
                        streamCallback: function(stream) {
                            // Após confirmado o compartilhamento, inicia a renegociação da conexão com cada usuário conectado
                            setTimeout(function() {
                                connection.getAllParticipants().forEach(function(p) {
                                    console.log('Renegociando com: ' + p);
                                    connection.renegotiate(p, {
                                        screen: true,
                                        oneway: true
                                    });
                                });
                            }, 2000);
                        }
                    });
                } else {
                    setShare('on');
                }
            };
        }

        // Botão de maximizar o video -> toggle on:off
        screen.onclick = function() { fullscreen(); };
        exitscreen.onclick = function() { fullscreen(); };
        // Tratamento das funções MUTE e UNMUTE -> Obrigatórios para utilizar mute e unmute
        connection.onmute = function(e) {
            e.mediaElement.setAttribute('poster', '/img/bg.jpg');
        };
        connection.onunmute = function(e) {
            e.mediaElement.removeAttribute('poster');
        };

    };

    // Ação de criar uma sala de aula ao clicar em 'btn-join-as-productor'
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
                oneway: true
            };
            // Controle da utilização de banda
            /*
            connection.bandwidth = {
                audio: 100,
                video: 250
            };
            */
            // Inicializa Socket
            var socket = connection.getSocket();
            socket.emit('check-broadcast-presence', broadcastId, function(isBroadcastExists) {
                if (!isBroadcastExists) {
                    // Definie o user-id do broadcaster
                    connection.userid = broadcastId;
                    console.log('Definindo userid broadcaster: ' + connection.userid);
                }
                console.log('check-broadcast-presence', broadcastId, isBroadcastExists);
                socket.emit('join-broadcast', {
                    broadcastId: broadcastId,
                    userid: connection.userid,
                    typeOfStreams: connection.session
                        //bandwidth: connection.bandwidth
                });
                // Habilita funções de chat
                document.getElementById('toggle-chat').onclick = function() {
                    toggleElem('#div-chat-panel');
                    $('#text-message').focus();
                };
            });
        } else {
            callToast('<i class="fa fa-exclamation-triangle fa-lg"></i> Por favor informe todos os campos indicados!', 'red darken-3');
        }
    };
    /**
     *  var mediaElement      elem. mídia html
     */
    connection.onstreamended = function(event) {
        var mediaElement = document.getElementById(event.streamid);
        if (mediaElement) {
            mediaElement.parentNode.removeChild(mediaElement);
        }
    };

    connection.onleave = function(event) {};

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
        // Verifica padrão de URI
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
                // Verifica a cada 5 segundos
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
                        console.log('Atualizando salas...');
                        //Coleta o número de espectadores conectados à sala
                        connection.getNumberOfBroadcastViewers(moderator.userid, function(numberOfBroadcastViewers) {
                            viewers = numberOfBroadcastViewers;
                        });
                        // Verifica se quem conecta é o próprio moderador
                        if (moderator.userid == connection.userid) return;
                        // Cria labels para exibição de salas disponíveis
                        /**
                         *  var labelRoom       string
                         *  var labelClasse     string
                         *  var labelAssunto    string
                         *  var labelProfessor  string
                         *  var labelCurso      string
                         *  var labelWhois      string
                         *  var myClass         string
                         *  var allowed         Boolean
                         *  var countRooms      integer
                         *  var classes         array
                         *  var broadcastId     string
                         *  var socket          connection.socket
                         *  var message         string
                         */

                        var labelRoom = moderator.userid;
                        try {
                            labelRoom = atob(labelRoom);
                        } catch (exp) {
                            console.log('Sala fora de padrão: ' + labelRoom + ' -> ' + exp);
                            if ((array.length - 1) < 1) {
                                noRooms();
                            }
                            return;
                        }
                        var labelClasse = labelRoom.split('|')[0];
                        var labelProfessor = labelRoom.split('|')[1];
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
                            var divOpen = document.createElement('ul');
                            // Cria objeto de lista com as broadcast disponíveis
                            var card = constructAccessList(labelClasse, labelAssunto, labelProfessor, viewers, moderator.userid);

                            divOpen.innerHTML = card;
                            divOpen.className = "collection";
                            // Cria objeto botão para ingressar na broadcast selecionada
                            var button = document.createElement('a');
                            button.id = moderator.userid;
                            button.title = 'Entrar';
                            button.className = 'btn-floating blue darken-2 waves-effect waves-light secondary-content';
                            // Atribui função para ingressar na sala disponível
                            button.onclick = function() {
                                onlobby = false;
                                isModerator = false;
                                broadcaster.value = labelWhois;
                                // Desabilita e muda aparência do botão de ingresso
                                this.disabled = true;
                                var elem = document.getElementById(this.id);
                                if (hasClass(elem, "blue")) {
                                    elem.classList.remove("blue");
                                    elem.classList.add("grey");
                                }
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
                                    toggleElem('#div-chat-panel');
                                    $('#text-message').focus();
                                };
                                // Modela e apresenta título do video
                                setRoomLabel('television', labelClasse, labelAssunto);
                            };
                            button.innerHTML = '<i class="material-icons white-text">play_arrow</i>';
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
                            //Exibe mensagem de salas indisponíveis
                            noRooms();
                        }
                    });
                } else {
                    //Exibe mensagem de salas indisponíveis
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
                document.getElementById('connection-list').innerHTML = htmlList;
                changeCounter(numberOfUsers);
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
        //verifica a cada 3 segundos
        setTimeout(looper, 3000);
    })();

    /**
     *  CHAT---------------------------------------------------------
     */
    //Controles de envio e recebimento de mensagens
    document.getElementById('text-message').onkeyup = function(e) {
        //Se a tecla apertada não for ENTER -> não faça nada
        if (e.keyCode != 13) return;
        // Tratando entrada de texto
        this.value = this.value.replace(/^\s+|\s+$/g, '');
        if (!this.value.length) return;
        var texto = usuario + ": " + this.value;
        texto = btoa(texto);
        connection.send(texto);
        // Função de append de texto ao elem. textarea
        appendDIV(texto);
        this.value = '';
    };
    /**
     *  var texto string
     */
    document.getElementById('send-message-btn').onclick = function() {
        // Tratando entrada de texto
        var texto = document.getElementById('text-message').value
        texto = texto.replace(/^\s+|\s+$/g, '');
        if (!texto.length) return;
        texto = usuario + ": " + texto;
        texto = btoa(texto);
        connection.send(texto);
        // Função de append de texto ao elem. textarea
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
 *      -> mensagens em formato de array[4] (length = 5) são tratadas como solicitações;
 *      -> solicitações tem como padrão no array[0] o indicativo da solicitação;
 *      -> os indicativos sempre iniciam com @, como @PedeAVez.
 *   
 *    var chatContainer elem. html
 *    var text          string
 *    var message       string
 */
function appendDIV(event) {
    var chatContainer = document.getElementById('chat-panel');
    // Recebe mensagens externas ou internas
    var text = event.data || event;
    // Verifica a origem da mensagem, se a menssagem é um array e se este array possui mais de 4 índices
    if (event.data && (Array.isArray(text) && text.length > 4)) {
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
            }
            return;
        } else if (chkrash[0] === btoa('@PedeAVez:deny')) {
            // Indica que o broadcaster negou a solicitação do usuário
            // Verifica se o destinatário é o criador da solicitação para entregar a resposta
            console.log(chkrash[2] + '|' + myRoom);
            if (chkrash[2] === myRoom) {
                solicita--;
                setPedir('deny');
            }
            return;
        } else if (chkrash[0] === btoa('@acessou')) {
            /*
            // Indica que um usuário acessou a sala
            if (chkrash[2] === myRoom) {
                console.log(chkrash[4] + ' entrou.');
                //console.log(atob(chkrash[4]) + ' entrou.');
                var htmlList = '';
                var conarray = {
                    username: chkrash[1],
                    userid: chkrash[4],
                    announced: chkrash[5]
                };
                //connections.push(conarray);
                connections.push(conarray.userid + '|' + conarray.username + '|' + conarray.announced);
                console.log('Users: ' + connections.length, connections);
                htmlList += constructConnectionList(conarray.userid, conarray.username, conarray.announced);
                document.getElementById('connection-list').innerHTML += htmlList;
            }
            */
            return;
        }
    } else {
        // Tratamento de mensagens comuns (fora do padrão de solicitação)
        var message = atob(text);
        if (!$('#div-chat-panel').is(":visible")) {
            callToast('<i class="fa fa-comment-o blue-text"></i> ' + message + '.', 'grey darken-4');
        }
        // Versão com adaptação para o MaterializeCSS
        // Append mensagem no textarea e atualiza o tamanho do campo 
        $('#chat-panel').val(chatContainer.value + message + '\n');
        M.textareaAutoResize($('#chat-panel'));
        M.updateTextFields();
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
        // Cria lista em html para preencher a <ul> 'solicita-list'
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
        console.log('Conexões: ' + Object.keys(connections).length);
        console.log(connections);
        try {
            for (var j = 0; j < Object.keys(connections).length; j++) {
                if (connections[j].split('|')[2] == userid) {
                    connections.splice(j, 1);
                }
            }
        } catch (e) {
            return;
        }
        console.log('Restam: ' + Object.keys(connections).length);
        console.log(connections);
        constructConnectionExpList(userid);
        changeCounter(Object.keys(connections).length);
    }
}
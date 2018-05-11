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
// solicita: efetua o controle de solicitações abertas para o broadcaster
// e limita a 1 a quantidade de solicitações dos demais usuários 
var solicita = 0;
// broadcasteStatus: define se o status da conexão está ativa (1) ou inativa (0)
var broadcastStatus = 0;
// Array de viewers conectados à sala
var connections = [];
// Array de viewers com acesso bloqueado à sala
var denyConnections;

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
    connection.socketMessageEvent = 'Broadcast';

    // Elemento alvo para iniciar o stream de video
    connection.teacherVideosContainer = document.getElementById('main-video');

    // Inicialização de variáveis de controle de elementos in-page
    /**
     *  var width           integer
     *  var status          Boolean
     *  var usuario         string
     *  var viewers         integer
     *  var cameras         Boolean
     *  var publicRoomsDiv  elem. html
     *  var inRoom          elem. html
     *  var videoPreview    elem. html
     *  var mute            elem. html
     *  var vol             elem. html
     *  var cam             elem. html
     *  var pedir           elem. html
     *  var ctlPedir        elem. html
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
    var mute = document.getElementById('toggle-mute');
    var vol = document.getElementById('toggle-volume');
    var cam = document.getElementById('toggle-camera');
    var pedir = document.getElementById('pedir-vez');
    var ctlPedir = document.getElementById('control-pedir-vez');
    var broadcaster = document.getElementById('broadcaster');
    var currentUser = document.getElementById('current-user').value;

    //connection.videoPreview = document.getElementById('video-preview');


    // Conexão com serviço de websocket
    // Servidor de signaling de teste gratúito:
    connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

    connection.connectSocket(function(socket) {
        // Socket - Join
        // Evento emitido quando a transmissão já existe
        socket.on('join-broadcaster', function(hintsToJoinBroadcast) {
            console.log('--> join-broadcaster', hintsToJoinBroadcast);
            broadcastStatus = 1;
            connection.session = hintsToJoinBroadcast.typeOfStreams;
            console.log(connection.session);
            /*
            connection.sdpConstraints.mandatory = {
                OfferToReceiveVideo: !!connection.session.video,
                OfferToReceiveAudio: !!connection.session.audio
            };
            */
            connection.sdpConstraints.mandatory = {
                OfferToReceiveVideo: true,
                OfferToReceiveAudio: true
            };
            connection.broadcastId = hintsToJoinBroadcast.broadcastId;
            connection.join(hintsToJoinBroadcast.userid);
            console.log('--> Joined at: ' + hintsToJoinBroadcast.userid);
            callToast('<span class="white-text"><i class="fa fa-play-circle fa-lg"></i> Transmissão iniciada!</span>', 'blue');
        });
        // Socket - Rejoin
        socket.on('rejoin-broadcast', function(broadcastId) {
            console.log('--> rejoin-broadcast', broadcastId);
            broadcastStatus = 1;
            connection.attachStreams = [];
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
            callToast('<span class="white-text"><i class="fa fa-stop-circle fa-lg"></i> Transmissão finalizada!</span>', 'red darken-3');
        });
        // Socket - Started -> Quando não há um broadcast inicia-se esse evento
        socket.on('start-broadcasting', function(typeOfStreams) {
            console.log('--> start-broadcasting', typeOfStreams);
            broadcastStatus = 1;
            // O broadcaster sempre utilizará essas configurações
            connection.sdpConstraints.mandatory = {
                OfferToReceiveVideo: false,
                OfferToReceiveAudio: false
            };
            connection.session = typeOfStreams;
            // Início da captura de mídia
            connection.open(connection.userid, isPublicModerator);
            console.log('--> Open: ' + connection.userid);
        });
    });
    // Inicia a transmissão
    connection.onstream = function(event) {
        //Apresentação da barra de funções de video
        $('#nav-footer').slideDown(500);
        inRoom.value = event.userid;
        if (connection.isInitiator && event.type !== 'local') {
            return;
        }

        event.mediaElement.removeAttribute('src');
        event.mediaElement.removeAttribute('srcObject');

        if (event.type === 'remote') {
            /**
             *  Ações para conexão REMOTA para controle de funções de áudio e video do webRTC
             */
            videoPreview.srcObject = event.stream;
            // Definições de video
            width = parseInt(connection.teacherVideosContainer.clientWidth);
            videoPreview.width = width;
            videoPreview.play();

            // Ajusta elementos de exibição (define o menu de áudio e video para ESPECTADORES)
            $('#div-connect').hide();
            $('#broadcast-viewers-counter').hide();
            ctlPedir.innerHTML = "<li class='hover-footer-btn'>" +
                "<a id='pedir-vez' data-active='enabled' class='blue-text text-darken-3' title='Pedir a vez'>" +
                "<i class='material-icons left'>pan_tool</i> <b class='white-text hide-on-med-and-down'>Pedir a vez</b>" +
                "</a>" +
                "</li>";
            pedir = document.getElementById('pedir-vez');

            //Controle de elementos da conexão
            //videoPreview.userid = event.userid;

            if (connection.isInitiator == false && event.type === 'remote') {
                /**
                 * Verifica se a pessoa que está conectando é o produtor do conteúdo (broadcaster)
                 * e se a conexão é local. Se não:
                 * ->Está apenas fazendo um relaying de media
                 */
                /*
                //connection.dontCaptureUserMedia = true;
                connection.attachStreams = [event.stream];
                connection.sdpConstraints.mandatory = {
                    OfferToReceiveAudio: false,
                    OfferToReceiveVideo: false
                };
                */
                /*
                var socket = connection.getSocket();
                socket.emit('can-relay-broadcast');
                if (connection.DetectRTC.browser.name === 'Chrome') {
                    connection.getAllParticipants().forEach(function(p) {
                        if (p + '' != event.userid + '') {
                            var peer = connection.peers[p].peer;
                            peer.getLocalStreams().forEach(function(localStream) {
                                peer.removeStream(localStream);
                            });
                            event.stream.getTracks().forEach(function(track) {
                                peer.addTrack(track, event.stream);
                            });
                            connection.dontAttachStream = true;
                            connection.renegotiate(p);
                            connection.dontAttachStream = false;
                        }
                    });
                }
                */
                /*
                if (connection.DetectRTC.browser.name === 'Firefox') {
                    /**
                     *  Método alternativo para o Firefox utilizar 'removeStream'
                     *  Possibilita rejoin para navegadores Firefox
                     */

                /*
                    connection.getAllParticipants().forEach(function(p) {
                        if (p + '' != event.userid + '') {
                            connection.replaceTrack(event.stream, p);
                        }
                    });
                }
                // Habilita recording para navegadores Chrome.
                if (connection.DetectRTC.browser.name === 'Chrome') {
                    repeatedlyRecordStream(event.stream);
                }
                */
            };

            // Constroi e envia MSG de conexão efetuada e se identifica
            /**
             *  var msgrash     string
             *  var myIdentity  string
             */
            var msgrash = [];
            var myIdentity = document.getElementById('room-id').value;
            msgrash[0] = btoa('@acessou');
            msgrash[1] = currentUser;
            msgrash[2] = broadcaster.value;
            msgrash[3] = inRoom.value;
            msgrash[4] = myIdentity;
            connection.send(msgrash);

            // Ação padrão para conexões remotas:
            /**
             * Desabilita botão de ação para microfone
             * Desabilita botão de ação para camera
             */
            setCam('dis');
            setMute('dis');

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
                        connection.send(msgrash);
                        solicita++;
                        callToast('<span class="white-text"><i class="fa fa-check"></i> Solicitação enviada!</span>', 'blue darken-2');
                    } catch (err) {
                        callToast('<span class="white-text"><i class="fa fa-times"></i> Não foi possível solicitar a vez: ' + err + '.</span>', 'red darken-3');
                    }
                } else if (solicita > 0) {
                    callToast('<span class="white-text"><i class="fa fa-exclamation-triangle"></i> Você já encaminhou uma solicitação.<br>Aguarde a resposta.</span>', 'amber darken-4');
                } else {
                    callToast('<span class="white-text"><i class="fa fa-times"></i> Não há conexão com a sala!</span>', 'red darken-3');
                }
            };
            // Tratamento de áudio: Botão "Áudio" -> Toggle on/off
            vol.onclick = function() {
                if (vol.getAttribute('data-active') == 'enabled') {
                    // Alteração de conexão -> Set audio: false
                    connection.attachStreams.forEach(function(stream) {
                        stream.mute('audio');
                    });
                    setVol('off');
                } else {
                    // Alteração de conexão -> Set audio: true
                    connection.attachStreams.forEach(function(stream) {
                        stream.unmute('audio');
                    });
                    setVol('on');
                }
            };
        } else {
            /**
             *  Ações para conexão LOCAL para controle de funções de áudio e video do webRTC
             */
            connection.isUpperUserLeft = false;
            videoPreview.srcObject = event.stream;
            // Definições de video
            width = parseInt(connection.teacherVideosContainer.clientWidth);
            videoPreview.width = width;
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
            document.getElementById('control-pedir-vez').onclick = function() {
                var response;
                // Tratamento de respostas (permitir / negar)
                response = document.getElementsByClassName('responses');
                for (var j = 0; j < response.length; j++) {
                    response[j].onclick = function() {
                        var admResponse = this.id.split('-');
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
                            callToast('<span class="white-text"><i class="fa fa-times"></i> Não foi possível responder a esta solicitação:<br>' + err + '.</span>', 'red darken-3');
                        }
                    }
                }
            };
        }
        // Tratamento das funções MUTE e UNMUTE (Obrigatórios)
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
            var roomCursos = strValues;
            var roomHash = btoa(materia + "|" + roomName + "|" + assunto + "|" + roomCursos + "|" + roomId);
            usuario = roomName;
            var broadcastId = roomHash;

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
            // Inicializa Socket
            var socket = connection.getSocket();
            socket.emit('check-broadcast-presence', broadcastId, function(isBroadcastExists) {
                if (!isBroadcastExists) {
                    // O broadcaster TEM de definir seu user-id
                    connection.userid = broadcastId;
                }
                console.log('check-broadcast-presence', broadcastId, isBroadcastExists);
                socket.emit('join-broadcast', {
                    broadcastId: broadcastId,
                    userid: connection.userid,
                    typeOfStreams: connection.session
                });
                // Habilita funções de chat
                document.getElementById('toggle-chat').onclick = function() {
                    toggleElem('#div-chat-panel');
                    $('#text-message').focus();
                };
            });
        } else {
            callToast('<span class="white-text"><i class="fa fa-exclamation-triangle fa-lg"></i> Por favor informe todos os campos indicados!</span>', 'red darken-3');
        }
    }

    connection.onstreamended = function(event) {
        var mediaElement = document.getElementById(event.streamid);
        if (mediaElement) {
            mediaElement.parentNode.removeChild(mediaElement);
        }
    };
    /**
     *  var socket      connection.socket
     *  var lastBlob    array
     *  var recorder    connection.currentRecorder
     */
    connection.onleave = function(event) {
        /*
        if (event.userid !== videoPreview.userid) return;
        var socket = connection.getSocket();
        socket.emit('can-not-relay-broadcast');
        connection.isUpperUserLeft = true;
        if (allRecordedBlobs.length) {
            // Play o último blob gravado
            var lastBlob = allRecordedBlobs[allRecordedBlobs.length - 1];
            videoPreview.src = URL.createObjectURL(lastBlob);

            // Definições de video
            width = parseInt(connection.teacherVideosContainer.clientWidth);
            videoPreview.width = width;
            videoPreview.play();
            $('#div-connect').hide();
            allRecordedBlobs = [];

        } else if (connection.currentRecorder) {
            var recorder = connection.currentRecorder;
            connection.currentRecorder = null;
            recorder.stopRecording(function() {
                if (!connection.isUpperUserLeft) return;
                videoPreview.src = URL.createObjectURL(recorder.getBlob());
                //Definições de video
                width = parseInt(connection.teacherVideosContainer.clientWidth);
                videoPreview.width = width;
                videoPreview.play();
                $('#div-connect').hide();
            });
        }
        if (connection.currentRecorder) {
            connection.currentRecorder.stopRecording();
            connection.currentRecorder = null;
        }
        */
    };
    /*
    // Lista blob de gravação 
    var allRecordedBlobs = [];
    // Atualiza blob de gravação a cada 30 segundos
    function repeatedlyRecordStream(stream) {
        if (!enableRecordings) {
            return;
        }
        connection.currentRecorder = RecordRTC(stream, {
            type: 'video'
        });
        connection.currentRecorder.startRecording();
        setTimeout(function() {
            if (connection.isUpperUserLeft || !connection.currentRecorder) {
                return;
            }
            connection.currentRecorder.stopRecording(function() {
                allRecordedBlobs.push(connection.currentRecorder.getBlob());
                if (connection.isUpperUserLeft) {
                    return;
                }
                connection.currentRecorder = null;
                repeatedlyRecordStream(stream);
            });
        }, 30 * 1000); // 30 segundos
    };
    */

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
    document.getElementById('room-id').value = broadcastId;
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
                    //document.getElementById('btn-join-as-productor').onclick();
                    document.getElementById(broadcastId).onclick();
                    return;
                }
                setTimeout(reCheckRoomPresence, 5000); // 5 segundos
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
        //Verifica a existência de uma sala pública
        connection.getPublicModerators(function(array) {
            publicRoomsDiv.innerHTML = '';
            // Se existir alguma sala pública execute
            if (array.length > 0) {
                array.forEach(function(moderator) {
                    // Definições de moderador:
                    /*  moderator.userid
                     *  moderator.extra
                     */
                    //Coleta o número de espectadores conectados à sala
                    connection.getNumberOfBroadcastViewers(moderator.userid, function(numberOfBroadcastViewers) {
                        viewers = numberOfBroadcastViewers;
                        //console.log(connection.userid + ": " + numberOfBroadcastViewers);
                    });

                    // Verifica se quem conecta é o próprio moderador
                    if (moderator.userid == connection.userid) {
                        return;
                    }
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
                    labelRoom = atob(labelRoom);
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
                    for ($i = 0; $i < classes.length; $i++) {
                        if (labelCurso.indexOf(classes[$i]) > -1) {
                            allowed = true;
                        }
                    }
                    // Se for permitido
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
                        var card = mountAccessList(labelClasse, labelAssunto, labelProfessor, viewers, moderator.userid);

                        divOpen.innerHTML = card;
                        divOpen.className = "collection";
                        // Cria objeto botão de ingresso na broadcast selecionada
                        var button = document.createElement('a');
                        button.id = moderator.userid;
                        button.title = 'Entrar';
                        button.className = 'btn-floating blue darken-2 waves-effect waves-light secondary-content';
                        // Atribui função para ingressar na sala disponível
                        button.onclick = function() {
                            broadcaster.value = labelWhois;
                            // Desabilita e muda aparência do botão de ingresso
                            this.disabled = true;
                            var elem = document.getElementById(this.id);
                            if (hasClass(elem, "blue")) {
                                elem.classList.remove("blue");
                                elem.classList.add("grey");
                            }
                            // Inicializa apresentação
                            callTeacherStream();

                            var broadcastId = this.id;
                            document.getElementById(this.id).disabled = true;

                            // Definições de sessão
                            connection.session = {
                                audio: false,
                                video: false,
                                data: true,
                                oneway: true
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
                        noRooms();
                    }
                });
            } else {
                noRooms();
            }
            setTimeout(looper, 3000); //3 segundos
        });
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
    //Envio de mensagem
    connection.onmessage = appendDIV;

});
/**
 * FUNCTIONS-------------------------------------------------------------------
 */

//Trata e escreve mensagem de chat
/*
 *    var chatContainer elem. html
 *    var text          string
 *    var message       string
 */
function appendDIV(event) {
    var chatContainer = document.getElementById('chat-panel');
    var text = event.data || event;
    // Verifica a origem da mensagem
    if (event.data && text.length == 5) {
        var chkrash = event.data;
        var msgData = [];
        var myRoom = document.getElementById('room-id').value;
        // Identifica se a mensagem é uma solicitação de serviço
        if (chkrash[0] === btoa('@PedeAVez')) {
            msgData[0] = chkrash[1];
            msgData[1] = (atob(chkrash[3])).split('|')[4];
            msgData[2] = chkrash[4];
            listBox(msgData);
            return;
        } else if (chkrash[0] === btoa('@PedeAVez:allow')) {
            // Verifica se o destinatário é o criador da solicitação para entregar a resposta
            if (chkrash[2] === myRoom) {
                // Mensagem de aprovação de solicitação
                solicita--;
                setPedir('allow');
            }
            return;
        } else if (chkrash[0] === btoa('@PedeAVez:deny')) {
            // Verifica se o destinatário é o criador da solicitação para entregar a resposta
            if (chkrash[2] === myRoom) {
                // Mensagem de solicitação negada
                solicita--;
                setPedir('deny');
            }
            return;
        } else if (chkrash[0] === btoa('@acessou')) {
            if (chkrash[2] === myRoom) {
                console.log(chkrash[4] + ' entrou.');
                var htmlList = '';
                var conarray = {
                    username: chkrash[1],
                    userid: chkrash[4]
                };
                connections.push(conarray);
                htmlList += constructConnectionList(conarray.userid, conarray.username);
                document.getElementById('connection-list').innerHTML += htmlList;
            }
            return;
        }
    } else {
        var message = atob(text);
        if (!$('#div-chat-panel').is(":visible")) {
            callToast('<span class="white-text"><i class="fa fa-comment-o blue-text"></i> ' + message + '</span>', 'grey darken-4');
        }
        // Versão com adaptação para o MaterializeCSS
        // Append mensagem no textarea e atualiza o tamanho do campo 
        $('#chat-panel').val(chatContainer.value + message + '\n');
        M.textareaAutoResize($('#chat-panel'));
        M.updateTextFields();
    }
}

// Lista todas as solicitações de "Pedir a vez" e incrementa contador
function listBox(text) {
    var msg = text;
    var receiver = document.getElementById('room-id').value
    var pedeList = document.getElementById('solicita-list');
    var htmlList;
    // Verifica se o destinatário é o broadcaster para entregar a solicitação
    if (msg[1] === receiver) {
        /**
         *  Alteração de UI
         */
        solicita++;
        trataSolicitacao(solicita);
        // Cria lista em html para preencher a <ul> 'solicita-list'
        /**
         *  Classes css:
         *      sol-response    -> <li> que representa uma solicitação;
         *      responses.      -> <a> que representa uma resposta a uma solicitação;
         *  São de uso exclusivo desta função e classificam todas as solicitações enviadas ao broadcaster
         */
        // Constroi elemento e concatena
        htmlList = constructSolicitationList(msg[2], msg[0]);
        pedeList.innerHTML += htmlList;
        callToast('<span class="white-text"><i class="material-icons">pan_tool</i> ' + msg[0] + ' solicita a vez!</span>', 'blue darken-2');
    }
}
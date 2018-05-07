/**
 *  Javascript + JQuery + WebRTC
 *  Controle de transmissão de mídia com stream;
 *  Controle de acesso de usuários por perfil;
 *  Configurações do WebRTC -> Sockets e RTCMulticonnection
 *                          -> Transmissão escalável em Broadcast
 *                          -> Controles do Chat
 *                          -> Controles de envio e recebimento de mensagens;
 *  Validação de campos de formulários;
 *  Utilizado EXCLUSIVAMENTE para rotas salas/*;
 */

$(document).ready(function() {
    //Application - Inicia a chamada e tratamento de multiconexão
    /**
     *  var connection          RTCMultiConnection
     *  var enableRecordings    Boolean
     *  var isPublicModerator   Boolean
     */
    var enableRecordings = false;
    var isPublicModerator = true;
    var connection = new RTCMultiConnection();

    // Definições de conexão
    connection.enableScalableBroadcast = true;
    connection.maxRelayLimitPerUser = 1;
    connection.autoCloseEntireSession = true;
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
     *  var videoPreview    elem. html
     *  var mute            elem. html
     *  var vol             elem. html
     *  var cam             elem. html
     */
    var width;
    var status = false;
    var usuario = '';
    var viewers = 'Calculando...';
    var cameras;
    var publicRoomsDiv = document.getElementById('public-conference');
    var videoPreview = document.getElementById('video-preview');
    var mute = document.getElementById('toggle-mute');
    var vol = document.getElementById('toggle-volume');
    var cam = document.getElementById('toggle-camera');

    // Controles de Áudio com Gain - EM TESTES
    var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    var gainNode = audioCtx.createGain();
    var source;

    // Conexão com serviço de websocket
    // Servidor de signaling de teste gratúito:
    connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

    connection.connectSocket(function(socket) {
        // Socket - Join
        // Evento emitido quando a transmissão já existe
        socket.on('join-broadcaster', function(hintsToJoinBroadcast) {
            console.log('2**join-broadcaster', hintsToJoinBroadcast);
            connection.session = hintsToJoinBroadcast.typeOfStreams;
            console.log(connection.session);
            connection.sdpConstraints.mandatory = {
                OfferToReceiveVideo: !!connection.session.video,
                OfferToReceiveAudio: !!connection.session.audio
            };
            connection.broadcastId = hintsToJoinBroadcast.broadcastId;
            connection.join(hintsToJoinBroadcast.userid);
            console.log('Joined at: ' + hintsToJoinBroadcast.userid);
            toastContent = '<span class="white-text"><i class="fa fa-play-circle fa-lg"></i> Transmissão iniciada!</span>';
            M.toast({ html: toastContent, classes: 'blue' });
        });
        // Socket - Rejoin
        socket.on('rejoin-broadcast', function(broadcastId) {
            console.log('**rejoin-broadcast', broadcastId);
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
            console.error('broadcast-stopped', broadcastId);
            toastContent = '<span class="white-text"><i class="fa fa-stop-circle fa-lg"></i> Transmissão finalizada!</span>';
            M.toast({ html: toastContent, classes: 'red darken-3' });
        });
        // Socket - Started -> Quando não há um broadcast inicia-se esse evento
        socket.on('start-broadcasting', function(typeOfStreams) {
            console.log('**start-broadcasting', typeOfStreams);
            // O broadcaster sempre utilizará essas configurações
            connection.sdpConstraints.mandatory = {
                OfferToReceiveVideo: false,
                OfferToReceiveAudio: false
            };
            connection.session = typeOfStreams;
            // Início da captura de mídia
            connection.open(connection.userid, true);
            console.log('Open: ' + connection.userid);
        });
    });
    window.onbeforeunload = function() {
        document.getElementById('btn-join-as-productor').disabled = false;
    };
    connection.onstream = function(event) {
        if (connection.isInitiator && event.type !== 'local') {
            return;
        }
        if (event.type === 'remote') {
            /**
             *  Ações para conexão REMOTA:
             */
            connection.isUpperUserLeft = false;
            videoPreview.srcObject = event.stream;
            // Definições de video
            width = parseInt(connection.teacherVideosContainer.clientWidth);
            videoPreview.width = width;
            $('#div-connect').hide();
            videoPreview.play();
            //console.log(event);

            videoPreview.userid = event.userid;
            if (connection.isInitiator == false && event.type === 'remote') {
                /**
                 * Verifica se a pessoa que está conectando é o produtor do conteúdo (broadcaster)
                 * e se a conexão é local. Se não:
                 * ->Está apenas fazendo um relaying de media
                 */
                console.log('3**STREAM Remoto!');
                connection.dontCaptureUserMedia = true;
                connection.attachStreams = [event.stream];
                connection.sdpConstraints.mandatory = {
                    OfferToReceiveAudio: false,
                    OfferToReceiveVideo: false
                };
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
                if (connection.DetectRTC.browser.name === 'Firefox') {
                    /**
                     *  Método alternativo para o Firefox utilizar 'removeStream'
                     *  Possibilita rejoin para navegadores Firefox
                     */
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

                // Ação padrão para conexões remotas:
                /**
                 * Desabilita botão de ação para microfone
                 * Desabilita botão de ação para camera
                 */
                mute.setAttribute('data-active', 'disabled');
                // Alteração visual - Desabilita
                mute.classList.remove("blue-text");
                mute.classList.add("grey-text");
                mute.innerHTML = "<i class='material-icons left'>mic_off</i> <b class='hide-on-med-and-down'>Microfone</b>";

                cam.setAttribute('data-active', 'disabled');
                // Alteração visual - Desabilita
                cam.classList.remove("blue-text");
                cam.classList.add("grey-text");
                cam.innerHTML = "<i class='material-icons left'>videocam_off</i> <b class='hide-on-med-and-down'>Camera</b>";
            };

            // Tratamento de áudio: Botão "Áudio" -> Toggle on/off
            document.getElementById('toggle-volume').onclick = function() {
                if (vol.getAttribute('data-active') == 'enabled') {
                    vol.setAttribute('data-active', 'disabled');
                    // Alteração visual - Desabilita
                    vol.classList.remove("blue-text");
                    vol.classList.add("red-text");
                    vol.innerHTML = "<i class='material-icons left'>volume_off</i> <b class='white-text hide-on-med-and-down'>Áudio</b>";
                    toastContent = '<span class="white-text"><i class="material-icons left">volume_off</i> Áudio Desabilitado.</span>';
                    M.toast({ html: toastContent, classes: 'red darken-3' });
                    // Alteração de conexão -> Set audio: false
                    connection.attachStreams.forEach(function(stream) {
                        stream.mute('audio');
                    });
                } else {
                    vol.setAttribute('data-active', 'enabled');
                    // Alteração visual - Habilita
                    vol.classList.remove("red-text");
                    vol.classList.add("blue-text");
                    vol.innerHTML = "<i class='material-icons left'>volume_up</i> <b class='white-text hide-on-med-and-down'>Áudio</b>";
                    toastContent = '<span class="white-text"><i class="material-icons left">volume_up</i> Áudio Habilitado.</span>';
                    M.toast({ html: toastContent, classes: 'blue darken-3' });
                    // Alteração de conexão -> Set audio: true
                    connection.attachStreams.forEach(function(stream) {
                        stream.unmute('audio');
                    });
                }
            };
        } else {
            /**
             *  Ações para conexão LOCAL:
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
            console.log(event.stream);

            // Ação padrão para conexões locais:
            /**
             * Desabilita botão de ação para áudio
             */
            vol.setAttribute('data-active', 'disabled');
            // Alteração visual - Desabilita
            vol.classList.remove("blue-text");
            vol.classList.add("grey-text");
            vol.innerHTML = "<i class='material-icons left'>volume_off</i> <b class='hide-on-med-and-down'>Áudio</b>";

            // Tratamento de áudio: Botão "Microfone" -> Toggle on/off
            document.getElementById('toggle-mute').onclick = function() {
                if (mute.getAttribute('data-active') == 'enabled') {
                    mute.setAttribute('data-active', 'disabled');
                    // Alteração visual - Desabilita
                    mute.classList.remove("blue-text");
                    mute.classList.add("red-text");
                    mute.innerHTML = "<i class='material-icons left'>mic_off</i> <b class='white-text hide-on-med-and-down'>Microfone</b>";
                    toastContent = '<span class="white-text"><i class="material-icons left">mic_off</i> Microfone Desabilitado.</span>';
                    M.toast({ html: toastContent, classes: 'red darken-3' });
                    // Alteração de conexão -> Set audio: false
                    connection.attachStreams.forEach(function(stream) {
                        stream.mute('audio');
                    });
                } else {
                    mute.setAttribute('data-active', 'enabled');
                    // Alteração visual - Habilita
                    mute.classList.remove("red-text");
                    mute.classList.add("blue-text");
                    mute.innerHTML = "<i class='material-icons left'>mic</i> <b class='white-text hide-on-med-and-down'>Microfone</b>";
                    toastContent = '<span class="white-text"><i class="material-icons left">mic</i> Microfone Habilitado.</span>';
                    M.toast({ html: toastContent, classes: 'blue darken-3' });
                    // Alteração de conexão -> Set audio: true
                    connection.attachStreams.forEach(function(stream) {
                        stream.unmute({
                            audio: true,
                            video: false,
                            type: 'remote'
                        });
                    });
                }
            }

            // Tratamento de áudio e video: Botão "Camera" -> Toggle on/off
            document.getElementById('toggle-camera').onclick = function() {
                if (cam.getAttribute('data-active') == 'enabled') {
                    cam.setAttribute('data-active', 'disabled');
                    // Alteração visual - Desabilita
                    cam.classList.remove("blue-text");
                    cam.classList.add("red-text");
                    cam.innerHTML = "<i class='material-icons left'>videocam_off</i> <b class='white-text hide-on-med-and-down'>Camera</b>";

                    mute.setAttribute('data-active', 'disabled');
                    // Alteração visual - Desabilita
                    mute.classList.remove("blue-text");
                    mute.classList.add("red-text");
                    mute.innerHTML = "<i class='material-icons left'>mic_off</i> <b class='white-text hide-on-med-and-down'>Microfone</b>";
                    toastContent = '<span class="white-text"><i class="material-icons left">videocam_off</i> Camera Desabilitada.</span>';
                    M.toast({ html: toastContent, classes: 'red darken-3' });
                    // Alteração de conexão -> Set audio: false, video: false
                    connection.attachStreams.forEach(function(stream) {
                        stream.mute('video');
                        stream.mute('audio');
                    });
                } else {
                    cam.setAttribute('data-active', 'enabled');
                    // Alteração visual - Habilita
                    cam.classList.remove("red-text");
                    cam.classList.add("blue-text");
                    cam.innerHTML = "<i class='material-icons left'>videocam</i> <b class='white-text hide-on-med-and-down'>Camera</b>";

                    mute.setAttribute('data-active', 'enabled');
                    // Alteração visual - Habilita
                    mute.classList.remove("red-text");
                    mute.classList.add("blue-text");
                    mute.innerHTML = "<i class='material-icons left'>mic</i> <b class='white-text hide-on-med-and-down'>Microfone</b>";
                    toastContent = '<span class="white-text"><i class="material-icons left">videocam</i> Camera Habilitada.</span>';
                    M.toast({ html: toastContent, classes: 'blue darken-3' });
                    // Alteração de conexão -> Set audio: true, video: true
                    connection.attachStreams.forEach(function(stream) {
                        stream.unmute('video');
                        stream.unmute('audio');
                    });
                }
            }
        }
        // Tratamento das funções mute e unmute (Obrigatórios)
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
        var roomId = Math.floor((Math.random() * 999999) + 0);
        var materia = document.querySelector('#tema').value;
        var assunto = document.querySelector('#assunto').value;
        var roomName = document.getElementById('current-user').value;
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
            // Modela e apresenta título do video
            setRoomLabel("<i class='fa fa-video-camera blue-text'></i> <b>" + materia + "</b> (" + assunto + ")" +
                "<span class='right'><a href='' title='Finalizar' class='red-text text-darken-3'>" +
                "<i class='fa fa-times'></i></a></span>");

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
                // Função de ajuste de volume: DESABILITADA
                /*
                document.getElementById('toggle-volume').onclick = function() {
                    toggleElem('#div-volume-panel');
                    $('#vol-control').focus();
                }
                */
            });
        } else {
            toastContent = '<span class="white-text"><i class="fa fa-exclamation-triangle fa-lg"></i> Por favor informe todos os campos indicados!</span>';
            M.toast({ html: toastContent, classes: 'red darken-3' });
        }
    }

    connection.onstreamended = function() {};
    /**
     *  var socket      connection.socket
     *  var lastBlob    array
     *  var recorder    connection.currentRecorder
     */
    connection.onleave = function(event) {
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
    };
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
                    document.getElementById('btn-join-as-productor').onclick();
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
        document.getElementById('broadcast-viewers-counter').innerHTML = '<i class="fa fa-desktop"></i> <b class="grey-text text-darken-3">' + event.numberOfBroadcastViewers + '</b>';
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
                    /*
                     *  var labelRoom       string
                     *  var labelClasse     string
                     *  var labelAssunto    string
                     *  var labelProfessor  string
                     *  var labelCurso      string
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
                        usuario = document.getElementById('myName').value;
                        var divOpen = document.createElement('ul');
                        // Cria objeto de lista com as broadcast disponíveis
                        var card = '<li class="collection-item avatar grey-text text-darken-3">' +
                            '<i class="material-icons circle blue">videocam</i>' +
                            '<span class="title"><b>' + labelClasse + ' (' + labelAssunto + ')' + '</b></span>' +
                            '<p>' +
                            '<b class="blue-text">Professor:</b> ' + labelProfessor +
                            '</p>' +
                            '<p>' +
                            '<b class="blue-text">Espectadores:</b> ' + viewers +
                            '</p>' +
                            '<span id="_' + moderator.userid + '">' +
                            '</span>' +
                            '</li>';

                        divOpen.innerHTML = card;
                        divOpen.className = "collection";
                        // Cria objeto botão de ingresso na broadcast selecionada
                        var button = document.createElement('a');
                        button.id = moderator.userid;
                        button.title = 'Entrar';
                        button.className = 'btn-floating blue waves-effect waves-light secondary-content';
                        // Atribui função para ingressar na sala disponível
                        button.onclick = function() {
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
                                audio: true,
                                video: true,
                                data: true,
                                oneway: true
                            };
                            // Inicializa socket
                            var socket = connection.getSocket();
                            socket.emit('check-broadcast-presence', broadcastId, function(isBroadcastExists) {
                                if (!isBroadcastExists) {
                                    // O broadcaster TEM de definir seu user-id
                                    connection.userid = broadcastId;
                                }
                                console.log('1**check-broadcast-presence', broadcastId, isBroadcastExists);
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
                                // Função de ajuste de volume: DESABILITADA
                                /*
                                document.getElementById('toggle-volume').onclick = function() {
                                    toggleElem('#div-volume-panel');
                                    $('#vol-control').focus();
                                };
                                */
                            });
                            // Modela e apresenta título do video
                            setRoomLabel("<i class='fa fa-television blue-text'></i> <b>" + labelClasse + "</b> (" + labelAssunto + ")" +
                                "<span class='right'><a href='' title='Sair' class='red-text text-darken-3'>" +
                                "<i class='fa fa-times'></i></a></span>");
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
                        //Mensagem de retorno para 0 salas encontradas na escola determinada
                        var divOpen = document.createElement('div');
                        var message = "<div class='red-text' style='margin-top:20px;' align='center'>" +
                            "<i class='fa fa-times fa-lg red-text text-darken-3'></i> <b>Não há salas disponíveis.</b>" +
                            "</div>";
                        divOpen.innerHTML = message;
                        publicRoomsDiv.appendChild(divOpen);
                    }
                });
            } else {
                //Mensagem de retorno para 0 salas encontradas
                var divOpen = document.createElement('div');
                var message = "<div class='red-text' style='margin-top:20px;' align='center'>" +
                    "<i class='fa fa-times fa-lg red-text text-darken-3'></i> <b>Não há salas disponíveis.</b>" +
                    "</div>";
                divOpen.innerHTML = message;
                publicRoomsDiv.appendChild(divOpen);
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
        this.value = usuario + ": " + this.value;
        connection.send(this.value);
        // Função de append de texto ao elem. textarea
        appendDIV(this.value);
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
//Verifica a existência de dispositivos de vídeo
function getCameras(sourceInfos) {
    if (sourceInfos.length > 0) {
        cameras = true;
    }
}
//Verificação de classes para elementos html
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
//Exibição de campos de vídeo
function callTeacherStream() {
    $('#initial-access').slideUp(300);
    $('#video-panel').slideDown(300);
}
//Define label da sala acessada
/*
 *  var roomtitle  html elem.
 */
function setRoomLabel(label) {
    var roomtitle = document.getElementById('class-title');
    roomtitle.innerHTML = label;
}
//Cria elementos com as definições da sala criada
/*
 *    var roomHashURL           string
 *    var roomQueryStringURL    string
 *    var html                  string
 *    var roomURLsDiv           elem. html
 */
function showRoomURL(roomid, className, classTheme) {
    var roomHashURL = '#' + roomid;
    var roomQueryStringURL = '?roomid=' + roomid;
    var html = '<h6 class="card-title"><i class="fa fa-circle light-green-text text-accent-4"></i> Aula iniciada.</h6>';
    var roomURLsDiv = document.getElementById('room-urls');
    roomURLsDiv.innerHTML = html;
    roomURLsDiv.style.display = 'block';
}
//Trata e escreve mensagem de chat
/*
 *    var chatContainer elem. html
 *    var text          string
 *    var message       string
 */
function appendDIV(event) {
    var chatContainer = document.getElementById('chat-panel');
    var text = event.data || event;
    var message = text;
    if (!$('#div-chat-panel').is(":visible")) {
        toastContent = '<span class="white-text"><i class="fa fa-comment-o blue-text"></i> ' + message + '</span>';
        M.toast({ html: toastContent, classes: 'grey darken-4' });
    }
    //Versão com adaptação para o MaterializeCSS
    $('#chat-panel').val(chatContainer.value + message + '\n');
    M.textareaAutoResize($('#chat-panel'));
    M.updateTextFields();
}
//Controle de Volume
window.SetVolume = function(val) {
        var player = document.getElementById('video-preview');
        console.log('Before: ' + player.volume);
        player.volume = val / 100;
        //player.controls = false;
        player.play();
        console.log('After: ' + player.volume);
    }
    //Toggle de controle de audio para elem. video
function toggleControls() {
    var player = document.getElementById('video-preview');
    if (player.hasAttribute("controls")) {
        player.removeAttribute("controls");
    } else {
        player.setAttribute("controls", "controls");
    }
}
//Controle para exibição toggle de elem. html
function toggleElem(elemId) {
    if ($(elemId).is(":visible")) {
        $(elemId).slideUp(500);
    } else {
        $(elemId).slideDown(500);
    }
}
$(document).ready(function() {
    //Application - Inicia a chamada e tratamento de multiconexão
    /**
     * Variáveis globais
     *  var connection RTCMultiConnection
     *  var status Boolean
     *  var usuario string
     *  var cameras integer
     */
    var connection = new RTCMultiConnection();
    var status = false;
    var usuario = '';
    var cameras;

    //Conexão com serviço de websocket
    //Servidor  de signaling gratúito https://rtcmulticonnection.herokuapp.com:443/
    connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
    //connection.socketURL = 'https://pinechart.com:3000/';

    //Definição de elementos da conferência; Audio e Video
    navigator.mediaDevices.enumerateDevices(getCameras);
    if (cameras) {
        connection.session = {
            audio: true,
            video: true,
            data: true
        }
    } else {
        connection.session = {
            audio: true,
            video: false,
            data: true
        }
    }
    connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
    }

    //Controles de envio e recebimento de mensagens
    document.getElementById('text-message').onkeyup = function(e) {
        //Se a tecla apertada não for ENTER -> não faça nada
        if (e.keyCode != 13) return;
        // Tratando entrada
        this.value = this.value.replace(/^\s+|\s+$/g, '');
        if (!this.value.length) return;
        this.value = usuario + ": " + this.value;
        connection.send(this.value);
        appendDIV(this.value);
        this.value = '';
    };
    /**
     *  var texto string
     */
    document.getElementById('send-message-btn').onclick = function() {
        // Tratando entrada
        var texto = document.getElementById('text-message').value
        texto = texto.replace(/^\s+|\s+$/g, '');
        if (!texto.length) return;
        texto = usuario + ": " + texto;
        connection.send(texto);
        appendDIV(texto);
        document.getElementById('text-message').value = '';
    };
    //Envio de mensagem
    connection.onmessage = appendDIV;

    document.getElementById('btn-join-as-productor').onclick = function() {
        //Ação de criar uma sala de aula ao clicar em 'btn-join-as-productor'
        /*
         *    var isPublicModerator Boolean
         *    var elem  html elem.
         *    var materia   string
         *    var assunto   string
         *    var escola    string
         *    var turma     string
         *    var roomLabel string
         *    var roomId    integer
         *    var roomName  string
         *    var roomEscola    integer
         *    var roomHash  string
         */
        var isPublicModerator = true;
        var elem = document.getElementById(this.id);
        var materia = document.querySelector('#materia').value;
        var assunto = document.querySelector('#assunto').value;

        var turma = document.querySelector('#turma').value;
        console.log(turma.value);
        var escola = document.querySelector('#escola').value;
        var roomLabel = escola.split('|')[1] + " (" + turma.split('|')[1] + ")" + ": " + materia;

        var roomId = Math.floor((Math.random() * 999999) + 0);
        var roomName = document.getElementById('current-user').value;
        var roomEscola = document.getElementById('codEscola').value;
        var roomHash = btoa(materia + "|" + roomName + "|" + escola.split('|')[1] + "|" + roomEscola + "|" + turma.split('|')[1]);
        usuario = roomName;
        callTeacherStream();

        //Verifica os campos materia e assunto, ambos devem ser informados
        if (materia && assunto) {
            this.disabled = true;
            materia.disabled = true;
            assunto.disabled = true;

            if (hasClass(elem, "green")) {
                elem.classList.remove("green");
                elem.classList.add("grey");
            }
            //Elementos do documento apontados
            connection.teacherVideosContainer = document.getElementById('main-video');
            connection.classVideosContainer = document.getElementById('class-video');

            //Abertura da sala
            connection.open(roomHash, isPublicModerator);
            //Início da transmissão
            connection.onstream = function(event) {
                //Verifica se a conexão é local ou remota
                if (event.type === 'local') {
                    //Se a criação da sala for uma conexão local: Exibe
                    connection.teacherVideosContainer.innerHTML = '';
                    //As definições de conexão local para um usuário do tipo professor são definidas por padrão com alta prioridade
                    connection.teacherVideosContainer.appendChild(event.mediaElement);
                    event.mediaElement.play();
                    setTimeout(function() {
                        event.mediaElement.play();
                    }, 5000);
                    event.mediaElement.muted = true;
                    event.mediaElement.owner = 'User';
                    document.getElementById('room-id').value = roomHash;

                    setStatus('online');
                    showRoomURL(roomHash, materia, assunto);
                    setRoomLabel(roomLabel);

                    var width = parseInt(connection.teacherVideosContainer.clientWidth);
                    event.mediaElement.width = width;
                    event.mediaElement.className = 'constructed-videos z-depth-3';

                    console.log('Stream: ' + event.mediaElement.id);
                    connection.extra.modifiedValue = event.mediaElement.id;
                    connection.updateExtraData();
                    document.getElementById('toggle-chat').onclick = function() {
                        showChat();
                    }
                } else {
                    //Se a criação da sala for de uma conexão remota: Não faça nada.
                    /*
                    //Conexões efetuadas a partir de um ponto remoto recebem tratamento de entradas de vídeo comuns
                    connection.classVideosContainer.innerHTML = '<br><br>';
                    connection.classVideosContainer.appendChild(event.mediaElement);
                    event.mediaElement.play();
                    setTimeout(function() {
                        event.mediaElement.play();
                    }, 5000);
                    //event.mediaElement.elem = roomHash;
                    document.getElementById('room-id').value = roomHash;

                    setStatus('online');
                    showRoomURL(roomHash, materia, assunto);
                    setRoomLabel(roomLabel);

                    var width = parseInt(connection.classVideosContainer.clientWidth);
                    event.mediaElement.width = width;
                    event.mediaElement.className = 'constructed-videos z-depth-3';
                    */
                }
            }
        }
    }

    var publicRoomsDiv = document.getElementById('public-conference');
    (function looper() {
        //Verifica a existência de uma sala pública
        connection.getPublicModerators(function(array) {
            publicRoomsDiv.innerHTML = '';
            //Se existir alguma sala pública exetute
            if (array.length > 0) {
                array.forEach(function(moderator) {
                    //Definições de moderador:
                    /*  moderator.userid
                     *  moderator.extra
                     */
                    //Verifica se quem conecta é o próprio moderador
                    if (moderator.userid == connection.userid) {
                        return;
                    }
                    //Cria labels para exibição de salas disponíveis
                    /*
                     *  var labelRoom   string
                     *  var labelClasse string
                     *  var labelNomeEscola string
                     *  var labelProfessor  string
                     *  var labelEscola integer
                     *  var labelTurma  string
                     *  var minhaEscola integer
                     *  var countRoom   integer
                     */
                    var labelRoom = moderator.userid;
                    labelRoom = atob(labelRoom);
                    console.log(labelRoom);
                    var labelClasse = labelRoom.split('|')[0];
                    var labelProfessor = labelRoom.split('|')[1];
                    var labelNomeEscola = labelRoom.split('|')[2];
                    var labelEscola = labelRoom.split('|')[3];
                    var labelTurma = labelRoom.split('|')[4];
                    var minhaEscola = document.getElementById('codEscola').value;
                    var countRooms = 0;

                    if (minhaEscola == labelEscola) {
                        countRooms++;
                        //cria elemento div para exibição de salas disponíveis em bloco
                        /*
                         *	var card html elem.
                         *  var divOpen html elem.
                         *  var button  html elem.
                         */
                        usuario = document.getElementById('meuNome').value;
                        var divOpen = document.createElement('div');
                        var card = "<div class='card z-depth-5'>" +
                            "<div class='card-content' align='left'>" +
                            "<h6 class='blue-text'>" +
                            "<i class='fa fa-desktop'></i> <b>" + labelClasse + "</b>" +
                            "</h6>" +
                            "<div class='row'>" +
                            "<div class='col s12 m8'>" +
                            "<p class='card-text'>" +
                            "<b>Professor:</b> " + labelProfessor +
                            "</p>" +
                            "<p class='card-text'>" +
                            "<b>Escola:</b> " + labelNomeEscola +
                            "</p>" +
                            "<p class='card-text'>" +
                            "<b>Turma:</b> " + labelTurma +
                            "</p>" +
                            "</div>" +
                            "<div id=" + moderator.userid + " class='col s12 m4' align='right'>" +
                            "</div>" +
                            "</div>" +
                            "</div>";

                        divOpen.innerHTML = card;
                        divOpen.className = "col s12";

                        var button = document.createElement('button');
                        button.id = moderator.userid;
                        button.className = 'btn blue waves-effect waves-light white-text';
                        //Debug
                        //console.log(connection.userid + "||" + connection.sessionid);
                        button.onclick = function() {
                            this.disabled = true;
                            var elem = document.getElementById(this.id);
                            if (hasClass(elem, "blue")) {
                                elem.classList.remove("blue");
                                elem.classList.add("grey");
                            }
                            //Definições iniciais para acesso à sala
                            callTeacherStream();
                            connection.classVideosContainer = document.getElementById('class-video');
                            connection.classVideosContainer.className = 'center';
                            connection.teacherVideosContainer = document.getElementById('main-video');

                            connection.join(this.id);
                            //Definições de vídeo para quem acessa a sala
                            /*
                             *   var owner   obj array[]
                             *   var userVideo   html elem.
                             *   var divClose   html elem.
                             *   var divOpen    html elem.
                             *   var message    string
                             */
                            connection.onstream = function(event) {
                                var owner = event.extra.modifiedValue;
                                var userVideo = document.createElement('video');
                                userVideo.controls = false;
                                //Debug
                                //console.log(event.extra);
                                console.log(event.extra.modifiedValue);
                                console.log(event.mediaElement.id);

                                //Define se a conexão é local ou remota
                                if (event.type === 'local') {
                                    //Se a conexão for local: Não faça nada
                                    /*
                                    userVideo.muted = true;
                                    connection.classVideosContainer.appendChild(event.mediaElement);
                                    event.mediaElement.play();
                                    setTimeout(function() {
                                        event.mediaElement.play();
                                    }, 5000);
                                    var width = parseInt(connection.classVideosContainer.clientWidth - 10);
                                    event.mediaElement.width = width;
                                    event.mediaElement.className = 'constructed-videos z-depth-3';
                                    event.mediaElement.title = 'Minha CAM';
                                    */
                                } else {
                                    if (event.extra.modifiedValue == event.mediaElement.id) {
                                        //Se a conexão for do dono da sala: Exibe
                                        connection.teacherVideosContainer.innerHTML = '';
                                        connection.teacherVideosContainer.appendChild(event.mediaElement);
                                        event.mediaElement.play();
                                        setTimeout(function() {
                                            event.mediaElement.play();
                                        }, 5000);
                                        var width = parseInt(connection.teacherVideosContainer.clientWidth - 10);
                                        event.mediaElement.width = width;
                                        event.mediaElement.className = 'constructed-videos z-depth-3';
                                        event.mediaElement.title = labelNomeEscola + " (" + labelTurma + "): " + labelClasse;
                                        document.getElementById('toggle-chat').onclick = function() {
                                            showChat();
                                        }
                                    } else {
                                        //Se a conexão for de outra sala: Não faça nada.
                                        /*
                                        connection.classVideosContainer.appendChild(event.mediaElement);
                                        event.mediaElement.play();
                                        setTimeout(function() {
                                            event.mediaElement.play();
                                        }, 5000);
                                        var width = parseInt(connection.classVideosContainer.clientWidth - 10);
                                        event.mediaElement.width = width;
                                        event.mediaElement.className = 'constructed-videos z-depth-3';
                                        event.mediaElement.title = event.mediaElement.id;
                                        */
                                    }
                                }
                                setRoomLabel(labelNomeEscola + " (" + labelTurma + "): " + labelClasse);
                            };
                        };
                        button.innerHTML = 'Entrar';
                        if (moderator.userid == connection.sessionid) {
                            // Se já estiver conectado na sala não faz nada
                            button.disabled = true;
                        }
                        //Append de elementos html
                        publicRoomsDiv.appendChild(divOpen);
                        var divClose = document.getElementById(moderator.userid);
                        divClose.appendChild(button);
                    }
                    if (countRooms == 0) {
                        //Mensagem de retorno para 0 salas encontradas na escola determinada
                        var divOpen = document.createElement('div');
                        var message = "<div class='red-text' style='margin-top:20px;'>" +
                            "<i class='fa fa-times fa-lg red-text text-darken-3'></i> <b>Não há salas disponíveis.</b>" +
                            "</div>";
                        divOpen.innerHTML = message;
                        publicRoomsDiv.appendChild(divOpen);
                    }
                });
            } else {
                //Mensagem de retorno para 0 salas encontradas
                var divOpen = document.createElement('div');
                var message = "<div class='red-text' style='margin-top:20px;'>" +
                    "<i class='fa fa-times fa-lg red-text text-darken-3'></i> <b>Não há salas disponíveis.</b>" +
                    "</div>";
                divOpen.innerHTML = message;
                publicRoomsDiv.appendChild(divOpen);
            }
            setTimeout(looper, 3000);
        });
    })();

    //Tratamento de URI para casos de conexão direta
    (function() {
        var params = {},
            r = /([^&=]+)=?([^&]*)/g;

        function d(s) {
            return decodeURIComponent(s.replace(/\+/g, ' '));
        }
        var match, search = window.location.search;
        while (match = r.exec(search.substring(1))) {
            params[d(match[1])] = d(match[2]);
        }
        window.params = params;
    })();

    //Ciclo de verificação de presença de uma sala aberta nesse servidor
    var roomid = '';
    if (localStorage.getItem(connection.socketMessageEvent)) {
        roomid = localStorage.getItem(connection.socketMessageEvent);
    } else {
        roomid = connection.token();
    }
    document.getElementById('room-id').value = roomid;
    document.getElementById('room-id').onkeyup = function() {
        localStorage.setItem(connection.socketMessageEvent, this.value);
    };
    var hashString = location.hash.replace('#', '');
    if (hashString.length && hashString.indexOf('comment-') == 0) {
        hashString = '';
    }
    var roomid = params.roomid;
    if (!roomid && hashString.length) {
        roomid = hashString;
    }
    if (roomid && roomid.length) {
        document.getElementById('room-id').value = roomid;
        localStorage.setItem(connection.socketMessageEvent, roomid);
        // auto-join-room
        (function reCheckRoomPresence() {
            connection.checkPresence(roomid, function(isRoomExists) {
                if (isRoomExists) {
                    connection.join(roomid);
                    return;
                }
                setTimeout(reCheckRoomPresence, 5000);
            });
        })();
    }

    //Controle de opções para criação de sala
    /*
     *  var matVal string
     *  var btnRoom html elem.
     */
    //Verifica campo select id=turma

    /*
    document.getElementById('turma').onchange = function(evt) {
        var instance = M.FormSelect.init(this);
        var selected = instance.getSelectedValues();
        //console.log(selected);

        
        var matVal = document.getElementById('materia').value;
        var btnRoom = document.getElementById('btn-join-as-productor');
        if (this.value && matVal) {
            btnRoom.disabled = false;
        }
        
    }
    */

});

/**
 * FUNCTIONS-----------------------------------------------------------------
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
//Define status de stream - on/off
function setStatus(st) {
    status = st;
}
//Exibição de campos de vídeo
function callTeacherStream() {
    //$('#teacher-access').slideUp(300);
    //$('#opend-rooms').slideUp(300);
    $('#initial-access').slideUp(300);
    $('#video-panel').slideDown(300);
}
//Define label da sala acessada
/*
 *   var roomtitle  html elem.
 */
function setRoomLabel(label) {
    var roomtitle = document.getElementById('class-title');
    roomtitle.innerHTML = label;
}
//Cria elementos com as definições da sala criada
/*
 *    var roomHashURL   string
 *    var roomQueryStringURL    string
 *    var html  string
 *    var roomURLsDiv   html elem.
 */
function showRoomURL(roomid, className, classTheme) {
    var roomHashURL = '#' + roomid;
    var roomQueryStringURL = '?roomid=' + roomid;
    var html = '<h6 class="card-title"><i class="fa fa-desktop"></i> Aula iniciada.</h6>';
    var roomURLsDiv = document.getElementById('room-urls');
    roomURLsDiv.innerHTML = html;
    roomURLsDiv.style.display = 'block';
}
//Trata e escreve mensagem de chat
/*
 *    var chatContainer html elem.
 *    var text  string
 *    var message   string
 */
function appendDIV(event) {
    var chatContainer = document.getElementById('chat-panel');
    var text = event.data || event;
    var message = text;
    if (!$('#div-chat-panel').is(":visible")) {
        toastContent = '<span class="white-text"><i class="fa fa-comment-o blue-text"></i> ' + message + '</span>';
        M.toast({ html: toastContent, classes: 'grey darken-4' });
    }
    //Versão anterior
    //chatContainer.value += message + '\n';

    //Versão com adaptação para o Materialize
    $('#chat-panel').val(chatContainer.value + message + '\n');
    M.textareaAutoResize($('#chat-panel'));
    M.updateTextFields();


}
//Controle para exibição do chat
function showChat() {
    if ($('#div-chat-panel').is(":visible")) {
        $('#div-chat-panel').slideUp(500);
    } else {
        $('#div-chat-panel').slideDown(500);
    }
}
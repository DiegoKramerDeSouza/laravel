$(document).ready(function() {
    //Application - Inicia a chamada e tratamento de multiconexão
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

    document.getElementById('btn-join-as-teacher').onclick = function() {
        //Ação de criar uma sala de aula ao clicar em 'btn-join-as-teacher'
        /*
            var isPublicModerator
            var elem
            var materia
            var assunto
            var roomLabel
            var roomId
            var roomHash
        */
        var isPublicModerator = true;
        var elem = document.getElementById(this.id);
        var materia = document.querySelector('#materia').value;
        var assunto = document.querySelector('#assunto').value;
        var roomLabel = materia + " (" + assunto + ")";
        var roomId = Math.floor((Math.random() * 999999) + 0);
        var roomName = document.getElementById('current-user').value;
        var roomEscola = document.getElementById('codEscola').value;
        var roomHash = btoa(materia + "|" + roomName + "|" + assunto + "|" + roomEscola);
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
            //Se existir uma sala pública
            if (array.length > 0) {
                array.forEach(function(moderator) {
                    //Definições de moderador:
                    /*  moderator.userid
                        moderator.extra
                    */
                    if (moderator.userid == connection.userid) {
                        //Verifica se quem conecta é o próprio moderador
                        return;
                    }
                    //Cria labels para exibição de salas disponíveis
                    /*
                        var labelRoom
                        var labelClasse
                        var labelMateria
                    */
                    var labelRoom = moderator.userid;
                    labelRoom = atob(labelRoom);
                    var labelClasse = labelRoom.split('|')[0];
                    var labelProfessor = labelRoom.split('|')[1];
                    var labelMateria = labelRoom.split('|')[2];
                    var labelEscola = labelRoom.split('|')[3];
                    var minhaEscola = document.getElementById('codEscola').value;
                    var countRooms = 0;

                    if (minhaEscola == labelEscola) {
                        countRooms++;
                        //cria elemento div para exibição de salas disponíveis em bloco
                        /*
                        	var card
                        */
                        usuario = document.getElementById('meuNome').value;
                        var divOpen = document.createElement('div');
                        var card = "<div class='card'>" +
                            "<div class='card-content' align='left'>" +
                            "<h6 class='blue-text'>" +
                            "<i class='fa fa-desktop'></i> <b>" + labelClasse + "</b>" +
                            "</h6>" +
                            "<div class='row'>" +
                            "<div class='col s12 m8 l9'>" +
                            "<p class='card-text'>" +
                            "<b>Professor:</b> " + labelProfessor +
                            "</p>" +
                            "<p class='card-text'>" +
                            "<b>Assunto:</b> " + labelMateria +
                            "</p>" +
                            "</div>" +
                            "<div id=" + moderator.userid + " class='col s12 m4 l3' align='right'>" +
                            "</div>" +
                            "</div>" +
                            "</div>";

                        divOpen.innerHTML = card;
                        divOpen.className = "col s12";

                        var button = document.createElement('button');
                        button.id = moderator.userid;
                        button.className = 'btn blue waves-effect waves-light white-text';

                        //console.log(connection.userid + "||" + connection.sessionid);
                        button.onclick = function() {
                            this.disabled = true;
                            var elem = document.getElementById(this.id);
                            if (hasClass(elem, "blue")) {
                                elem.classList.remove("blue");
                                elem.classList.add("grey");
                            }
                            callTeacherStream();
                            connection.classVideosContainer = document.getElementById('class-video');
                            connection.classVideosContainer.className = 'center';
                            connection.teacherVideosContainer = document.getElementById('main-video');

                            connection.join(this.id);
                            //Definições de vídeo para quem acessa a sala
                            connection.onstream = function(event) {
                                var owner = event.extra.modifiedValue;
                                var userVideo = document.createElement('video');
                                userVideo.controls = false;

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
                                    //console.log(owner + "||" + event.mediaElement.id);

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
                                        event.mediaElement.title = labelClasse + ' (' + labelMateria + ')';
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
                                setRoomLabel(labelClasse + " (" + labelMateria + ")");
                            };
                        };
                        button.innerHTML = 'Entrar';
                        if (moderator.userid == connection.sessionid) {
                            // Se já estiver conectado na sala
                            button.disabled = true;
                        }

                        publicRoomsDiv.appendChild(divOpen);

                        var divClose = document.getElementById(moderator.userid);
                        divClose.appendChild(button);
                        $('#div-chat-panel').fadeIn(300);
                    }
                    if (countRooms == 0) {
                        var divOpen = document.createElement('div');
                        var message = "<div class='grey-text' style='margin-top:20px;'>" +
                            "<i class='fa fa-times fa-lg red-text'></i> Não há salas de aula disponíveis." +
                            "</div>";
                        divOpen.innerHTML = message;
                        publicRoomsDiv.appendChild(divOpen);

                    }
                });
            } else {
                var divOpen = document.createElement('div');
                var message = "<div class='grey-text' style='margin-top:20px;'>" +
                    "<i class='fa fa-times fa-lg red-text'></i> Não há salas de aula disponíveis." +
                    "</div>";
                divOpen.innerHTML = message;
                publicRoomsDiv.appendChild(divOpen);
            }
            setTimeout(looper, 3000);
        });
    })();


    //
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

    //
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

});

//FUNCTIONS-----------------------------------------------------------------
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
/*
    var videoPanel
*/
function callTeacherStream() {
    //$('#teacher-access').slideUp(300);
    //$('#opend-rooms').slideUp(300);
    $('#initial-access').slideUp(300);
    $('#video-panel').slideDown(300);

    //var videoPanel = document.getElementById('video-panel');
    //videoPanel.classList.remove("d-none");
}
//Define label da sala acessada
/*
 *   var roomtitle
 */
function setRoomLabel(label) {
    var roomtitle = document.getElementById('class-title');
    roomtitle.innerHTML = label;
}
//Cria elementos com as definições da sala criada
/*
 *    var roomHashURL
 *    var roomQueryStringURL
 *    var html
 *    var roomURLsDiv
 */
function showRoomURL(roomid, className, classTheme) {
    var roomHashURL = '#' + roomid;
    var roomQueryStringURL = '?roomid=' + roomid;
    var html = '<h6 class="card-title"><i class="fa fa-desktop"></i> Aula iniciada.</h6>';
    var roomURLsDiv = document.getElementById('room-urls');
    roomURLsDiv.innerHTML = html;
    roomURLsDiv.style.display = 'block';
    //callTeacherStream();
    $('#div-chat-panel').fadeIn(300);

}
//Trata e escreve mensagem de chat
/*
 *    var chatContainer
 *    var text
 *    var message
 */
function appendDIV(event) {
    var chatContainer = document.getElementById('chat-panel');
    var text = event.data || event;
    var message = text;

    //Versão anterior
    //chatContainer.value += message + '\n';

    //Versão com adaptação para o Materialize
    $('#chat-panel').val(chatContainer.value + message + '\n');
    M.textareaAutoResize($('#chat-panel'));
    M.updateTextFields();

}
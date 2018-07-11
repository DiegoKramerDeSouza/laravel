/**
 * Criação de métodos estáticos com finalidades específicas
 */
class RoomHelper {

    constructor() {
        throw new Error('RoomHelper não pode ser instanciada.');
    }

    // Inicia os Listeners de tela cheia para todos os tipos de navegadores
    static initListeners() {
        document.addEventListener('fullscreenchange', exitHandler);
        document.addEventListener('webkitfullscreenchange', exitHandler);
        document.addEventListener('mozfullscreenchange', exitHandler);
        document.addEventListener('MSFullscreenChange', exitHandler);
    }

    // Configurações visuais de status da webcam
    /**
     * Param status: 'disabled', 'off', 'on' 
     */
    /*
    static setCam(status) {
        var cam = document.getElementById('toggle-camera');
        if (status === 'dis') {
            cam.setAttribute('data-active', 'disabled');
            cam.classList.add("grey");
            cam.innerHTML = "<i class='material-icons'>videocam_off</i>";
            $('#li-toggle-camera').hide();
        } else if (status === 'off') {
            cam.setAttribute('data-active', 'disabled');
            cam.classList.add("red");
            cam.innerHTML = "<i class='material-icons'>videocam_off</i>";
            callToast('<span class="white-text"><i class="material-icons left">videocam_off</i> Camera Desabilitada.</span>', 'red darken-3');
        } else if (status === 'on') {
            cam.setAttribute('data-active', 'enabled');
            cam.classList.remove("red");
            cam.innerHTML = "<i class='material-icons'>videocam</i>";
            callToast('<span class="white-text"><i class="material-icons left">videocam</i> Camera Habilitada.</span>', 'blue darken-2');
        }
    }
    */

    // Configurações visuais de status do botão Mute
    /**
     * Param status: 'disabled', 'off', 'on' 
     */
    /*
    static setMute(status) {
        var mute = document.getElementById('toggle-mute');
        if (status === 'dis') {
            mute.setAttribute('data-active', 'disabled');
            mute.classList.add("grey");
            mute.innerHTML = "<i class='material-icons'>mic_off</i>";
            $('#li-toggle-mute').hide();
        } else if (status === 'off') {
            mute.setAttribute('data-active', 'disabled');
            mute.classList.add("red");
            mute.innerHTML = "<i class='material-icons'>mic_off</i>";

            alerta.initiateMessage(conf.message.MIC_OFF);
        } else if (status === 'on') {
            mute.setAttribute('data-active', 'enabled');
            mute.classList.remove("red");
            mute.innerHTML = "<i class='material-icons'>mic</i>";

            alerta.initiateMessage(conf.message.MIC_ON);
        }
    }
    */

    // Configurações visuais de status do volume
    /**
     * Param status: 'disabled', 'off', 'on' 
     */
    /*
    static setVol(status) {
        var vol = document.getElementById('toggle-volume');
        if (status === 'dis') {
            vol.setAttribute('data-active', 'disabled');
            vol.classList.add("grey");
            vol.innerHTML = "<i class='material-icons'>volume_off</i>";
            $('#li-toggle-volume').hide();
        } else if (status === 'off') {
            vol.setAttribute('data-active', 'disabled');
            vol.classList.add("red");
            vol.innerHTML = "<i class='material-icons'>volume_off</i>";

            alerta.initiateMessage(conf.message.VOL_DOWN);
        } else if (status === 'on') {
            vol.setAttribute('data-active', 'enabled');
            vol.classList.remove("red");
            vol.innerHTML = "<i class='material-icons'>volume_up</i>";

            alerta.initiateMessage(conf.message.VOL_UP);
        }
    }
    */

    // Configurações visuais de status do compartilhamento de tela
    /**
     * Param status: 'disabled', 'off', 'on' 
     */
    /*
    static setShare(status) {
        var share = document.getElementById('share-screen');
        if (status === 'dis') {
            share.setAttribute('data-active', 'disabled');
            share.disabled = true;
            share.classList.add("grey");
            share.innerHTML = "<i class='material-icons'>stop_screen_share</i>";
            $('#li-share-screen').hide();
        } else if (status === 'off') {
            $('#share-screen').show();
            share.setAttribute('data-active', 'disabled');
            share.classList.add("red");
            share.innerHTML = "<i class='material-icons'>stop_screen_share</i>";

            alerta.initiateMessage(conf.message.START_SHARE);
        } else if (status === 'on') {
            $('#share-screen').show();
            share.setAttribute('data-active', 'enabled');
            share.classList.remove("red");
            share.innerHTML = "<i class='material-icons'>screen_share</i>";

            alerta.initiateMessage(conf.message.STOP_SHARE);
        }
    }
    */

    // Configurações visuais de status de uma solicitação
    /**
     * Param status: 'disabled', 'allowed', 'denied' 
     */
    static setPedir(status) {
        var pedir = document.getElementById('pedir-vez');
        if (status === 'dis') {
            pedir.setAttribute('data-active', 'disabled');
            pedir.classList.add("grey");
            $('#pedir-vez').hide();
        } else if (status === 'allow') {

            alerta.initiateMessage(conf.message.SEND_ACP_SOLICITATION);
            $('#div-enter').fadeIn(300);
            setParticipation('on');
        } else if (status === 'deny') {
            setParticipation('dis');

            alerta.initiateMessage(conf.message.NOT_ACP_SOLICITATION);
        }
    }

    // Configurações visuais de status da participação na transmissão
    /**
     * Param status: 'disabled', 'off', 'on' 
     */
    static setParticipation(status) {
        var participation = document.getElementById('enter-session');
        if (status === 'dis') {
            participation.setAttribute('data-active', 'notAllowed');
            participation.disabled = true;
            participation.classList.remove("cyan");
            participation.classList.remove("red");
            participation.classList.add("grey");
            participation.innerHTML = "<i class='material-icons'>videocam_off</i>";
            $('#div-enter').hide();
        } else if (status === 'off') {
            $('#div-enter').show();
            participation.setAttribute('data-active', 'enabled');
            participation.classList.remove("cyan");
            participation.classList.remove("grey");
            participation.classList.add("red");
            participation.innerHTML = "<i class='material-icons'>videocam_off</i>";
        } else if (status === 'on') {
            $('#div-enter').show();
            participation.setAttribute('data-active', 'disabled');
            participation.classList.remove("red");
            participation.classList.remove("grey");
            participation.classList.add("cyan");
            participation.innerHTML = "<i class='material-icons'>videocam</i>";
        }
    }

    // Controle da saída de tela cheia -> correção de saídas não previstas da função de tela cheia
    static exitHandler() {
        if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            var element = document.getElementById('span-video-preview');
            var status = element.getAttribute('data-status');
            if (status === 'enabled') {
                fullscreen();
            } else {
                return;
            }
        }
    }

    // Controle do botão de tela cheia -> toggle on:off
    static fullscreen() {
        var element = document.getElementById('span-video-preview');
        var videopreview = document.getElementById('video-preview');
        var status = element.getAttribute('data-status');

        if (status === 'disabled') {
            $('#div-exit-fullscreen').fadeIn(500);
            if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen();
            }
            element.classList.add("black");
            element.classList.remove("width-limit");
            element.style.height = (window.innerHeight) + 'px';
            element.setAttribute('data-status', 'enabled');
        } else if (status === 'enabled') {
            $('#div-exit-fullscreen').fadeOut(500);
            if (document.fullscreen) {
                document.cancelFullScreen();
            } else if (document.mozFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitIsFullScreen) {
                document.webkitCancelFullScreen();
            }
            element.classList.remove("black");
            element.classList.add("width-limit");
            element.style.height = 'inherit';
            element.setAttribute('data-status', 'disabled');
        }
        return;
    }

    // Controle do tamanho da view de videos
    static toggleFullsize() {
        let content = document.getElementById('main-content');
        let videoContent = document.getElementById('span-video-preview');
        if (hasClass(content, 'main-container')) {
            content.classList.remove('main-container');
            content.classList.add('main-container-full');
            videoContent.classList.remove('width-limit');
            videoContent.classList.add('col', 's12');
        } else {
            content.classList.remove('main-container-full');
            content.classList.add('main-container');
            videoContent.classList.add('width-limit');
            videoContent.classList.remove('col', 's12');
        }
    }

    // Tratamento de mensagens de chat
    /**
     * Param msg: Mensagem enviada ou recebida
     * Param rmt: Identificador da origem da mensagem (interna ou externa) 
     */
    static writeMessage(msg, rmt) {
        var message = atob(msg);
        var element = document.getElementById('chat-panel');
        var elem = document.getElementById('slide-out');
        var scrollsize;
        var instance = M.Sidenav.getInstance(elem);
        if (!instance.isOpen) {
            alerta.initiateMessage(conf.message.CHAT_MESSAGE, message);
        }
        if (rmt) {
            element.innerHTML = `${element.innerHTML}<p class="chat-in blue">${message}</p>`;
        } else {
            element.innerHTML = `${element.innerHTML}<p class="chat-out grey" align="right">${message}</p>`;
        }
        //countMessages++;
        document.getElementById('chat-textarea').style.height = (window.innerHeight - 100) + 'px';
        //scrollsize = (countMessages * 90);
        //$('#chat-textarea').animate({ scrollTop: scrollsize });
    }

    // Verifica a existência de dispositivos de vídeo
    /**
     * Param sourceInfos: dispositivos verificados
     */
    static getCameras(sourceInfos) {
        if (sourceInfos.length > 0) {
            cameras = true;
        }
    }

    // Verificação de classes para elementos html
    /**
     * Param element: elemento a ser verificado
     * Param cls: classe a ser verificada no elemento
     */
    static hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }

    // Exibição de campos de vídeo
    static callTeacherStream() {
        $('#initial-access').slideUp(300);
        $('#video-panel').slideDown(300);
    }

    // Toggle de controle de audio para elem. video
    static toggleControls() {
        var player = document.getElementById('video-preview');
        if (player.hasAttribute("controls")) {
            player.removeAttribute("controls");
        } else {
            player.setAttribute("controls", "controls");
        }
    }

    // Controle para exibição toggle de elem. html
    /**
     * Param elemId: Id do elemento a ser verificado
     */
    static toggleElem(elemId) {
        if ($(elemId).is(":visible")) {
            $(elemId).slideUp(500);
        } else {
            $(elemId).slideDown(500);
        }
    }

    // Constroi um botão de 'Pedir vez' 
    // *Uso pontual
    static constructBtnActionPedir() {
        var htmlBtn = "<a id='pedir-vez' data-active='enabled' class='media-control btn-floating btn-large' title='Solicitar vez'>" +
            "<i class='material-icons center'>pan_tool</i>" +
            "</a>";
        return htmlBtn;
    }

    // Constroi lista de salas online
    /**
     * Param classe: Temática da sala
     * Param assunto: Assunto da sala
     * Param apresentador: Apresentador responsável
     * Param viwer: Quantidade de espectadores
     * Param moderador: Id do criador da sala (moderador)
     */
    static constructAccessList(classe, assunto, apresentador, viwer, moderador) {
        var htmlItem = `<div class="row valign-wrapper li-hover grey-text text-darken-3">
        <div id="_${moderador}" align="center" class="col s3 m2">
                <span class="blue-text">Entrar</span><br>
            </div>
            <div class="col s9 m10 l11">
                <span class="card-title">
                    <b>${classe}: ${assunto}</b>
                </span>
                <div class="divider"></div>
                <div class="blockquoted">
                    <span>
                        <b class="blue-text"> Apresentado por:</b> ${apresentador}
                    </span><br>
                    <span>
                        <b class="blue-text"> Espectadores:</b><b> ${viwer}</b>
                    </span>
                </div>
            </div>
        </div>`;
        return htmlItem;
    }

    // Constroi lista de usuários conectados
    /**
     * Param userid: Id da conexão
     * Param username: Nome do usuário
     */
    static constructConnectionList(userid, username, announce, deletable) {
        var deleteButton;
        if (deletable) {
            deleteButton = '<a id="disconnect-' + userid + '" name="' + username + '" data-announced="' + announce + '" title="Desconectar espectador" class="disconnect-btn"><i class="material-icons red-text text-darken-4">close</i></a>';
        } else {
            deleteButton = '<a id="disabled-' + userid + '" name="' + username + '" data-announced="' + announce + '" ><i class="material-icons grey-text text-lighten-1">close</i></a>';
        }
        var htmlList = '<div id="li-disconnect-' + userid + '" data-sender="' + username + '" class="li-disconnect truncate">' +
            '<i class="fa fa-user-o blue-text lighten-2"></i> <b>' + username + '</b>' +
            '<span class="right">' +
            deleteButton +
            '</span>' +
            '</div>';
        return htmlList;
    }

    // Reconstroi lista <ul> 'connection-list' após ação de remoção
    /**
     * Param exp: Id da conexão onde a ação foi tomada
     */
    static constructConnectionExpList(exp) {
        var connectionList = document.getElementById('connected-users-list');
        var liList = document.getElementsByClassName('disconnect-btn');
        var htmlList = '';
        var announce;
        for (var j = 0; j < liList.length; j++) {
            announce = liList[j].getAttribute('data-announced');
            console.log('Alert: ' + announce + '|' + exp);
            if (announce != exp) {
                var sender = liList[j].name;
                var htmlList = '<div id="li-' + liList[j].id + '" data-sender="' + sender + '" class="li-disconnect truncate">' +
                    '<i class="fa fa-user-o blue-text lighten-2"></i> <b>' + sender + '</b>' +
                    '<span class="right">' +
                    '<a id="' + liList[j].id + '" name="' + sender + '" data-announced="' + announce + '" class="disconnect-btn"><i class="material-icons red-text text-darken-4">close</i></a>' +
                    '</span>' +
                    '</div>';
            }
        }
        connectionList.innerHTML = htmlList;
    }

    // Constroi lista inicial de solicitação de usuários - Solicitação feita a partir do botão 'pedir vez'
    /**
     * Param userid: Id da conexão
     * Param username: Nome do usuário
     * Classes css:
     *      sol-response    -> <li> que representa uma solicitação;
     *      responses.      -> <a> que representa uma resposta a uma solicitação;
     * São de uso exclusivo desta função e classificam todas as solicitações enviadas ao broadcaster
     */
    static constructSolicitationList(userid, username) {
        var htmlList = '<li id="' + userid + '" data-sender="' + username + '" class="sol-response collection-item avatar li-hover">' +
            '<i class="material-icons blue lighten-2 circle">tv</i>' +
            '<h6><b>' + username + '</b> solicita vez.</h6>' +
            '<div class="secondary-content">' +
            '<a id="allow_' + userid + '" class="room-enter responses blue-text text-darken-2 modal-close" title="Permitir"><i class="fa fa-check-circle fa-2x"></i></a> &nbsp;&nbsp;' +
            '<a id="deny_' + userid + '" class="room-enter responses red-text text-darken-3 modal-close" title="Negar"><i class="fa fa-times-circle fa-2x"></i></a>' +
            '</div>' +
            '</li>';
        return htmlList;
    }

    // Reconstroi lista <ul> 'solicita-list' após ação tomada (allow/deny) na lista inicial
    /**
     * Param exp: Id da conexão onde a ação foi tomada
     */
    static constructList(exp) {
        var pedeList = document.getElementById('solicita-list');
        var liList = document.getElementsByClassName('sol-response');
        var htmlList = '';
        if (liList.length <= 1) {
            htmlList = "<li align='center' class='red-text text-darken-3' style='padding:40px;' ><b><i class='fa fa-times fa-lg'></i> Não há solicitações no momento.</b></li>";
        } else {
            for (var j = 0; j < liList.length; j++) {
                if (liList[j].id != exp) {
                    var sender = liList[j].getAttribute('data-sender');
                    htmlList += '<li id="' + liList[j].id + '" data-sender="' + sender + '" class="sol-response collection-item avatar li-hover">' +
                        '<i class="material-icons blue lighten-2 circle">tv</i>' +
                        '<h6><b>' + sender + '</b> solicita vez.</h6>' +
                        '<span class="secondary-content">' +
                        '<a id="allow_' + liList[j].id + '" class="room-enter responses blue-text text-darken-2 modal-close" title="Permitir"><i class="fa fa-check-circle fa-2x"></i></a> &nbsp;&nbsp;' +
                        '<a id="deny_' + liList[j].id + '" class="room-enter responses red-text text-darken-3 modal-close" title="Negar"><i class="fa fa-times-circle fa-2x"></i></a>' +
                        '</span>' +
                        '</li>';
                }
            }
        }
        pedeList.innerHTML = htmlList;
    }

    // Trata indicador de quantidade de solicitações ao broadcaster
    /**
     * Param val: quantidade de solicitações
     */
    static trataSolicitacao(val) {
        document.getElementById('count-pedir-vez').innerHTML = val;
        if (val > 0) {
            $('#count-pedir-vez').fadeIn(300);
        } else {
            $('#count-pedir-vez').fadeOut(300);
        }
    }
}
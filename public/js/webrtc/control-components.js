/**
 * MANIPULAÇÃO DE ELEMENTOS VISUAIS APLICÁVEIS À SALAS.INDEX.BLADE
 * Métodos de criação/alteração de elementos visuais para a plataforma de video conferência
 * 
 */
$(document).ready(function() {
    /*
    $('#nav-footer').mouseenter(function() {
        console.log('Mouse entered...');
        $('#div-mobile').fadeIn(500);
    });
    $('#nav-footer').mouseleave(function() {
        $('#div-mobile').fadeOut(500);
    });
    */
});

// Chama alertas em elementos toast do MaterializeCSS
/**
 * content: conteúdo da mensagem
 * classe: classes aplicadas ao elem. toast
 */
function callToast(content, classe) {
    content = '<span class="white-text">' + content + '</span>';
    M.toast({ html: content, classes: classe, displayLength: 1000 });
}
// Altera o contador de usuários conectados à sala e exibe em 'broadcast-viewers-counter'
/**
 * number: número de usuários conectados
 */
function changeCounter(number) {
    var controller = document.getElementById('broadcast-viewers-counter');
    if (controller.getAttribute('data-target') == '0') {
        controller.innerHTML = '<a href="#con-list" id="viewers" class="modal-trigger"><i class="fa fa-play-circle-o"></i> Espectadores: <b class="grey-text text-darken-2">' + number + '</b></a>';
    }
}
// Mensagem de 0 salas disponíveis por conexão
function noRooms() {
    var publicRoomsDiv = document.getElementById('public-conference');
    var divOpen = document.createElement('div');
    var message = "<div class='red-text' style='margin-top:50px; margin-bottom:50px;' align='center'>" +
        "<h6><i class='fa fa-times-circle fa-lg red-text text-darken-3'></i> <b>Não há salas disponíveis.</b></h6>" +
        "</div>";
    divOpen.innerHTML = message;
    publicRoomsDiv.appendChild(divOpen);
}
// Define o cabeçalho da sala criada
/**
 * icon: Ícone da sala
 * classe: Temática da sala
 * assunto: Assunto da sala
 */
function setRoomLabel(icon, classe, assunto) {
    var roomtitle = document.getElementById('class-title');
    var label = "<i class='fa fa-" + icon + " blue-text'></i> <b>" + classe + "</b> (" + assunto + ")" +
        "<span class='right'><a href='' title='Sair' class='red-text text-darken-3'>" +
        "<i class='fa fa-times'></i></a></span>";
    roomtitle.innerHTML = label;
}
// Configurações visuais de status da webcam
/**
 * status: 'disabled', 'off', 'on' 
 */
function setCam(status) {
    var cam = document.getElementById('toggle-camera');
    if (status === 'dis') {
        cam.setAttribute('data-active', 'disabled');
        cam.classList.add("grey-text");
        cam.innerHTML = "<i class='material-icons'>videocam_off</i>";
        $('#toggle-camera').hide();
    } else if (status === 'off') {
        cam.setAttribute('data-active', 'disabled');
        cam.classList.add("red-text");
        cam.innerHTML = "<i class='material-icons'>videocam_off</i>";
        callToast('<span class="white-text"><i class="material-icons left">videocam_off</i> Camera Desabilitada.</span>', 'red darken-3');
    } else if (status === 'on') {
        cam.setAttribute('data-active', 'enabled');
        cam.classList.remove("red-text");
        cam.innerHTML = "<i class='material-icons'>videocam</i>";
        callToast('<span class="white-text"><i class="material-icons left">videocam</i> Camera Habilitada.</span>', 'blue darken-2');
    }

}
// Configurações visuais de status do botão Mute
/**
 * status: 'disabled', 'off', 'on' 
 */
function setMute(status) {
    var mute = document.getElementById('toggle-mute');
    if (status === 'dis') {
        mute.setAttribute('data-active', 'disabled');
        mute.classList.add("grey-text");
        mute.innerHTML = "<i class='material-icons'>mic_off</i>";
        $('#toggle-mute').hide();
    } else if (status === 'off') {
        mute.setAttribute('data-active', 'disabled');
        mute.classList.add("red-text");
        mute.innerHTML = "<i class='material-icons'>mic_off</i>";
        callToast('<span class="white-text"><i class="material-icons left">mic_off</i> Microfone Desabilitado.</span>', 'red darken-3');
    } else if (status === 'on') {
        mute.setAttribute('data-active', 'enabled');
        mute.classList.remove("red-text");
        mute.innerHTML = "<i class='material-icons'>mic</i>";
        callToast('<span class="white-text"><i class="material-icons left">mic</i> Microfone Habilitado.</span>', 'blue darken-2');
    }
}
// Configurações visuais de status do volume
/**
 * status: 'disabled', 'off', 'on' 
 */
function setVol(status) {
    var vol = document.getElementById('toggle-volume');
    if (status === 'dis') {
        vol.setAttribute('data-active', 'disabled');
        vol.classList.add("grey-text");
        vol.innerHTML = "<i class='material-icons'>volume_off</i>";
        $('#toggle-volume').hide();
    } else if (status === 'off') {
        vol.setAttribute('data-active', 'disabled');
        vol.classList.add("red-text");
        vol.innerHTML = "<i class='material-icons'>volume_off</i>";
        callToast('<span class="white-text"><i class="material-icons left">volume_off</i> Áudio Desabilitado.</span>', 'red darken-3');
    } else if (status === 'on') {
        vol.setAttribute('data-active', 'enabled');
        vol.classList.remove("red-text");
        vol.innerHTML = "<i class='material-icons'>volume_up</i>";
        callToast('<span class="white-text"><i class="material-icons left">volume_up</i> Áudio Habilitado.</span>', 'blue darken-2');
    }
}
// Configurações visuais de status do compartilhamento de tela
/**
 * status: 'disabled', 'off', 'on' 
 */
function setShare(status) {
    var share = document.getElementById('share-screen');
    if (status === 'dis') {
        share.setAttribute('data-active', 'disabled');
        share.classList.add("grey-text");
        share.innerHTML = "<i class='material-icons'>stop_screen_share</i>";
        $('#share-screen').hide();
    } else if (status === 'off') {
        share.setAttribute('data-active', 'disabled');
        share.classList.add("red-text");
        share.innerHTML = "<i class='material-icons'>stop_screen_share</i>";
        callToast('<span class="white-text"><i class="material-icons left">screen_share</i> Tela compartilhada.</span>', 'blue darken-2');
    } else if (status === 'on') {
        share.setAttribute('data-active', 'enabled');
        share.classList.remove("red-text");
        share.innerHTML = "<i class='material-icons'>screen_share</i>";
        callToast('<span class="white-text"><i class="material-icons left">stop_screen_share</i> Compartilhamento finalizado.</span>', 'red darken-3');
    }
}
// Configurações visuais de status de uma solicitação
/**
 * status: 'disabled', 'allowed', 'denied' 
 */
function setPedir(status) {
    var pedir = document.getElementById('pedir-vez');
    if (status === 'dis') {
        pedir.setAttribute('data-active', 'disabled');
        pedir.classList.add("grey-text");
        pedir.innerHTML = "<i class='material-icons left'>pan_tool</i> <b class='hide-on-med-and-down'>Áudio</b>";
        $('#pedir-vez').hide();
    } else if (status === 'allow') {
        var toastContent = '<span class="white-text"><i class="fa fa-check"></i> ' +
            'Sua solicitação foi atendida.<br>' +
            'Clique no botão ao lado para participar.' +
            '</span>';
        callToast(toastContent, 'blue darken-2');
        $('#div-enter').fadeIn(300);
    } else if (status === 'deny') {
        callToast('<span class="white-text"><i class="fa fa-times"></i> Sua solicitação foi negada!</span>', 'red darken-3');
    }
}
// Controle da saída de tela cheia -> correção de saídas não previstas da função de tela cheia
function exitHandler() {
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
function fullscreen() {
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
//Verifica a existência de dispositivos de vídeo
/**
 * sourceInfos: dispositivos verificados
 */
function getCameras(sourceInfos) {
    if (sourceInfos.length > 0) {
        cameras = true;
    }
}
//Verificação de classes para elementos html
/**
 * element: elemento a ser verificado
 * cls: classe a ser verificada no elemento
 */
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
//Exibição de campos de vídeo
function callTeacherStream() {
    $('#initial-access').slideUp(300);
    $('#video-panel').slideDown(300);
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
/**
 * elemId: Id do elemento a ser verificado
 */
function toggleElem(elemId) {
    if ($(elemId).is(":visible")) {
        $(elemId).slideUp(500);
    } else {
        $(elemId).slideDown(500);
    }
}
// Constroi um botão de 'Pedir vez' 
// *Uso pontual
function constructBtnActionPedir() {
    var htmlBtn = "<li class=''>" +
        "<a id='pedir-vez' data-active='enabled' class='media-control tooltipped' data-position='top' data-tooltip='Solicitar vez'>" +
        "<i class='material-icons center'>pan_tool</i>" +
        "</a>" +
        "</li>";
    return htmlBtn;
}
// Constroi lista de salas online
/**
 * classe: Temática da sala
 * assunto: Assunto da sala
 * professor: Apresentador responsável
 * viwer: Quantidade de espectadores
 * moderador: Id do criador da sala (moderador)
 */
function constructAccessList(classe, assunto, professor, viwer, moderador) {
    var htmlItem = '<li class="collection-item avatar li-hover grey-text text-darken-3">' +
        '<i class="material-icons circle blue lighten-2">videocam</i>' +
        '<span class="title"><b>' + classe + ' (' + assunto + ')' + '</b></span>' +
        '<p>' +
        '<b class="blue-text">Apresentado por:</b> ' + professor + '</p>' +
        '<p>' +
        '<b class="blue-text">Espectadores:</b><b> ' + viwer + '</b>' +
        '</p>' +
        '<span id="_' + moderador + '">' +
        '</span>' +
        '</li>';
    return htmlItem;
}
// Constroi lista de usuários conectados
/**
 * userid: Id da conexão
 * username: Nome do usuário
 */
function constructConnectionList(userid, username, announce, deletable) {
    var deleteButton;
    if (deletable) {
        deleteButton = '<a id="disconnect-' + userid + '" name="' + username + '" data-announced="' + announce + '" title="Disconectar espectador" class="disconnect-btn modal-close"><i class="material-icons red-text text-darken-4">close</i></a>';
    } else {
        deleteButton = '<a id="disabled-' + userid + '" name="' + username + '" data-announced="' + announce + '" ><i class="material-icons grey-text text-lighten-1">close</i></a>';
    }
    var htmlList = '<li id="li-disconnect-' + userid + '" data-sender="' + username + '" class="li-disconnect collection-item avatar li-hover">' +
        '<i class="material-icons blue lighten-2 circle">tv</i>' +
        '<h6><b>' + username + '</b></h6>' +
        '<span class="secondary-content">' +
        deleteButton +
        '</span>' +
        '</li>';
    return htmlList;
}
// Reconstroi lista <ul> 'connection-list' após ação de remoção
/**
 * exp: Id da conexão onde a ação foi tomada
 */
function constructConnectionExpList(exp) {
    var connectionList = document.getElementById('connection-list');
    var liList = document.getElementsByClassName('disconnect-btn');
    var htmlList = '';
    var announce;
    for (var j = 0; j < liList.length; j++) {
        announce = liList[j].getAttribute('data-announced');
        console.log('Alert: ' + announce + '|' + exp);
        if (announce != exp) {
            var sender = liList[j].name;
            htmlList = '<li id="li-' + liList[j].id + '" data-sender="' + sender + '" class="li-disconnect collection-item avatar li-hover">' +
                '<i class="material-icons blue lighten-2 circle">tv</i>' +
                '<h6><b>' + sender + '</b></h6>' +
                '<span class="secondary-content">' +
                '<a id="' + liList[j].id + '" name="' + sender + '" data-announced="' + announce + '" class="disconnect-btn btn-floating small waves-effect waves-teal red darken-4"><i class="material-icons">close</i></a>' +
                '</span>' +
                '</li>';
        }
    }
    connectionList.innerHTML = htmlList;
}

// Constroi lista inicial de solicitação de usuários - Solicitação feita a partir do botão 'pedir vez'
/**
 * userid: Id da conexão
 * username: Nome do usuário
 * Classes css:
 *      sol-response    -> <li> que representa uma solicitação;
 *      responses.      -> <a> que representa uma resposta a uma solicitação;
 * São de uso exclusivo desta função e classificam todas as solicitações enviadas ao broadcaster
 */
function constructSolicitationList(userid, username) {
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
 * exp: Id da conexão onde a ação foi tomada
 */
function constructList(exp) {
    var pedeList = document.getElementById('solicita-list');
    var liList = document.getElementsByClassName('sol-response');
    var htmlList = '';
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
    pedeList.innerHTML = htmlList;
}
// Trata indicador de quantidade de solicitações ao broadcaster
/**
 * val: quantidade de solicitações
 */
function trataSolicitacao(val) {
    document.getElementById('count-pedir-vez').innerHTML = val;
    if (val > 0) {
        $('#count-pedir-vez').fadeIn(300);
    } else {
        $('#count-pedir-vez').fadeOut(300);
    }
}
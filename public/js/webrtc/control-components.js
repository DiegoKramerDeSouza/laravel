$(document).ready(function() {
    /*
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
    */

});

function callToast(content, classe) {
    M.toast({ html: content, classes: classe });
}

function changeCounter(number) {
    document.getElementById('broadcast-viewers-counter').innerHTML = '<a href="#con-list" class="modal-trigger"><i class="fa fa-desktop"></i> <b class="grey-text text-darken-3">' + number + '</b></a>';
}

function noRooms() {
    //Mensagem de retorno para 0 salas encontradas
    var publicRoomsDiv = document.getElementById('public-conference');
    var divOpen = document.createElement('div');
    var message = "<div class='red-text' style='margin-top:20px;' align='center'>" +
        "<i class='fa fa-times fa-lg red-text text-darken-3'></i> <b>Não há salas disponíveis.</b>" +
        "</div>";
    divOpen.innerHTML = message;
    publicRoomsDiv.appendChild(divOpen);
}

function setRoomLabel(icon, classe, assunto) {
    var roomtitle = document.getElementById('class-title');
    var label = "<i class='fa fa-" + icon + " blue-text'></i> <b>" + classe + "</b> (" + assunto + ")" +
        "<span class='right'><a href='' title='Sair' class='red-text text-darken-3'>" +
        "<i class='fa fa-times'></i></a></span>";
    roomtitle.innerHTML = label;
}

function mountAccessList(classe, assunto, professor, viwer, moderador) {
    var htmlItem = '<li class="collection-item avatar li-hover grey-text text-darken-3">' +
        '<i class="material-icons circle blue lighten-2">videocam</i>' +
        '<span class="title"><b>' + classe + ' (' + assunto + ')' + '</b></span>' +
        '<p>' +
        '<b class="blue-text">Professor:</b> ' + professor + '</p>' +
        '<p>' +
        '<b class="blue-text">Espectadores:</b><b> ' + viwer + '</b>' +
        '</p>' +
        '<span id="_' + moderador + '">' +
        '</span>' +
        '</li>';
    return htmlItem;
}

function setCam(status) {
    var cam = document.getElementById('toggle-camera');
    if (status === 'dis') {
        cam.setAttribute('data-active', 'disabled');
        cam.classList.remove("blue-text");
        cam.classList.add("grey-text");
        cam.innerHTML = "<i class='material-icons left'>videocam_off</i> <b class='hide-on-med-and-down'>Camera</b>";
    } else if (status === 'off') {
        cam.setAttribute('data-active', 'disabled');
        cam.classList.remove("blue-text");
        cam.classList.add("red-text");
        cam.innerHTML = "<i class='material-icons left'>videocam_off</i> <b class='white-text hide-on-med-and-down'>Camera</b>";
        callToast('<span class="white-text"><i class="material-icons left">videocam_off</i> Camera Desabilitada.</span>', 'red darken-3');
    } else if (status === 'on') {
        cam.setAttribute('data-active', 'enabled');
        cam.classList.remove("red-text");
        cam.classList.add("blue-text");
        cam.innerHTML = "<i class='material-icons left'>videocam</i> <b class='white-text hide-on-med-and-down'>Camera</b>";
        callToast('<span class="white-text"><i class="material-icons left">videocam</i> Camera Habilitada.</span>', 'blue darken-2');
    }

}

function setMute(status) {
    var mute = document.getElementById('toggle-mute');
    if (status === 'dis') {
        mute.setAttribute('data-active', 'disabled');
        mute.classList.remove("blue-text");
        mute.classList.add("grey-text");
        mute.innerHTML = "<i class='material-icons left'>mic_off</i> <b class='hide-on-med-and-down'>Microfone</b>";
    } else if (status === 'off') {
        mute.setAttribute('data-active', 'disabled');
        mute.classList.remove("blue-text");
        mute.classList.add("red-text");
        mute.innerHTML = "<i class='material-icons left'>mic_off</i> <b class='white-text hide-on-med-and-down'>Microfone</b>";
        callToast('<span class="white-text"><i class="material-icons left">mic_off</i> Microfone Desabilitado.</span>', 'red darken-3');
    } else if (status === 'on') {
        mute.setAttribute('data-active', 'enabled');
        mute.classList.remove("red-text");
        mute.classList.add("blue-text");
        mute.innerHTML = "<i class='material-icons left'>mic</i> <b class='white-text hide-on-med-and-down'>Microfone</b>";
        callToast('<span class="white-text"><i class="material-icons left">mic</i> Microfone Habilitado.</span>', 'blue darken-2');
    }

}

function setVol(status) {
    var vol = document.getElementById('toggle-volume');
    if (status === 'dis') {
        vol.setAttribute('data-active', 'disabled');
        vol.classList.remove("blue-text");
        vol.classList.add("grey-text");
        vol.innerHTML = "<i class='material-icons left'>volume_off</i> <b class='hide-on-med-and-down'>Áudio</b>";
    } else if (status === 'off') {
        vol.setAttribute('data-active', 'disabled');
        vol.classList.remove("blue-text");
        vol.classList.add("red-text");
        vol.innerHTML = "<i class='material-icons left'>volume_off</i> <b class='white-text hide-on-med-and-down'>Áudio</b>";
        callToast('<span class="white-text"><i class="material-icons left">volume_off</i> Áudio Desabilitado.</span>', 'red darken-3');
    } else if (status === 'on') {
        vol.setAttribute('data-active', 'enabled');
        vol.classList.remove("red-text");
        vol.classList.add("blue-text");
        vol.innerHTML = "<i class='material-icons left'>volume_up</i> <b class='white-text hide-on-med-and-down'>Áudio</b>";
        callToast('<span class="white-text"><i class="material-icons left">volume_up</i> Áudio Habilitado.</span>', 'blue darken-2');
    }
}

function setPedir(status) {
    var pedir = document.getElementById('pedir-vez');
    if (status === 'dis') {
        pedir.setAttribute('data-active', 'disabled');
        pedir.classList.remove("blue-text");
        pedir.classList.add("grey-text");
        pedir.innerHTML = "<i class='material-icons left'>pan_tool</i> <b class='hide-on-med-and-down'>Áudio</b>";
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

function constructConnectionList(userid, username) {
    var htmlList = '<li id="connect_' + userid + '" data-sender="' + userid + '" class="li-disconnect collection-item avatar li-hover">' +
        '<i class="material-icons blue lighten-2 circle">tv</i>' +
        '<h6><b>' + username + '</b></h6>' +
        '<span class="secondary-content">' +
        '<a id="disconnect-' + userid + '" class="disconnect btn-floating small waves-effect waves-teal red darken-4"><i class="material-icons">close</i></a>' +
        '</span>' +
        '</li>';
    return htmlList;
}

function constructSolicitationList(userid, username) {
    var htmlList = '<li id="' + userid + '" data-sender="' + username + '" class="sol-response collection-item avatar li-hover">' +
        '<i class="material-icons blue lighten-2 circle">tv</i>' +
        '<h6><b>' + username + '</b> solicita vez.</h6>' +
        '<span class="secondary-content">' +
        '<a id="allow-' + userid + '" class="responses btn-flat waves-effect waves-teal blue-text text-darken-2 modal-close"><i class="fa fa-check"></i> permitir</a>' +
        '<a id="deny-' + userid + '" class="responses btn-flat waves-effect waves-red  red-text text-darken-3 modal-close"><i class="fa fa-times"></i> negar</a>' +
        '</span>' +
        '</li>';
    return htmlList;
}

// Reconstroi lista <ul> 'solicita-list'
/**
 * var pedeList string
 * var liList   string
 * var htmlList string
 * var sender   string
 */
function constructList(exp) {
    var pedeList = document.getElementById('solicita-list');
    var liList = document.getElementsByClassName('sol-response');
    var htmlList = '';
    for (var j = 0; j < liList.length; j++) {
        if (liList[j].id != exp) {
            var sender = liList[j].getAttribute('data-sender');
            // Constroi elementos concatenando
            htmlList += '<li id="' + liList[j].id + '" data-sender="' + sender + '" class="sol-response collection-item avatar li-hover">' +
                '<i class="material-icons blue lighten-2 circle">tv</i>' +
                '<h6><b>' + sender + '</b> solicita vez.</h6>' +
                '<span class="secondary-content">' +
                '<a id="allow-' + liList[j].id + '" class="responses btn-flat waves-effect waves-teal blue-text text-darken-2 modal-close"><i class="fa fa-check"></i> permitir</a>' +
                '<a id="deny-' + liList[j].id + '" class="responses btn-flat waves-effect waves-red  red-text text-darken-3 modal-close"><i class="fa fa-times"></i> negar</a>' +
                '</span>' +
                '</li>';
        }
    }
    pedeList.innerHTML = htmlList;
}
// Trata a quantidade de solicitações ao broadcaster
function trataSolicitacao(val) {
    document.getElementById('count-pedir-vez').innerHTML = val;
    if (val > 0) {
        $('#count-pedir-vez').fadeIn(300);
    } else {
        $('#count-pedir-vez').fadeOut(300);
    }
}
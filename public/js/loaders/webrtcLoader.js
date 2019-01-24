/**
 * MANIPULAÇÃO DE ELEMENTOS DO WEBRTC EM CONJUNTO COM RTCMULTICONNECTION
 * Inicializa os elementos do webRTC para abertura, gerenciamento e controle de transmissões ao carregar o documento
 */

let webrtc = new webrtcController();
let instanceCheckInterval;

$(document).ready(function() {

    // Inicia a chamada e tratamento de adaptadores
    window.enableAdapter = true;
    // Inicializa a configuração de conexão webRTC e os listeners do socket.io
    webrtc.configureDefaults();
    // Inicia listener para criação de sala
    webrtc.createRoom();
    // Inicia verificação de salas abertas
    instanceCheckInterval = checkAvaliableRooms();
    //Inicializa listeners de gerenciamento de stream
    webrtc.manageRoom();
    // Inicia listeners de operações em sala
    webrtc.operateRoom();
    // Inicia listeners de tratamento de URI
    webrtc.formatRoom();
    // Inicia listener de tratamento de mensagens de elementos aninhados
    listenEmbeddedMessages();
});

/**
 * Ações baseadas na desconexão de usuários
 * @param {Obj RTCMultiConnection} event 
 */
function alertDisconnection(event) {

    webrtc.alertDisconnection(event);
}

/**
 * Ações de verificação de salas criadas
 */
function checkAvaliableRooms() {

    return setInterval(searchAvaliableRooms, 3000);
}

/**
 * Busca por salas criadas
 */
function searchAvaliableRooms() {

    if (!webrtc.getPublicModerators()) clearInterval(instanceCheckInterval);
}

/**
 * Cria listener para mensagens enviadas por páginas aninhadas
 * Permite apenas mensagens com as origens em:
 * med2.lrbtecnologia.com
 * wtv.lrbtecnologia.com
 */
function listenEmbeddedMessages() {

    window.addEventListener('message', (event) => {

        if (~event.origin.indexOf(doc.SERVER.MEDIA.URL) ||
            ~event.origin.indexOf(doc.SERVER.MEDIA2.URL) ||
            ~event.origin.indexOf(doc.SERVER.MEDIA.SSL) ||
            ~event.origin.indexOf(doc.SERVER.MEDIA2.SSL) ||
            ~event.origin.indexOf(doc.SERVER.HOME.LOCAL) ||
            ~event.origin.indexOf(doc.SERVER.HOME.SSL)) {

            if (~event.origin.indexOf(doc.SERVER.MEDIA.URL) ||
                ~event.origin.indexOf(doc.SERVER.MEDIA2.URL) ||
                ~event.origin.indexOf(doc.SERVER.MEDIA.SSL) ||
                ~event.origin.indexOf(doc.SERVER.MEDIA2.SSL))
                webrtc.checkEmbeddedMessages(event.data);

            if (~event.origin.indexOf(doc.SERVER.HOME.LOCAL) || ~event.origin.indexOf(doc.SERVER.HOME.SSL)) {
                //console.warn(event.data);
                if (event.data.sourceId && event.data != 'PermissionDeniedError') {
                    webrtc.startDesktopCapture();
                } else if (event.data === 'stopDesktopCapture' || event.data === 'PermissionDeniedError') {
                    webrtc.returnDesktopCapture();
                }
            }
        } else {
            console.error('Origem não reconhecida', event.data, event.origin);
            return;
        }

    });
}
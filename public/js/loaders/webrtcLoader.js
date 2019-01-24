/**
 * MANIPULAÇÃO DE ELEMENTOS DO WEBRTC EM CONJUNTO COM RTCMULTICONNECTION
 * Inicializa os elementos do webRTC para abertura, gerenciamento e controle de transmissões;
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
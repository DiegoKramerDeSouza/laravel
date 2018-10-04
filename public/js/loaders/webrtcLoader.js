/**
 * MANIPULAÇÃO DE ELEMENTOS DO WEBRTC EM CONJUNTO COM RTCMULTICONNECTION
 * Inicializa os elementos do webRTC para abertura, gerenciamento e controle de transmissões;
 */

let webrtc = new webrtcController();
let instanceCheckInterval;
let onLobby;

$(document).ready(function() {

    // Inicia a chamada e tratamento de adaptadores
    window.enableAdapter = true;
    // Inicializa a configuração de conexão webRTC e os listeners do socket.io
    webrtc.configureDefaults();
    //Inicializa listeners de gerenciamento de stream
    webrtc.manageRoom();
    // Inicia listener para criação de sala
    webrtc.createRoom();
    // Inicia listeners de operações em sala
    webrtc.operateRoom();
    // Inicia listeners de tratamento de URI
    webrtc.formatRoom();
    // Inicia verificação de salas abertas
    instanceCheckInterval = checkAvaliableRooms();

});

// Ações baseadas na desconexão de usuários
function alertDisconnection(event) {

    webrtc.alertDisconnection(event);
}

function checkAvaliableRooms() {

    return setInterval(searchAvaliableRooms, 3000);
}

function searchAvaliableRooms() {

    webrtc.setUsersInformation();
    onLobby = webrtc.checkRooms();
}
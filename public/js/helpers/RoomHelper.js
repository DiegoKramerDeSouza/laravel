/**
 * Criação de métodos estáticos com finalidades específicas
 */
class RoomHelper {

    constructor() {
        throw new Error('RoomHelper apresenta apenas métodos estáticos.');
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

}
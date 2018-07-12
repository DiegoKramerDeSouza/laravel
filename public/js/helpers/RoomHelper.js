/**
 * Criação de métodos estáticos com finalidades específicas
 */
class RoomHelper {

    constructor() {
        throw new Error('RoomHelper não pode ser instanciada.');
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

}
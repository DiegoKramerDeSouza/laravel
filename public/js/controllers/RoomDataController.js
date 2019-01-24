/**
 * Classe voltada à definição de dados específicos de salas criadas por um apresentador
 * -> Trata a quantidade de espectadores e os grupos permitidos a vizualizar e acessar a sala
 * 
 * Instancia:
 * RoomData
 * RoomView
 */
class RoomDataController {

    constructor() {

        this._countRooms = conf.datacls.COUNT_ROOMS;
        this._allowed = conf.datacls.ALLOWED;
    }

    /**
     * Cria e retorna um array de permissões de acesso a cursos que o usuário possui
     * @param {String} courses Lista de cursos a que aquele usuário possui acesso
     * @returns {Array}
     */
    _setClasses(courses) {

        if (courses === 'ADMIN') return conf.datacls.ADMIN_ACCESS
        else return courses.split(';');
    }

    /**
     * Inicializa uma instância de RoomData
     * @param {String} roomid Identificador da sala
     * @param {String} assunto Assunto da sala
     * @param {String} materia Matéria da sala
     * @param {String} nome Nome completo da sala
     * @param {String} courses cursos permitidos para aquela sala
     * @returns {Obj}
     */
    initiateRoomData(roomid, assunto, materia, nome, courses) {

        let arrRoomId = roomid.split('|');
        arrRoomId.push(this._countRooms, this._allowed, this._setClasses(courses), conf.datacls.TRANSMITING, assunto, materia, nome);
        return new RoomData(...arrRoomId);
    }

    /**
     * Valida o nome de sala criada
     * @param {String} labelRoom Identificador da sala
     * @param {Obj} roomsArray Dados da sala
     * @returns {Boolean}
     */
    validateRoomName(labelRoom, roomsArray) {

        try {
            if (!(labelRoom.split('|').length === 3)) return false;
        } catch (exp) {
            let roomView = new RoomView();
            if (roomsArray.length < 2) roomView.noRooms();
            return false;
        }
        return true;
    }

    /**
     * Valida o acesso de um usuário para com uma sala
     * @param {Array} curso Lista de cursos permitidos para o usuário
     * @param {Array} classes Lista de cursos permitidos para aquela sala
     */
    validateAccess(curso, classes) {

        let valid = false;
        if (classes === conf.datacls.ADMIN_ACCESS) valid = true;
        else if (curso) {
            classes.forEach((cls) => {
                if (curso.indexOf(cls) > -1) valid = true;
            });
        }
        return valid;
    }
}
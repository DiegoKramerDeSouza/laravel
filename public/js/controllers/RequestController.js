/**
 * Classe voltada ao tratamento de requisições Ajax
 *  
 * Instancia:
 * MessageController
 * Request
 */
class RequestController {

    constructor(url, type, data, dataType) {

        this._alerta = new MessageController();
        this._request = new Request(url, type, data, dataType);
    }

    /**
     * Chamada de procedimento de inserção/atualização de dados de salas criadas
     */
    saveRoom(req) {

        if (req) this._request = req;

        // Setup para permitir integração Laravel x Ajax 
        $.ajaxSetup({
            headers: this._request.header
        });
        // Post para registro de eventos
        $.ajax({
            url: this._request.url,
            type: this._request.type,
            data: this._request.data,
            dataType: this._request.dataType,
            success: () => this._alerta.initiateMessage(conf.message.SUCCESS_SAVE_CLASS),
            error: () => this._alerta.initiateMessage(conf.message.FAIL_SAVE_CLASS)
        });
    }

    /**
     * Chamada de procedimento informando a lista de salas disponíveis
     */
    listRoom() {

        $.ajax({
            url: this._request.url,
            type: this._request.type,
            dataType: this._request.dataType,
            success: (data) => console.log(data),
            error: (data) => console.error(data)
        });
    }

    /**
     * Chamada de procedimento para criação da lista de espectadores presentes
     */
    requestAttendance() {

        // Setup para permitir integração Laravel x Ajax
        $.ajaxSetup({
            headers: this._request.header
        });
        console.log(this._request.data);
        // Post para registro de eventos
        $.ajax({
            url: this._request.url,
            type: this._request.type,
            dataType: this._request.dataType,
            data: this._request.data,
            success: (data) => {
                console.log(data);
                this._createAttendance(data.presentes, data.total, this._request.data.turmaId, this._request.data.aula, this._request.data.tema);
            },
            error: (data) => {
                console.error(data);
                return false;
            }
        });
    }

    /**
     * Chamada de procedimento para a construção da lista de espectadores presentes na apresentação
     * @param { Array Int } arr 
     * @param { Array list } all 
     * @param { Int } turmaId 
     * @param { Int } aula 
     */
    _createAttendance(arr, all, turmaId, aula, tema) {

        GeneralHelper.hideit(dom.CHAMADA);
        let url = `${location.origin}/rest/listaPresenca`;
        let type = 'POST';
        let data = { turmaId: turmaId, aula: aula, tema: tema, allData: all, presentes: arr };
        let req = new Request(url, type, data, null);
        this._generateAttendance(req);
    }

    /**
     * Chamada de procedimento para coleta de dados de espectadores presentes
     * @param { Obj Request } req 
     */
    _generateAttendance(req) {

        let data = req.data;
        let turma = data.turmaId;
        // Setup para permitir integração Laravel x Ajax
        $.ajaxSetup({
            headers: req.header
        });
        data.presentes.length < 1 ? data.presentes = [null] : null;
        console.log(data);
        // Post para registro de eventos
        $.ajax({
            url: req.url,
            type: req.type,
            data: data,
            success: (data) => this._manageAttendanceList(data, turma),
            error: (data) => console.error(data)
        });
    }

    /**
     * Procedimento de criação da view de lista de gerenciamento de espectadores presentes
     * @param { Array list } data 
     * @param { Int } turma 
     */
    _manageAttendanceList(data, turma) {

        this._alerta.initiateMessage(conf.message.ATTENDANCE_CONFIRM);
        doc.TAG(dom.CHAMADA).innerHTML = data;
        GeneralHelper.showit(dom.CHAMADA, 500);
        doc.ALL(dom.CHANGE_ATTEND).forEach(item => {
            let itemId = item.id;
            let itemLabel = doc.ID(itemId + '-label');
            doc.ID(itemId).onclick = () => {
                item.checked ?
                    itemLabel.innerHTML = misc.ATTEND_IN :
                    itemLabel.innerHTML = misc.ATTEND_OUT;
            }
            doc.ID(dom.CONFIRM_ATTENDANCE_ID).onclick = () => this._saveAttendanceList(turma);
        });
    }

    /**
     * Inicialização dos listeners de controle/tratamento de listas de espectadores
     * @param { Int } turma 
     */
    _saveAttendanceList(turma) {

        let allUsers = [];
        let attendUsers = [];
        let users = doc.ALL(dom.ATTENDANCE_ID);
        for (var i = 0; i < users.length; i++) {
            let id = users[i].value;
            let attend = doc.ID(users[i].id + '-attend').checked;
            let item = [id, attend];
            allUsers.push(item);
            if (attend) attendUsers.push(id);
        }
        let req;
        let url;
        let data;
        let type = 'POST';
        let dataType = 'json';
        let count = attendUsers.length;
        let moderator = doc.TAG(dom.IN_ROOM).value;

        // Atualiza lista de presença
        url = doc.URL_ATTENDANCE_UPDATE;
        data = { presentes: attendUsers };
        req = new Request(url, type, data, dataType);
        this._confirmSendList(req, false);

        // Atualiza quantidade de espectadores
        url = doc.URL_SALAS_UPDATE;
        data = { turmaHash: moderator, numViews: count };
        req = new Request(url, type, data, dataType);
        this.saveRoom(req);

        // Envia listagem de espectadores
        url = doc.URL_ATTENDANCE_SEND;
        data = { turmaId: turma, data: allUsers };
        req = new Request(url, type, data, dataType);
        //this._confirmSendList(req, true);
    }

    /**
     * Chamada de procedimento para confirmação e envio da lista de espectadores presentes
     * @param { Obj Request } req 
     * @param { Boolean } send 
     */
    _confirmSendList(req, send) {

        // Setup para permitir integração Laravel x Ajax
        $.ajaxSetup({
            headers: req.header
        });
        // Post para registro de eventos
        $.ajax({
            url: req.url,
            type: req.type,
            data: req.data,
            dataType: req.dataType,
            success: (data) => {
                send ?
                    this._alerta.initiateMessage(conf.message.ATTENDANCE_SEND_SUCCESS) :
                    this._alerta.initiateMessage(conf.message.ATTENDANCE_CONFIRM_SUCCESS);
                console.log(data);
            },
            error: (error) => {
                send ?
                    this._alerta.initiateMessage(conf.message.ATTENDANCE_SEND_FAIL) :
                    this._alerta.initiateMessage(conf.message.ATTENDANCE_CONFIRM_FAIL);
                console.error(error);
            }
        });
    }

}
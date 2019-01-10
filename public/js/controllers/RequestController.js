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

    _basicRequest(header, url, type, data, dataType, callback, callbackError) {

        let configuration;

        // Setup para permitir integração Laravel x Ajax 
        if (header) $.ajaxSetup({ headers: header });
        configuration = { url: url, type: type, data: data, dataType: dataType, success: (data) => callback(data), error: (data) => callbackError(data) };

        // Post para registro de eventos
        $.ajax(configuration);
    }

    /**
     * Chamada de procedimento de inserção/atualização de dados de salas criadas
     */
    saveRoom(req, response) {

        if (req) this._request = req;
        let callback = () => {
            if (response) {
                /* Envia resposta para API de chamadas 
                 * {aulaHash: this._request.data.turmaHash, turmaId: this._request.data.turmaId, presentes: this._request.data.presentes}
                 */
                console.info('ENVIANDO PARA API DE CHAMADA {aulaHash, turmaId, presentes}: ', this._request.data.turmaHash, this._request.data.turmaId, this._request.data.presentes);
                this._alerta.initiateMessage(conf.message.ATTENDANCE_SEND_SUCCESS);
            }
            this._alerta.initiateMessage(conf.message.SUCCESS_SAVE_CLASS);
        };
        let error = () => {
            if (response) this._alerta.initiateMessage(conf.message.ATTENDANCE_SEND_FAIL);
            this._alerta.initiateMessage(conf.message.FAIL_SAVE_CLASS);
        };
        this._basicRequest(this._request.header, this._request.url, this._request.type, this._request.data, this._request.dataType, callback, error);
    }

    sendPhoto() {

        let callback = (data) => {
            /* Envia photos para API de reconhecimento facial
             * {picture: this._request.data.picture, aulaHash: this._request.data.aulaHash, turmaId: this._request.turmaId} 
             */
            console.warn(data);
        };
        let error = (data) => {
            console.error(data);
        };
        this._basicRequest(this._request.header, this._request.url, this._request.type, this._request.data, this._request.dataType, callback, error);
    }

    /**
     * Chamada de procedimento informando a lista de salas disponíveis
     */
    listRoom() {

        let callback = (data) => console.log(data);
        let error = (data) => console.error(data);
        this._basicRequest(false, this._request.url, this._request.type, null, this._request.dataType, callback, error);
    }

    /**
     * Chamada de procedimento para criação da lista de espectadores presentes
     */
    requestAttendance() {

        let callback = (data) => {
            this._createAttendance(data.presentes, data.total, this._request.data.turmaId, this._request.data.aula, this._request.data.tema);
        }
        let error = (data) => {
            console.error(data);
            return false;
        };

        this._basicRequest(this._request.header, this._request.url, this._request.type, this._request.data, this._request.dataType, callback, error);
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
        let url = doc.URL_ATTENDANCE_LIST;
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

        let dataRequest = req.data;
        let turma = dataRequest.turmaId;

        let callback = (data) => this._manageAttendanceList(data, turma);
        let error = (data) => console.error(data);

        this._basicRequest(req.header, req.url, req.type, dataRequest, null, callback, error);
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

        let userId;
        let attend;
        let item;
        let allUsers = [];
        let attendUsers = [];
        let type = 'POST';
        let dataType = 'json';
        let moderator = doc.TAG(dom.IN_ROOM).value;
        let users = doc.ALL(dom.ATTENDANCE_ID);

        users.forEach((user) => {
            userId = user.value;
            attend = doc.ID(user.id + '-attend').checked;
            item = [userId, attend];
            allUsers.push(item);
            if (attend) attendUsers.push(userId);
        });
        let count = attendUsers.length;

        // Atualiza lista de presença
        let url = doc.URL_ATTENDANCE_UPDATE;
        let data = { presentes: attendUsers, turmaId: turma, moderator: moderator, count: count };
        let req = new Request(url, type, data, dataType);
        this._confirmSendList(req);
    }

    /**
     * Chamada de procedimento para confirmação e envio da lista de espectadores presentes
     * @param { Obj Request } req 
     * @param { Boolean } send 
     */
    _confirmSendList(req) {

        let reqUrl = req.url;
        let reqData = req.data;
        let reqType = req.type;
        let reqDataType = req.dataType;
        let turmaId = reqData.turmaId;
        let presentes = reqData.presentes;
        let moderator = reqData.moderator;
        let count = reqData.count;

        let callback = () => {
            // Atualiza quantidade de espectadores
            let data = { turmaHash: moderator, numViews: count, turmaId: turmaId, presentes: presentes };
            let request = new Request(doc.URL_SALAS_UPDATE, reqType, data, reqDataType);
            this.saveRoom(request, true);
            this._alerta.initiateMessage(conf.message.ATTENDANCE_CONFIRM_SUCCESS);
        }
        let error = () => {
            console.error(error);
            this._alerta.initiateMessage(conf.message.ATTENDANCE_CONFIRM_FAIL);
        }
        this._basicRequest(req.header, reqUrl, reqType, reqData, reqDataType, callback, error);
    }

}
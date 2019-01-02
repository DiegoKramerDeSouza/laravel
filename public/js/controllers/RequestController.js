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

    saveRoom() {

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

    listRoom() {

        // Post para registro de eventos
        $.ajax({
            url: this._request.url,
            type: this._request.type,
            dataType: this._request.dataType,
            success: (data) => console.log(data),
            error: (data) => console.error(data)
        });
    }

    generateAttendance() {

        let data = this._request.data;
        let turma = data.turmaId;
        // Setup para permitir integração Laravel x Ajax
        $.ajaxSetup({
            headers: this._request.header
        });
        data.presentes.length < 1 ? data.presentes = [null] : null;
        console.log(data.presentes);
        // Post para registro de eventos
        $.ajax({
            url: this._request.url,
            type: this._request.type,
            data: data,
            success: (data) => this._manageAttendanceList(data, turma),
            error: (data) => console.error(data)
        });
    }

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
        console.log(allUsers, attendUsers);

        let url = doc.URL_ATTENDANCE_UPDATE;
        let type = 'POST';
        let dataType = 'json';
        let data = { presentes: attendUsers };

        let req = new Request(url, type, data, dataType);
        this._confirmSendList(req, false);

        url = doc.URL_ATTENDANCE_SEND;
        data = { turmaId: turma, data: allUsers };
        req = new Request(url, type, data, dataType);
        //this._confirmSendList(req, true);
    }

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
                this._alerta.initiateMessage(conf.message.FAIL_SAVE_CLASS);
                console.error(error);
            }
        });
    }

}
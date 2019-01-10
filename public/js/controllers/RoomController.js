/**
 * Classe voltada à definição básica de salas criadas pelo apresentador
 * 
 * Instancia:
 * RoomView
 */
class RoomController {

    constructor() {

        this._roomView = new RoomView();

        this._roomId = doc.TAG(dom.ROOM);
        this._roomConId = doc.TAG(dom.CON_ID);
        this._inputMateria = doc.TAG(dom.MATERIA);
        this._inputAssunto = doc.TAG(dom.ASSUNTO);
        this._inputName = doc.TAG(dom.NAME);
        this.audioList = doc.TAG(dom.LIST_AUDIO);
        this.videoList = doc.TAG(dom.LIST_VIDEO);
        this._numberOfViewers = doc.TAG(dom.NUMBER_VIEWS);
    }

    createList() {

        this._inputCursos = $(dom.CURSO_LIST).val();
        return this._inputCursos.join(';');
    }

    _createHash() {

        let timestamp = +new Date();
        return `${ this.createList() }|${ this._roomId.value }|${ timestamp }`;
    }

    setRoomLabel(icon, classe, assunto) {

        this._roomView.createRoomLabel(icon, classe, assunto);
    }

    checkDevices() {

        return (this.audioList.value != '' && this.videoList.value != '');
    }

    validade() {

        return (this.createList() != '' && (this._inputMateria.value != '' && this._inputAssunto.value != ''));
    }

    initiateRoom() {

        return new Room(this._inputName.value, this._roomConId.value, this._inputMateria.value, this._inputAssunto.value, this.createList(), this._createHash());
    }

    cleanRoomList(list) {

        this._roomView.cleanRoomList(list);
    }

    constructAccessList(classe, assunto, apresentador, viwer, moderador) {

        return this._roomView.createRoomCard(classe, assunto, apresentador, viwer, moderador);
    }

    initiateRoomCard(moderatorId, label, container, obj, type) {

        this._roomView.setRoomCard(moderatorId, label, container, obj, type);
    }

    noRooms() {

        this._roomView.noRooms();
    }

    clearConList() {

        this._roomView.clearLabelCon();
    }

    constructConnectionList(userid, username, announce, itsMe) {

        let deleteButton;
        userid = userid.split('-')[0];
        itsMe ?
            deleteButton = this._roomView.setDisabledConBtn(userid, username, announce) :
            deleteButton = this._roomView.setRemoveConBtn(userid, username, announce);
        this._roomView.newLabelCon(userid, username, deleteButton, itsMe);
    }

    inputConList() {

        this._roomView.putList();
    }

    constructConnectionExpList(exp) {

        let announce;
        let removeBtn;
        let liList = doc.ALL(dom.DISCONNECT_BTN);
        this._roomView.clearLabelCon();

        liList.forEach(elem => {
            announce = elem.getAttribute('data-announced');
            if (announce != exp) {
                removeBtn = this._roomView.setRemoveConBtn(elem.id, elem.name, announce);
                this._roomView.newLabelCon(elem.id, elem.name, removeBtn);
            }
        });
        this._roomView.putList();
    }

    validateViews() {

        return this._numberOfViewers.value >= 0 && this._numberOfViewers.value < 99999;
    }

    checkViews() {

        return this._numberOfViewers.value != "" && this.validateViews();
    }

    changeCounter(viwers) {

        this._roomView.changeCounter(viwers);
    }

}
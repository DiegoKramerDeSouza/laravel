class RoomController {

    constructor() {

        let tag = document.querySelector.bind(document);
        this._getTags = document.querySelectorAll.bind(document);
        this._roomView = new RoomView();

        this._roomId = tag(conf.dom.ROOM);
        this._inputMateria = tag(conf.dom.MATERIA);
        this._inputAssunto = tag(conf.dom.ASSUNTO);
        this._inputName = tag(conf.dom.NAME);
    }

    _createList() {

        this._inputCursos = $(conf.dom.CURSO_LIST).val();
        return this._inputCursos.join(';');
    }

    _createHash() {

        return btoa(`${ this._inputMateria.value }|${ this._inputName.value }|${ this._inputAssunto.value }|${ this._createList() }|${ this._roomId.value }`);
    }

    setRoomLabel(icon, classe, assunto) {

        this._roomView.createRoomLabel(icon, classe, assunto);
    }

    validade() {

        return (this._createList() != '' && (this._inputMateria.value != '' && this._inputAssunto.value != ''));
    }

    initiateRoom() {

        return new Room(this._inputName.value, this._inputMateria.value, this._inputAssunto.value, this._createList(), this._createHash());
    }

    constructAccessList(classe, assunto, apresentador, viwer, moderador) {

        return this._roomView.createRoomCard(classe, assunto, apresentador, viwer, moderador)
    }

    initiateRoomCard(moderatorId, label, container, obj) {

        this._roomView.setRoomCard(moderatorId, label, container, obj);
    }

    noRooms() {

        this._roomView.noRooms();
    }

    clearConList() {

        this._roomView.clearLabelCon();
    }

    constructConnectionList(userid, username, announce, deletable) {

        let deleteButton;
        deletable ?
            deleteButton = this._roomView.setRemoveConBtn(userid, username, announce) :
            deleteButton = this._roomView.setDisabledConBtn(userid, username, announce);
        this._roomView.newLabelCon(userid, username, deleteButton);
    }

    inputConList() {

        this._roomView.putList();
    }

    constructConnectionExpList(exp) {

        let announce;
        let removeBtn;
        let liList = this._getTags(conf.dom.DISCONNECT_BTN);
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



}
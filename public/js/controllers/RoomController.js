class RoomController {

    constructor() {

        let tag = document.querySelector.bind(document);
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

    validade() {

        return (this._createList() != '' && (this._inputMateria.value != '' && this._inputAssunto.value != ''));
    }

    initiateRoom() {

        return new Room(this._inputName.value, this._inputMateria.value, this._inputAssunto.value, this._createList(), this._createHash());
    }
}
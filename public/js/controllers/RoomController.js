class RoomController {

    constructor() {

        let tag = document.querySelector.bind(document);
        this._roomId = tag(conf.dom.room.ROOM);
        this._inputMateria = tag(conf.dom.room.MATERIA);
        this._inputAssunto = tag(conf.dom.room.ASSUNTO);
        this._inputName = tag(conf.dom.room.NAME);
    }

    _createList() {

        this._inputCursos = $(conf.dom.room.CURSO_LIST).val();
        return this._inputCursos.join(';');
    }

    _createHash() {

        return btoa(`${ this._inputMateria.value }|${ this._inputName.value }|${ this._inputAssunto.value }|${ this._createList() }|${ this._roomId.value }`);
    }

    validade() {

        return (this._createList() != '' && (this._inputMateria.value != '' && this._inputAssunto.value != ''));
    }

    setRoom() {

        return new Room(this._inputName.value, this._inputMateria.value, this._inputAssunto.value, this._createList(), this._createHash());
    }
}
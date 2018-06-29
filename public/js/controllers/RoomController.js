class RoomController {

    constructor() {

        let tag = document.querySelector.bind(document);
        this._roomId = tag('#room-id').value;
        this._inputMateria = tag('#tema').value;
        this._inputAssunto = tag('#assunto').value;
        this._inputName = tag('#current-user').value;
        this._inputCursos = $('#cursos-list').val();
    }

    _createList() {

        return this._inputCursos.join(';');
    }

    _createHash() {

        return btoa(`${ this._inputMateria }|${ this._inputName }|${ this._inputAssunto }|${ this._createList() }|${ this._roomId }`);
    }

    validade() {

        return (this._createList() != '' && (this._inputMateria != '' && this._inputAssunto != ''));
    }

    setRoom() {

        return new Room(this._inputName, this._inputMateria, this._inputAssunto, this._createList(), this._createHash());
    }
}
/**
 * Módulo de gerenciamento de dados da sala
 *  -> Suporta as variáveis de controle para utilização de aplicações da sala
 */
class RoomData {

    constructor(classe, apresentador, assunto, curso, whois, activeRoom, allowed, classes) {

        this._classe = classe;
        this._apresentador = apresentador;
        this._assunto = assunto;
        this._curso = curso;
        this._whois = whois;
        this._allowed = allowed;
        this._classes = classes;
        this._activeRoom = activeRoom;
        Object.freeze(this);
    }

    get classe() {

        return this._classe;
    }

    get apresentador() {

        return this._apresentador;
    }

    get assunto() {

        return this._assunto;
    }

    get curso() {

        return this._curso;
    }

    get whois() {

        return this._whois;
    }

    get allowed() {

        return this._allowed;
    }

    get classes() {

        return this._classes;
    }

    get activeRoom() {

        return this._activeRoom;
    }

}
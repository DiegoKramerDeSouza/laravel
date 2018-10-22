/**
 * Módulo de gerenciamento de dados da sala
 *  -> Suporta as variáveis de controle para utilização de aplicações da sala
 */
class RoomData {

    constructor(curso, whois, timestamp, activeRoom, allowed, classes, transmiting, assunto, classe, apresentador) {

        this._classe = classe;
        this._apresentador = apresentador;
        this._assunto = assunto;
        this._curso = curso;
        this._whois = whois;
        this._timestamp = timestamp;
        this._activeRoom = activeRoom;
        this._allowed = allowed;
        this._classes = classes;
        this._transmiting = transmiting;
    }

    get classe() {

        return this._classe;
    }

    set classe(classe) {

        this._classe = classe;
    }

    get apresentador() {

        return this._apresentador;
    }

    set apresentador(apresentador) {

        this._apresentador = apresentador;
    }

    get assunto() {

        return this._assunto;
    }

    set assunto(assunto) {

        this._assunto = assunto;
    }

    get curso() {

        return this._curso;
    }

    set curso(curso) {

        this._curso = curso;
    }

    get whois() {

        return this._whois;
    }

    set whois(whois) {

        this._whois = whois;
    }

    get timestamp() {

        return this._timestamp;
    }

    set timestamp(timestamp) {

        this._timestamp = timestamp;
    }

    get activeRoom() {

        return this._activeRoom;
    }

    set activeRoom(activeRoom) {

        this._activeRoom = activeRoom;
    }

    get allowed() {

        return this._allowed;
    }

    set allowed(allowed) {

        this._allowed = allowed;
    }

    get classes() {

        return this._classes;
    }

    set classes(classes) {

        this._classes = classes;
    }

    get transmiting() {

        return this._transmiting;
    }

    set transmiting(transmiting) {

        this._transmiting = transmiting;
    }
}
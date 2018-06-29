class Room {

    constructor(name, tema, assunto, cursos, hash) {

        this._name = name;
        this._tema = tema;
        this._assunto = assunto;
        this._cursos = cursos;
        this._hash = hash;
        Object.freeze(this);
    }

    get tema() {

        return this._tema;
    }

    get assunto() {

        return this._assunto;
    }

    get name() {

        return this._name;
    }

    get cursos() {

        return this._cursos;
    }

    get hash() {

        return this._hash;
    }

}
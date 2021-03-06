/**
 * Módulo de criação de salas
 *  -> Define as informações básicas para criação de salas e formação de rótulo
 */
class Room {

    constructor(name, con, tema, assunto, cursos, hash) {

        this._name = name;
        this._con = con;
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

    get con() {

        return this._con;
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
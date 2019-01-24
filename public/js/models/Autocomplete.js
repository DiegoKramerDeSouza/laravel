/**
 * Módulo de definição dos atributos das operações de autocomplete
 */
class Autocomplete {

    constructor(origin, admModule, searched) {

        this._origin = origin;
        this._admModule = admModule;
        this._searched = searched;
    }

    get origin() {

        return this._origin;
    }

    set origin(origin) {

        this._origin = origin;
    }

    get admModule() {

        return this._admModule;
    }

    set admModule(admModule) {

        this._admModule = admModule;
    }

    get searched() {

        return this._searched;
    }

    set searched(searched) {

        this._searched = searched;
    }
}
/**
 * Módulo de constração de mensagens para apresentação
 */
class Message {

    constructor(text = '', model = '') {

        this._text = text;
        this._model = model;
    }

    get text() {

        return this._text;
    }

    set text(text) {

        this._text = text;
    }

    get model() {

        return this._model;
    }

    set model(model) {

        this._model = model;
    }
}
/**
 * Módulo de requisições Ajax a partir do Javascript
 *  -> Define as informações básicas para o tratamento de requisições
 */
class Request {

    constructor(url, type, data, dataType) {

        this._header = { 'X-CSRF-TOKEN': $(dom.TK_OBJ).attr('data-content') };
        this._url = url;
        this._type = type;
        this._data = data;
        this._dataType = dataType;
        Object.freeze(this);
    }

    get header() {

        return this._header;
    }

    get url() {

        return this._url;
    }

    get type() {

        return this._type;
    }

    get data() {

        return this._data;
    }

    get dataType() {

        return this._dataType;
    }

}
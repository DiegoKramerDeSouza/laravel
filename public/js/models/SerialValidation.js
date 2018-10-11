class SerialValidation {

    constructor(key, url, msg, msgSend) {

        this._key = key;
        this._url = url;
        this._msg = msg;
        this._msgSend = msgSend
        this._result;
    }

    get key() {

        return this._key;
    }

    get url() {

        return this._url;
    }

    get msg() {

        return this._msg;
    }

    get msgSend() {

        return this._msgSend;
    }

    get result() {

        return this._result;
    }

    set result(result) {

        this._result = result;
    }

}
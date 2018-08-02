class FormInstitutionView {

    constructor() {

        this._postal = doc.TAG(dom.POSTAL);
        this._url = doc.TAG(dom.url);
        this._key = doc.TAG(dom.LOCK);
        this._address = doc.TAG(dom.ADDRESS);
        this._city = doc.TAG(dom.CITY);
        this._street = doc.TAG(dom.STREET);
    }

    enderecoClearData() {

        this._address.value = "";
        this._city.value = "";
        this._street.value = "";
    }

    waitResponse() {

        this._address.value = conf.structure.FORM;
        this._city.value = conf.structure.FORM;
    }
}
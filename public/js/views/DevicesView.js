class DevicesView {

    constructor() {

        this._audioOption = `<option value="" disabled selected>Selecione um dispositivo</option>`;
        this._videoOption = `<option value="" disabled selected>Selecione um dispositivo</option>`;
        this._audioSelect = doc.TAG(dom.LIST_AUDIO);
        this._videoSelect = doc.TAG(dom.LIST_VIDEO);
        this._value;
    }

    createSelector() {

        this._audioSelect.innerHTML += this._audioOption;
        this._videoSelect.innerHTML += this._videoOption;
        let materialize = new MaterializeController();
        materialize.initiateSelect();
    }

    selectedAudio(id, label, group, selected) {

        selected ?
            this._audioOption += `<option value="${ this._convertValue(id, label, group) }" selected>${ label }</option>` :
            this._audioOption += `<option value="${ this._convertValue(id, label, group) }">${ label }</option>`;
    }

    selectedVideo(id, label, group, selected) {

        selected ?
            this._videoOption += `<option value="${ this._convertValue(id, label, group) }" selected>${ label }</option>` :
            this._videoOption += `<option value="${ this._convertValue(id, label, group) }">${ label }</option>`;
    }

    _convertValue(id, label, group) {

        return btoa(`${ id }|${ label }|${ group }`);
    }
}
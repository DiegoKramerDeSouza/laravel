class DevicesView {

    constructor() {

        this._audioOption = `<option value="" disabled selected>Selecione um dispositivo</option>`;
        this._videoOption = `<option value="" disabled selected>Selecione um dispositivo</option>`;
        this._audioSelect = doc.TAG(dom.LIST_AUDIO);
        this._videoSelect = doc.TAG(dom.LIST_VIDEO);
        this._value;
    }

    createAudioSelector() {

        this._audioSelect.innerHTML += this._audioOption;
    }

    createVideoSelector() {

        this._videoSelect.innerHTML += this._videoOption;
    }

    startMaterializeSelect() {

        let materialize = new MaterializeController();
        materialize.initiateSelect();
    }

    selectedAudio(id, label, group, selected) {

        selected ?
            this._audioOption += `<option value="${ id }" selected>${ label }</option>` :
            this._audioOption += `<option value="${ id }">${ label }</option>`;
    }

    selectedVideo(id, label, group, selected) {

        selected ?
            this._videoOption += `<option value="${ id }" selected>${ label }</option>` :
            this._videoOption += `<option value="${ id }">${ label }</option>`;
    }

    _convertValue(id, label, group) {

        return btoa(`${ id }|${ label }|${ group }`);
    }
}
class DevicesView {

    constructor() {

        this._audioOption = misc.DEFAULT_SELECT_DEVICE;
        this._videoOption = misc.DEFAULT_SELECT_DEVICE;
        this._audioSelect = doc.TAG(dom.LIST_AUDIO);
        this._videoSelect = doc.TAG(dom.LIST_VIDEO);
        this._value;
        this._cleanSelection();
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

    selectedAudio(id, label, selected) {

        selected ?
            this._audioOption += `<option value="${ id }" selected>${ label }</option>` :
            this._audioOption += `<option value="${ id }">${ label }</option>`;
    }

    selectedVideo(id, label, selected) {

        selected ?
            this._videoOption += `<option value="${ id }" selected>${ label }</option>` :
            this._videoOption += `<option value="${ id }">${ label }</option>`;
    }

    _cleanSelection() {

        this._audioSelect.innerHTML = "";
        this._videoSelect.innerHTML = "";
    }

    _convertValue(id, label, group) {

        return btoa(`${ id }|${ label }|${ group }`);
    }
}
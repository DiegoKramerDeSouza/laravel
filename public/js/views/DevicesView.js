/**
 * Define e trata os elementos da view relacionado ao controle e definição de interface de dispositivos 
 */
class DevicesView {

    constructor() {

        this._audioOption = misc.DEFAULT_SELECT_DEVICE;
        this._videoOption = misc.DEFAULT_SELECT_DEVICE;
        this._audioSelect = doc.TAG(dom.LIST_AUDIO);
        this._videoSelect = doc.TAG(dom.LIST_VIDEO);
        this._cleanSelection();
    }

    /**
     * Cria listagem de dispositivos de áudio disponíveis
     */
    createAudioSelector() {

        this._audioSelect.innerHTML += this._audioOption;
    }

    /**
     * Cria listagem de dispositívos de vídeo disponíveis
     */
    createVideoSelector() {

        this._videoSelect.innerHTML += this._videoOption;
    }

    /**
     * Inicializa instância do Materialize CSS para construção de select
     */
    startMaterializeSelect() {

        let materialize = new MaterializeController();
        materialize.initiateSelect();
    }

    /**
     * Cria e apresenta em view elementos HTML a partir dos dispositivos de áudio identificados
     * @param {String} id Identificador do dispositívo
     * @param {String} label Rótulo do dispositívo
     * @param {Boolean} selected Status da seleção deste dispositívo
     */
    selectedAudio(id, label, selected) {

        if (this._audioOption === misc.DEFAULT_SELECT_DEVICE) selected = true;
        selected ?
            this._audioOption += `<option value="${ id }" selected>${ label }</option>` :
            this._audioOption += `<option value="${ id }">${ label }</option>`;
    }

    /**
     * Cria e apresenta em view elementos HTML a partir dos dispositivos de vídeo identificados
     * @param {String} id Identificador do dispositívo
     * @param {String} label Rótulo do dispositívo
     * @param {Boolean} selected Status da seleção deste dispositívo
     */
    selectedVideo(id, label, selected) {

        if (this._videoOption === misc.DEFAULT_SELECT_DEVICE) selected = true;
        selected ?
            this._videoOption += `<option value="${ id }" selected>${ label }</option>` :
            this._videoOption += `<option value="${ id }">${ label }</option>`;
    }

    /**
     * Limpa para a view a listagem de dispositívos detectados
     */
    _cleanSelection() {

        this._audioSelect.innerHTML = "";
        this._videoSelect.innerHTML = "";
    }

}
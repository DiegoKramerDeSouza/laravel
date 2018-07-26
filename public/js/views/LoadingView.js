class LoadingView {

    constructor() {

        this._center = doc.TAG(dom.LOAD_POSITION_ELEM);
    }

    // Inicia apresentação de tela de loading
    callLoading() {
        $(dom.LOAD_LAYER_ELEM).show();
        $(dom.LOAD_POSITION_ELEM).show();
        this._center.innerHTML = `<h5>
                                    <b>Aguarde...</b><br><br>
                                    <div class="preloader-wrapper big active">
                                        <div class="spinner-layer spinner-blue-only">
                                            <div class="circle-clipper left">
                                                <div class="circle"></div>
                                            </div>
                                            <div class="gap-patch">
                                                <div class="circle"></div>
                                            </div>
                                            <div class="circle-clipper right">
                                                <div class="circle"></div>
                                            </div>
                                        </div>
                                    </div>
                                </h5>`;
    }

    // Finaliza apresentação tela de loading
    destroyLoading() {

        $(dom.LOAD_LAYER_ELEM).fadeOut(300);
        $(dom.LOAD_POSITION_ELEM).fadeOut(300);
        this._center.innerHTML = '';
    }
}
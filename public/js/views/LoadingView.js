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

    callDeviceOff(audio, video) {

        let icons = '';
        audio ? null : icons += '<i class="material-icons large">mic_off</i> ';
        video ? null : icons += '<i class="material-icons large">videocam_off</i> ';
        $(dom.LOAD_LAYER_ELEM).show();
        $(dom.LOAD_POSITION_ELEM).show();
        this._center.innerHTML = `<div align="center">
                                    ${ icons }
                                    <br>
                                    <br>
                                    <h6><i class="fa fa-times"></i> Dispositívos não detectados corretamente.</h6>
                                    <h5>Por Favor verifique os seus dispositivos de Áudio e Vídeo e tente novamente.</h5>
                                    <br>
                                    <br>
                                    <a class="white-text" href="/"><u>Voltar</u></a>
                                </div>`;
        $(dom.BTN_START_ROOM).focus();
        $(dom.BTN_START_ROOM).fadeOut(300);
    }

    setVersion() {

        let ver = doc.TAG(dom.VERSION);
        ver.innerHTML = doc.VERSION;
    }
}
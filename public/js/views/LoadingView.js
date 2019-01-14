class LoadingView {

    constructor() {

        this._center = doc.TAG(dom.LOAD_POSITION_ELEM);
    }

    // Inicia apresentação de tela de loading
    callLoading() {

        GeneralHelper.showit(dom.LOAD_LAYER_ELEM);
        GeneralHelper.showit(dom.LOAD_POSITION_ELEM);
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

        GeneralHelper.hideit(dom.LOAD_LAYER_ELEM, 300);
        GeneralHelper.hideit(dom.LOAD_POSITION_ELEM, 300);
        this._center.innerHTML = '';
    }

    callDeviceOff(audio, video) {

        let icons = '';
        audio ? null : icons += '<i class="material-icons large">mic_off</i> ';
        video ? null : icons += '<i class="material-icons large">videocam_off</i> ';
        GeneralHelper.showit(dom.LOAD_LAYER_ELEM);
        GeneralHelper.showit(dom.LOAD_POSITION_ELEM);
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
        GeneralHelper.hideit(dom.BTN_START_ROOM, 300);
    }

    setVersion() {

        let ver = doc.TAG(dom.VERSION);
        ver.innerHTML = doc.VERSION;
    }
}
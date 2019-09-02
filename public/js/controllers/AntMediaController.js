class AntMediaController{

    constructor(alerta, media){
        this._webRTCAdaptor;
        this._streams = [];
        this._adaptors = [];
        this._startedStream = false;
        this._alerta = alerta;
        this._media = media;
    }

    get webRTCAdaptor(){
        return this._webRTCAdaptor;
    }

    get adaptors(){
        return this._adaptors;
    }

    get startedStream(){
        return this._startedStream;
    }

    set startedStream(value){
        this._startedStream = value;
    }


    /**
     * Inicia o adaptador para transmissão com WebRTC
     * @param {String} roomid 
     * @param {String} videoLayer 
     * @param {Obj WebRTCAdaptor} connection 
     */
    initAdaptor(roomid, videoLayer, connection, videoConstraints, audioConstraints) {

        console.warn(roomid);
        let mediaConstraints;
        let sdpConstraints;
        let websocketURL;
        let pc_config = null;
        let localVideo = connection ? dom.SECOND_VIDEO_ID : dom.MAIN_VIDEO_ID;

        /*
        if (conf.con.LOW_LATENCY) {
            location.protocol.startsWith("https") ?
                websocketURL = 'wss://test.antmedia.io:5443/WebRTCAppEE/websocket' :
                websocketURL = 'ws://test.antmedia.io:5080/WebRTCAppEE/websocket';
        } else {
            location.protocol.startsWith("https") ? websocketURL = conf.con.SOCKET_SSL : websocketURL = conf.con.SOCKET_URL;
            if (connection || videoLayer) {
                websocketURL = conf.con.SOCKET_2_URL;
                location.protocol.startsWith("https") ? websocketURL = conf.con.SOCKET_2_SSL : websocketURL = conf.con.SOCKET_2_URL;
            }
        }
        */
        websocketURL = conf.con.SOCKET_SSL;
        if (videoLayer || connection) {
            mediaConstraints = {
                video: true,
                audio: true
            }
        } else {
            mediaConstraints = {
                video: videoConstraints,
                audio: audioConstraints
            }
        }
        sdpConstraints = {
            OfferToReceiveAudio: false,
            OfferToReceiveVideo: false
        };
        this._webRTCAdaptor = new WebRTCAdaptor({
            websocket_url: websocketURL,
            mediaConstraints: mediaConstraints,
            peerconnection_config: pc_config,
            sdp_constraints: sdpConstraints,
            localVideoId: localVideo,
            debug: true,
            callback: (info, description) => {

                if (info == "initialized") {
                    console.info("Conexão inicializada!");
                } else if (info == "publish_started") {
                    console.info("Iniciando Transmissão");
                    if (!connection) this._media.startAnimation(this._webRTCAdaptor, roomid);
                } else if (info == "publish_finished") {
                    console.warn("Finalizando Transmissão");
                } else if (info == "closed") {
                    if (typeof description != "undefined")
                        console.warn("Conexão fechada: " + JSON.stringify(description));
                } else if (info == "screen_share_extension_available") {
                    console.log("Compartilhamento de tela disponível");
                }
            },
            callbackError: (error) => {

                let errorMessage = JSON.stringify(error);
                if (error.indexOf("NotFoundError") != -1) {
                    errorMessage = conf.message.DEVICES_MISSING;
                } else if (error.indexOf("NotReadableError") != -1 || error.indexOf("TrackStartError") != -1) {
                    errorMessage = conf.message.DEVICES_BUSY;
                } else if (error.indexOf("OverconstrainedError") != -1 || error.indexOf("ConstraintNotSatisfiedError") != -1) {
                    errorMessage = conf.message.DEVICES_NOT_FOUND;
                } else if (error.indexOf("NotAllowedError") != -1 || error.indexOf("PermissionDeniedError") != -1) {
                    errorMessage = conf.message.DEVICES_NOT_ALLOWED;
                } else if (error.indexOf("TypeError") != -1) {
                    errorMessage = conf.message.DEVICES_REQUIRED;
                }
                this._alerta.initiateMessage(errorMessage);
            }
        });
        this._streams['adaptor'] = this._webRTCAdaptor;
        this._streams['id'] = roomid;
        if (!videoLayer) this._adaptors.push(this._streams);
    }

    /**
     * Inicia publicação da mídia capturada para o socket do serviço de mídia 
     * (informado em websocketURL) 
     * @param {String} roomid 
     */
    startPublishing(roomid) {
        console.log(this._webRTCAdaptor);
        this._webRTCAdaptor.publish(btoa(roomid), "null");
    }

    /**
     * Finaliza a publicação de mídia para o serviço de mídia
     * @param {String} roomid 
     * @param {Boolean} isBroadcaster 
     * @param {Obj WebRTCAdaptor} adaptor 
     */
    stopPublishing(roomid, isBroadcaster, adaptor, media, mediaController, broadcaster) {

        console.warn('Finalizando transmissão...', roomid, isBroadcaster);
        if (isBroadcaster) {
            this._startedStream = false;
            media.previewVideo.pause();
            mediaController.changeTransmition(misc.TITLE_FINISH_ROOM, misc.ICON_END_ROOM);
            mediaController.stopTransmition(roomid, broadcaster);
        }
        adaptor.stop(btoa(roomid));
    }

    /**
     * Altera a captura de mídia para a ferramenta de compartilhamento de tela
     * @param {String} streamId 
     */
    enableDesktopCapture(streamId) {

        this._webRTCAdaptor.switchDesktopCapture(btoa(streamId));
    }

}
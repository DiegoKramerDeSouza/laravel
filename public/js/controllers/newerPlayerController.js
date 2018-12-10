class NewerPlayerController {

    constructor(roomId, videoid, media) {

        this._videoid = videoid;
        this._media = media;
        this._token = "null";
        this._streamId = roomId;
        this._webRTCAdaptor;
        this._pc_config;
        this._sdpConstraints;
        this._mediaConstraints;
        this._websocketURL;
    }

    startPlaying() {

        this._webRTCAdaptor.play(this._streamId, this._token);
    }

    stopPlaying() {

        this._webRTCAdaptor.stop(this._streamId);
    }

    startConfig() {

        this._pc_config = null;
        this._sdpConstraints = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true

        };
        this._mediaConstraints = {
            video: false,
            audio: false
        };


        location.protocol.startsWith("https") ?
            this._websocketURL = "wss://test.antmedia.io:5443/WebRTCAppEE/websocket" :
            this._websocketURL = "ws://test.antmedia.io:5080/WebRTCAppEE/websocket";

        /*
        location.protocol.startsWith("https") ?
            this._websocketURL = "wss://med.lrbtecnologia.com:5443/WebRTCApp/websocket" :
            this._websocketURL = "ws://med.lrbtecnologia.com:5080/WebRTCApp/websocket";

        */
        this._startVideo();

    }

    _startVideo() {

        this._webRTCAdaptor = new WebRTCAdaptor({
            websocket_url: this._websocketURL,
            mediaConstraints: this._mediaConstraints,
            peerconnection_config: this._pc_config,
            sdp_constraints: this._sdpConstraints,
            remoteVideoId: this._videoid,
            isPlayMode: true,
            debug: true,
            callback: (info, description) => {
                if (info == "initialized") {
                    console.log("Stream inicializada");
                    this._media.controlVolume();

                } else if (info == "play_started") {
                    console.log("Stream publicada");

                } else if (info == "play_finished") {
                    console.log("Stream finalizada");
                    this._media.stopTransmition(this._streamId);

                } else if (info == "closed") {
                    if (typeof description != "undefined") {
                        console.log("Conexão fechada: " + JSON.stringify(description));
                    }
                }
            },
            callbackError: (error) => {
                let errorType = JSON.stringify(error);
                console.error("Erro encontrado: " + errorType, this._streamId);
                if (errorType == 'no_stream_exist') {
                    setTimeout(() => {
                        this.startPlaying();
                    }, 1000);
                }
            }
        });
    }

}
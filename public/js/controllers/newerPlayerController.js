class NewerPlayerController {

    constructor(roomId) {

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

        /*
        location.protocol.startsWith("https") ?
            this._websocketURL = "wss://test.antmedia.io:5443/WebRTCAppEE/websocket" :
            this._websocketURL = "ws://test.antmedia.io:5080/WebRTCAppEE/websocket";
        */

        location.protocol.startsWith("https") ?
            this._websocketURL = "wss://med.lrbtecnologia.com:5443/WebRTCApp/websocket" :
            this._websocketURL = "ws://med.lrbtecnologia.com:5080/WebRTCApp/websocket";


        this._startVideo();

    }

    _startVideo() {

        this._webRTCAdaptor = new WebRTCAdaptor({
            websocket_url: this._websocketURL,
            mediaConstraints: this._mediaConstraints,
            peerconnection_config: this._pc_config,
            sdp_constraints: this._sdpConstraints,
            remoteVideoId: "remoteVideo",
            isPlayMode: true,
            debug: true,
            callback: function(info, description) {
                if (info == "initialized") {
                    console.log("initialized");

                } else if (info == "play_started") {
                    //joined the stream
                    console.log("play started");

                } else if (info == "play_finished") {
                    //leaved the stream
                    console.log("play finished");

                } else if (info == "closed") {
                    //console.log("Connection closed");
                    if (typeof description != "undefined") {
                        console.log("Connecton closed: " + JSON.stringify(description));
                    }
                }
            },
            callbackError: function(error) {
                //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError
                console.log("error callback: " + JSON.stringify(error));
                console.error(JSON.stringify(error));
            }
        });
    }

}
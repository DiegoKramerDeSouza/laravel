/**
 * Controla mecanismos de elementos de mídia como vídeos, volume e câmeras
 *  ->  Controla também as funções de operações relativas às mídias como
 *      pedir a vez e compartilhamento de tela
 */
class MediaController {

    constructor() {

        let tag = document.querySelector.bind(document);
        this._mediaView = new MediaView();

        this._videoPreview = tag(conf.dom.FIRST_VIDEO);
        this._secondVideoPreview = tag(conf.dom.SECOND_VIDEO);
        this._thirdVideoPreview = tag(conf.dom.THIRD_VIDEO);
        this._mute = tag(conf.dom.MUTE);
        this._screen = tag(conf.dom.SCREEN);
        this._exitscreen = tag(conf.dom.EXIT_SCREEN);
        this._vol = tag(conf.dom.VOL);
        this._solPedir = tag(conf.dom.SOL_PEDIR);
        this._cam = tag(conf.dom.CAM);
        this._pedir = tag(conf.dom.PEDIR);
        this._ctlPedir = tag(conf.dom.CTL_PEDIR);
        this._share = tag(conf.dom.SHARE);
        this._videoSecond = tag(conf.dom.VIDEO_SECOND);
        this._swapSecond = tag(conf.dom.SWAP_SECOND);
        this._sessionAccess = tag(conf.dom.SESSION_ACCESS);
        this._endSessionAccess = tag(conf.dom.END_SESSION_ACCESS);
        this._divEndBtn = tag(conf.dom.DIV_BTN_END);
        this._toggleChat = tag(conf.dom.TOGGLE_CHAT);
        this._textMessage = tag(conf.dom.TEXT_MESSAGE);

        this._controlCam = true;
        this._controlMute = true;
        this._controlVolume = true;
        this._controlSharing = true;

        this._session = false;
        this._videoIsMain = false;
        this._divMainVideo = tag(conf.dom.DIV_MAIN_VIDEO);
        this._divIncomingVideo = tag(conf.dom.DIV_INCOMING_VIDEO);
        this._otherVideos = {
            screen: '',
            user: ''
        };
    }

    initiateMedia() {

        let arrMedia = [
            this._videoPreview,
            this._secondVideoPreview,
            this._thirdVideoPreview,
            this._mute,
            this._screen,
            this._exitscreen,
            this._vol,
            this._cam,
            this._solPedir,
            this._pedir,
            this._ctlPedir,
            this._share,
            this._videoSecond,
            this._swapSecond,
            this._sessionAccess,
            this._endSessionAccess,
            this._divEndBtn,
            this._toggleChat,
            this._textMessage
        ];
        return new Media(...arrMedia);
    }

    _switchValue(value) {

        return value ? false : true;
    }

    initiateVideo(targetVideo) {

        let playPromise = targetVideo.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                    targetVideo.play();
                })
                .catch(error => {});
        }
    }

    controlVolume(currentStream) {

        if (this._controlVolume) {
            currentStream.forEach((stream) => {
                stream.mute('audio');
            });
            this._mediaView.setVolume();
            this._controlVolume = false;
        } else {
            currentStream.forEach((stream) => {
                stream.unmute('audio');
            });
            this._mediaView.setVolume();
            this._controlVolume = true;
        }
    }

    disableVolume() {

        this._mediaView.volumeOff();
    }

    controlMute(currentStream) {

        if (this._controlMute) {
            currentStream.forEach((stream) => {
                if (!stream.isScreen) {
                    stream.mute('audio');
                }
            });
            this._mediaView.setMute();
            this._controlMute = false;
        } else {
            currentStream.forEach((stream) => {
                if (!stream.isScreen) {
                    stream.unmute({
                        audio: true,
                        video: false,
                        type: 'remote'
                    });
                }
            });
            this._mediaView.setMute();
            this._controlMute = true;
        }
    }

    disableMute() {

        this._mediaView.muteOff();
    }

    controlCam(currentStream) {

        if (this._controlCam) {
            currentStream.forEach((stream) => {
                if (!stream.isScreen) {
                    stream.mute('video');
                    stream.mute('audio');
                }
            });
            this._mediaView.setCam();
            this._controlCam = false;
            if (this._controlMute) {
                this._mediaView.setMute();
                this._controlMute = false;
            }
        } else {
            currentStream.forEach((stream) => {
                if (!stream.isScreen) {
                    stream.unmute('video');
                    stream.unmute('audio');
                }
            });
            this._mediaView.setCam();
            this._controlCam = true;
            if (!this._controlMute) {
                this._mediaView.setMute();
                this._controlMute = true;
            }
        }
    }

    disableCam() {

        this._mediaView.camOff();
    }

    controlSwapVideo() {

        let mVideoP = this._videoPreview;
        let sVideoP = this._secondVideoPreview;
        let mainVideoSrc;

        this._videoIsMain ? mVideoP.classList.remove(conf.misc.CLASS_WIDTH_LIMIT) : mVideoP.classList.add(conf.misc.CLASS_WIDTH_LIMIT);
        this._videoIsMain = this._switchValue(this._videoIsMain);

        mainVideoSrc = mVideoP.srcObject;
        mVideoP.pause();
        sVideoP.pause();
        mVideoP.srcObject = sVideoP.srcObject;
        sVideoP.srcObject = mainVideoSrc;

        setTimeout(function() {
            let playSecReady = sVideoP.play();
            let playReady = mVideoP.play();
            if (playSecReady !== undefined && playReady !== undefined) {
                playSecReady.then(_ => {
                        sVideoP.play();
                    })
                    .catch(error => {
                        console.log('Iniciando vídeo...');
                    });
                playReady.then(_ => {
                        mVideoP.play();
                    })
                    .catch(error => {
                        console.log('Iniciando vídeo...');
                    });
            }
        }, 500);
    }

    openIncomingVideos(stream) {

        if (stream) {
            stream.isScreen ? this._otherVideos.screen = stream.id : this._otherVideos.user = stream.id;
            this._mediaView.incomingVideos(this._divMainVideo, this._divIncomingVideo, true);
        } else {
            return;
        }
    }

    closeIncomingVideos(stream) {

        if (stream) {
            stream.isScreen ? this._otherVideos.screen = '' : this._otherVideos.user = '';
            if (this._otherVideos.screen == '' && this._otherVideos.user == '') {
                this._mediaView.incomingVideos(this._divMainVideo, this._divIncomingVideo);
            } else {
                return;
            }
        } else {
            return;
        }
    }

    switchShare() {

        this._controlSharing = this._switchValue(this._controlSharing);
        this._mediaView.setShare();
    }

    disableShare() {

        this._mediaView.shareOff();
    }

    startParticipation() {

        this._session = true;
        this._mediaView.startParticipation();
    }

    endParticipation() {

        this._session = false;
        this._mediaView.endParticipation();
    }

    disableParticipation() {

        this._session = false;
        this._mediaView.participationOff();
    }

    allow() {

        this._mediaView.allowSolicitation();
    }

    deny() {

        this._mediaView.denySolicitation();
    }

    disablePedir() {

        this._mediaView.pedirOff();
    }
}
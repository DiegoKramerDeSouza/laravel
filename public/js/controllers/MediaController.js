class MediaController {

    constructor() {

        let tag = document.querySelector.bind(document);

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

    initiateVideo(targetVideo) {

        let playPromise = targetVideo.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                    targetVideo.play();
                })
                .catch(error => {
                    console.log('Carregando vídeo...');
                });
        }
    }

    controlVolume(currentStream) {

        if (this._vol.getAttribute('data-active') == 'enabled') {
            currentStream.forEach((stream) => {
                stream.mute('audio');
            });
            setVol('off');
        } else {
            currentStream.forEach((stream) => {
                stream.unmute('audio');
            });
            RoomHelper.setVol('on');
        }
    }

    controlMute(currentStream) {

        if (this._mute.getAttribute('data-active') == 'enabled') {
            currentStream.forEach((stream) => {
                if (!stream.isScreen) {
                    stream.mute('audio');
                }
            });
            RoomHelper.setMute('off');
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
            RoomHelper.setMute('on');
        }
    }

    controlCam(currentStream) {

        if (this._cam.getAttribute('data-active') == 'enabled') {
            currentStream.forEach((stream) => {
                if (!stream.isScreen) {
                    stream.mute('video');
                    stream.mute('audio');
                }
            });
            RoomHelper.setCam('off');
            RoomHelper.setMute('off');
        } else {
            currentStream.forEach((stream) => {
                if (!stream.isScreen) {
                    stream.unmute('video');
                    stream.unmute('audio');
                }
            });
            RoomHelper.setCam('on');
            RoomHelper.setMute('on');
        }
    }

    controlSwapVideo() {

        let mVideoP = this._videoPreview;
        let sVideoP = this._secondVideoPreview;
        let videoS = this._videoSecond;
        let mainVideoSrc;

        if (videoS.getAttribute('data-position') == 'second') {
            videoS.setAttribute('data-position', 'main');
            mVideoP.classList.add('width-limit');
        } else {
            videoS.setAttribute('data-position', 'second');
            mVideoP.classList.remove('width-limit');
        }
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
                        console.log('Carregando vídeo 2...');
                    });
                playReady.then(_ => {
                        mVideoP.play();
                    })
                    .catch(error => {
                        console.log('Carregando vídeo 1...');
                    });
            }
        }, 500);
    }
}
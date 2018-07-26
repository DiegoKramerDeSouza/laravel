/**
 * Controla mecanismos de elementos de mídia como vídeos, volume e câmeras
 *  ->  Controla também as funções de operações relativas às mídias como
 *      pedir a vez e compartilhamento de tela
 */
class MediaController {

    constructor() {

        this._mediaView = new MediaView();

        this._videoPreview = doc.TAG(dom.FIRST_VIDEO);
        this._secondVideoPreview = doc.TAG(dom.SECOND_VIDEO);
        this._thirdVideoPreview = doc.TAG(dom.THIRD_VIDEO);
        this._mute = doc.TAG(dom.MUTE);
        this._screen = doc.TAG(dom.SCREEN);
        this._exitscreen = doc.TAG(dom.EXIT_SCREEN);
        this._vol = doc.TAG(dom.VOL);
        this._solPedir = doc.TAG(dom.SOL_PEDIR);
        this._cam = doc.TAG(dom.CAM);
        this._pedir = doc.TAG(dom.PEDIR);
        this._ctlPedir = doc.TAG(dom.CTL_PEDIR);
        this._share = doc.TAG(dom.SHARE);
        this._videoSecond = doc.TAG(dom.VIDEO_SECOND);
        this._swapSecond = doc.TAG(dom.SWAP_SECOND);
        this._sessionAccess = doc.TAG(dom.SESSION_ACCESS);
        this._endSessionAccess = doc.TAG(dom.END_SESSION_ACCESS);
        this._divEndBtn = doc.TAG(dom.DIV_BTN_END);
        this._toggleChat = doc.TAG(dom.TOGGLE_CHAT);
        this._textMessage = doc.TAG(dom.TEXT_MESSAGE);
        this._sideNavbar = doc.TAG(dom.SIDE_NAVBAR);
        this._fullsize = doc.TAG(dom.TOGGLE_VIDEO_SIZE);

        this._controlCam = true;
        this._controlVoice = true;
        this._controlVolume = true;
        this._controlSharing = false;
        this._session = false;
        this._videoIsMain = false;

        this._roomId = doc.TAG(dom.ROOM);
        this._divMainVideo = doc.TAG(dom.DIV_MAIN_VIDEO);
        this._spanMainVideo = doc.TAG(dom.VIDEO_MAIN);
        this._pageMainContainer = doc.TAG(dom.PAGE_MAIN_CONTENT);
        this._divIncomingVideo = doc.TAG(dom.DIV_INCOMING_VIDEO);
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
            this._textMessage,
            this._fullsize
        ];
        return new Media(...arrMedia);
    }

    initListeners() {

        document.addEventListener('fullscreenchange', this.escFullScreen);
        document.addEventListener('webkitfullscreenchange', this.escFullScreen);
        document.addEventListener('mozfullscreenchange', this.escFullScreen);
        document.addEventListener('MSFullscreenChange', this.escFullScreen);
    }

    _switchValue(value) {

        return value ? false : true;
    }

    initiateStream() {

        this._mediaView.adjustStreamScreen();
        this._mediaView.adjustChatPanel();
    }

    getControlSharing() {

        return this._controlSharing;
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
            this._mediaView.setVolumeOff();
            this._controlVolume = false;
        } else {
            currentStream.forEach((stream) => {
                stream.unmute('audio');
            });
            this._mediaView.setVolumeOn();
            this._controlVolume = true;
        }
    }

    disableVolume() {

        this._mediaView.volumeOff();
    }

    controlVoice(currentStream) {

        if (this._controlVoice) {
            currentStream.forEach((stream) => {
                if (!stream.isScreen) {
                    stream.mute('audio');
                }
            });
            this._mediaView.setVoiceOff();
            this._controlVoice = false;
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
            this._mediaView.setVoiceOn();
            this._controlVoice = true;
        }
    }

    disableMute() {

        this._mediaView.voiceOff();
    }

    controlCam(currentStream) {

        if (this._controlCam) {
            currentStream.forEach((stream) => {
                if (!stream.isScreen) {
                    stream.mute('video');
                    stream.mute('audio');
                }
            });
            this._mediaView.setCamOff();
            this._controlCam = false;
            if (this._controlVoice) {
                this._mediaView.setVoiceOff();
                this._controlVoice = false;
            }
        } else {
            currentStream.forEach((stream) => {
                if (!stream.isScreen) {
                    stream.unmute('video');
                    stream.unmute('audio');
                }
            });
            this._mediaView.setCamOn();
            this._controlCam = true;
            if (!this._controlVoice) {
                this._mediaView.setVoiceOn();
                this._controlVoice = true;
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

        this._videoIsMain ? mVideoP.classList.remove(misc.CLASS_WIDTH_LIMIT) : mVideoP.classList.add(misc.CLASS_WIDTH_LIMIT);
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
            this._mediaView.openIncomingVideos(this._divMainVideo, this._divIncomingVideo);
        } else {
            return;
        }
    }

    closeIncomingVideos(stream) {

        if (stream) {
            stream.isScreen ? this._otherVideos.screen = '' : this._otherVideos.user = '';
            if (this._otherVideos.screen == '' && this._otherVideos.user == '') {
                this._mediaView.closeIncomingVideos(this._divMainVideo, this._divIncomingVideo);
            } else {
                return;
            }
        } else {
            return;
        }
    }

    switchShare() {

        this._controlSharing = this._switchValue(this._controlSharing);
        this._controlSharing ? this._mediaView.startShare() : this._mediaView.exitShare();
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

    enterFullScreen() {

        if (this._spanMainVideo.mozRequestFullScreen) {
            this._spanMainVideo.mozRequestFullScreen();
        } else if (this._spanMainVideo.requestFullScreen) {
            this._spanMainVideo.requestFullScreen();
        } else if (this._spanMainVideo.webkitRequestFullScreen) {
            this._spanMainVideo.webkitRequestFullScreen();
        }
        this._mediaView.enterFullscreen();
    }

    exitFullScreen() {

        if (document.fullscreen) {
            document.cancelFullScreen();
        } else if (document.mozFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitIsFullScreen) {
            document.webkitCancelFullScreen();
        }
        this._mediaView.exitFullscreen();
    }

    escFullScreen() {

        if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            if (document.fullscreen) {
                document.cancelFullScreen();
            } else if (document.mozFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitIsFullScreen) {
                document.webkitCancelFullScreen();
            }
            $(dom.DIV_EXIT_FSCREEN).fadeOut(500);
            let videoContainer = doc.TAG(dom.VIDEO_MAIN);
            videoContainer.classList.remove(misc.TURNOFF_COLOR);
            videoContainer.classList.add(misc.CLASS_WIDTH_LIMIT);
            videoContainer.style.height = misc.STYLE_HEIGHT_INHERIT;
        }
        return;
    }

    toggleFullSize() {

        if (RoomHelper.hasClass(this._pageMainContainer, misc.CLASS_MAIN_CONTAINER)) {
            this._mediaView.expandVideoSize();
        } else {
            this._mediaView.shrinkVideoSize();
        }
    }

    writeMessage(msg, rmt) {

        let msgbox;
        let message = atob(msg);
        let instance = M.Sidenav.getInstance(this._sideNavbar);

        rmt ? msgbox = misc.DEFAULT_MSGBOX_OUT : msgbox = misc.DEFAULT_MSGBOX_IN;
        this._mediaView.writeReceiveMessage(message, msgbox, instance.isOpen);
    }

    trataSolicitacao(value) {

        if (value > 0) this._mediaView.showSolicitation(value);
        else this._mediaView.hideSolicitation();
    }

    listBox(text, count) {

        if (text[1] === this._roomId.value) {
            count++
            this.trataSolicitacao(count);
            this._mediaView.listSolicitation(count, text[0], text[2]);
        }
        return count;
    }

    reconstructList(exp) {

        let responseList = doc.ALL(dom.SOL_RESPONSE);

        this._mediaView.clearSolicitationLis();
        if (responseList.length <= 1) this._mediaView.noSolicitation();
        else {
            responseList.forEach(response => {
                console.log(response.id, exp);
                if (response.id != exp) {
                    this._mediaView.newSolicitation(response);
                }
            });
        }
        this._mediaView.constructSolicitationList();
    }

}
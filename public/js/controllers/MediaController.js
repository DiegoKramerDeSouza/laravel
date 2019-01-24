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
        this._previewVideo = doc.TAG(dom.PREVIEW);
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
        this._sharedFile = doc.TAG(dom.BTN_FILE_SHARING);
        this._spanSecondVideo = doc.TAG(dom.VIDEO_SECOND);
        this._callMinReceiveFiles = doc.TAG(dom.CALL_RECEIVE);
        this._callMinSendFiles = doc.TAG(dom.CALL_SEND);
        this._callReceiveFiles = doc.TAG(dom.CALL_RECEIVE_MIN);
        this._callSendFiles = doc.TAG(dom.CALL_SEND_MIN);
		this._finish = doc.TAG(dom.FINISH);

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

        return new Media(
            this._videoPreview,
            this._secondVideoPreview,
            this._thirdVideoPreview,
            this._previewVideo,
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
            this._fullsize,
            this._sharedFile,
            this._spanSecondVideo,
            this._callReceiveFiles,
            this._callSendFiles,
            this._callMinReceiveFiles,
            this._callMinSendFiles
        );
    }

    initListeners() {

        document.addEventListener('fullscreenchange', this.escFullScreen);
        document.addEventListener('webkitfullscreenchange', this.escFullScreen);
        document.addEventListener('mozfullscreenchange', this.escFullScreen);
        document.addEventListener('MSFullscreenChange', this.escFullScreen);
		this._changeTransmition();
    }

    createSolicitationArray(command, firstData, secondData, thirdData, fourthData) {

        return [
            command,
            firstData,
            secondData,
            thirdData,
            fourthData
        ];
    }

    _switchValue(value) {

        return value ? false : true;
    }

    initiateStream() {

        this._mediaView.adjustStreamScreen();
        this._mediaView.adjustChatFilePanel();
    }

    initiateControls() {

        this._mediaView.showControlElements();
    }

    getControlSharing() {

        return this._controlSharing;
    }

    initiateVideo(targetVideo) {

        //targetVideo.play();

        setTimeout(() => {
            let playPromise = targetVideo.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                        targetVideo.play();
                    })
                    .catch(error => {
                        console.log('Erro ao inicializar vídeo...', error);
                        this.initiateVideo(targetVideo);
                    });
                return;
            }
        }, 700);

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
        mVideoP.classList.add("obj-invisible");
        sVideoP.classList.add("obj-invisible");
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
                        console.log('Iniciando vídeo...', error);
                    });
                playReady.then(_ => {
                        mVideoP.play();
                    })
                    .catch(error => {
                        console.log('Iniciando vídeo...', error);
                    });
            }
            mVideoP.classList.remove("obj-invisible");
            sVideoP.classList.remove("obj-invisible");
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

    getSharedValue() {

        return this._videoIsMain;
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

        if (GeneralHelper.hasClass(this._pageMainContainer, misc.CLASS_MAIN_CONTAINER)) {
            this._mediaView.expandVideoSize();
        } else {
            this._mediaView.shrinkVideoSize();
        }
    }

    toggleVisibility(elem) {

        if (GeneralHelper.hasClass(elem, misc.CLASS_INVISIBLE)) {
            this._mediaView.setVisible(elem);
        } else {
            this._mediaView.setInvisible(elem);
        }
    }

    writeChatMessage(user, message) {

        return this._mediaView.writeChatMessage(user, message);
    }

    writeMessage(msg, rmt) {

        let msgbox;
        let message = atob(msg);
        let instance = M.Sidenav.getInstance(this._sideNavbar);

        rmt ? msgbox = misc.DEFAULT_MSGBOX_OUT : msgbox = misc.DEFAULT_MSGBOX_IN;
        this._mediaView.writeReceiveMessage(message, msgbox, instance.isOpen);
    }

    disableFileSharing() {

        this._mediaView.fileSharingOff();
    }

    disableFileSharingList() {

        this._mediaView.fileSharingListOff();
    }

    fileSharing(connection, count) {

        if (count > 0) {
            let fileSelector = new FileSelector();
            fileSelector.selectSingleFile(file => {
                this._getDataURL(file, dataURL => {
                    connection.send([
                        btoa(conf.req.RECEIVE_FILE),
                        file.name,
                        file.type,
                        file.size,
                        file.lastModified
                    ]);
                    setTimeout(() => {
                        connection.send({
                            fileName: file.name,
                            fileType: file.type,
                            dataURL: dataURL
                        });
                        this._mediaView.createSendedFiles(file.name, file.size);
                    }, 500);
                });
            });
        } else {
            this._mediaView.noFileSharing();
        }
    }

    incomingFile(event, connection) {

        let blob = this._dataURItoBlob(event.data.dataURL);
        //console.log(event.data);
        let file = new File([blob], event.data.fileName, {
            type: event.data.fileType
        });
        this._mediaView.transferCompleted();
        this._mediaView.createDownloadLink(file, connection);
        return;
    }

    createProgressBar(file) {

        this._mediaView.createProgressBar(file);
    }

    _dataURItoBlob(dataURI) {

        let byteString = atob(dataURI.split(',')[1]);
        let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        let ab = new ArrayBuffer(byteString.length);
        let ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        let blob = new Blob([ab], {
            type: mimeString
        });
        return blob;
    }

    _getDataURL(file, callback) {

        let reader = new FileReader();
        reader.onload = event => callback(event.target.result);
        reader.readAsDataURL(file);
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

    adjustMediaMenu(type) {

        if (type === 'local') {
            this.disableVolume();
            if (DetectRTC.isMobileDevice) this.disableShare();
            this._mediaView.adjustBroadCaster();
        } else {
            this.disableCam();
            this.disableMute();
            this.disableShare();
            this.disableFileSharing();
            this._mediaView.adjustEspect();
        }
    }

    displayElem(elem, delay) {

        this._mediaView.fadeInElem(elem, delay);
        //delay != undefined ? this._mediaView.fadeInElem(elem, delay) : this._mediaView.displayElem(elem);
    }

    hideElem(elem, delay) {

        this._mediaView.fadeOutElem(elem, delay)
            //delay != undefined ? this._mediaView.fadeOutElem(elem, delay) : this._mediaView.hideElem(elem);
    }
	
	_changeTransmition() {

        this._finish.onclick = (() => location.reload.bind(location));
    }



}
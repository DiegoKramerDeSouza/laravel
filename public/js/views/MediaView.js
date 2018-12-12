/**
 * Cotrola elementos visuais e alterações de view quando aplicados aos elementos de mídia
 */
class MediaView {

    constructor() {

        this._alerta = new MessageController();

        this._mute = doc.TAG(dom.MUTE);
        this._cam = doc.TAG(dom.CAM);
        this._vol = doc.TAG(dom.VOL);
        this._share = doc.TAG(dom.SHARE);
        this._pedir = doc.TAG(dom.PEDIR);
        this._sharedFile = doc.TAG(dom.BTN_FILE_SHARING);
        this._participation = doc.TAG(dom.SESSION_ACCESS);
        this._divParticipation = doc.TAG(dom.DIV_ENTER);
        this._divMainVideo = doc.TAG(dom.DIV_MAIN_VIDEO);
        this._divIncomingVideo = doc.TAG(dom.DIV_INCOMING_VIDEO);
        this._spanMainVideo = doc.TAG(dom.VIDEO_MAIN);
        this._mainVideo = doc.TAG(dom.FIRST_VIDEO);
        this._pageMainContainer = doc.TAG(dom.PAGE_MAIN_CONTENT);
        this._chatPanel = doc.TAG(dom.CHAT_PANEL);
        this._sideNavbar = doc.TAG(dom.SIDE_NAVBAR);
        this._chatTextArea = doc.TAG(dom.CHAT_TEXTAREA);
        this._countPedirVez = doc.TAG(dom.COUNT_PEDIR);
        this._solicitationList = doc.TAG(dom.SOL_LIST);
        this._fileTransfering = doc.TAG(dom.FILE_TRANSFERING);
        this._fileListReceive = doc.TAG(dom.FILE_LIST_REICEIVED);
        this._fileListSend = doc.TAG(dom.FILE_LIST_SENDED);
        this._fileSideBar = doc.TAG(dom.FILE_EXP);
        this._countdown = doc.TAG(dom.COUNTDOWN);
        this._videoField = doc.TAG(dom.PRE_APRESENTACAO);
        this._listContent = '';
        this._countReceiveFiles = 0;
        this._countSendFiles = 0;
        this._otherVideos = false;
        this._readyToPlay = false;

    }

    setInvisible(elem) {

        elem.classList.add(misc.CLASS_INVISIBLE);
    }

    setVisible(elem) {

        elem.classList.remove(misc.CLASS_INVISIBLE);
    }

    setVoiceOn() {

        this._mute.classList.remove(misc.OFF_COLOR);
        this._mute.innerHTML = misc.ICON_MIC;
        this._alerta.initiateMessage(conf.message.MIC_ON);
    }

    setVoiceOff() {

        this._mute.classList.add(misc.OFF_COLOR);
        this._mute.innerHTML = misc.ICON_MUTE_MIC;
        this._alerta.initiateMessage(conf.message.MIC_OFF);
    }

    voiceOff() {

        this._mute.classList.add(misc.DISABLED_COLOR);
        this._mute.innerHTML = misc.ICON_MUTE_MIC;
        this._mute.disabled = true;
        GeneralHelper.hideit(dom.LI_MUTE);
    }

    setVolumeOn() {

        this._vol.classList.remove(misc.OFF_COLOR);
        this._vol.innerHTML = misc.ICON_VOL_ON;
        this._vol.setAttribute(misc.ATTR_ACTIVE, 'unmute');
        this._alerta.initiateMessage(conf.message.VOL_UP);
    }

    setVolumeOff() {

        this._vol.classList.add(misc.OFF_COLOR);
        this._vol.innerHTML = misc.ICON_VOL_OFF;
        this._vol.setAttribute(misc.ATTR_ACTIVE, 'mute');
        this._alerta.initiateMessage(conf.message.VOL_DOWN);
    }

    volumeOff() {

        this._vol.classList.add(misc.DISABLED_COLOR);
        this._vol.innerHTML = misc.ICON_VOL_OFF;
        this._vol.disabled = true;
        GeneralHelper.hideit(dom.LI_VOLUME);
    }

    setCamOn() {

        this._cam.classList.remove(misc.OFF_COLOR);
        this._cam.innerHTML = misc.ICON_CAM_ON;
        this._alerta.initiateMessage(conf.message.CAM_ON);
    }

    setCamOff() {

        this._cam.classList.add(misc.OFF_COLOR);
        this._cam.innerHTML = misc.ICON_CAM_OFF;
        this._alerta.initiateMessage(conf.message.CAM_OFF);
    }

    camOff() {

        this._cam.classList.add(misc.DISABLED_COLOR);
        this._cam.innerHTML = misc.ICON_CAM_OFF;
        this._cam.disabled = true;
        GeneralHelper.hideit(dom.LI_CAM);
    }

    openIncomingVideos(mainVideo, inVideo) {

        mainVideo.classList.remove("m8");
        mainVideo.classList.add("m7");
        inVideo.classList.add("m3");
        inVideo.classList.remove("m2");
        this._otherVideos = true;
    }

    closeIncomingVideos(mainVideo, inVideo) {

        mainVideo.classList.add("m8");
        mainVideo.classList.remove("m7");
        inVideo.classList.add("m2");
        inVideo.classList.remove("m3");
        this._otherVideos = false;
    }

    startShare() {

        GeneralHelper.showit(dom.SHARE);
        this._share.classList.add(misc.OFF_COLOR);
        this._share.innerHTML = misc.ICON_SHARE_OFF;
    }

    exitShare() {

        GeneralHelper.showit(dom.SHARE);
        this._share.classList.remove(misc.OFF_COLOR);
        this._share.innerHTML = misc.ICON_SHARE_ON;
    }


    shareOff() {

        this._share.disabled = true;
        this._share.classList.add(misc.DISABLED_COLOR);
        this._share.innerHTML = misc.ICON_SHARE_ON;
        GeneralHelper.hideit(dom.LI_SHARE);
    }

    shareEnabled() {

        this._share.disabled = false;
        this._share.classList.add(misc.ON_COLOR);
        this._share.classList.remove(misc.OFF_COLOR);
        this._share.classList.remove(misc.DISABLED_COLOR);
        GeneralHelper.showit(dom.LI_SHARE);
    }

    startParticipation() {

        GeneralHelper.showit(dom.DIV_ENTER);
        this._divParticipation.title = 'Finalizar participação';
        this._participation.classList.remove(misc.HILIGHT_COLOR);
        this._participation.classList.add(misc.OFF_COLOR);
        this._participation.innerHTML = misc.ICON_CAM_OFF;
    }

    endParticipation() {

        GeneralHelper.showit(dom.DIV_ENTER);
        this._divParticipation.title = 'Ingressar';
        this._participation.classList.remove(misc.OFF_COLOR);
        this._participation.classList.add(misc.HILIGHT_COLOR);
        this._participation.innerHTML = misc.ICON_CAM_ON;
    }

    participationOff() {

        this._participation.classList.remove(misc.HILIGHT_COLOR);
        this._participation.classList.add(misc.OFF_COLOR);
        this._participation.innerHTML = misc.ICON_CAM_OFF;
        this._participation.disabled = true;
        GeneralHelper.hideit(dom.DIV_ENTER);
    }

    allowSolicitation() {

        this._alerta.initiateMessage(conf.message.SEND_ACP_SOLICITATION);
        setTimeout(() => {
            GeneralHelper.showit(dom.DIV_ENTER, 300);
            this.endParticipation();
            $(dom.SESSION_ACCESS).click();
            this._alerta.initiateMessage(conf.message.SEND_START_SOLICITATION);
        }, 2000);
    }

    denySolicitation() {

        this.participationOff();
        this._alerta.initiateMessage(conf.message.NOT_ACP_SOLICITATION);
    }

    pedirOff() {

        this._pedir.classList.add(misc.OFF_COLOR);
        this._pedir.disabled = true;
        GeneralHelper.hideit(dom.LI_PERDIR);
    }

    fileSharingOff() {

        this._sharedFile.classList.remove(misc.HILIGHT_COLOR);
        this._sharedFile.classList.add(misc.OFF_COLOR);
        this._sharedFile.disabled = true;
        GeneralHelper.hideit(dom.BTN_FILE_SHARING);
    }

    fileSharingListOff() {

        this._fileListReceive.classList.remove(misc.HILIGHT_COLOR);
        this._fileListSend.classList.remove(misc.HILIGHT_COLOR);
        this._fileListReceive.classList.add(misc.OFF_COLOR);
        this._fileListSend.classList.add(misc.OFF_COLOR);
        this._fileListReceive.disabled = true;
        this._fileListSend.disabled = true;
        GeneralHelper.hideit(dom.FILE_LIST);
    }

    noFileSharing() {

        this._alerta.initiateMessage(conf.message.NO_PARTICIPANTS);
    }

    exitFullscreen() {

        GeneralHelper.hideit(dom.DIV_EXIT_FSCREEN, 500);
        this._spanMainVideo.classList.remove(misc.TURNOFF_COLOR);
        this._spanMainVideo.classList.add(misc.CLASS_WIDTH_LIMIT);
        this._spanMainVideo.style.height = misc.STYLE_HEIGHT_INHERIT;
        this.shrinkVideoSize();
    }

    enterFullscreen() {

        GeneralHelper.showit(dom.DIV_EXIT_FSCREEN, 500);
        this._spanMainVideo.classList.add(misc.TURNOFF_COLOR);
        this._spanMainVideo.classList.remove(misc.CLASS_WIDTH_LIMIT);
        this._spanMainVideo.style.height = (window.innerHeight) + 'px';
    }

    fullScreamOff() {

        GeneralHelper.hideit(dom.LI_SCREEN);
    }

    pedirOff() {

        this._pedir.classList.add(misc.OFF_COLOR);
        this._pedir.disabled = true;
        GeneralHelper.hideit(dom.PEDIR);
    }

    expandVideoSize() {

        this._pageMainContainer.classList.remove(misc.CLASS_MAIN_CONTAINER);
        this._pageMainContainer.classList.add(misc.CLASS_MAIN_CONTAINER_FULL);
        this._spanMainVideo.classList.add(misc.CLASS_WIDTH_LIMIT_NO);
        this._spanMainVideo.classList.remove(misc.CLASS_WIDTH_LIMIT);
    }

    shrinkVideoSize() {

        this._pageMainContainer.classList.remove(misc.CLASS_MAIN_CONTAINER_FULL);
        this._pageMainContainer.classList.add(misc.CLASS_MAIN_CONTAINER);
        this._spanMainVideo.classList.add(misc.CLASS_WIDTH_LIMIT);
        this._spanMainVideo.classList.remove(misc.CLASS_WIDTH_LIMIT_NO);
    }

    adjustStreamScreen() {

        GeneralHelper.showit(dom.BG_DARK, 500);
        $(dom.ROOM_LOBBY).slideUp(500);
        $(dom.VIDEOS_PANEL).slideDown(500);
    }

    adjustChatFilePanel() {

        let chatHeight = window.screen.height;
        this._chatPanel.style.height = (chatHeight - 250) + 'px';
        this._chatPanel.style.maxHeight = (chatHeight - 250) + 'px';
        this._fileSideBar.style.height = (chatHeight - 200) + 'px';
        this._fileSideBar.style.maxHeight = (chatHeight - 200) + 'px';
    }

    showControlElements() {

        doc.TAG(dom.ALERT_SHARE).click();
        GeneralHelper.showit(dom.ROOM_STATUS, 500);
        GeneralHelper.showit(dom.DIV_MAIN_VIDEO, 500);
        GeneralHelper.showit(dom.DIV_INCOMING_VIDEO, 500);
        setTimeout(() => {
            doc.TAG(dom.ROOM_STATUS).classList.remove("obj-invisible");
            doc.TAG(dom.DIV_MAIN_VIDEO).classList.remove("obj-invisible");
            doc.TAG(dom.DIV_INCOMING_VIDEO).classList.remove("obj-invisible");
        }, 800);
    }

    hideControlElements() {

        GeneralHelper.hideit(dom.ROOM_STATUS);
        GeneralHelper.hideit(dom.DIV_MAIN_VIDEO);
        GeneralHelper.hideit(dom.DIV_INCOMING_VIDEO);

        doc.TAG(dom.ROOM_STATUS).classList.add("obj-invisible");
        doc.TAG(dom.DIV_MAIN_VIDEO).classList.add("obj-invisible");
        doc.TAG(dom.DIV_INCOMING_VIDEO).classList.add("obj-invisible");
    }

    writeChatMessage(user, message) {

        let texto = `<b class='small'>${user}</b> :<br>${message}`;
        texto = btoa(texto);
        return texto;
    }

    writeReceiveMessage(message, pContainer, isOpen) {

        isOpen ? null : this._alerta.initiateMessage(conf.message.CHAT_MESSAGE, message);
        this._chatPanel.innerHTML = `${this._chatPanel.innerHTML}${pContainer}${message}</p>`;
        this._chatTextArea.style.height = (window.innerHeight - 100) + 'px';
    }

    showSolicitation(val) {

        this._countPedirVez.innerHTML = val;
        GeneralHelper.showit(dom.COUNT_PEDIR, 300);
    }

    hideSolicitation() {

        GeneralHelper.hideit(dom.COUNT_PEDIR, 300);
    }

    listSolicitation(count, username, userid) {

        if (count === 1) this._listContent = '';
        this._listContent += `
                <li id="${ userid }" data-sender="${ username }" class="sol-response collection-item avatar li-hover">
                    <i class="material-icons blue lighten-2 circle">tv</i>
                    <h6><b>${ username }</b> solicita vez.</h6>
                    <div class="secondary-content">
                        <a id="allow_${ userid }" class="room-enter responses blue-text text-darken-2 modal-close" title="Permitir"><i class="fa fa-check-circle fa-2x"></i></a> &nbsp;&nbsp;
                        <a id="deny_${ userid }" class="room-enter responses red-text text-darken-3 modal-close" title="Negar"><i class="fa fa-times-circle fa-2x"></i></a>
                    </div>
                </li>`;
        this._solicitationList.innerHTML = this._listContent;
        this._alerta.initiateMessage(conf.message.NEW_SOLICITATION, username);
    }

    clearSolicitationLis() {

        this._listContent = '';
    }

    noSolicitation() {

        this._listContent = "<li align='center' class='red-text text-darken-3 p-40' ><b><i class='fa fa-times fa-lg'></i> Não há solicitações no momento.</b></li>";
    }

    newSolicitation(item) {

        let sender = item.getAttribute(misc.ATTR_SOLICITATION);
        this._listContent += `
            <li id="${ item.id }" data-sender="${ sender }" class="sol-response collection-item avatar li-hover">
                <i class="material-icons blue lighten-2 circle">tv</i>
                <h6><b>${ sender }</b> solicita vez.</h6>
                <span class="secondary-content">
                    <a id="allow_${ item.id }" class="room-enter responses blue-text text-darken-2 modal-close" title="Permitir"><i class="fa fa-check-circle fa-2x"></i></a> &nbsp;&nbsp;
                    <a id="deny_${ item.id }" class="room-enter responses red-text text-darken-3 modal-close" title="Negar"><i class="fa fa-times-circle fa-2x"></i></a>
                </span>
            </li>`;
    }

    constructSolicitationList() {

        this._solicitationList.innerHTML = this._listContent;
    }

    adjustBroadCaster() {

        this._prepareFileMenu(dom.LI_PERDIR, dom.DIV_RECEIVE_FILES, dom.MIN_RECEIVE, dom.PRE_VIDEO);
    }

    adjustEspectador() {

        this._prepareFileMenu(dom.CTL_PEDIR, dom.DIV_UPLOADED_FILES, dom.MIN_SEND, dom.PRE_APRESENTACAO);
    }

    _prepareFileMenu(pedir, files, filesMin, preview) {

        GeneralHelper.hideit(dom.DIV_CONNECT);
        GeneralHelper.hideit(pedir);
        GeneralHelper.hideit(files);
        GeneralHelper.hideit(filesMin);
        GeneralHelper.showit(preview, 500);
    }

    initPreVideo(preVideo, preLoader, count) {

        GeneralHelper.hideit(preVideo);
        this.prepareToInitiate(preLoader, count);
    }

    prepareToInitiate(preLoader, count) {

        GeneralHelper.showit(preLoader, 300);
        if (count) this._startCountDown();
    }

    changeTransmition(btn, title, icon) {

        btn.title = title;
        btn.innerHTML = icon;
    }

    removeElement(elem) {

        $(elem).remove();
    }

    stopTransmition(roomid) {

        try { roomid = atob(roomid) } catch (e) { /* Não faz nada */ }
        if (roomid.startsWith('screen') || roomid.startsWith('participant')) return;
        this.hideControlElements();
        this._createVideoLink(roomid);
        GeneralHelper.showit(dom.PRE_VIDEO_FINISHED, 1000);
        GeneralHelper.hideit(dom.LI_SCREEN);
        GeneralHelper.hideit(dom.LI_VOLUME);
        GeneralHelper.hideit(dom.LI_SHARE);
        GeneralHelper.hideit(dom.LI_PERDIR);
        GeneralHelper.hideit(dom.SOL_PEDIR);
        GeneralHelper.hideit(dom.CTL_PEDIR);
        try { this.removeElement(dom.FRAME_LAYER) } catch (e) { /* Não faz nada */ };
    }

    _createVideoLink(roomid) {

        setTimeout(() => {
            let videoLink = doc.TAG(dom.DOWNLOAD_VIDEO);
            videoLink.href = conf.con.SOCKET_DOWNLOAD + btoa(roomid) + '.mp4';
            videoLink.setAttribute('download', btoa(roomid));
            GeneralHelper.hideit(dom.WAITING_LINK);
            GeneralHelper.showit(dom.DIV_DOWNLOAD_VIDEO, 300);
        }, 3000);
    }

    endPreVideo() {

        GeneralHelper.hideit(dom.PRE_LOAD_VIDEO);
        GeneralHelper.hideit(dom.EMBEDDED_FRAME);
        GeneralHelper.showit(dom.DIV_CONTROLLER, 300);
    }

    _startCountDown() {

        let count = 3
        let interval = setInterval(() => {
            this._countdown.innerHTML = count;
            count--;
            if (count <= 0) clearInterval(interval);
        }, 1000);
    }

    startAnimation(webRTCadpt, roomid) {

        $(dom.BROADCASTING_INFO).fadeIn(800, () => {
            $(dom.BROADCASTING_INFO).fadeOut(800, () => {
                let state = webRTCadpt.signallingState(btoa(roomid));
                if (state != null && state != "closed") {
                    let iceState = webRTCadpt.iceConnectionState(btoa(roomid));
                    if (iceState != null && iceState != "failed" && iceState != "disconnected") {
                        this.startAnimation(webRTCadpt, roomid);
                    }
                }
            });
        });
    }

    recordAnimation(elem) {

        $(elem).fadeIn(800, () => {
            $(elem).fadeOut(800, () => {
                this.recordAnimation(elem);
            });
        });
    }

    initBroadcasterVideo(roomid, media) {

        let name = btoa(roomid);
        let frame = doc.TAG(dom.EMBEDDED_FRAME);
        GeneralHelper.hideit(dom.VIDEOS);
        GeneralHelper.hideit(dom.PRE_APRESENTACAO);
        GeneralHelper.hideit(dom.PRE_LOAD_APRESENTACAO);
        if (!conf.con.LOW_LATENCY) {
            let addr = `<iframe id="embedded_player" class="embedded-video" src="${ conf.con.SOCKET_PLAYER }?name=${ name }" frameborder="0" allowfullscreen></iframe>`;
            //let addr = `<iframe id="embedded_player" class="embedded-video" src="https://test.antmedia.io:5443/WebRTCAppEE/play.html?name=${ name }" frameborder="0" allowfullscreen></iframe>`;
            frame.innerHTML = addr;
        }
        GeneralHelper.showit(dom.DIV_MAIN_VIDEO);
        doc.TAG(dom.DIV_MAIN_VIDEO).classList.remove("obj-invisible");
        GeneralHelper.showit(dom.EMBEDDED_FRAME, 300);
        GeneralHelper.showit(dom.DIV_CONTROLLER, 300);

        if (conf.con.LOW_LATENCY) this._initNewPlayer(name, dom.REMOTE_VIDEO_ID, media, dom.PLAY_IT);

        /* Video executado no local */
        //this._initPlayer(name);

    }

    _initPlayer(name) {

        let player = new PlayerController(name);
        player.initFetch();
    }

    _initNewPlayer(name, video, media, btnPlay) {

        let newplayer = new NewerPlayerController(name, video, media);
        newplayer.startConfig();

        doc.TAG(btnPlay).onclick = () => newplayer.startPlaying(name);
        setTimeout(() => {
            //$(btnPlay).click();
        }, 2000);

    }

    initParticipantVideo(participant, name) {

        let rash = btoa(participant);
        let addr = `<iframe id="embedded_player_v3" data-active="participant" class="embedded-video" src="${ conf.con.SOCKET_PLAYER }?name=${ rash }" frameborder="0" allowfullscreen></iframe>`;
        //let addr = `<iframe id="embedded_player_v3" data-active="participant" class="embedded-video" src="https://test.antmedia.io:5443/WebRTCAppEE/play.html?name=${ btoa(rash) }" frameborder="0" allowfullscreen></iframe>`;
        let participantName = doc.TAG(dom.PARTICIPATION_NAME);
        participantName.innerHTML = name;
        this._controlEmbeddedVideo(
            addr,
            dom.EMBEDDED_FRAME_III,
            dom.INCOMMING_VIDEO_PARTICIPANT,
            dom.PARTICIPATION_CONTROL,
            dom.PARTICIPATION_SWAP,
            dom.PARTICIPATION_MUTE,
            dom.FRAME_LAYER_III
        );
    }

    initScreenVideo(screen, media) {

        let rash = btoa(screen);
        let addr = `<iframe id="embedded_player_v2" data-active="participant" class="embedded-video" src="${ conf.con.SOCKET_PLAYER }?name=${ rash }" frameborder="0" allowfullscreen></iframe>`;
        //let addr = `<iframe id="embedded_player_v2" data-active="participant" class="embedded-video" src="${ conf.con.SOCKET_PLAYER }?name=dW5kZWZpbmVk" frameborder="0" allowfullscreen></iframe>`;
        this._controlEmbeddedVideo(
            addr,
            dom.EMBEDDED_FRAME_II,
            dom.INCOMMING_VIDEO_SCREEN,
            dom.SCREEN_CONTROL,
            dom.SCREEN_SWAP,
            false,
            dom.FRAME_LAYER_II
        );
        if (conf.con.LOW_LATENCY) {
            this._initNewPlayer(rash, dom.THIRD_VIDEO_ID, media, dom.PLAY_SCREEN);
            GeneralHelper.showit(dom.VIDEO_THIRD, 300);
        }
    }

    _controlEmbeddedVideo(content, embedded, container, control, itemSwap, itemMute, layer) {

        if (!conf.con.LOW_LATENCY) {
            let frame = doc.TAG(embedded);
            frame.innerHTML = content;

            GeneralHelper.showit(container, 300);
            GeneralHelper.showit(embedded, 300);
            GeneralHelper.showit(control, 300);
        }
        GeneralHelper.showit(dom.DIV_INCOMING_VIDEO);
        doc.TAG(dom.DIV_INCOMING_VIDEO).classList.remove("obj-invisible");

        setTimeout(() => {
            let mute;
            if (itemMute) {
                mute = doc.TAG(itemMute);
                this._toggleMute(mute, layer);
            }
            let swap = doc.TAG(itemSwap);
            let mainMute = doc.TAG(dom.VOL);
            this._swapParticipant(swap, mute, mainMute, layer, itemMute);

        }, 300);
    }

    _swapParticipant(swap, mute, mainMute, layer, audioEnabled) {

        swap.onclick = () => {
            let main = doc.TAG(dom.FRAME_LAYER);
            let incomming = doc.TAG(layer);
            let swapScr = main.src;
            main.src = incomming.src;
            incomming.src = swapScr;
            let active = swap.getAttribute(misc.ATTR_ACTIVE);
            active == 'other' ?
                swap.setAttribute(misc.ATTR_ACTIVE, 'main') :
                swap.setAttribute(misc.ATTR_ACTIVE, 'other');

            if (audioEnabled) {
                setTimeout(() => {
                    let status = mute.getAttribute(misc.ATTR_ACTIVE);
                    if (status == 'unmute') this.embeddedMessage(layer, status);
                    status = mainMute.getAttribute(misc.ATTR_ACTIVE);
                    if (status == 'unmute') this.embeddedMessage(dom.FRAME_LAYER, status);
                }, 1000);
            }
        };
    }

    _toggleMute(mute, layer) {

        mute.onclick = () => {
            let active = mute.getAttribute(misc.ATTR_ACTIVE);
            let value;
            active == 'mute' ? value = 'unmute' : value = 'mute';
            mute.setAttribute(misc.ATTR_ACTIVE, value);
            this._targetVolumeToggle(mute, value);
            if (!conf.con.LOW_LATENCY) this.embeddedMessage(layer, value);
        }
    }

    _targetVolumeToggle(vol, status) {

        if (status == 'unmute') {
            vol.classList.remove(misc.OFF_COLOR);
            vol.innerHTML = misc.ICON_VOL_ON;
            this._alerta.initiateMessage(conf.message.VOL_UP);
        } else {
            vol.classList.add(misc.OFF_COLOR);
            vol.innerHTML = misc.ICON_VOL_OFF;
            this._alerta.initiateMessage(conf.message.VOL_DOWN);
        }
    }

    embeddedMessage(frameid, message) {

        if (conf.con.LOW_LATENCY) {
            let setvolume;
            message == 'unmute' ?
                setvolume = false :
                setvolume = true;
            doc.TAG(dom.REMOTE_VIDEO).muted = setvolume;
        } else {
            let framePlay = doc.TAG(frameid);
            framePlay.contentWindow.postMessage(message, '*');
        }
    }

    createProgressBar(file) {

        this._fileTransfering.innerHTML += `<b>Recebendo:</b> ${ file }<br/>
                                            <div class="progress">
                                                <div class="indeterminate"></div>
                                            </div>`;
    }

    transferCompleted() {

        this._countReceiveFiles++;
        doc.TAG(dom.COUNT_RECEIVE_FILES).innerHTML = this._countReceiveFiles;
        this._fileTransfering.innerHTML = '';
    }

    createSendedFiles(name, size) {

        let filesSended = doc.TAG(dom.DIV_SEND_FILES);
        let div = document.createElement('div');
        this._countSendFiles++;
        doc.TAG(dom.COUNT_SEND_FILES).innerHTML = this._countSendFiles;
        div.innerHTML = `<div class="p-5 rounded-borders grey darken-4 truncate" title="${name}">
                            <span class="fa fa-cloud text-darken-1"></span> <b>${name}</b><br/>
                            Tamanho: ${this._convertSize(size)}
                        </div>`;
        filesSended.insertBefore(div, filesSended.firstChild);
    }

    createDownloadLink(file, connection) {

        file.url = URL.createObjectURL(file);
        let div = document.createElement('div');
        div.innerHTML = `<div class="p-5 rounded-borders grey darken-4 truncate">
                            <a class="shared-file blue-text" href="${file.url}" download="${file.name}" title="${file.name}">
                                <span class="fa fa-download text-darken-1"></span> <b>${file.name}</b><br>
                                Tamanho: ${this._convertSize(file.size)}<br>
                            </a>
                        </div>`;
        connection.filesContainer.insertBefore(div, connection.filesContainer.firstChild);
        this._alerta.initiateMessage(conf.message.FILE_RECEIVED, file.name);
    }

    _convertSize(bytes) {

        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    };

    displayElem(elem) {

        GeneralHelper.showit(elem);
    }

    fadeInElem(elem, delay) {

        GeneralHelper.showit(elem, delay);
    }

    hideElem(elem) {

        GeneralHelper.hideit(elem);
    }

    fadeOutElem(elem, delay) {

        GeneralHelper.hideit(elem, delay);
    }

}
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
        $(dom.LI_MUTE).hide();
    }

    setVolumeOn() {

        this._vol.classList.remove(misc.OFF_COLOR);
        this._vol.innerHTML = misc.ICON_VOL_ON;
        this._alerta.initiateMessage(conf.message.VOL_UP);
    }

    setVolumeOff() {

        this._vol.classList.add(misc.OFF_COLOR);
        this._vol.innerHTML = misc.ICON_VOL_OFF;
        this._alerta.initiateMessage(conf.message.VOL_DOWN);
    }

    volumeOff() {

        this._vol.classList.add(misc.DISABLED_COLOR);
        this._vol.innerHTML = misc.ICON_VOL_OFF;
        this._vol.disabled = true;
        $(dom.LI_VOLUME).hide();
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
        $(dom.LI_CAM).hide();
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

        $(dom.SHARE).show();
        this._share.classList.add(misc.OFF_COLOR);
        this._share.innerHTML = misc.ICON_SHARE_OFF;
    }

    exitShare() {

        $(dom.SHARE).show();
        this._share.classList.remove(misc.OFF_COLOR);
        this._share.innerHTML = misc.ICON_SHARE_ON;
    }


    shareOff() {

        this._share.disabled = true;
        this._share.classList.add(misc.DISABLED_COLOR);
        this._share.innerHTML = misc.ICON_SHARE_ON;
        this._share.disabled = true;
        $(dom.LI_SHARE).hide();
    }

    startParticipation() {

        $(dom.DIV_ENTER).show();
        this._divParticipation.title = 'Finalizar participação';
        this._participation.classList.remove(misc.HILIGHT_COLOR);
        this._participation.classList.add(misc.OFF_COLOR);
        this._participation.innerHTML = misc.ICON_CAM_OFF;
    }

    endParticipation() {

        $(dom.DIV_ENTER).show();
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
        $(dom.DIV_ENTER).hide();
    }

    allowSolicitation() {

        this._alerta.initiateMessage(conf.message.SEND_ACP_SOLICITATION);
        setTimeout(() => {
            $(dom.DIV_ENTER).fadeIn(300);
            this.endParticipation();
            $(dom.SESSION_ACCESS).click();
            this._alerta.initiateMessage(conf.message.SEND_START_SOLICITATION);
        }, 2500);
    }

    denySolicitation() {

        this.participationOff();
        this._alerta.initiateMessage(conf.message.NOT_ACP_SOLICITATION);
    }

    pedirOff() {

        this._pedir.classList.add(misc.OFF_COLOR);
        this._pedir.disabled = true;
        $(dom.PEDIR).hide();
    }

    fileSharingOff() {

        this._sharedFile.classList.remove(misc.HILIGHT_COLOR);
        this._sharedFile.classList.add(misc.OFF_COLOR);
        this._sharedFile.disabled = true;
        $(dom.BTN_FILE_SHARING).hide();
    }

    fileSharingListOff() {

        this._fileListReceive.classList.remove(misc.HILIGHT_COLOR);
        this._fileListSend.classList.remove(misc.HILIGHT_COLOR);
        this._fileListReceive.classList.add(misc.OFF_COLOR);
        this._fileListSend.classList.add(misc.OFF_COLOR);
        this._fileListReceive.disabled = true;
        this._fileListSend.disabled = true;
        $(dom.FILE_LIST).hide();
    }

    noFileSharing() {

        this._alerta.initiateMessage(conf.message.NO_PARTICIPANTS);
    }

    exitFullscreen() {

        $(dom.DIV_EXIT_FSCREEN).fadeOut(500);
        this._spanMainVideo.classList.remove(misc.TURNOFF_COLOR);
        this._spanMainVideo.classList.add(misc.CLASS_WIDTH_LIMIT);
        this._spanMainVideo.style.height = misc.STYLE_HEIGHT_INHERIT;
        this.shrinkVideoSize();
    }

    enterFullscreen() {

        $(dom.DIV_EXIT_FSCREEN).fadeIn(500);
        this._spanMainVideo.classList.add(misc.TURNOFF_COLOR);
        this._spanMainVideo.classList.remove(misc.CLASS_WIDTH_LIMIT);
        this._spanMainVideo.style.height = (window.innerHeight) + 'px';
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

        $(dom.BG_DARK).fadeIn(500);
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
        $(dom.ROOM_STATUS).show(500);
        $(dom.DIV_MAIN_VIDEO).show(500);
        $(dom.DIV_INCOMING_VIDEO).show(500);
        setTimeout(() => {
            doc.TAG(dom.ROOM_STATUS).classList.remove("obj-invisible");
            doc.TAG(dom.DIV_MAIN_VIDEO).classList.remove("obj-invisible");
            doc.TAG(dom.DIV_INCOMING_VIDEO).classList.remove("obj-invisible");
        }, 800);
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
        $(dom.COUNT_PEDIR).fadeIn(300);
    }

    hideSolicitation() {

        $(dom.COUNT_PEDIR).fadeOut(300);
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

        $(dom.DIV_CONNECT).hide();
        $(pedir).hide();
        $(files).hide();
        $(filesMin).hide();
        $(preview).fadeIn(500);
    }

    initPreVideo(preVideo, preLoader, count) {

        $(preVideo).hide();
        this.prepareToInitiate(preLoader, count);
    }

    prepareToInitiate(preLoader, count) {

        $(preLoader).fadeIn(300);
        if (count) this._startCountDown();
    }

    endPreVideo() {

        $(dom.PRE_LOAD_VIDEO).hide();
        $(dom.EMBEDDED_FRAME).hide();
        $(dom.DIV_CONTROLLER).fadeIn(300);
    }

    _startCountDown() {

        let count = 4
        let interval = setInterval(() => {
            this._countdown.innerHTML = count;
            count--;
            if (count <= 0) clearInterval(interval);
        }, 1000);
    }

    broadcasterReady() {

        $(dom.BROADCASTING_READY).fadeIn(800, () => {
            $(dom.BROADCASTING_READY).fadeOut(800, () => {
                if (this._readyToPlay) this.broadcasterReady();
            });
        })
    }

    initBroadcasterVideo(roomid) {

        $(dom.VIDEOS).hide();
        $(dom.PRE_APRESENTACAO).hide();
        $(dom.PRE_LOAD_APRESENTACAO).hide();

        let addr = `<iframe id="embedded_player" class="embedded-video" src="${ conf.con.SOCKET_PLAYER }?name=${ btoa(roomid) }" frameborder="0" allowfullscreen></iframe>`;
        let frame = doc.TAG(dom.EMBEDDED_FRAME);
        frame.innerHTML = addr;

        $(dom.DIV_MAIN_VIDEO).show();
        doc.TAG(dom.DIV_MAIN_VIDEO).classList.remove("obj-invisible");
        $(dom.EMBEDDED_FRAME).fadeIn(300);

        this._readyToPlay = true;
        this.broadcasterReady();
        frame.onclick = () => this._readyToPlay = false;

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

        $(elem).show();
    }

    fadeInElem(elem, delay) {

        $(elem).fadeIn(delay);
    }

    hideElem(elem) {

        $(elem).hide();
    }

    fadeOutElem(elem, delay) {

        $(elem).fadeOut(delay);
    }

}
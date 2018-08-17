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
        this._listContent = '';
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
        $(dom.LI_CAM).hide();
    }

    openIncomingVideos(mainVideo, inVideo) {

        mainVideo.classList.remove("s12");
        mainVideo.classList.add("s6", "m8");
        inVideo.classList.add("s6", "m4");
        setTimeout(() => {
            $(dom.DIV_INCOMING_VIDEO).fadeIn(300);
        }, 500);
    }

    closeIncomingVideos(mainVideo, inVideo) {

        $(dom.DIV_INCOMING_VIDEO).fadeOut(300);
        inVideo.classList.remove("s6", "m4");
        mainVideo.classList.add("s12");
        mainVideo.classList.remove("s6", "m8");
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
        $(dom.DIV_ENTER).hide();
    }

    allowSolicitation() {

        this._alerta.initiateMessage(conf.message.SEND_ACP_SOLICITATION);
        setTimeout(() => {
            $(dom.DIV_ENTER).fadeIn(300);
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
        $(dom.PEDIR).hide();
    }

    fileSharingOff() {

        this._sharedFile.classList.remove(misc.HILIGHT_COLOR);
        this._sharedFile.classList.add(misc.OFF_COLOR);
        $(dom.BTN_FILE_SHARING).hide();
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
        this._spanMainVideo.classList.remove(misc.CLASS_WIDTH_LIMIT);
        this._spanMainVideo.classList.add('col', 's12');
    }

    shrinkVideoSize() {

        this._pageMainContainer.classList.remove(misc.CLASS_MAIN_CONTAINER_FULL);
        this._pageMainContainer.classList.add(misc.CLASS_MAIN_CONTAINER);
        this._spanMainVideo.classList.add(misc.CLASS_WIDTH_LIMIT);
        this._spanMainVideo.classList.remove('col', 's12');
    }

    adjustStreamScreen() {
        $(dom.ROOM_LOBBY).slideUp(500);
        $(dom.VIDEOS_PANEL).slideDown(500);
    }

    adjustChatPanel() {
        let chatHeight = window.screen.height;
        this._chatPanel.style.height = (chatHeight - 250) + 'px';
        this._chatPanel.style.maxHeight = (chatHeight - 250) + 'px';
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

    _adjustMediaMenu() {

        $(dom.DIV_CONNECT).hide();
        $(dom.DIV_CONTROLLER).fadeIn(300);

    }

    adjustBroadCaster() {

        this._adjustMediaMenu();
        $(dom.LI_PERDIR).hide();
        $(dom.DIV_RECEIVE_FILES).hide();
    }

    adjustEspect() {

        this._adjustMediaMenu();
        $(dom.CTL_PEDIR).hide();
        $(dom.DIV_UPLOADED_FILES).hide();
    }

    createProgressBar(file) {

        this._fileTransfering.innerHTML += `<b>Recebendo:</b> ${ file }<br/>
                                            <div class="progress">
                                                <div class="indeterminate"></div>
                                            </div>`;
    }

    transferCompleted() {

        this._fileTransfering.innerHTML = '';
    }

    createSendedFiles(name, size) {

        let filesSended = doc.TAG(dom.DIV_SEND_FILES);
        let div = document.createElement('div');
        div.innerHTML = `<span class="fa fa-cloud text-darken-1"></span> <b>${name}</b> (${this._convertSize(size)})<br/>`;
        filesSended.insertBefore(div, filesSended.firstChild);
    }

    createDownloadLink(file, connection) {

        file.url = URL.createObjectURL(file);
        let div = document.createElement('div');
        div.innerHTML = `<a class="shared-file blue-text" href="${file.url}" download="${file.name}"><span class="fa fa-download text-darken-1"></span> <b>${file.name}</b> (${this._convertSize(file.size)})</a><br/>`;
        connection.filesContainer.insertBefore(div, connection.filesContainer.firstChild);
    }

    _convertSize(bytes) {
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    };

}
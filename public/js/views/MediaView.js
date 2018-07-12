/**
 * Cotrola elementos visuais e alterações de view quando aplicados aos elementos de mídia
 */
class MediaView {

    constructor() {

        let tag = document.querySelector.bind(document);
        let alerta = new MessageController();

        this._mute = tag(conf.dom.MUTE);
        this._cam = tag(conf.dom.CAM);
        this._vol = tag(conf.dom.VOL);
        this._share = tag(conf.dom.SHARE);
        this._pedir = tag(conf.dom.PEDIR);
        this._participation = tag(conf.dom.SESSION_ACCESS);
        this._divParticipation = tag(conf.dom.DIV_ENTER);
        this._divMainVideo = tag(conf.dom.DIV_MAIN_VIDEO);
        this._divIncomingVideo = tag(conf.dom.DIV_INCOMING_VIDEO);
        this._spanMainVideo = tag(conf.dom.VIDEO_MAIN);
        this._mainVideo = tag(conf.dom.FIRST_VIDEO);
        this._pageMainContainer = tag(conf.dom.PAGE_MAIN_CONTENT);
        this._chatPanel = tag(conf.dom.CHAT_PANEL);
        this._sideNavbar = tag(conf.dom.SIDE_NAVBAR);
        this._chatTextArea = tag(conf.dom.CHAT_TEXTAREA);
        this._countPedirVez = tag(conf.dom.COUNT_PEDIR);
    }

    setVoiceOn() {

        this._mute.classList.remove(conf.misc.OFF_COLOR);
        this._mute.innerHTML = conf.misc.ICON_MIC;
        alerta.initiateMessage(conf.message.MIC_ON);
    }

    setVoiceOff() {

        this._mute.classList.add(conf.misc.OFF_COLOR);
        this._mute.innerHTML = conf.misc.ICON_MUTE_MIC;
        alerta.initiateMessage(conf.message.MIC_OFF);
    }

    voiceOff() {

        this._mute.classList.add(conf.misc.DISABLED_COLOR);
        this._mute.innerHTML = conf.misc.ICON_MUTE_MIC;
        $(conf.dom.LI_MUTE).hide();
    }

    setVolumeOn() {

        this._vol.classList.remove(conf.misc.OFF_COLOR);
        this._vol.innerHTML = conf.misc.ICON_VOL_ON;
        alerta.initiateMessage(conf.message.VOL_UP);
    }

    setVolumeOff() {

        this._vol.classList.add(conf.misc.OFF_COLOR);
        this._vol.innerHTML = conf.misc.ICON_VOL_OFF;
        alerta.initiateMessage(conf.message.VOL_DOWN);
    }

    volumeOff() {

        this._vol.classList.add(conf.misc.DISABLED_COLOR);
        this._vol.innerHTML = conf.misc.ICON_VOL_OFF;
        $(conf.dom.LI_VOLUME).hide();
    }

    setCamOn() {

        this._cam.classList.remove(conf.misc.OFF_COLOR);
        this._cam.innerHTML = conf.misc.ICON_CAM_ON;
        alerta.initiateMessage(conf.message.CAM_ON);
    }

    setCamOff() {

        this._cam.classList.add(conf.misc.OFF_COLOR);
        this._cam.innerHTML = conf.misc.ICON_CAM_OFF;
        alerta.initiateMessage(conf.message.CAM_OFF);
    }

    camOff() {

        this._cam.classList.add(conf.misc.DISABLED_COLOR);
        this._cam.innerHTML = conf.misc.ICON_CAM_OFF;
        $(conf.dom.LI_CAM).hide();
    }

    openIncomingVideos(mainVideo, inVideo) {

        mainVideo.classList.remove("s12");
        mainVideo.classList.add("s6", "m8");
        inVideo.classList.add("s6", "m4");
        setTimeout(() => {
            $(conf.dom.DIV_INCOMING_VIDEO).fadeIn(300);
        }, 500);
    }

    closeIncomingVideos(mainVideo, inVideo) {

        $(conf.dom.DIV_INCOMING_VIDEO).fadeOut(300);
        inVideo.classList.remove("s6", "m4");
        mainVideo.classList.add("s12");
        mainVideo.classList.remove("s6", "m8");
    }

    startShare() {

        $(conf.dom.SHARE).show();
        this._share.classList.add(conf.misc.OFF_COLOR);
        this._share.innerHTML = conf.misc.ICON_SHARE_OFF;
        alerta.initiateMessage(conf.message.START_SHARE);
    }

    exitShare() {

        $(conf.dom.SHARE).show();
        this._share.classList.remove(conf.misc.OFF_COLOR);
        this._share.innerHTML = conf.misc.ICON_SHARE_ON;
        alerta.initiateMessage(conf.message.STOP_SHARE);
    }


    shareOff() {

        this._share.disabled = true;
        this._share.classList.add(conf.misc.DISABLED_COLOR);
        this._share.innerHTML = conf.misc.ICON_SHARE_ON;
        $(conf.dom.LI_SHARE).hide();
    }

    startParticipation() {

        $(conf.dom.DIV_ENTER).show();
        this._divParticipation.title = 'Finalizar participação';
        this._participation.classList.remove(conf.misc.HILIGHT_COLOR);
        this._participation.classList.add(conf.misc.OFF_COLOR);
        this._participation.innerHTML = conf.misc.ICON_CAM_OFF;
    }

    endParticipation() {

        $(conf.dom.DIV_ENTER).show();
        this._divParticipation.title = 'Ingressar';
        this._participation.classList.remove(conf.misc.OFF_COLOR);
        this._participation.classList.add(conf.misc.HILIGHT_COLOR);
        this._participation.innerHTML = conf.misc.ICON_CAM_ON;
    }

    participationOff() {

        this._participation.classList.remove(conf.misc.HILIGHT_COLOR);
        this._participation.classList.add(conf.misc.OFF_COLOR);
        this._participation.innerHTML = conf.misc.ICON_CAM_OFF;
        $(conf.dom.DIV_ENTER).hide();
    }

    allowSolicitation() {

        alerta.initiateMessage(conf.message.SEND_ACP_SOLICITATION);
        $(conf.dom.DIV_ENTER).fadeIn(300);
        this.endParticipation();
    }

    denySolicitation() {

        this.participationOff();
        alerta.initiateMessage(conf.message.NOT_ACP_SOLICITATION);
    }

    pedirOff() {

        this._pedir.classList.add(conf.misc.OFF_COLOR);
        $(conf.dom.PEDIR).hide();
    }

    exitFullscreen() {

        $(conf.dom.DIV_EXIT_FSCREEN).fadeOut(500);
        this._spanMainVideo.classList.remove(conf.misc.TURNOFF_COLOR);
        this._spanMainVideo.classList.add(conf.misc.CLASS_WIDTH_LIMIT);
        this._spanMainVideo.style.height = conf.misc.STYLE_HEIGHT_INHERIT;
        this.shrinkVideoSize();
    }

    enterFullscreen() {

        $(conf.dom.DIV_EXIT_FSCREEN).fadeIn(500);
        this._spanMainVideo.classList.add(conf.misc.TURNOFF_COLOR);
        this._spanMainVideo.classList.remove(conf.misc.CLASS_WIDTH_LIMIT);
        this._spanMainVideo.style.height = (window.innerHeight) + 'px';
    }

    enlargeVideoSize() {

        this._pageMainContainer.classList.remove(conf.misc.CLASS_MAIN_CONTAINER);
        this._pageMainContainer.classList.add(conf.misc.CLASS_MAIN_CONTAINER_FULL);
        this._spanMainVideo.classList.remove(conf.misc.CLASS_WIDTH_LIMIT);
        this._spanMainVideo.classList.add('col', 's12');
    }

    shrinkVideoSize() {

        this._pageMainContainer.classList.remove(conf.misc.CLASS_MAIN_CONTAINER_FULL);
        this._pageMainContainer.classList.add(conf.misc.CLASS_MAIN_CONTAINER);
        this._spanMainVideo.classList.add(conf.misc.CLASS_WIDTH_LIMIT);
        this._spanMainVideo.classList.remove('col', 's12');
    }

    adjustStreamScreen() {
        $(conf.dom.ROOM_LOBBY).slideUp(500);
        $(conf.dom.VIDEOS_PANEL).slideDown(500);
    }

    writeReceiveMessage(message, pContainer, isOpen) {

        isOpen ? null : alerta.initiateMessage(conf.message.CHAT_MESSAGE, message);
        this._chatPanel.innerHTML = `${this._chatPanel.innerHTML}${pContainer}${message}</p>`;
        this._chatTextArea.style.height = (window.innerHeight - 100) + 'px';
    }

    showSolicitation(val) {

        this._countPedirVez.innerHTML = val;
        $(conf.dom.COUNT_PEDIR).fadeIn(300);
    }

    hideSolicitation() {

        $(conf.dom.COUNT_PEDIR).fadeOut(300);
    }

}
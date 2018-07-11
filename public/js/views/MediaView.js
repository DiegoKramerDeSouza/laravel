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

        this._divMainVideo = tag(conf.dom.DIV_MAIN_VIDEO);
        this._divIncomingVideo = tag(conf.dom.DIV_INCOMING_VIDEO);
        this._otherVideos = {
            screen: '',
            user: ''
        };

        this._isMute = false;
        this._isVolOff = false;
        this._camIsOn = true;
    }

    setMute() {

        if (!this._isMute) {
            this._isMute = true;
            this._mute.classList.add(conf.misc.OFF_COLOR);
            this._mute.innerHTML = conf.misc.ICON_MUTE_MIC;
            alerta.initiateMessage(conf.message.MIC_OFF);
        } else {
            this._isMute = false;
            this._mute.classList.remove(conf.misc.OFF_COLOR);
            this._mute.innerHTML = conf.misc.ICON_MIC;
            alerta.initiateMessage(conf.message.MIC_ON);
        }
    }

    muteOff() {

        this._isMute = true;
        this._mute.classList.add(conf.misc.DISABLED_COLOR);
        this._mute.innerHTML = conf.misc.ICON_MUTE_MIC;
        $(conf.dom.LI_MUTE).hide();
    }

    setVolume() {

        if (!this._isVolOff) {
            this._isVolOff = true;
            this._vol.classList.add(conf.misc.OFF_COLOR);
            this._vol.innerHTML = conf.misc.ICON_VOL_OFF;
            alerta.initiateMessage(conf.message.VOL_DOWN);
        } else {
            this._isVolOff = false;
            this._vol.classList.remove(conf.misc.OFF_COLOR);
            this._vol.innerHTML = conf.misc.ICON_VOL_ON;
            alerta.initiateMessage(conf.message.VOL_UP);
        }
    }

    volumeOff() {

        this._isVolOff = true;
        this._vol.classList.add(conf.misc.DISABLED_COLOR);
        this._vol.innerHTML = conf.misc.ICON_VOL_OFF;
        $(conf.dom.LI_VOLUME).hide();
    }

    setCam() {

        if (this._camIsOn) {
            this._camIsOn = false;
            this._cam.classList.add(conf.misc.OFF_COLOR);
            this._cam.innerHTML = conf.misc.ICON_CAM_OFF;
            alerta.initiateMessage(conf.message.CAM_OFF);
        } else {
            this._camIsOn = true;
            this._cam.classList.remove(conf.misc.OFF_COLOR);
            this._cam.innerHTML = conf.misc.ICON_CAM_ON;
            alerta.initiateMessage(conf.message.CAM_ON);
        }
    }

    camOff() {

        this._camIsOn = false;
        this._cam.classList.add(conf.misc.DISABLED_COLOR);
        this._cam.innerHTML = conf.misc.ICON_CAM_OFF;
        $(conf.dom.LI_CAM).hide();
    }

    incomingVideos(mainVideo, inVideo, status) {

        if (status) {
            mainVideo.classList.remove("s12");
            mainVideo.classList.add("s6", "m8");
            inVideo.classList.add("s6", "m4");
            setTimeout(() => {
                $(conf.dom.DIV_INCOMING_VIDEO).fadeIn(300);
            }, 500);
        } else {
            $(conf.dom.DIV_INCOMING_VIDEO).fadeOut(300);
            inVideo.classList.remove("s6", "m4");
            mainVideo.classList.add("s12");
            mainVideo.classList.remove("s6", "m8");
        }
    }
}
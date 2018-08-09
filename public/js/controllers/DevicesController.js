class DevicesController {

    constructor() {

        this._origin = location.origin;
        this._devices = [];
        this._alerta = new MessageController();
    }

    initiateDevices() {

        DetectRTC.load(() => {

            DetectRTC.audioInputDevices.forEach(device => this._devices.push(this._collectDevice(device)));
            DetectRTC.videoInputDevices.forEach(device => this._devices.push(this._collectDevice(device)));
            setTimeout(() => {
                this._collectCookiesDevices();
            }, 500);
        });
    }

    setDevices() {

        let roomController = new RoomController();
        if (!roomController.checkDevices()) {
            this._alerta.initiateMessage(conf.message.DEVICE_ALERT);
            return;
        } else {
            let audio = doc.TAG(dom.LIST_AUDIO);
            let video = doc.TAG(dom.LIST_VIDEO);
            this.setCookies(doc.COOKIE_AUDIO_DEVICE, audio.value, doc.COOKIE_LIFETIME);
            this.setCookies(doc.COOKIE_VIDEO_DEVICE, video.value, doc.COOKIE_LIFETIME);
            this._alerta.initiateMessage(conf.message.DEVICE_CONFIGURED);
        }
    }

    _collectDevice(device) {

        let input = {
            id: device.id,
            label: device.label,
            group: device.groupId,
            kind: device.kind
        }
        return input;
    }

    setCookies(cookiename, cookievalue, days) {

        let date = new Date();
        let expires;
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `expires=${date.toUTCString()}`;
        document.cookie = `${cookiename}=${cookievalue};${expires};`;
    }

    _getCookies(cookiename) {

        let name = cookiename + "=";
        let result = "";
        let decodedCookie = decodeURIComponent(document.cookie);
        let dc = decodedCookie.split(';');
        dc.forEach((cookie) => {
            while (cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) == 0) {
                result = cookie.substring(name.length, cookie.length);
            }
        });
        return result;
    }

    _collectCookiesDevices() {

        let deviceView = new DevicesView();
        let audDev = this._getCookies(doc.COOKIE_AUDIO_DEVICE);
        let vidDev = this._getCookies(doc.COOKIE_VIDEO_DEVICE);

        this._updateSelectorAud(audDev, deviceView);
        this._updateSelectorVid(vidDev, deviceView);
        setTimeout(() => {
            deviceView.startMaterializeSelect();
        }, 300);
    }

    _updateSelectorAud(data, view) {

        this._devices.forEach(device => {
            if (device.kind === 'audioinput') {
                device.id == data ?
                    view.selectedAudio(device.id, device.label, true) :
                    view.selectedAudio(device.id, device.label);
            }
        });
        view.createAudioSelector();
    }

    _updateSelectorVid(data, view) {

        this._devices.forEach(device => {
            if (device.kind === 'videoinput') {
                device.id == data ?
                    view.selectedVideo(device.id, device.label, true) :
                    view.selectedVideo(device.id, device.label);
            }
        });
        view.createVideoSelector();
    }
}
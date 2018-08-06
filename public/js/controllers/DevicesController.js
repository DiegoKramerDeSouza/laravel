class DevicesController {

    constructor() {

        this._origin = location.origin;
        this._devices = [];
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
        let audDev = this._getCookies("audioDevice");
        let vidDev = this._getCookies("videoDevice");

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
                    view.selectedAudio(device.id, device.label, device.group, true) :
                    view.selectedAudio(device.id, device.label, device.group);
            }
        });
        view.createAudioSelector();
    }

    _updateSelectorVid(data, view) {

        this._devices.forEach(device => {
            if (device.kind === 'videoinput') {
                device.id == data ?
                    view.selectedVideo(device.id, device.label, device.group, true) :
                    view.selectedVideo(device.id, device.label, device.group);
            }
        });
        view.createVideoSelector();
    }
}
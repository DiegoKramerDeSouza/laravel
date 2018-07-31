class DevicesController {

    constructor() {

        this._origin = location.origin;
        this._devices = [];
    }

    initiateDevices() {

        this._setDevicesData();
        this._collectDBDevices();
    }

    _setDevicesData() {

        DetectRTC.load(() => {
            DetectRTC.audioInputDevices.forEach(device => this._devices.push(this._collectDevice(device)));
            DetectRTC.videoInputDevices.forEach(device => this._devices.push(this._collectDevice(device)));

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

    _collectDBDevices() {

        $.ajax({
            url: `${ this._origin }/salas/dispositivos`,
            type: 'get',
            dataType: 'json',
            success: data => {
                this._updateSelector(data);
            }
        });
    }

    _updateSelector(data) {

        let deviceView = new DevicesView();
        this._devices.forEach((device) => {
            if (device.kind === 'audioinput') {
                device.label == data.audio_label && device.id == data.audio_id ?
                    deviceView.selectedAudio(device.id, device.label, device.group, true) :
                    deviceView.selectedAudio(device.id, device.label, device.group);
            } else {
                device.label == data.video_label && device.id == data.video_id ?
                    deviceView.selectedVideo(device.id, device.label, device.group, true) :
                    deviceView.selectedVideo(device.id, device.label, device.group);
            }
        });

        deviceView.createSelector();
    }
}
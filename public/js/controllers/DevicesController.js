class DevicesController {

    constructor() {

        this._origin = location.origin;
        this._devices = [];

        this._setDevicesData();
        this._collectDBDevices();
    }

    initiateDevices() {

        return this._devices;
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

        let view = new DevicesView(this._devices);
        this._devices.forEach((device) => {
            if (device.kind == 'audioinput') {
                device.label == data.label && device.id == data.id ?
                    view.selectedAudio(device.id, device.label, device.group) :
                    view.unselectedAudio(device.id, device.label, device.group);
            } else {
                device.label == data.label && device.id == data.id ?
                    view.selectedVideo(device.id, device.label, device.group) :
                    view.unselectedVideo(device.id, device.label, device.group);
            }
        });
    }
}
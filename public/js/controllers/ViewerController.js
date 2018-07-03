class ViewerController {

    constructor() {

        let tag = document.querySelector.bind(document);
        this._myClass = tag(conf.dom.viewer.TARGET);
        this._countRooms = conf.viewer.COUNT_ROOMS;
        this._allowed = conf.viewer.ALLOWED;
    }

    _setClasses() {

        return this._myClass.value.split(';');
    }

    initiateViewer(roomid) {

        let arrRoomId = roomid.split('|');
        arrRoomId.push(this._countRooms, this._allowed, this._setClasses());
        return new Viewer(...arrRoomId);
    }
}
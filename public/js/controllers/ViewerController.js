class ViewerController {

    constructor() {

        let tag = document.querySelector.bind(document);
        this._myClass = tag('#target').value;
        this._countRooms = 0;
        this._allowed = false;
    }

    _setClasses() {

        return this._myClass.split(';');
    }

    setViewer(roomid) {

        let arrRoomId = roomid.split('|');
        arrRoomId.push(this._countRooms, this._allowed, this._setClasses());
        return new Viewer(...arrRoomId);
    }
}
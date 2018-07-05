class RoomDataController {

    constructor() {

        let tag = document.querySelector.bind(document);
        this._myClass = tag(conf.dom.room.TARGET);
        this._countRooms = conf.roomdata.COUNT_ROOMS;
        this._allowed = conf.roomdata.ALLOWED;
    }

    _setClasses() {

        return this._myClass.value.split(';');
    }

    initiateRoomData(roomid) {

        let arrRoomId = roomid.split('|');
        arrRoomId.push(this._countRooms, this._allowed, this._setClasses());
        return new RoomData(...arrRoomId);
    }
}
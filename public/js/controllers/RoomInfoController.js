class RoomInfoController {

    constructor() {

        let tag = document.querySelector.bind(document);
        this._currentRoomId = tag(conf.dom.room.ROOM);
        this._broadcaster = tag(conf.dom.room.BROADCASTER);
        this._inRoom = tag(conf.dom.room.IN_ROOM);
        this._inScreen = tag(conf.dom.room.IN_SCREEN);
        this._currentUser = tag(conf.dom.room.NAME);
        this._myClass = tag(conf.dom.room.TARGET);
        Object.freeze(this);
    }

    initiateRoomInfo() {

        return new RoomInfo(this._currentRoomId, this._broadcaster, this._inRoom, this._inScreen, this._currentUser, this._myClass);
    }

}
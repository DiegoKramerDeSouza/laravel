class RoomInfoController {

    constructor() {

        let tag = document.querySelector.bind(document);
        this._currentRoomId = tag(conf.dom.ROOM);
        this._broadcaster = tag(conf.dom.BROADCASTER);
        this._inRoom = tag(conf.dom.IN_ROOM);
        this._inScreen = tag(conf.dom.IN_SCREEN);
        this._currentUser = tag(conf.dom.NAME);
        this._myClass = tag(conf.dom.TARGET);
        this._countUsers = tag(conf.dom.LABEL_USERS);
        Object.freeze(this);
    }

    initiateRoomInfo() {

        return new RoomInfo(this._currentRoomId, this._broadcaster, this._inRoom, this._inScreen, this._currentUser, this._myClass, this._countUsers);
    }

}
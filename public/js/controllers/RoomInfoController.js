class RoomInfoController {

    constructor() {

        this._currentRoomId = doc.TAG(dom.ROOM);
        this._broadcaster = doc.TAG(dom.BROADCASTER);
        this._inRoom = doc.TAG(dom.IN_ROOM);
        this._inScreen = doc.TAG(dom.IN_SCREEN);
        this._currentUser = doc.TAG(dom.NAME);
        this._myClass = doc.TAG(dom.TARGET);
        this._countUsers = doc.TAG(dom.LABEL_USERS);
        Object.freeze(this);
    }

    initiateRoomInfo() {

        return new RoomInfo(this._currentRoomId, this._broadcaster, this._inRoom, this._inScreen, this._currentUser, this._myClass, this._countUsers);
    }

}
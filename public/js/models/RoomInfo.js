/**
 * Módulo de informatívo de sala
 *  -> Apresenta o rótulo da sala, informando os dados básicos da sala criada/acessada
 */
class RoomInfo {

    constructor(currentRoomId, broadcaster, inRoom, inScreen, countUsers) {

        this._currentRoomId = currentRoomId;
        this._broadcaster = broadcaster;
        this._inRoom = inRoom;
        this._inScreen = inScreen;
        //this._currentUser = currentUser;
        this._countUsers = countUsers;
        Object.freeze(this);
    }

    get currentRoomId() {

        return this._currentRoomId;
    }

    get broadcaster() {

        return this._broadcaster;
    }

    get inRoom() {

        return this._inRoom;
    }

    get inScreen() {

        return this._inScreen;
    }

    /*
    get currentUser() {

        return this._currentUser;
    }
    */

    get countUsers() {

        return this._countUsers;
    }

}
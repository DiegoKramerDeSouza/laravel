/**
 * Classe voltada à definição de informações apresentadas ao espectadores
 * 
 * Instancia:
 * RoomInfo
 * RoomView
 */
class RoomInfoController {

    constructor() {

        this._currentRoomId = doc.TAG(dom.ROOM);
        this._broadcaster = doc.TAG(dom.BROADCASTER);
        this._inRoom = doc.TAG(dom.IN_ROOM);
        this._inScreen = doc.TAG(dom.IN_SCREEN);
        this._currentUser = doc.TAG(dom.NAME);
        this._myClass = doc.TAG(dom.TARGET);
        this._countUsers = doc.TAG(dom.LABEL_USERS);

        this._view = new RoomView();
        this._hours = 0;
        this._minutes = 0;
        this._seconds = 0;
        this._formH = '00';
        this._formM = '00';
        this._formS = '00';
        this._currentTime;
        this.stoped = true;
    }

    initiateRoomInfo() {

        return new RoomInfo(
            this._currentRoomId,
            this._broadcaster,
            this._inRoom,
            this._inScreen,
            this._currentUser,
            this._myClass,
            this._countUsers
        );
    }

    initiateClock(time) {

        setTimeout(() => {
            if (!this.stoped) this._setCurrentTime(time);
            this.initiateClock(time);
        }, 1000);
    }

    _setCurrentTime(time) {

        let timeNow = new Date();
        let diference = Math.abs(timeNow - time) / 1000;
        this._hours = Math.floor(diference / 3600) % 24;
        this._minutes = Math.floor(diference / 60) % 60;
        this._seconds = Math.floor(diference % 60);
        this._currentTime = this._formatCount();
        this._view.setCurrentTime(...this._currentTime);
    }

    _formatCount() {

        this._formS = (this._seconds < 10 ? '0' : '') + this._seconds;
        this._formM = (this._minutes < 10 ? '0' : '') + this._minutes;
        this._formH = (this._hours < 10 ? '0' : '') + this._hours;
        return [this._formH, this._formM, this._formS];
    }

}
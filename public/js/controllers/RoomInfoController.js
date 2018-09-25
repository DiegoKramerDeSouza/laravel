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

    initiateClock() {

        setTimeout(() => {
            this._seconds++;
            if (this._seconds >= 60) {
                this._seconds = 0;
                this._minutes++;
                if (this._minutes >= 60) {
                    this._minutes = 0;
                    this._hours++;
                    if (this._hours > 99) return;
                    this._formH = this._formatTime(this._hours);
                }
                this._formM = this._formatTime(this._minutes);
            }
            this._formS = this._formatTime(this._seconds);
            this._view.setCurrentTime(this._formH, this._formM, this._formS);
            this.initiateClock();
        }, 1000);
    }

    _formatTime(value) {

        if (value.toString().length <= 1) return '0' + value;
        return '' + value;
    }

}
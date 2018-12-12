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

    setInitialTime(day, hour, min, sec) {

        let timeNow = new Date();
        let thisDay = timeNow.getDay();
        let thisHour = timeNow.getHours();
        let thisMin = timeNow.getMinutes();
        let thisSec = timeNow.getSeconds();

        console.log('Criada: ' + hour + ':' + min + ':' + sec, 'Acessada: ' + thisHour + ':' + thisMin + ':' + thisSec);
        sec > thisSec ? this._seconds = (60 - sec) + thisSec : this._seconds = thisSec - sec;
        min > thisMin ? this._minutes = (60 - min) + thisMin : this._minutes = thisMin - min;
        if (hour > thisHour) {
            this._hours = (24 - hour) + thisHour;
        } else {
            this._hours = thisHour - hour;
        }
        if (day != thisDay) hour <= thisHour ? this._hours += 24 : null;
        this.initiateClock();
    }

    initiateClock() {

        setTimeout(() => {
            if (!this.stoped) {
                this._currentTime = this._startToCount();
                this._view.setCurrentTime(...this._currentTime);
            }
            this.initiateClock();
        }, 1000);
    }

    _startToCount() {

        this._seconds++;
        if (this._seconds >= 60) {
            this._seconds = 0;
            this._minutes++;
            if (this._minutes >= 60) {
                this._minutes = 0;
                this._hours++;
            }
        }
        this._formS = this._formatTime(this._seconds);
        this._formM = this._formatTime(this._minutes);
        this._formH = this._formatTime(this._hours);
        if (this._hours > 24) this._formH = '+24';
        return [this._formH, this._formM, this._formS];
    }

    _formatTime(value) {

        return (value < 10 ? '0' : '') + value;
    }

}
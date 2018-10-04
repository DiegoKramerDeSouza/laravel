class RoomDataController {

    constructor() {

        this._myClass = doc.TAG(dom.TARGET);
        this._countRooms = conf.datacls.COUNT_ROOMS;
        this._allowed = conf.datacls.ALLOWED;
    }

    _setClasses() {

        if (this._myClass.value === '') return conf.datacls.ADMIN_ACCESS
        else return this._myClass.value.split(';');
    }

    initiateRoomData(roomid) {

        let arrRoomId = roomid.split('|');
        arrRoomId.push(this._countRooms, this._allowed, this._setClasses(), conf.datacls.TRANSMITING);
        return new RoomData(...arrRoomId);
    }

    validateRoomName(labelRoom, roomsArray) {

        try {
            labelRoom = atob(labelRoom);
            if (!(labelRoom.split('|').length === 6)) return false;
        } catch (exp) {
            let roomView = new RoomView();
            if (roomsArray.length < 2) roomView.noRooms();
            return false;
        }
        return labelRoom;
    }

    validateAccess(curso, classes) {

        let valid = false;
        if (classes === conf.datacls.ADMIN_ACCESS) valid = true;
        else if (curso) {
            classes.forEach((cls) => {
                if (curso.indexOf(cls) > -1) valid = true;
            });

        }
        return valid;
    }
}
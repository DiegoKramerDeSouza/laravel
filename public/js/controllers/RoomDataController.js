class RoomDataController {

    constructor() {

        let tag = document.querySelector.bind(document);
        this._myClass = tag(conf.dom.TARGET);
        this._countRooms = conf.roomdata.COUNT_ROOMS;
        this._allowed = conf.roomdata.ALLOWED;
    }

    _setClasses() {

        if (this._myClass.value === '') return conf.roomdata.ADMIN_ACCESS
        else return this._myClass.value.split(';');
    }

    initiateRoomData(roomid) {

        let arrRoomId = roomid.split('|');
        arrRoomId.push(this._countRooms, this._allowed, this._setClasses());
        return new RoomData(...arrRoomId);
    }

    validateRoomName(labelRoom, roomsArray) {

        try {
            labelRoom = atob(labelRoom);
            if (!(labelRoom.split('|').length === 5)) return false;
        } catch (exp) {
            if (roomsArray.length < 2) roomView.noRooms();
            return false;
        }
        return labelRoom;
    }

    validateAccess(curso, classes) {

        let valid = false;
        if (classes === conf.roomdata.ADMIN_ACCESS) valid = true;
        else if (curso) {
            classes.forEach((cls) => {
                if (curso.indexOf(cls) > -1) valid = true;
            });

        }
        return valid;
    }
}
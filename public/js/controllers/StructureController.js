class StructureController {

    constructor() {

        this._viewer = conf.str.VIEWER;
        this._user = conf.str.USER;
        this._solicita = conf.str.SOLICITA;
        this._broadcastStatus = conf.str.BROADCAST_STATUS;
        this._isModerator = conf.str.BROADCAST_STATUS;
        this._onlobby = conf.str.ON_LOBBY;
        this._onParticipation = conf.str.ON_PARTICIPATION;
        this._lockSolicitation = conf.str.LOCK_SOLICITATION;
        this._mainVideo = conf.str.WAITING_FOR_VIDEO;
        this._userVideo = conf.str.WAITING_FOR_VIDEO;
        this._startRoom = doc.TAG(dom.BTN_START_ROOM);
        this._configDev = doc.TAG(dom.BTN_CONF_DEVICES);
        this._publicRoomsList = doc.TAG(dom.PUBLIC_CONFERENCE);
        this._connectList = doc.TAG(dom.USERS_LIST);
        this._roomType = doc.TAG(dom.ROOM_TYPE);
        this._countRooms = conf.str.NUMBER_OF_ROOMS;
        this._singlecon = conf.str.SINGLE_CON;
    }

    initiateStructure() {

        return new Structure(
            this._viewer,
            this._user,
            this._solicita,
            this._broadcastStatus,
            this._isModerator,
            this._onlobby,
            this._onParticipation,
            this._lockSolicitation,
            this._mainVideo,
            this._userVideo,
            this._startRoom,
            this._configDev,
            this._publicRoomsList,
            this._connectList,
            this._roomType,
            this._countRooms,
            this._singlecon
        );
    }
}
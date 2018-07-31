class StructureController {

    constructor() {

        this._viewer = conf.structure.VIEWER;
        this._user = conf.structure.USER;
        this._solicita = conf.structure.SOLICITA;
        this._broadcastStatus = conf.structure.BROADCAST_STATUS;
        this._isModerator = conf.structure.BROADCAST_STATUS;
        this._onlobby = conf.structure.ON_LOBBY;
        this._onParticipation = conf.structure.ON_PARTICIPATION;
        this._lockSolicitation = conf.structure.LOCK_SOLICITATION;
        this._mainVideo = conf.structure.WAITING_FOR_VIDEO;
        this._userVideo = conf.structure.WAITING_FOR_VIDEO;
        this._startRoom = doc.TAG(dom.BTN_START_ROOM);
        this._configDev = doc.TAG(dom.BTN_CONF_DEVICES);
        this._publicRoomsList = doc.TAG(dom.PUBLIC_CONFERENCE);
        this._connectList = doc.TAG(dom.USERS_LIST);
        this._countRooms = conf.structure.NUMBER_OF_ROOMS;
        this._singlecon = conf.structure.SINGLE_CON;
    }

    initiateStructure() {

        let arrDocument = [
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
            this._countRooms,
            this._singlecon
        ];
        return new Structure(...arrDocument);
    }
}
class StructureController {

    constructor() {

        let tag = document.querySelector.bind(document);
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
        this._startRoom = tag(conf.dom.BTN_START_ROOM);
        this._publicRoomsList = tag(conf.dom.PUBLIC_CONFERENCE);
        this._connectList = tag(conf.dom.USERS_LIST);
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
            this._publicRoomsList,
            this._connectList
        ];
        return new Structure(...arrDocument);
    }
}
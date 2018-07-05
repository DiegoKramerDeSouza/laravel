class StructureController {

    constructor() {

        this._tag = document.querySelector.bind(document);
        this._allTags = document.querySelectorAll.bind(document);
        this._addTag = document.createElement.bind(document);

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
            this._userVideo
        ];
        return new Structure(...arrDocument);
    }

    tag(obj) {

        return this._tag(obj);
    }

    allTags(obj) {

        return this._allTags(obj);
    }

    addTag(obj) {

        return this._addTag(obj);
    }
}
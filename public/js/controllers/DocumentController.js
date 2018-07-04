class DocumentController {

    constructor() {

        this.tag = document.querySelector.bind(document);
        this.allTags = document.querySelectorAll.bind(document);
        this.createTag = document.createElement.bind(document);
        this._viewer = conf.document.VIEWER;
        this._user = conf.document.USER;
        this._solicita = conf.document.SOLICITA;
        this._broadcastStatus = conf.document.BROADCAST_STATUS;
        this._isModerator = conf.document.BROADCAST_STATUS;
        this._onlobby = conf.document.ON_LOBBY;
        this._onParticipation = conf.document.ON_PARTICIPATION;
        this._lockSolicitation = conf.document.LOCK_SOLICITATION;
        this._mainVideo = conf.document.WAITING_FOR_VIDEO;
        this._userVideo = conf.document.WAITING_FOR_VIDEO;
    }

    initiateDocument() {

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
        return new Document(...arrDocument);
    }

    getTag(obj) {

        return this.tag(obj);
    }

    getAllTags(obj) {

        return this.allTags(obj);
    }

    createTag(obj) {

        return this.createTag(obj);
    }
}
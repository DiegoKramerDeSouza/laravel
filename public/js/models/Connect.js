class Connect {

    constructor(urlSocket, enableScalableBroadcast, maxRelayLimitPerUser, socketMessageEvent, isPublicModerator) {

        this._urlSocket = urlSocket;
        this._enableScalableBroadcast = enableScalableBroadcast;
        this._maxRelayLimitPerUser = maxRelayLimitPerUser;
        this._socketMessageEvent = socketMessageEvent;
        this._isPublicModerator = isPublicModerator;
        Object.freeze(this);
    }

    get urlSocket() {

        return this._urlSocket;
    }

    get enableScalableBroadcast() {

        return this._enableScalableBroadcast;
    }

    get maxRelayLimitPerUser() {

        return this._maxRelayLimitPerUser;
    }

    get socketMessageEvent() {

        return this._socketMessageEvent;
    }

    get isPublicModerator() {

        return this._isPublicModerator;
    }
}
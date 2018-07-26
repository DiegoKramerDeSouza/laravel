/**
 * Módulo de definição de configurações básicas de conexão com o RTCMulticonnection
 */
class Connect {

    constructor(urlSocket, enableScalableBroadcast, maxRelayLimitPerUser, socketMessageEvent, isPublicModerator, direction) {

        this._urlSocket = urlSocket;
        this._enableScalableBroadcast = enableScalableBroadcast;
        this._maxRelayLimitPerUser = maxRelayLimitPerUser;
        this._socketMessageEvent = socketMessageEvent;
        this._isPublicModerator = isPublicModerator;
        this._direction = direction;
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

    get direction() {

        return this._direction;
    }
}
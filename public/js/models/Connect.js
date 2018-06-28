class Connect {

    constructor() {

        this._urlSocket = 'https://rtcmulticonnection.herokuapp.com:443/';
        this._enableScalableBroadcast = true;
        this._maxRelayLimitPerUser = 0;
        this._socketMessageEvent = 'Inicia-Apresentacao';
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

}
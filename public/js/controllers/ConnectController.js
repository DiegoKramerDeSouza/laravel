class ConnectController {
    constructor() {

        this._urlSocket = conf.con.URL;
        this._enableScalableBroadcast = conf.con.IS_BROADCAST;
        this._maxRelayLimitPerUser = conf.con.MAX_RELAY;
        this._socketMessageEvent = conf.con.MSG;
        this._isPublic = conf.con.IS_PUBLIC;
        this._direction = conf.con.DIRECTION;
    }

    initiateConnection() {

        return new Connect(this._urlSocket, this._enableScalableBroadcast, this._maxRelayLimitPerUser, this._socketMessageEvent, this._isPublic, this._direction);
    }
}
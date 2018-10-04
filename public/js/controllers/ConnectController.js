class ConnectController {
    constructor() {

        this._urlSocket = conf.con.URL;
        this._enableScalableBroadcast = conf.con.IS_BROADCAST;
        this._maxRelayLimitPerUser = conf.con.MAX_RELAY;
        this._socketMessageEvent = conf.con.MSG;
        this._isPublic = conf.con.IS_PUBLIC;
        this._direction = conf.con.DIRECTION;
        this._fileSharing = conf.str.FILE_SHARING;
        this.points = [];
    }

    initiateConnection() {

        return new Connect(this._urlSocket, this._enableScalableBroadcast, this._maxRelayLimitPerUser, this._socketMessageEvent, this._isPublic, this._direction, this._fileSharing);
    }

    checkDuplicatedCon(incomingCon, event, connection) {

        if (incomingCon == event.stream.streamid) {
            connection.getAllParticipants().forEach((p) => {
                if (p + '' == event.userid + '') {
                    let peer = connection.peers[p].peer;
                    stream.stop();
                    peer.removeStream(event.stream);
                    p.close();
                }
            });
        }
        return;
    }

    cancelFullMeshConnection(connection, brodcaster) {

        connection.extra.alteredValue = false;
        connection.getAllParticipants().forEach((p) => {
            if (p + '' != brodcaster + '') {
                connection.disconnectWith(p);
            }
        });
    }

}
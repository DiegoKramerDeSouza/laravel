/**
 * Módulo de estrutura de uma sala
 *  -> Suporta as variáveis de controle para a criação de uma sala
 */
class Structure {

    constructor(
        viewers,
        usuario,
        solicita,
        broadcastStatus,
        isModerator,
        onlobby,
        onParticipation,
        lockSolicitation,
        mainVideo,
        userVideo,
        startRoom,
        configDev,
        publicRoomsList,
        connectList,
        //roomType,
        countRooms,
        singlecon
    ) {

        this._viewers = viewers;
        this._usuario = usuario;
        this._solicita = solicita;
        this._broadcastStatus = broadcastStatus;
        this._isModerator = isModerator;
        this._onlobby = onlobby;
        this._onParticipation = onParticipation;
        this._lockSolicitation = lockSolicitation;
        this._incomingCon;
        this._connectedAt;
        this._mainVideo = mainVideo;
        this._userVideo = userVideo;
        this._startRoom = startRoom;
        this._configDev = configDev;
        this._publicRoomsList = publicRoomsList;
        this._connectList = connectList;
        //this._roomType = roomType;
        this._countRooms = countRooms;
        this._singleConnection = singlecon;

        this._targetUser;
        this._connections = [];
        this._streamVideos = [];
        this._streamUsers;
    }

    get viewers() {

        return this._viewers;
    }

    set viewers(value) {

        this._viewers = value;
    }

    get usuario() {

        return this._usuario;
    }

    set usuario(name) {

        this._usuario = name;
    }

    get solicita() {

        return this._solicita;
    }

    set solicita(value) {

        this._solicita = value;
    }

    get broadcastStatus() {

        return this._broadcastStatus;
    }

    set broadcastStatus(value) {

        this._broadcastStatus = value;
    }

    get isModerator() {

        return this._isModerator;
    }

    set isModerator(value) {

        this._isModerator = value;
    }

    get onlobby() {

        return this._onlobby;
    }

    set onlobby(value) {

        this._onlobby = value;
    }

    get onParticipation() {

        return this._onParticipation;
    }

    set onParticipation(value) {

        this._onParticipation = value;
    }

    get lockSolicitation() {

        return this._lockSolicitation;
    }

    set lockSolicitation(value) {

        this._lockSolicitation = value;
    }

    get incomingCon() {

        return this._incomingCon;
    }

    set incomingCon(value) {

        this._incomingCon = value;
    }

    get connectedAt() {

        return this._connectedAt;
    }

    set connectedAt(value) {

        this._connectedAt = value;
    }

    get connections() {

        return this._connections;
    }

    set connections(value) {

        this._connections.push(value);
    }

    get mainVideo() {

        return this._mainVideo;
    }

    set mainVideo(value) {

        this._mainVideo = value;
    }

    get userVideo() {

        return this._userVideo;
    }

    set userVideo(value) {

        this._userVideo = value;
    }

    // Apenas getters ---------------------------

    get startRoom() {

        return this._startRoom;
    }

    get configDev() {

        return this._configDev;
    }

    get publicRoomsList() {

        return this._publicRoomsList;
    }

    get connectList() {

        return this._connectList;
    }

    /*
    get roomType() {

        return this._roomType;
    }
    */

    // ------------------------------------------

    get countRooms() {

        return this._countRooms;
    }

    set countRooms(countRooms) {

        this._countRooms = countRooms;
    }

    get singleConnection() {

        return this._singleConnection;
    }

    set singleConnection(singleConnection) {

        this._singleConnection = singleConnection;
    }

    get targetUser() {

        return this._targetUser;
    }

    set targetUser(targetUser) {

        this._targetUser = targetUser;
    }

    get streamVideos() {

        return this._streamVideos;
    }

    set streamVideos(value) {

        this._streamVideos.push(value);
    }

    get streamUsers() {

        return this._streamUsers;
    }

    set streamUsers(value) {

        this._streamUsers = value;
    }

    emptyStreamVideos() {

        this._streamVideos = [];
    }

    waitingForVideos(index) {

        this._arrVideos[index] = 'waiting';
    }

}
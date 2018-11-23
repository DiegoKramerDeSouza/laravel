/**
 * Responde pelas alteraçãos de interface dentro da view e dos elementos das salas
 */
class RoomView {

    constructor() {

        this._countUsers = doc.TAG(dom.LABEL_USERS);
        this._currentUsers = doc.TAG(dom.CURRENT_USERS);
        this._roomLabel = doc.TAG(dom.CLASS_TITLE);
        this._label;
        this._publicRoomsDiv = doc.TAG(dom.PUBLIC_CONFERENCE);
        this._divOpen = doc.ADD('div');
        this._divMessage;
        this._roomCard;
        this._roomList = doc.TAG(dom.PUBLIC_CONFERENCE);
        this._connectionList = doc.TAG(dom.CONNECTION_LIST);
        this._connectList = doc.TAG(dom.USERS_LIST);
        this._listOfConCards = '';
    }

    setCurrentTime(...time) {

        doc.TAG(dom.CURRENT_HOUR).innerHTML = time[0];
        doc.TAG(dom.CURRENT_MIN).innerHTML = time[1];
        doc.TAG(dom.CURRENT_SEC).innerHTML = time[2];
    }

    changeCounter(value) {

        if (this._countUsers)
            if (this._countUsers.getAttribute('data-target') == '0')
                this._countUsers.innerHTML = value;
        this._currentUsers.innerHTML = value;
    }

    createRoomLabel(icon, classe, assunto) {

        this._label = `${ icon } <b>${ classe }</b> (${ assunto })`;
        this._roomLabel.innerHTML = this._label;
    }

    noRooms() {

        this._divMessage = `<div class='red-text text-darken-3 margin-50-top' align='center'>
                                <h6>
                                    <i class='fa fa-times-circle fa-lg'></i> <b>Não há salas disponíveis.</b>
                                </h6>
                            </div>`;
        this._divOpen.innerHTML = this._divMessage;
        this._publicRoomsDiv.appendChild(this._divOpen);
    }

    createRoomCard(classe, assunto, apresentador, viwer, moderador) {

        this._roomCard = `<div class="row valign-wrapper li-hover grey-text text-darken-3">
                            <div id="_${moderador}" align="center" class="col s3 m2">
                                    <span class="blue-text"><b>Entrar</b></span><br>
                                </div>
                                <div class="col s9 m10 l11">
                                    <span class="card-title">
                                        <b>${classe}: ${assunto}</b>
                                    </span>
                                    <div class="divider"></div>
                                    <div class="blockquoted">
                                        <span>
                                            <b class="blue-text"> Apresentado por:</b> ${apresentador}
                                        </span><br>
                                        <span>
                                            <b class="blue-text"> Espectadores:</b><b> ${viwer}</b>
                                        </span>
                                    </div>
                                </div>
                            </div>`;
        return this._roomCard;
    }

    setRoomCard(moderatorId, label, container, obj, valid) {

        container.innerHTML = label;
        container.className = "card-panel hoverable";
        obj.id = btoa(moderatorId);
        obj.title = 'Acessar sala';
        obj.innerHTML = misc.ICON_PLAY;
        obj.className = 'btn-floating room-enter blue darken-1 modal-trigger';
        obj.href = "#msg-informa-espectadores";
        this._roomList.appendChild(container);
        doc.ID('_' + moderatorId).appendChild(obj);
    }

    clearLabelCon() {

        this._listOfConCards = '';
    }

    cleanRoomList(list) {

        list.innerHTML = '';
    }

    newLabelCon(userid, username, deleteBtn, itsMe) {

        let me;
        itsMe ? me = '(você)' : me = '';
        this._listOfConCards += `
                            <div id="li-disconnect-${ userid }" data-sender="${ username }" class="li-disconnect truncate container p-5" title="${ username }">
                                <i class="fa fa-user-o blue-text lighten-2"></i> <b>${ username } ${ me }</b>
                                <span class="right">
                                    ${ deleteBtn }
                                </span>
                            </div>`;
    }

    setDisabledConBtn(userid, username, announce) {

        return '<a id="disabled-' + userid + '" name="' + username + '" data-announced="' + announce + '" >' + misc.ICON_REMOVE_DISABLED + '</a>';
    }

    setRemoveConBtn(userid, username, announce) {

        return '<a id="disconnect-' + userid + '" name="' + username + '" data-announced="' + announce + '" title="Desconectar espectador" class="disconnect-btn">' + misc.ICON_REMOVE_USER + '</a>';;
    }

    putList() {

        this._connectList.innerHTML = this._listOfConCards;
    }
}
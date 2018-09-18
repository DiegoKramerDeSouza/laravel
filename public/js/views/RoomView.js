/**
 * Responde pelas alteraçãos de interface dentro da view e dos elementos das salas
 */
class RoomView {

    constructor() {

        this._countUsers = doc.TAG(dom.LABEL_USERS);
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

    changeCounter(value) {
        if (this._countUsers) {
            if (this._countUsers.getAttribute('data-target') == '0') {
                this._countUsers.innerHTML = value;
            }
        }
    }

    createRoomLabel(icon, classe, assunto) {

        this._label = `${ icon } <b>${ classe }</b> (${ assunto })
                            <span class='right'><a href='' title='Sair' class='red-text text-darken-4'>
                        <i class='fa fa-times'></i></a></span>`;
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
        obj.id = moderatorId;
        obj.title = 'Acessar sala';
        obj.innerHTML = misc.ICON_PLAY;
        obj.className = 'btn-floating room-enter blue darken-1 modal-trigger';
        //valid ? null : obj.className += ' modal-trigger';
        obj.href = "#msg-informa-espectadores";

        this._roomList.appendChild(container);
        doc.ID('_' + moderatorId).appendChild(obj);
    }

    clearLabelCon() {

        this._listOfConCards = '';
    }

    newLabelCon(userid, username, deleteBtn) {

        this._listOfConCards += `
                            <div id="li-disconnect-${ userid }" data-sender="${ username }" class="li-disconnect truncate">
                                <i class="fa fa-user-o blue-text lighten-2"></i> <b>${ username }</b>
                                <span class="right">
                                    ${ deleteBtn }
                                </span>
                            </div>`;
    }

    setDisabledConBtn(userid, username, announce) {

        return '<a id="disabled-' + userid + '" name="' + username + '" data-announced="' + announce + '" ><i class="material-icons grey-text text-lighten-1">close</i></a>';
    }

    setRemoveConBtn(userid, username, announce) {

        return '<a id="disconnect-' + userid + '" name="' + username + '" data-announced="' + announce + '" title="Desconectar espectador" class="disconnect-btn"><i class="material-icons red-text text-darken-4">close</i></a>';;
    }

    putList() {

        this._connectList.innerHTML = this._listOfConCards;
    }
}
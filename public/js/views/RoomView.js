/**
 * Responde pelas alteraçãos de interface dentro da view e dos elementos das salas
 */
class RoomView {

    constructor() {

        let tag = document.querySelector.bind(document);
        let addTag = document.createElement.bind(document);

        this._countUsers = tag(conf.dom.LABEL_USERS);
        this._roomLabel = tag(conf.dom.CLASS_TITLE);
        this._label;
        this._publicRoomsDiv = tag(conf.dom.PUBLIC_CONFERENCE);
        this._divOpen = addTag('div');
        this._divMessage;
        this._roomCard;
        this._roomList = tag(conf.dom.PUBLIC_CONFERENCE);
        this._connectionList = tag(conf.dom.CONNECTION_LIST);
        this._connectList = tag(conf.dom.USERS_LIST);
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
                                    <span class="blue-text">Entrar</span><br>
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

    setRoomCard(moderatorId, label, container, obj) {

        let getId = document.getElementById.bind(document);
        container.innerHTML = label;
        container.className = "card-panel hoverable";
        obj.id = moderatorId;
        obj.title = 'Acessar sala';
        obj.className = 'btn-floating room-enter blue darken-1';
        obj.innerHTML = '<i class="material-icons large">play_arrow</i>';

        this._roomList.appendChild(container);
        getId('_' + moderatorId).appendChild(obj);
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
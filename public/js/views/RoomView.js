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
    }

    changeCounter(value) {
        if (this._countUsers) {
            if (this._countUsers.getAttribute('data-target') == '0') {
                this._countUsers.innerHTML = value;
            }
        }
    }

    setRoomLabel(icon, classe, assunto) {

        this._label = `<i class='fa fa-${ icon } blue-text'></i> <b>${ classe }</b> (${ assunto })
                            <span class='right'><a href='' title='Sair' class='red-text text-darken-3'>
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
}
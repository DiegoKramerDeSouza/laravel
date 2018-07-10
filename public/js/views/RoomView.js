class RoomView {

    constructor() {

        let tag = document.querySelector.bind(document);
        this._countUsers = tag(conf.dom.LABEL_USERS);
    }

    changeCounter(value) {
        if (this._countUsers) {
            if (this._countUsers.getAttribute('data-target') == '0') {
                this._countUsers.innerHTML = value;
            }
        }
    }
}
class MessageView {

    constructor(patern, bgColor) {

        this._text = patern;
        this._color = bgColor;
    }

    update() {

        M.toast({ html: `<span class="white-text">${ this._text }</span>`, classes: this._color, displayLength: conf.message.TIMEOUT });
    }

}
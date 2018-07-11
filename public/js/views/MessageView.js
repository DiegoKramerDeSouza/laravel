class MessageView {

    constructor(patern, bgColor) {

        this._text = patern;
        this._color = bgColor;
    }

    update() {

        M.toast({ html: this._text, classes: this._color, displayLength: 2000 });
    }

}
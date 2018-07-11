class MessageView {

    constructor(patern, bgColor) {

        this._text = patern;
        this._color = bgColor;
    }

    _template(arrModelo, detail) {

        return detail ? `${arrModelo[0]} ${detail} ${arrModelo[1]}` : `${arrModelo[0]} ${arrModelo[1]}`;
    }

    update() {
        /*
        this._text = value ? this._template(arrModelo, value) : this._template(arrModelo);
        this._text = `<span class="white-text">${ this._text }</span>`;
        let mensagem = new Message(this._text, arrModelo[2]);
        M.toast({ html: mensagem.text, classes: mensagem.model, displayLength: 2000 });
        */
        M.toast({ html: this._text, classes: this._color, displayLength: 2000 });
    }

}
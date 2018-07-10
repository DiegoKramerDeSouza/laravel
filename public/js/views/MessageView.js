class MessageView {

    constructor() {

        this._text;
    }

    _template(arrModelo, detail) {

        return detail ? `<span class="white-text">${arrModelo[0]} ${detail} ${arrModelo[1]}</span>` : `<span class="white-text">${arrModelo[0]} ${arrModelo[1]}</span>`;
    }

    update(arrModelo, value) {

        this._text = value ? this._template(arrModelo, value) : this._template(arrModelo);
        let mensagem = new Message(this._text, arrModelo[2]);
        M.toast({ html: mensagem.text, classes: mensagem.model, displayLength: 2000 });
    }

}
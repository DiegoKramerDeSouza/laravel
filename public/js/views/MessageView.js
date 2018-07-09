class MessageView {

    constructor() {

        this._text;
    }

    _template(model, detail) {

        return detail ? `<span class="white-text">${model[0]} ${detail} ${model[1]}</span>` : `<span class="white-text">${model[0]} ${model[1]}</span>`;
    }

    update(model, value) {

        this._text = value ? this._template(model, value) : this._template(model);
        M.toast({ html: this._text, classes: model[2], displayLength: 2000 });
        return new Message(this._text);
    }

}
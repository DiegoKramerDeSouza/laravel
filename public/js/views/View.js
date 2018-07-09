class View {

    constructor(element) {

        this._element = element;
    }

    template() {

        throw new Error('O método template deve ser implementado');
    }

    update(model) {

        //this._elemento.innerHTML = this.template(model);
        let content = `<span class="white-text">${model[0]} ${model[1]}</span>`;
        M.toast({ html: content, classes: model[2], displayLength: 2000 });
    }
}
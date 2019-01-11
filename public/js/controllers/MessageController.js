class MessageController {

    constructor() {

        this._text;
    }

    initiateMessage(patern, detail) {

        this._text = detail ? `${patern[0]} ${detail} ${patern[1]}` : `${patern[0]} ${patern[1]}`;
        let messageView = new MessageView(this._text, patern[2]);
        messageView.update();
    }
}
/**
 * Classe voltada ao tratamento de mensagens para exibição
 *  
 * Instancia:
 * MessageView
 */
class MessageController {

    constructor() {

        this._text;
    }

    /**
     * Instancia MessageView para chamada de exibição de mensagens de toast
     * @param {Array} patern 
     * @param {String} detail 
     */
    initiateMessage(patern, detail) {

        this._text = detail ? `${patern[0]} ${detail} ${patern[1]}` : `${patern[0]} ${patern[1]}`;
        let messageView = new MessageView(this._text, patern[2]);
        messageView.update();
    }
}
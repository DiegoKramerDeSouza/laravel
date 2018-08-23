class PageMessageController {

    constructor() {

        this._message = new MessageController();
        this._errorLevel = doc.TAG(dom.ERROR_LEVEL);
        this._successLevel = doc.TAG(dom.SUCCESS_LEVEL);
    }

    initiateMessage() {

        this._errorLevel.value ? this._formatMessage(this._errorLevel.value, false) : this._formatMessage(this._successLevel.value, true);
    }

    _formatMessage(msgtext, success) {

        let msgBlock;
        success ? msgBlock = [misc.ICON_SUCCESS, msgtext, misc.CLASS_SUCCESS_COLOR] : msgBlock = [misc.ICON_ERROR, msgtext, misc.CLASS_ERROR_COLOR];
        this._message.initiateMessage(msgBlock);
    }
}
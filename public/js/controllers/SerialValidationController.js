/**
 * Classe voltada à validação e controle do dispositívo de token 
 * 
 * Instancia:
 * MessageController
 * SerialValidation
 */
class SerialValidationController {

    constructor() {

        this._key = conf.con.TK_KEY;
        this._url = conf.con.TK_URL;
        this._msg = conf.con.TK_MSG;
        this._msgSend = conf.con.TK_MSG_SEND;
        this._time = conf.con.TK_TIME_REQ;
        this._btnDevice = doc.TAG(dom.CALL_TK);
        this._allow = true;
        this._index = 2;
        this._atual;
        this._anterior = "0";
        this._alerta = new MessageController();
    }

    initiateSerialValidation() {

        return new SerialValidation(this._key, this._url, this._msg, this._msgSend);
    }

    initiateSendMessage(key, url) {

        if (!conf.con.TK_DETECT) return;
        this._btnDevice.onclick = () => {
            if (this._allow) {

                this._callChromeRuntime(key, url);
                this._btnDevice.disabled = true;

                setInterval(() => {
                    this._index++;
                    this._callChromeRuntime(key, url);
                }, this._time);
            }
            this._allow = false;
        }
    }

    _callChromeRuntime(key, url) {

        chrome.runtime.sendMessage(
            key, { openUrlInEditor: url },
            response => {
                try {
                    this._atual = response.targetData;
                } catch (e) {
                    this._atual = "0";
                }

                if (this._index > 1) {
                    if (this._atual == "1" || this._anterior == "1") {
                        //this._alerta.initiateMessage(conf.message.TK_FOUNDED);
                        $(dom.TK_OFF).hide();
                        $(dom.TK_ON).fadeIn(100);
                    } else {
                        $(dom.TK_ON).hide();
                        $(dom.TK_OFF).fadeIn(100);
                        //this._alerta.initiateMessage(conf.message.TK_NOT_FOUND);
                    }
                    this._index = 0;
                }
                this._anterior = this._atual;
            }
        );
    }
}
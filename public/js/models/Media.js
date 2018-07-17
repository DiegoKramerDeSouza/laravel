/**
 * Módulo de definição de elementos de mídia
 *  -> Suporta os elementos do DOM de controle de mídias
 */
class Media {

    constructor(
        videoPreview,
        secondVideoPreview,
        thirdVideoPreview,
        mute,
        screen,
        exitscreen,
        vol,
        cam,
        solPedir,
        pedir,
        ctlPedir,
        share,
        videoSecond,
        swapSecond,
        sessionAccess,
        endSessionAccess,
        divEndBtn,
        toggleChat,
        textMessage
    ) {

        this._videoPreview = videoPreview;
        this._secondVideoPreview = secondVideoPreview;
        this._thirdVideoPreview = thirdVideoPreview;
        this._mute = mute;
        this._screen = screen;
        this._exitscreen = exitscreen;
        this._vol = vol;
        this._cam = cam;
        this._solPedir = solPedir;
        this._pedir = pedir;
        this._ctlPedir = ctlPedir;
        this._share = share;
        this._videoSecond = videoSecond;
        this._swapSecond = swapSecond;
        this._sessionAccess = sessionAccess;
        this._endSessionAccess = endSessionAccess;
        this._divEndBtn = divEndBtn;
        this._toggleChat = toggleChat;
        this._textMessage = textMessage;
        Object.freeze(this);
    }

    get videoPreview() {

        return this._videoPreview;
    }

    get secondVideoPreview() {

        return this._secondVideoPreview;
    }

    get thirdVideoPreview() {

        return this._thirdVideoPreview;
    }

    get mute() {

        return this._mute;
    }

    get screen() {

        return this._screen;
    }

    get exitscreen() {

        return this._exitscreen;
    }

    get vol() {

        return this._vol;
    }

    get cam() {

        return this._cam;
    }

    get solPedir() {

        return this._solPedir;
    }

    get pedir() {

        return this._pedir;
    }

    get ctlPedir() {

        return this._ctlPedir;
    }

    get share() {

        return this._share;
    }

    get videoSecond() {

        return this._videoSecond;
    }

    get swapSecond() {

        return this._swapSecond;
    }

    get sessionAccess() {

        return this._sessionAccess;
    }

    get endSessionAccess() {

        return this._endSessionAccess;
    }

    get divEndBtn() {

        return this._divEndBtn;
    }

    get toggleChat() {

        return this._toggleChat;
    }

    get textMessage() {

        return this._textMessage;
    }

}
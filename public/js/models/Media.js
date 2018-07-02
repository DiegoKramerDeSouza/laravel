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
        pedir,
        ctlPedir,
        share,
        videoSecond,
        swapSecond,
        sessionAccess,
        endSessionAccess
    ) {

        this._videoPreview = videoPreview;
        this._secondVideoPreview = secondVideoPreview;
        this._thirdVideoPreview = thirdVideoPreview;
        this._mute = mute;
        this._screen = screen;
        this._exitscreen = exitscreen;
        this._vol = vol;
        this._cam = cam;
        this._pedir = pedir;
        this._ctlPedir = ctlPedir;
        this._share = share;
        this._videoSecond = videoSecond;
        this._swapSecond = swapSecond;
        this._sessionAccess = sessionAccess;
        this._endSessionAccess = endSessionAccess;
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

}
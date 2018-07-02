class MediaController {

    constructor() {

        let tag = document.querySelector.bind(document);
        this._videoPreview = tag(conf.dom.media.FIRST_VIDEO);
        this._secondVideoPreview = tag(conf.dom.media.SECOND_VIDEO);
        this._thirdVideoPreview = tag(conf.dom.media.THIRD_VIDEO);
        this._mute = tag(conf.dom.media.MUTE);
        this._screen = tag(conf.dom.media.SCREEN);
        this._exitscreen = tag(conf.dom.media.EXIT_SCREEN);
        this._vol = tag(conf.dom.media.VOL);
        this._cam = tag(conf.dom.media.CAM);
        this._pedir = tag(conf.dom.media.PEDIR);
        this._ctlPedir = tag(conf.dom.media.CTL_PEDIR);
        this._share = tag(conf.dom.media.SHARE);
        this._videoSecond = tag(conf.dom.media.VIDEO_SECOND);
        this._swapSecond = tag(conf.dom.media.SWAP_SECOND);
        this._sessionAccess = tag(conf.dom.media.SESSION_ACCESS);
        this._endSessionAccess = tag(conf.dom.media.END_SESSION_ACCESS);
    }

    initiateMedia() {

        return new Media(
            this._videoPreview,
            this._secondVideoPreview,
            this._thirdVideoPreview,
            this._mute,
            this._screen,
            this._exitscreen,
            this._vol,
            this._cam,
            this._pedir,
            this._ctlPedir,
            this._share,
            this._videoSecond,
            this._swapSecond,
            this._sessionAccess,
            this._endSessionAccess
        );
    }
}
class VideoController{

    constructor(){
        this._videos;
    }

    getVideos(url){
        this._videos = doc.ALL("iframe[src^='" + url + "']");
        console.warn("---> MEDIA: ", url, this._videos);
        this._setAspectRatio();
        this._resizeListener();
    }

    _embeddedMessage(frameid, message) {

        let framePlay = doc.TAG(frameid);
        framePlay.contentWindow.postMessage(message, '*');
    }

    _setAspectRatio(){
        let video;
        this._videos.forEach(vid => {
            video = $("#" + vid.id);
            video.data('aspectRatio', video.height / video.width)
                .removeAttr('height')
                .removeAttr('width');
        })
    }

    _resizeListener(){
        // Verifica quando a janela é ajustada
        $(window).resize(() => {
            let el;
            let parent;
            // Ajusta cada vídeo de acordo com o seu aspectratio
            this._videos.forEach(vid => {
                el = $("#" + vid.id);
                parent = el.parent().width();
                if(el){
                    let margin = parent/12 + 'px';
                    doc.TAG('#' + vid.id).style.width = parent + 'px';
                    doc.TAG('#' + vid.id).style.marginLeft = margin;
                }   
            });
        }).resize();
    }

}
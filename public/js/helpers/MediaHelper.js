/**
 * Métodos estáticos de verificação de elementos de salas
 */
class MediaHelper {

    constructor() {

        throw new Error('MediaHelper apresenta apenas métodos estáticos.');
    }

    static setMediaPlayer(roomid) {

        let JSVideo = false;
        let player;
        let name = btoa(roomid);

        fetch(conf.con.SOCKET_DOWNLOAD + name + "_adaptive.m3u8", { method: 'HEAD' })
            .then(function(response) {
                if (response.status == 200) {
                    // adaptive m3u8 exists,play it
                    initializePlayer(name + "_adaptive", "m3u8");
                } else {
                    //adaptive m3u8 not exists, try m3u8 exists.
                    fetch(conf.con.SOCKET_DOWNLOAD + name + ".m3u8", { method: 'HEAD' })
                        .then(function(response) {
                            if (response.status == 200) {
                                //m3u8 exists, play it
                                initializePlayer(name, "m3u8");
                            } else {
                                //no m3u8 exists, try vod file
                                fetch(conf.con.SOCKET_DOWNLOAD + name + ".mp4", { method: 'HEAD' })
                                    .then(function(response) {
                                        if (response.status == 200) {
                                            //mp4 exists, play it
                                            initializePlayer(name, "mp4");
                                        } else {
                                            console.log("No stream found");

                                        }
                                    }).catch(function(err) {
                                        console.log("Error: " + err);
                                    });

                            }
                        }).catch(function(err) {
                            console.log("Error: " + err);
                        });
                }
            }).catch(function(err) {
                console.log("Error: " + err);
            });

        function initializePlayer(name, extension) {

            let type;
            let liveStream = false;
            if (extension == 'mp4') {
                type = 'video/mp4';
                liveStream = false;
            } else if (extension == 'm3u8') {
                type = 'application/x-mpegurl';
                liveStream = true;
            } else {
                console.log("Unknown extension: " + extension);
                return;
            }

            let preview = name;
            if (name.endsWith("_adaptive")) {
                preview = name.substring(0, name.indexOf("_adaptive"));
            }

            // Define qual player será usado
            JSVideo ?
                startJSVideo(name, extension, type) :
                startFlow(name, extension, type, liveStream);
        }

        /* Inicializa VideoJS */
        function startJSVideo(name, extension, type) {

            // Cria elemento do player
            player = videojs('embedded-container-iframe', {
                html5: {
                    hls: {
                        overrideNative: true
                    }
                },
                ratio: '16:9',
                controls: false
            });
            player.src({
                src: conf.con.SOCKET_DOWNLOAD + name + '.' + extension,
                type: type,
                withCredentials: false
            });
        }

        /* Inicializa FlowPlayer */
        function startFlow(name, extension, type, liveStream) {

            // Cria elemento do player
            player = flowplayer("#embedded-container-iframe", {
                muted: false,
                ratio: 9 / 16,
                clip: {
                    live: liveStream,
                    sources: [{
                        type: type,
                        src: conf.con.SOCKET_DOWNLOAD + name + "." + extension
                    }]
                }
            });

            setTimeout(() => {

                let fpMark = document.querySelector('div.fp-player');
                let fpPlay = document.querySelector('video.fp-engine');
                fpPlay.setAttribute('crossOrigin', 'anonymous');
                fpMark.removeChild(fpMark.childNodes[2]);
                setTimeout(() => {
                    player.play();
                }, 300);
            }, 300);
        }
    }

}
class PlayerController {

    constructor(name) {

        this._name = name;
        this._JSVideo = true;
        this._autoPlay = true;
        this._controls = true;
        this._muted = true;
        this._ratio = '16:9';
        this._player;
        this._local = 'http://localhost';
        this._url = 'https://wtv.lrbtecnologia.com';
    }

    /* Inicializa player de Video */
    _initializePlayer(name, extension) {

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
        this._JSVideo ?
            this._startJSVideo(name, extension, type) :
            this._startFlow(name, extension, type, liveStream);
    }

    /* Inicializa VideoJS */
    _startJSVideo(name, extension, type) {

        // Cria elemento de vídeo com VideoJS
        this._player = videojs('embedded_player', {
            html5: {
                hls: {
                    overrideNative: true
                }
            },
            ratio: this._ratio,
            controls: this._controls,
            muted: this._muted,
            autoplay: this._autoPlay
        });
        this._player.src({
            src: "https://med.lrbtecnologia.com:5443/WebRTCApp/streams/" + name + "." + extension,
            //src: 'https://test.antmedia.io:5443/WebRTCAppEE/streams/' + name + '.' + extension,
            type: type,
            withCredentials: false
        });



        // Alteração do botão de play
        //this._videoJSPlayText();

        // Inicia verificação de vídeo
        this._initListeners(this._player);
        this._isEnded(name);
    }

    /* Inicializa Flowplayer */
    _startFlow(name, extension, type, liveStream) {

        // Cria elemento de vídeo com Flowplayer
        this._player = flowplayer("#video-player", {
            ratio: 9 / 16,
            clip: {
                live: liveStream,
                controls: true,
                sources: [{
                    type: type,
                    src: "https://med.lrbtecnologia.com:5443/WebRTCApp/streams/" + name + "." + extension
                        //src: "https://test.antmedia.io:5443/WebRTCAppEE/streams/" + name + "." + extension
                }]
            }
        });

        /*
        setTimeout(() => {
        	let fpMenu = document.querySelector('div.fp-context-menu');
        	let fpPlay = document.querySelector('video.fp-engine');
        	let fpMark = document.querySelector('div.fp-player');
        			
        	fpMenu.innerHTML = '';
        	fpMark.removeChild(fpMark.childNodes[2]);
        	this._player.play();
        	
        }, 100);
        */
        let thisVideo = document.querySelector("#remoteVideo");
        //thisVideo.style.display = 'none';
    }

    /* Altera botão de play da aplicação para uma mensagem de texto */
    _videoJSPlayText() {

        // Ajusta botão de play
        let thisVideo = document.querySelector("#remoteVideo");
        let bigPlay = document.querySelector("button.vjs-big-play-button");
        let message = 'Clique aqui para iniciar o vídeo';
        bigPlay.innerHTML = '<div id="iniciada">Apresentação iniciada</div><span id="playableButton" aria-live="polite">' + message + '</span>';
        thisVideo.onclick = () => startPlay = true;

        // Apresenta inicialização de vídeo
        let iniciada = document.getElementById("iniciada");
        this._cicleOut(iniciada, 800);
    }

    /* Ciclo de apresentação (blinking) */
    // Fade In
    _cicleIn(el, time) {

            el.style.opacity = 0;
            let timer;
            let last = +new Date();
            let tick = () => {
                timer = (new Date() - last) / time;
                el.style.opacity = +el.style.opacity + timer;
                last = +new Date();

                if (el.style.opacity < 1) {
                    (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
                } else if (el.style.opacity >= 1 && startPlay === false) {
                    this._cicleOut(el, time);
                    return;
                }
            };
            tick();
        }
        // Fade Out
    _cicleOut(el, time) {

        el.style.opacity = 1;
        let timer;
        let last = +new Date();
        let tick = () => {
            timer = (new Date() - last) / time;
            el.style.opacity = +el.style.opacity - timer;
            last = +new Date();

            if (el.style.opacity > 0) {
                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            } else if (el.style.opacity <= 0 && startPlay === false) {
                cicleIn(el, time);
                return;
            }
        };
        tick();
    }

    /* Verifica a finalização do vídeo */
    _isEnded(name) {

        setTimeout(() => {
            if (this._player.ended()) {
                console.log('Player ended...');
                this._parentMessage('ended', name);
            } else this._isEnded(name);
        }, 1000);
    }

    /* Envia mensagens para o parent container */
    _parentMessage(message, videoid) {

        let container = message + '|' + videoid;
        window.parent.postMessage(container, '*');
    }


    initFetch() {

        let name = this._name;

        //ask if adaptive m3u8 file
        //fetch("https://test.antmedia.io:5443/WebRTCAppEE/streams/" + name + "_adaptive.m3u8", { method: 'HEAD' })
        fetch("https://med.lrbtecnologia.com:5443/WebRTCApp/streams/" + name + "_adaptive.m3u8", { method: 'HEAD' })
            .then((response) => {
                if (response.status == 200) this._initializePlayer(name + "_adaptive", "m3u8");
                else {
                    //fetch("https://test.antmedia.io:5443/WebRTCAppEE/streams/" + name + ".m3u8", { method: 'HEAD' })
                    fetch("https://med.lrbtecnologia.com:5443/WebRTCApp/streams/" + name + ".m3u8", { method: 'HEAD' })
                        .then((response) => {
                            if (response.status == 200) this._initializePlayer(name, "m3u8");
                            else {
                                //fetch("https://test.antmedia.io:5443/WebRTCAppEE/streams/" + name + ".mp4", { method: 'HEAD' })
                                fetch("https://med.lrbtecnologia.com:5443/WebRTCApp/streams/" + name + ".mp4", { method: 'HEAD' })
                                    .then((response) => {
                                        if (response.status == 200) this._initializePlayer(name, "mp4");
                                        else {
                                            console.info("Stream não encontrada...", name);
                                            setTimeout(location.reload.bind(location), 3000);
                                        }
                                    }).catch((err) => {
                                        console.log("Error: " + err);
                                    });

                            }
                        }).catch((err) => {
                            console.log("Error: " + err);
                        });
                }
            }).catch((err) => {
                console.log("Error: " + err);
            });
    }

    _initListeners(player) {

        window.addEventListener('message', (event) => {

            if (~event.origin.indexOf(this._local) || ~event.origin.indexOf(this._url)) {

                if (event.data == 'mute') player.muted(true);
                else if (event.data == 'unmute') player.muted(false);
                else if (event.data == 'fullscreen') player.requestFullscreen();
                else if (event.data == 'exitfullscreen') player.exitFullscreen();

                console.log(event.data);
            } else return;

        });
    }
}
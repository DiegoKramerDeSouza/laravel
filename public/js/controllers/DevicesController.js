/**
 *  Classe voltada ao tratamento dos dispositívos de áudio e vídeo detectados
 * 
 * Instancia:
 * MessageController
 * RoomController
 */
class DevicesController {

    constructor() {

        this._origin = location.origin;
        this._devices = [];
        this._alerta = new MessageController();
        this._hasMic;
        this._hasCan;
    }

    /**
     * Detecta dispositivos padrões para Microfone e Câmera de um usuário ao entrar na sala
     */
    participantInitiateDevices() {

        DetectRTC.load();
        setTimeout(() => {
            this._hasMic = DetectRTC.hasMicrophone;
            this._hasCan = DetectRTC.hasWebcam;
        }, 500);

    }

    /**
     * Valida a existência de dispositívos de Câmera e Microfone
     * @return {Boolean}
     */
    checkParticipation() {

        if (DetectRTC.isMobileDevice) return true;
        if (this._hasMic !== true) {
            this._alerta.initiateMessage(conf.message.AUDIO_DEVICE_NOT_FOUND);
            return false;
        }
        if (this._hasCan !== true) {
            this._alerta.initiateMessage(conf.message.VIDEO_DEVICE_NOT_FOUND);
            return false;
        }
        return true;
    }

    /**
     * Verifica todos os dispositívos disponíveis de áudio e vídeo ao acessar a página
     */
    initiateDevices() {

        console.log('DetectRTC Versão: ', DetectRTC.version);
        GeneralHelper.loading();
        DetectRTC.load(() => {
            setTimeout(() => {
                if (DetectRTC.hasMicrophone !== true) {
                    this._alerta.initiateMessage(conf.message.AUDIO_DEVICE_NOT_FOUND);
                    GeneralHelper.devicesOff(false, true);
                    return;
                }
                if (DetectRTC.hasWebcam !== true) {
                    this._alerta.initiateMessage(conf.message.VIDEO_DEVICE_NOT_FOUND);
                    GeneralHelper.devicesOff(true, false);
                    return;
                }
                DetectRTC.audioInputDevices.forEach(device => this._devices.push(this._collectDevice(device)));
                DetectRTC.videoInputDevices.forEach(device => this._devices.push(this._collectDevice(device)));
                GeneralHelper.endLoading();
                console.log('Dispositivos carregados: ', DetectRTC);
                this._collectCookiesDevices();
            }, 2000);
        });
    }

    /**
     * Define dispositivos de áudio e vídeo selecionados e grava seus identificadores em cookies
     */
    setDevices() {

        let roomController = new RoomController();
        if (!roomController.checkDevices()) {
            this._alerta.initiateMessage(conf.message.DEVICE_ALERT);
            return;
        } else {
            let audio = doc.TAG(dom.LIST_AUDIO);
            let video = doc.TAG(dom.LIST_VIDEO);
            this.setCookies(doc.COOKIE_AUDIO_DEVICE, audio.value, doc.COOKIE_LIFETIME);
            this.setCookies(doc.COOKIE_VIDEO_DEVICE, video.value, doc.COOKIE_LIFETIME);
            this._alerta.initiateMessage(conf.message.DEVICE_CONFIGURED);
        }
    }

    /**
     * Lista definições de cada dispositívo encontrado
     * @param {Obj} device Objeto listado pelo DetectRTC
     * @return {Obj}
     */
    _collectDevice(device) {

        let input = {
            id: device.id,
            label: device.label,
            group: device.groupId,
            kind: device.kind
        }
        return input;
    }

    /**
     * Define os valores básicos de um cookie criado
     * @param {String} cookiename Nome atribuido ao cookie
     * @param {String} cookievalue Valor atribuido ao cookie
     * @param {Integer} days Quantidade de dias de validade do cookie
     */
    setCookies(cookiename, cookievalue, days) {

        let date = new Date();
        let expires;
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `expires=${date.toUTCString()}`;
        document.cookie = `${cookiename}=${cookievalue};${expires};`;
    }

    /**
     * Coleta os valores dos cookies indicados pelo nome
     * @param {String} cookiename Nome do cookie
     * @returns {String}
     */
    _getCookies(cookiename) {

        let name = cookiename + "=";
        let result = "";
        let decodedCookie = decodeURIComponent(document.cookie);
        let dc = decodedCookie.split(';');
        dc.forEach((cookie) => {
            while (cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) == 0) {
                result = cookie.substring(name.length, cookie.length);
            }
        });
        return result;
    }

    /**
     * Coleta os identificadores do dispositívo selecionado armazenado em cookies
     */
    _collectCookiesDevices() {

        let deviceView = new DevicesView();
        let audDev = this._getCookies(doc.COOKIE_AUDIO_DEVICE);
        let vidDev = this._getCookies(doc.COOKIE_VIDEO_DEVICE);

        this._updateSelectorAud(audDev, deviceView);
        this._updateSelectorVid(vidDev, deviceView);
        setTimeout(() => {
            deviceView.startMaterializeSelect();
        }, 300);
    }

    /**
     * Atualiza view de listagem de dispositivos de áudio
     * @param {String} data Identificador do dispositívo
     * @param {Obj} view Instância de DevicesView()
     */
    _updateSelectorAud(data, view) {

        this._devices.forEach(device => {
            if (device.kind === 'audioinput') {
                view.selectedAudio(device.id, device.label);
                /*
                device.id == data ?
                    view.selectedAudio(device.id, device.label, true) :
                    view.selectedAudio(device.id, device.label);
                */
            }
        });
        view.createAudioSelector();
    }

    /**
     * Atualiza view de listagem de dispositivos de vídeo
     * @param {String} data Identificador do dispositívo
     * @param {Obj} view Instância de DevicesView()
     */
    _updateSelectorVid(data, view) {

        this._devices.forEach(device => {
            if (device.kind === 'videoinput') {
                view.selectedVideo(device.id, device.label);
                /*
                device.id == data ?
                    view.selectedVideo(device.id, device.label, true) :
                    view.selectedVideo(device.id, device.label);
                */
            }
        });
        view.createVideoSelector();
    }
}
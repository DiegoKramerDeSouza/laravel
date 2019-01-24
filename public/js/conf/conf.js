/**
 * Definições de configuração para INICIALIZAÇÃO de componentes JS
 * const doc: definições de métodos e atributos básicos de manipulação do documento;
 * const conf: definições de elementos para inicialização;
 * const dom: elementos gerais do DOM;
 * const misc: elementos visuais de uso geral;
 */

const url = {
    MEDIA: 'med2.lrbtecnologia.com',
    //MEDIA: 'med.pinechart.com',
    LOCAL: 'localhost',
    SIG: 'sig.lrbtecnologia.com',
    TEST: 'test.antmedia.io',
    WTV: 'wtv.lrbtecnologia.com'
};

const doc = {
    /*Constantes de configuração de elementos do documento */
    ALL: document.querySelectorAll.bind(document),
    ADD: document.createElement.bind(document),
    ID: document.getElementById.bind(document),
    TAG: document.querySelector.bind(document),
    IDLE_TIME: 240,
    COOKIE_AUDIO_DEVICE: 'audioDevice',
    COOKIE_LIFETIME: 365,
    COOKIE_VIDEO_DEVICE: 'videoDevice',
    /* Servidores de mídia med e med2 estão invertidos */
    SERVER: {
        HOME: {
            LOCAL: 'http://' + url.LOCAL,
            SSL: 'https://' + url.WTV,
            URL: 'http://' + url.WTV
        },
        MEDIA: {
            /*
            SSL: 'https://' + url.TEST,
            URL: 'https://' + url.TEST,
            WS: 'wss://' + url.TEST + ':5443/WebRTCAppEE/websocket',
            WSS: 'wss://' + url.TEST + ':5443/WebRTCAppEE/websocket'
            */

            SSL: 'https://' + url.MEDIA,
            URL: 'https://' + url.MEDIA,
            WS: 'wss://' + url.MEDIA + ':5443/WebRTCApp/websocket',
            WSS: 'wss://' + url.MEDIA + ':5443/WebRTCApp/websocket'

        },
        MEDIA2: {
            /*
            SSL: 'https://' + url.TEST,
            URL: 'https://' + url.TEST,
            WS: 'wss://' + url.TEST + ':5443/WebRTCAppEE/websocket',
            WSS: 'wss://' + url.TEST + ':5443/WebRTCAppEE/websocket'
            */

            SSL: 'https://' + url.MEDIA,
            URL: 'https://' + url.MEDIA,
            WS: 'wss://' + url.MEDIA + ':5443/WebRTCApp/websocket',
            WSS: 'wss://' + url.MEDIA + ':5443/WebRTCApp/websocket'

        },
        SIG: {
            SSL: 'https://' + url.SIG + ':443/',
            URL: 'http://' + url.SIG + ':80/'
        }
    },
    URL_ATTENDANCE_LIST: `${location.origin}/rest/listaPresenca`,
    /** APENAS TESTE */
    URL_ATTENDANCE_REQ: `${location.origin}/rest/testaPresenca`,
    URL_ATTENDANCE_UPDATE: `${location.origin}/rest/confirmaPresenca`,
    URL_GROUPLIST_REQ: `${location.origin}/rest/listaCursos`,
    /** APENAS TESTE */
    URL_PHOTO_SEND: `${location.origin}/rest/testaPhoto`,
    URL_SALAS_SAVE: `${location.origin}/rest/salas/salvar`,
    URL_SALAS_UPDATE: `${location.origin}/rest/salas/update`,
    VERSION: "1.1.0.95"
}

const apr = {
    /*Constantes de aparencia de elementos */
    msg: {
        DB_MSG_COLOR: 'cyan',
        ERROR_MSG_COLOR: 'red darken-4',
        LOCAL_MSG_COLOR: 'blue darken-1',
        WARNING_MSG_COLOR: 'amber darken-4'
    }
}

const conf = {

    str: {
        /*Constantes de configuração de inicialização da ESTRUTURA do documento de salas */
        BROADCAST_STATUS: 0,
        COUNTDOWN_TO_START: 3,
        FILE_SHARING: true,
        FORM: 'Verificando...',
        IS_MODERATOR: true,
        LOCK_SOLICITATION: false,
        NAV_EDGE: 'left',
        NUMBER_OF_ROOMS: 0,
        ON_LOBBY: true,
        ON_PARTICIPATION: false,
        POSTER_IMG: '/img/bg.jpg',
        SOLICITA: 0,
        TAKE_PIC_INTERVAL: (10 * (60 * 1000)),
        TAKE_PIC_START: 1,
        TAKE_PIC_STOP: 4,
        USER: '',
        VIEWER: 'Calculando...',
        WAITING_FOR_VIDEO: 'waiting'
    },
    con: {
        /*Constantes de configuração de inicialização de CONEXÃO */
        BAND_AUDIO: 200,
        BAND_VIDEO: 300,
        DIRECTION: 'one-to-many',
        DISCONNECTION_TIMER: 2000,
        IS_BROADCAST: true,
        IS_PUBLIC: true,
        LOW_LATENCY: false,
        MAX_RELAY: 0,
        MSG: 'Inicia-Apresentacao',
        ROOM_IDENTIFIER: 'class-room',
        SESSION_AUDIO: false,
        SESSION_VIDEO: false,
        SESSION_DATA: true,
        SESSION_BROADCAST: true,
        SESSION_ONEWAY: true,
        SET_BAND_LIMIT: false,
        SHARE_DENIED: 'permission-denied',
        SINGLE_CON: false,

        /*------------------------------------------------------------------------------- */

        /*
        SOCKET_DOWNLOAD: doc.SERVER.MEDIA.SSL + ':5443/WebRTCAppEE/streams/',
        SOCKET_PLAYER: doc.SERVER.MEDIA.URL + ':5080/WebRTCAppEE/play.html',
        SOCKET_PLAYER_SSL: doc.SERVER.MEDIA.SSL + ':5443/WebRTCAppEE/play.html',

        SOCKET_PLAYER_2: doc.SERVER.MEDIA2.URL + ':5080/WebRTCAppEE/play.html',
        SOCKET_PLAYER_2_SSL: doc.SERVER.MEDIA2.SSL + ':5443/WebRTCAppEE/play.html',
        */
        SOCKET_DOWNLOAD: doc.SERVER.MEDIA.SSL + ':5443/WebRTCApp/streams/',
        SOCKET_PLAYER: doc.SERVER.MEDIA.URL + ':5443/WebRTCApp/play.html',
        SOCKET_PLAYER_SSL: doc.SERVER.MEDIA.SSL + ':5443/WebRTCApp/play.html',

        SOCKET_PLAYER_2: doc.SERVER.MEDIA2.URL + ':5443/WebRTCApp/play.html',
        SOCKET_PLAYER_2_SSL: doc.SERVER.MEDIA2.SSL + ':5443/WebRTCApp/play.html',

        /*------------------------------------------------------------------------------- */

        SOCKET_REST_SSL: doc.SERVER.MEDIA.SSL + ':5443/WebRTCApp/rest/broadcast/getList/0/10',
        SOCKET_REST_URL: doc.SERVER.MEDIA.URL + ':5080/WebRTCApp/rest/broadcast/getList/0/10',
        SOCKET_SSL: doc.SERVER.MEDIA.WSS,
        SOCKET_URL: doc.SERVER.MEDIA.WS,

        SOCKET_2_SSL: doc.SERVER.MEDIA2.WSS,
        SOCKET_2_URL: doc.SERVER.MEDIA2.WS,

        STREAM_LOCAL: 'local',
        STREAM_REMOTE: 'remote',
        TK_DETECT: false,
        TK_KEY: 'fhnfigfpkkijpcpfhjaeajmgeelkkila',
        TK_MSG: 'MSG',
        TK_MSG_SEND: 'test',
        TK_TIME_REQ: (1000 * 15),
        TK_URL: 'http://*/*',
        URL: 'https://' + url.SIG + ':443/',
        URL_ADM: 'https://' + url.SIG + ':443/admin/'
    },
    socket: {
        /*Constantes de padronização de mensagens SOCKET.IO */
        MSG_BROADCAST_START: 'start-broadcasting',
        MSG_BROADCAST_STOP: 'broadcast-stopped',
        MSG_CHK_PRESENCE: 'check-broadcast-presence',
        MSG_JOIN: 'join-broadcaster',
        MSG_JOIN_BROADCAST: 'join-broadcast',
        MSG_LEAVE_ROOM: 'leave-the-room',
        MSG_REJOIN: 'rejoin-broadcast'
    },
    datacls: {
        /*Atributos de inicialização de SALAS para espectadores */
        ADMIN_ACCESS: 'ADMIN',
        ALLOWED: false,
        COUNT_ROOMS: 0,
        TRANSMITING: false
    },
    req: {
        /*Padrão de mensagens de chat com REQUISIÇÕES/RESPOSTAS a ações */
        END_CONNECTION: '@Finaliza-Conexao',
        END_PARTICIPANT: '@Finaliza-Participante',
        END_PARTICIPATION: '@Finaliza-Participacao',
        END_SHARE: '@Finaliza-Share',
        NEW_PARTICIPATION: '@Nova-Participacao',
        NEW_ROOM: '@Nova-Sala-Aberta',
        NEW_SHARE: '@Novo-Compartilhamento-Tela',
        PEDE_VEZ: '@PedeAVez',
        RECEIVE_FILE: '@Receive-File',
        REJOIN_ROOM: '@RejoinRoom',
        REQ_ALLOW: 'allow',
        REQ_DENY: 'deny',
        RESP_PEDE_VEZ: '@PedeAVez:',
        USERS_STATUS: '@UsersStatus'
    },
    message: {
        /*Tempo padrão de exibição das MENSAGENS de toast */
        TIMEOUT: 2000,
        /*Atributos para formação de MENSAGENS padronizadas: array[ícone(html), texto(html), cor de fundo(classes MaterializeCSS)] */
        CHAT_MESSAGE: ['<div align="right"><i class="fa fa-comment-o white-text"></i>', '</div>', 'cyan'],
        START_TRANSMITION: ['<i class="fa fa-play-circle fa-lg"></i>', 'Transmissão iniciada!', apr.msg.LOCAL_MSG_COLOR],
        END_TRANSMITION: ['<i class="material-icons left">highlight_off</i>', 'Sala fechada!', apr.msg.ERROR_MSG_COLOR],
        START_PARTICIPATION: ['<i class="material-icons">videocam</i>', 'Participação iniciada!', apr.msg.LOCAL_MSG_COLOR],
        END_PARTICIPATION: ['<i class="material-icons left">videocam_off</i>', 'Participação Finalizada!', apr.msg.ERROR_MSG_COLOR],
        SEND_SOLICITATION: ['<i class="fa fa-check"></i>', 'Solicitação enviada!', apr.msg.LOCAL_MSG_COLOR],
        ERROR_SOLICITATION: ['<i class="fa fa-times"></i>', 'Não foi possível solicitar a vez.', apr.msg.ERROR_MSG_COLOR],
        DUP_SOLICITATION: ['<i class="fa fa-exclamation-triangle"></i>', 'Você já encaminhou uma solicitação.<br>Aguarde a resposta.', apr.msg.WARNING_MSG_COLOR],
        ERR_ACP_SOLICITATION: ['<i class="fa fa-exclamation-triangle"></i>', 'Sua solicitação já foi aceita.<br>Você não pode efetuar uma nova solicitação até finalizar esta.', apr.msg.WARNING_MSG_COLOR],
        SEND_ACP_SOLICITATION: ['<i class="fa fa-check"></i>', 'Sua solicitação foi atendida.<br>Dentro de instantes você iniciará sua participação.', apr.msg.LOCAL_MSG_COLOR],
        SEND_START_SOLICITATION: ['<i class="fa fa-check"></i>', 'Participação iniciada!<br>Você está transmitindo!', apr.msg.DB_MSG_COLOR],
        NOT_ACP_SOLICITATION: ['<i class="fa fa-times"></i>', 'Sua solicitação foi negada!', apr.msg.ERROR_MSG_COLOR],
        NO_CONNECTION: ['<i class="fa fa-times"></i>', 'Não há conexão com a sala!', apr.msg.ERROR_MSG_COLOR],
        NO_PARTICIPANTS: ['<i class="fa fa-times"></i>', 'Não há participantes para compartilhar arquivos!', apr.msg.ERROR_MSG_COLOR],
        ACCEPT_SOLICITATION: ['<i class="fa fa-times"></i>', 'Já existe uma solicitação aceita!<br>Finalize-a para aceitar outra.', apr.msg.ERROR_MSG_COLOR],
        FORM_ALERT: ['<i class="fa fa-exclamation-triangle fa-lg"></i>', 'Por favor informe todos os campos indicados!', apr.msg.ERROR_MSG_COLOR],
        DEVICE_ALERT: ['<i class="fa fa-exclamation-triangle fa-lg"></i>', 'Por favor selecione os dispositívos a serem utilizados antes de iniciar a sala!', apr.msg.WARNING_MSG_COLOR],
        DEVICE_CONFIGURED: ['<i class="fa fa-check fa-lg"></i>', 'Dispositivos configurados com sucesso!', apr.msg.LOCAL_MSG_COLOR],
        DISCONNECT_USER: ['<i class="fa fa-times"></i>', 'foi desconectado!', apr.msg.ERROR_MSG_COLOR],
        CANCEL_SOLICITATION: ['<i class="fa fa-times"></i>', 'Solicitação cancelada.', apr.msg.ERROR_MSG_COLOR],
        NEW_SOLICITATION: ['<i class="material-icons">pan_tool</i>', 'solicita a vez!', apr.msg.LOCAL_MSG_COLOR],
        ALERT_DISCONNECTION: ['<i class="material-icons left">close</i>', 'Conexão finalizada!', apr.msg.ERROR_MSG_COLOR],
        CAM_OFF: ['<i class="material-icons left">videocam_off</i>', 'Camera Desabilitada.', apr.msg.ERROR_MSG_COLOR],
        CAM_ON: ['<i class="material-icons left">videocam</i>', 'Camera Habilitada.', apr.msg.LOCAL_MSG_COLOR],
        MIC_OFF: ['<i class="material-icons left">mic_off</i>', 'Microfone Desabilitado.', apr.msg.ERROR_MSG_COLOR],
        MIC_ON: ['<i class="material-icons left">mic</i>', 'Microfone Habilitado.', apr.msg.LOCAL_MSG_COLOR],
        VOL_DOWN: ['<i class="material-icons left">volume_off</i>', 'Áudio Desabilitado.', apr.msg.ERROR_MSG_COLOR],
        VOL_UP: ['<i class="material-icons left">volume_up</i>', 'Áudio Habilitado.', apr.msg.LOCAL_MSG_COLOR],
        STOP_SHARE: ['<i class="material-icons left">stop_screen_share</i>', 'Compartilhamento de tela finalizado.', apr.msg.ERROR_MSG_COLOR],
        START_SHARE: ['<i class="material-icons left">screen_share</i>', 'Tela compartilhada.', apr.msg.LOCAL_MSG_COLOR],
        SUCCESS_LOCATION: ['<i class="fa fa-check fa-lg"></i>', 'Localização determinada com sucesso!', apr.msg.DB_MSG_COLOR],
        NOTFOUND_LOCATION: ['<i class="fa fa-times fa-lg"></i>', 'Localização não determinada!', apr.msg.ERROR_MSG_COLOR],
        INVALID_CEP: ['<i class="fa fa-times fa-lg"></i>', 'CEP inválido!', apr.msg.ERROR_MSG_COLOR],
        NOTFOUND_CEP_LOCATION: ['<i class="fa fa-times fa-lg"></i>', 'CEP não localizado!', apr.msg.ERROR_MSG_COLOR],
        SUCCESS_CEP_LOCATION: ['<i class="fa fa-check fa-lg"></i>', 'CEP localizado com sucesso!', apr.msg.LOCAL_MSG_COLOR],
        SUCCESS_SAVE_CLASS: ['<i class="fa fa-check fa-lg"></i>', 'Sala registrada com Sucesso!', apr.msg.DB_MSG_COLOR],
        FAIL_SAVE_CLASS: ['<i class="fa fa-times fa-lg"></i>', 'Falha ao registrar a Sala!', apr.msg.ERROR_MSG_COLOR],
        AUDIO_DEVICE_NOT_FOUND: ['<i class="material-icons left">mic_off</i>', 'Microfone não detectado! Impossível participar.', apr.msg.ERROR_MSG_COLOR],
        VIDEO_DEVICE_NOT_FOUND: ['<i class="material-icons left">videocam_off</i>', 'Câmera não detectada! Impossível participar.', apr.msg.ERROR_MSG_COLOR],
        INVALID_VALUE: ['<i class="fa fa-times fa-lg"></i>', 'Por favor informe um valor válido!', apr.msg.ERROR_MSG_COLOR],
        TK_FOUNDED: ['<i class="material-icons left">usb</i>', 'Token encontrado e validado com sucesso!', apr.msg.LOCAL_MSG_COLOR],
        TK_NOT_FOUND: ['<i class="material-icons left">usb</i>', 'Falha ao validar. Token não encontrado!', apr.msg.ERROR_MSG_COLOR],
        FILE_RECEIVED: ['<i class="fa fa-cloud-download fa-2x left"></i> Arquivo ', ' recebido.', apr.msg.LOCAL_MSG_COLOR],
        DEVICES_MISSING: ['<i class="material-icons left">close</i>', ' Dispositívos de áudio e vídeo não encontrados ou não permitidos!', apr.msg.ERROR_MSG_COLOR],
        DEVICES_BUSY: ['<i class="material-icons left">close</i>', ' Camera ou microfone sendo utilizados por outro processo!', apr.msg.ERROR_MSG_COLOR],
        DEVICES_NOT_FOUND: ['<i class="material-icons left">close</i>', ' Dispositívo de áudio e/ou vídeo não encontrados!', apr.msg.ERROR_MSG_COLOR],
        DEVICES_NOT_ALLOWED: ['<i class="material-icons left">close</i>', ' Acesso negado ao microfone e/ou à camera!', apr.msg.ERROR_MSG_COLOR],
        DEVICES_REQUIRED: ['<i class="material-icons left">close</i>', ' Áudio/Vídeo requeridos', apr.msg.ERROR_MSG_COLOR],
        ATTENDANCE_CONFIRM: ['<i class="fa fa-check-square-o"></i>', 'Confirme os espectadores presentes!', apr.msg.LOCAL_MSG_COLOR],
        ATTENDANCE_SEND_SUCCESS: ['<i class="fa fa-check"></i>', 'Lista enviada com sucesso!', apr.msg.DB_MSG_COLOR],
        ATTENDANCE_CONFIRM_SUCCESS: ['<i class="fa fa-check"></i>', 'Confirmação realizada com sucesso!', apr.msg.LOCAL_MSG_COLOR],
        ATTENDANCE_SEND_FAIL: ['<i class="material-icons left">close</i>', 'Falha ao enviar listagem!', apr.msg.ERROR_MSG_COLOR],
        ATTENDANCE_CONFIRM_FAIL: ['<i class="material-icons left">close</i>', 'Falha ao confirmar lstagem!', apr.msg.ERROR_MSG_COLOR],
    }
}

const dom = {
    /* Elementos dinâmicos do DOM */
    ADDRESS: '#address',
    ALERT_SHARE: '#alert-share',
    ASSUNTO: '#assunto',
    ATTENDANCE_ATTEND: '.attendance_list_attend',
    ATTENDANCE_CLASS: '.attendance_list_class',
    ATTENDANCE_ID: '.attendance_list_id',
    BG_DARK: '#bgdark',
    BROADCASTER: '#broadcaster',
    BROADCASTING_INFO: '#broadcastingInfo',
    BTN_CONF_DEVICES: '#btn-conf-devices',
    BTN_FILE_SHARING: '#file-sharing',
    BTN_SEND_MSG: '#send-message-btn',
    BTN_SUBMIT: 'button[type="submit"]',
    BTN_START_ROOM: '#btn-join-as-productor',
    CALL_SEND: '#call-send-files',
    CALL_SEND_MIN: '#call-send-min',
    CALL_RECEIVE: '#call-receive-files',
    CALL_RECEIVE_MIN: '#call-receive-min',
    CALL_TK: '#call-token',
    CAM: '#toggle-camera',
    CHAMADA: '#attendance',
    CHANGE_ATTEND: '.changeAttend',
    CLASS_LIST: '#btn-open-classlist',
    CITY: '#city',
    CHAT_PANEL: '#chat-panel',
    CHAT_TEXTAREA: '#chat-textarea',
    CLASS_RESPONSES: '.responses',
    CLASS_TITLE: '#class-title',
    CLOSE_PARTICIPATION: '#close-participation',
    COLLAPSIBLE: '.collapsible',
    CONFIRM_ATTENDANCE: '#confirmAttendance',
    CONFIRM_ATTENDANCE_ID: 'confirmAttendance',
    CONFIRM_DEVICES: '#confirmDevices',
    CONNECTION_LIST: '#connection-list',
    COUNT_RECEIVE_FILES: '#count-receive-files',
    COUNT_SEND_FILES: '#count-send-files',
    COUNT_PEDIR: '#count-pedir-vez',
    COUNTDOWN: '#countdown',
    CTL_PEDIR: '#control-pedir-vez',
    CURRENT_HOUR: '#currentHour',
    CURRENT_MIN: '#currentMin',
    CURRENT_SEC: '#currentSec',
    CURRENT_TIME: '#current-time',
    CURRENT_USERS: '#current-users',
    CURSO_LIST: '#cursos-list',
    DISCONNECT_BTN: '.disconnect-btn',
    DIV_BTN_END: '#div-end',
    DIV_CONNECT: '#div-connect',
    DIV_CONTROLLER: '#div-controller',
    DIV_DOWNLOAD_VIDEO: '#div-download-video',
    DIV_ENTER: '#div-enter',
    DIV_EXIT_FSCREEN: '#div-exit-fullscreen',
    DIV_FILE_SHARING: '#div-file-sharing',
    DIV_INCOMING_VIDEO: '#div-incoming-videos',
    DIV_MAIN_VIDEO: '#div-main-video',
    DIV_RECEIVE_FILES: '#receive-files',
    DIV_SEND_FILES: '#div-sended-files',
    DIV_UPLOADED_FILES: '#send-files',
    DOWNLOAD_VIDEO: '#download-video',
    DROPDOWN_TRG: '.dropdown-trigger',
    EMBEDDED_FRAME: '#embedded-container-iframe',
    EMBEDDED_FRAME_II: '#embedded-container-iframe-v2',
    EMBEDDED_FRAME_III: '#embedded-container-iframe-v3',
    END_SESSION_ACCESS: '#end-session',
    ERROR_LEVEL: '#error_level',
    EXIT_SCREEN: '#exit-fullscreen',
    FILE_EXP: '#exp-files',
    FILE_LIST_SENDED: '#view-send-files',
    FILE_LIST_REICEIVED: '#view-receive-files',
    FILE_MIN: '#min-files',
    FILE_SIDE_BAR: '#files-side-bar',
    FILE_TRANSFERING: '#file-transfering',
    FINISH: '#finish_btn',
    FIRST_VIDEO: '#video-preview',
    FRAME_LAYER: '#embedded_player',
    FRAME_LAYER_II: '#embedded_player_v2',
    FRAME_LAYER_III: '#embedded_player_v3',
    IN_ROOM: '#in-room',
    IN_SCREEN: '#in-screen',
    INCOMMING_VIDEO: '#video-preview-incoming',
    INCOMMING_VIDEO_PARTICIPANT: '#incommingVideo-participant',
    INCOMMING_VIDEO_SCREEN: '#incommingVideo-screen',
    INFORM_VIEWS: '#informViews',
    LABEL_USERS: '#users-counter',
    LI_CAM: '#li-toggle-camera',
    LI_FILE_SHARE: '#li-sharing-file',
    LI_MUTE: '#li-toggle-mute',
    LI_PERDIR: '#li-pedir-vez',
    LI_SHARE: '#li-share-screen',
    LI_SCREEN: '#li-toggle-screen',
    LI_VOLUME: '#li-toggle-volume',
    LIST_AUDIO: '#audio_list',
    LIST_VIDEO: '#video_list',
    LOAD_ELEM: ".load",
    LOAD_CANCEL_ELEM: ".load-cancel",
    LOAD_POSITION_ELEM: "#centralized",
    LOAD_LAYER_ELEM: "#fglayer",
    LOCATION: '#location',
    LOCK: '#lock',
    LOCK_CEP: '#lockcep',
    MAIN_VIDEO_ID: 'video-preview',
    MATERIA: '#tema',
    MIN_SEND: '#min-send-files',
    MIN_RECEIVE: '#min-receive-files',
    MODAL: '.modal',
    MODAL_USERS: '#msg-informa-espectadores',
    MSG_SHARE: '#msg-share',
    MUTE: '#toggle-mute',
    NAME: '#current-user',
    NUMBER: '#number',
    NUMBER_VIEWS: '#numViews',
    PAGE_MAIN_CONTENT: '#main-content',
    PARTICIPATION_CONTROL: '#participation-control',
    PARTICIPATION_MUTE: '#participation-mute',
    PARTICIPATION_NAME: '#participation-name',
    PARTICIPATION_SWAP: '#participation-swap',
    PEDIR: '#pedir-vez',
    PIC_CLASS_IMG: '#classImg',
    PIC_CLASS_PHOTO: '#classPhoto',
    PIC_CLASS_TAKE_SHOT: '#takeShot',
    PIC_CLASS_VIDEO: '#classVideo',
    PLAY_IT: '#playit',
    PLAY_SCREEN: '#playscreen',
    PLAY_PARTICIPANT: '#playparticipant',
    POSTAL: '#postal',
    PRE_APRESENTACAO: '#preApresentacao',
    PRE_LOAD_APRESENTACAO: '#preLoaderPresentation',
    PRE_LOAD_VIDEO: '#preLoaderVideo',
    PRE_VIDEO: '#preVideo',
    PRE_VIDEO_FINISHED: '#preVideoFinished',
    PREVIEW: '#video-preview-broadcaster',
    PUBLIC_CONFERENCE: '#public-conference',
    PUBLISH_PARTICIPANT: '#publish_participant',
    RECORDING: '#recording',
    REMOTE_VIDEO: '#remoteVideo',
    REMOTE_VIDEO_ID: 'remoteVideo',
    REQUIRED: '[required]',
    ROOM: '#room-id',
    ROOM_LOBBY: '#initial-access',
    ROOM_STATUS: '#room-status',
    ROOM_TYPE: '#room-type',
    SCREEN: '#toggle-screen',
    SCREEN_CONTROL: '#screen-control',
    SCREEN_NAME: '#screen-name',
    SCREEN_SWAP: '#screen-swap',
    SCRIPT: 'script',
    SEARCH: '#search-input',
    SECOND_VIDEO: '#secondvideo-preview',
    SECOND_VIDEO_ID: 'secondvideo-preview',
    SELECT: 'select',
    SESSION_ACCESS: '#enter-session',
    SHARE: '#share-screen',
    SHARE_ALERT: '#screen-share-alert',
    SHARED_FILE: '.shared-file',
    SHOW_PREVIEW: '#show-preview',
    SIDE_NAVBAR: '#slide-out',
    SIDENAV: '.sidenav',
    SOL_LIST: '#solicita-list',
    SOL_PEDIR: '#sol-pedir',
    SOL_RESPONSE: '.sol-response',
    START_TRANSMITION: '#start-transmition',
    START_VIEW: '#startView',
    STREET: '#st',
    SUCCESS_LEVEL: '#success_level',
    SWAP_SECOND: '#swap-video',
    TARGET: '#target',
    TEXT_MESSAGE: '#text-message',
    THIRD_VIDEO: '#thirdvideo-preview',
    THIRD_VIDEO_ID: 'thirdvideo-preview',
    TK_DETECT: '#token_Detection',
    //TK_OBJ: '#token',
    TK_OBJ: 'meta[name="csrf-token"]',
    TK_ON: '#tokenOn',
    TK_OFF: '#tokenOff',
    TOGGLE_CHAT: '#toggle-chat',
    TOGGLE_VIDEO_SIZE: '#toggle-size',
    TOOLTIP_ENABLE_SOUND: '#enable-sound',
    TOOLTIPED: '.tooltipped',
    TURMA_HASH: '#turmaHash',
    UL_CON_USERS: '#connected-users',
    URL: '#url',
    URL_CEP: '#urlcep',
    USERS_LIST: '#connected-users-list',
    VERSION: '#version',
    VIDEO_MAIN: '#span-video-preview',
    VIDEO_SECOND: '#span-video-preview-2nd',
    VIDEO_THIRD: '#span-video-preview-3rd',
    VIDEOS: '#videos',
    VIDEOS_PANEL: '#video-panel',
    VOL: '#toggle-volume',
    WAITING_LINK: '#waitingLinkFile'
}

const misc = {
    /* Atributos gerais muito utilizados com funcionalidades variádas (MISCELÂNEA) */
    /*Atributos de elementos do DOM */
    ATTR_ACTIVE: 'data-active',
    ATTR_CONDITION: 'data-condition',
    ATTR_POSTER: 'poster',
    ATTR_SOLICITATION: 'data-sender',
    ATTR_USER_ANNOUNCE: 'data-announced',
    ATTR_USER_TYPE: 'data-target',
    /*Classes de estilo CSS */
    CLASS_ERROR_COLOR: apr.msg.ERROR_MSG_COLOR,
    CLASS_INVISIBLE: 'obj-invisible',
    CLASS_MAIN_CONTAINER: 'main-container',
    CLASS_MAIN_CONTAINER_FULL: 'main-container-full',
    CLASS_SUCCESS_COLOR: apr.msg.LOCAL_MSG_COLOR,
    CLASS_VISIBLE: 'obj-visible',
    CLASS_WIDTH_LIMIT: 'width-limit',
    CLASS_WIDTH_LIMIT_NO: 'width-no-limit',
    /*Elementos HTML para caixas de mensagens */
    DEFAULT_MSGBOX_IN: '<p class="chat-out blue" align="right">',
    DEFAULT_MSGBOX_OUT: '<p class="chat-in cyan">',
    /* Elementos vizuais padrões */
    DEFAULT_SELECT_DEVICE: '<option value="" disabled selected>Selecione um dispositivo</option>',
    /*Ícones */
    ICON_CAM_OFF: '<i class="material-icons">videocam_off</i>',
    ICON_CAM_ON: '<i class="material-icons">videocam</i>',
    ICON_CLOUD_UPLOAD: '<i class="fa fa-cloud-upload"></i>',
    ICON_ERROR: '<i class="fa fa-times fa-lg"></i>',
    ICON_END_ROOM: '<i class="fa fa-sign-out fa-2x"></i>',
    ICON_END_TRANSMITION: '<i class="fa fa-times fa-2x"></i>',
    ICON_FA_HOME: '<i class="fa fa-home fa-lg"></i>',
    ICON_FA_TV: '<i class="fa fa-television blue-text"></i>',
    ICON_FA_VIDEOCAM: '<i class="fa fa-video-camera blue-text"></i>',
    ICON_MIC: '<i class="material-icons">mic</i>',
    ICON_MUTE_MIC: '<i class="material-icons">mic_off</i>',
    ICON_PLAY: '<i class="material-icons large">play_arrow</i>',
    ICON_PLAY_CIRCLE: '<i class="material-icons medium">play_circle_outline</i>',
    ICON_REMOVE_DISABLED: '<i class="material-icons grey-text text-lighten-1">remove_circle_outline</i>',
    ICON_REMOVE_USER: '<i class="material-icons red-text text-darken-4">highlight_off</i>',
    ICON_SHARE_OFF: '<i class="material-icons">stop_screen_share</i>',
    ICON_SHARE_ON: '<i class="material-icons">screen_share</i>',
    ICON_SUCCESS: '<i class="fa fa-check fa-lg"></i>',
    ICON_SWAP: '<i class="material-icons">swap_horiz</i>',
    ICON_VOL_OFF: '<i class="material-icons">volume_off</i>',
    ICON_VOL_ON: '<i class="material-icons">volume_up</i>',
    /*Títulos */
    TITLE_END_ROOM: "Sair da sala",
    TITLE_END_TRANSMITION: "Finalizar Transmissão",
    TITLE_FINISH_ROOM: "Finalizar Sala",
    /*Atribuição CSS */
    STYLE_HEIGHT_INHERIT: 'inherit',
    /*Cores */
    DISABLED_COLOR: 'grey',
    HILIGHT_COLOR: 'cyan',
    OFF_COLOR: 'red',
    ON_COLOR: 'blue',
    TURNOFF_COLOR: 'black',
    /*Elementos HTML */
    ATTEND_IN: '<span class="green-text">Presente</span>',
    ATTEND_OUT: '<span class="red-text text-darken-3">Ausente</span>'
}

/*Configurações gerais carregadas via JSON */
//const jFile = `http://localhost/js/conf/config.json`;
//const cfg = $.getJSON(jFile);

//URL: 'https://rtcmulticonnection.herokuapp.com:443/',
//URL: 'https://webrtcweb.com:9001/'
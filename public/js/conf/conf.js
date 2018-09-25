/**
 * Definições de configuração para INICIALIZAÇÃO de componentes JS
 * const doc: definições de métodos e atributos básicos de manipulação do documento;
 * const conf: definições de elementos para inicialização;
 * const dom: elementos gerais do DOM;
 * const misc: elementos visuais de uso geral;
 */

/*Configurações gerais carregadas via JSON */
//const jFile = `http://localhost/js/conf/config.json`;
//const cfg = $.getJSON(jFile);

const doc = {

    TAG: document.querySelector.bind(document),
    ALL: document.querySelectorAll.bind(document),
    ADD: document.createElement.bind(document),
    ID: document.getElementById.bind(document),
    IDLE_TIME: 240,
    COOKIE_LIFETIME: 365,
    COOKIE_AUDIO_DEVICE: "audioDevice",
    COOKIE_VIDEO_DEVICE: "videoDevice",
    URL_SALAS_SAVE: `${location.origin}/salas/salvar`,
    URL_SALAS_UPDATE: `${location.origin}/salas/update`,
    VERSION: "1.1.0.80"
}

const apr = {

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
        VIEWER: 'Calculando...',
        FORM: 'Verificando...',
        USER: '',
        SOLICITA: 0,
        BROADCAST_STATUS: 0,
        IS_MODERATOR: true,
        ON_LOBBY: true,
        ON_PARTICIPATION: false,
        LOCK_SOLICITATION: false,
        SINGLE_CON: false,
        FILE_SHARING: true,
        WAITING_FOR_VIDEO: 'waiting',
        NUMBER_OF_ROOMS: 0,
        POSTER_IMG: '/img/bg.jpg',
        NAV_EDGE: 'left'
    },
    con: {
        /*Constantes de configuração de inicialização de CONEXÃO */
        BAND_AUDIO: 200,
        BAND_VIDEO: 400,
        DIRECTION: 'one-to-many',
        IS_BROADCAST: true,
        IS_PUBLIC: true,
        MAX_RELAY: 0,
        MSG: 'Inicia-Apresentacao',
        SESSION_AUDIO: true,
        SESSION_VIDEO: {
            mandatory: {
                minFrameRate: 30
            }
        },
        SESSION_DATA: true,
        SESSION_BROADCAST: true,
        SESSION_ONEWAY: true,
        SHARE_DENIED: 'permission-denied',
        URL: 'https://sig.lrbtecnologia.com:8080/',
        //URL: 'https://rtcmulticonnection.herokuapp.com:443/'
    },
    socket: {
        /*Constantes de padronização de mensagens SOCKET.IO */
        MSG_JOIN: 'join-broadcaster',
        MSG_REJOIN: 'rejoin-broadcast',
        MSG_CHK_PRESENCE: 'check-broadcast-presence',
        MSG_JOIN_BROADCAST: 'join-broadcast',
        MSG_BROADCAST_STOP: 'broadcast-stopped',
        MSG_BROADCAST_START: 'start-broadcasting',
        MSG_LEAVE_ROOM: 'leave-the-room'
    },
    datacls: {
        /*Atributos de inicialização de SALAS para espectadores */
        ADMIN_ACCESS: 'ADMIN',
        ALLOWED: false,
        COUNT_ROOMS: 0
    },
    req: {
        /*Padrão de mensagens de chat com REQUISIÇÕES/RESPOSTAS a ações */
        PEDE_VEZ: '@PedeAVez',
        RESP_PEDE_VEZ: '@PedeAVez:',
        END_SHARE: '@Finaliza-Share',
        END_PARTICIPATION: '@Finaliza-Participacao',
        END_PARTICIPANT: '@Finaliza-Participante',
        RECEIVE_FILE: '@Receive-File',
    },
    message: {
        /*Tempo padrão de exibição das MENSAGENS de toast */
        TIMEOUT: 2000,
        /*Atributos para formação de MENSAGENS padronizadas: array[ícone(html), texto(html), cor de fundo(classes MaterializeCSS)] */
        CHAT_MESSAGE: ['<div align="right"><i class="fa fa-comment-o white-text"></i>', '</div>', 'grey darken-2'],
        START_TRANSMITION: ['<i class="fa fa-play-circle fa-lg"></i>', 'Transmissão iniciada!', apr.msg.LOCAL_MSG_COLOR],
        END_TRANSMITION: ['<i class="fa fa-stop-circle fa-lg"></i>', 'Transmissão finalizada!', apr.msg.ERROR_MSG_COLOR],
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
        ALERT_DISCONNECTION: ['<i class="fa fa-times"></i>', 'Você foi desconectado!', apr.msg.ERROR_MSG_COLOR],
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
        AUDIO_DEVICE_NOT_FOUND: ['<i class="material-icons left">mic_off</i>', 'Microfone não detectado!', apr.msg.ERROR_MSG_COLOR],
        VIDEO_DEVICE_NOT_FOUND: ['<i class="material-icons left">videocam_off</i>', 'Câmera não detectada!', apr.msg.ERROR_MSG_COLOR],
        INVALID_VALUE: ['<i class="fa fa-times fa-lg"></i>', 'Por favor informe um valor válido!', apr.msg.ERROR_MSG_COLOR],

    }
}

const dom = {
    /* Elementos dinâmicos do DOM */
    ADDRESS: '#address',
    ALERT_SHARE: '#alert-share',
    ASSUNTO: '#assunto',
    BG_DARK: '#bgdark',
    BROADCASTER: '#broadcaster',
    BTN_CONF_DEVICES: '#btn-conf-devices',
    BTN_FILE_SHARING: '#file-sharing',
    BTN_SEND_MSG: '#send-message-btn',
    BTN_SUBMIT: 'button[type="submit"]',
    BTN_START_ROOM: '#btn-join-as-productor',
    CALL_SEND: '#call-send-files',
    CALL_SEND_MIN: '#call-send-min',
    CALL_RECEIVE: '#call-receive-files',
    CALL_RECEIVE_MIN: '#call-receive-min',
    CAM: '#toggle-camera',
    CITY: '#city',
    CHAT_PANEL: '#chat-panel',
    CHAT_TEXTAREA: '#chat-textarea',
    CLASS_RESPONSES: '.responses',
    CLASS_TITLE: '#class-title',
    COLLAPSIBLE: '.collapsible',
    CONFIRM_DEVICES: '#confirmDevices',
    CONNECTION_LIST: '#connection-list',
    COUNT_RECEIVE_FILES: '#count-receive-files',
    COUNT_SEND_FILES: '#count-send-files',
    COUNT_PEDIR: '#count-pedir-vez',
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
    DIV_ENTER: '#div-enter',
    DIV_EXIT_FSCREEN: '#div-exit-fullscreen',
    DIV_FILE_SHARING: '#div-file-sharing',
    DIV_INCOMING_VIDEO: '#div-incoming-videos',
    DIV_MAIN_VIDEO: '#div-main-video',
    DIV_RECEIVE_FILES: '#receive-files',
    DIV_SEND_FILES: '#div-sended-files',
    DIV_UPLOADED_FILES: '#send-files',
    DROPDOWN_TRG: '.dropdown-trigger',
    END_SESSION_ACCESS: '#end-session',
    ERROR_LEVEL: '#error_level',
    EXIT_SCREEN: '#exit-fullscreen',
    FILE_EXP: '#exp-files',
    FILE_LIST: '#file-list',
    FILE_MIN: '#min-files',
    FILE_SIDE_BAR: '#files-side-bar',
    FILE_TRANSFERING: '#file-transfering',
    FIRST_VIDEO: '#video-preview',
    IN_ROOM: '#in-room',
    IN_SCREEN: '#in-screen',
    INFORM_VIEWS: '#informViews',
    LABEL_USERS: '#users-counter',
    LI_CAM: '#li-toggle-camera',
    LI_FILE_SHARE: '#li-sharing-file',
    LI_MUTE: '#li-toggle-mute',
    LI_PERDIR: '#li-pedir-vez',
    LI_SHARE: '#li-share-screen',
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
    PEDIR: '#pedir-vez',
    POSTAL: '#postal',
    PREVIEW: '#video-preview-broadcaster',
    PUBLIC_CONFERENCE: '#public-conference',
    REQUIRED: '[required]',
    ROOM: '#room-id',
    ROOM_LOBBY: '#initial-access',
    ROOM_STATUS: '#room-status',
    ROOM_TYPE: '#room-type',
    SCREEN: '#toggle-screen',
    SCRIPT: 'script',
    SEARCH: '#search-input',
    SECOND_VIDEO: '#secondvideo-preview',
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
    STREET: '#st',
    SUCCESS_LEVEL: '#success_level',
    SWAP_SECOND: '#swap-video',
    TARGET: '#target',
    TEXT_MESSAGE: '#text-message',
    THIRD_VIDEO: '#thirdvideo-preview',
    TOGGLE_CHAT: '#toggle-chat',
    TOGGLE_VIDEO_SIZE: '#toggle-size',
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
    VIDEOS_PANEL: '#video-panel',
    VOL: '#toggle-volume'
}

const misc = {
    /* Atributos gerais muito utilizados com funcionalidades variádas (MISCELÂNEA) */
    /*Cores */
    DISABLED_COLOR: 'grey',
    ON_COLOR: 'blue',
    OFF_COLOR: 'red',
    HILIGHT_COLOR: 'cyan',
    TURNOFF_COLOR: 'black',
    /*Classes de estilo CSS */
    CLASS_ERROR_COLOR: apr.msg.ERROR_MSG_COLOR,
    CLASS_INVISIBLE: 'obj-invisible',
    CLASS_VISIBLE: 'obj-visible',
    CLASS_WIDTH_LIMIT: 'width-limit',
    CLASS_WIDTH_LIMIT_NO: 'width-no-limit',
    CLASS_MAIN_CONTAINER: 'main-container',
    CLASS_MAIN_CONTAINER_FULL: 'main-container-full',
    CLASS_SUCCESS_COLOR: apr.msg.LOCAL_MSG_COLOR,
    /*Atribuição CSS */
    STYLE_HEIGHT_INHERIT: 'inherit',
    /*Atributos de elementos do DOM */
    ATTR_SOLICITATION: 'data-sender',
    ATTR_USER_TYPE: 'data-target',
    ATTR_USER_ANNOUNCE: 'data-announced',
    ATTR_POSTER: 'poster',
    /*Ícones */
    ICON_CAM_ON: '<i class="material-icons">videocam</i>',
    ICON_CAM_OFF: '<i class="material-icons">videocam_off</i>',
    ICON_CLOUD_UPLOAD: '<i class="fa fa-cloud-upload"></i>',
    ICON_ERROR: '<i class="fa fa-times fa-lg"></i>',
    ICON_FA_HOME: '<i class="fa fa-home fa-lg"></i>',
    ICON_FA_TV: '<i class="fa fa-television blue-text"></i>',
    ICON_FA_VIDEOCAM: '<i class="fa fa-video-camera blue-text"></i>',
    ICON_MIC: '<i class="material-icons">mic</i>',
    ICON_MUTE_MIC: '<i class="material-icons">mic_off</i>',
    ICON_PLAY: '<i class="material-icons large">play_arrow</i>',
    ICON_PLAY_CIRCLE: '<i class="material-icons medium">play_circle_outline</i>',
    ICON_SHARE_ON: '<i class="material-icons">screen_share</i>',
    ICON_SHARE_OFF: '<i class="material-icons">stop_screen_share</i>',
    ICON_SUCCESS: '<i class="fa fa-check fa-lg"></i>',
    ICON_VOL_ON: '<i class="material-icons">volume_up</i>',
    ICON_VOL_OFF: '<i class="material-icons">volume_off</i>',
    /*Elementos HTML para caixas de mensagens */
    DEFAULT_MSGBOX_OUT: '<p class="chat-in blue">',
    DEFAULT_MSGBOX_IN: '<p class="chat-out grey" align="right">',
    /* Elementos vizuais padrões */
    DEFAULT_SELECT_DEVICE: '<option value="" disabled selected>Selecione um dispositivo</option>'
}
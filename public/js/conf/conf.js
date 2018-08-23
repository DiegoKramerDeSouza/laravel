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
    IDLE_TIME: 120,
    COOKIE_LIFETIME: 365,
    COOKIE_AUDIO_DEVICE: "audioDevice",
    COOKIE_VIDEO_DEVICE: "videoDevice"
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
        POSTER_IMG: '/img/bg.jpg'
    },
    con: {
        /*Constantes de configuração de inicialização de CONEXÃO */
        BAND_AUDIO: 200,
        BAND_VIDEO: 300,
        DIRECTION: 'one-to-many',
        IS_BROADCAST: true,
        IS_PUBLIC: true,
        MAX_RELAY: 0,
        MSG: 'Inicia-Apresentacao',
        SESSION_AUDIO: true,
        SESSION_VIDEO: true,
        SESSION_DATA: true,
        SESSION_BROADCAST: true,
        SESSION_ONEWAY: true,
        SHARE_DENIED: 'permission-denied',
        //URL: 'https://webrtcweb.com:9559/',
        URL: 'https://rtcmulticonnection.herokuapp.com:443/'
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
        CHAT_MESSAGE: ['<div align="right"><i class="fa fa-comment-o blue-text"></i>', '</div>', 'grey darken-4'],
        START_TRANSMITION: ['<i class="fa fa-play-circle fa-lg"></i>', 'Transmissão iniciada!', 'blue darken-1'],
        END_TRANSMITION: ['<i class="fa fa-stop-circle fa-lg"></i>', 'Transmissão finalizada!', 'red darken-4'],
        START_PARTICIPATION: ['<i class="material-icons">videocam</i>', 'Participação iniciada!', 'blue darken-1'],
        END_PARTICIPATION: ['<i class="material-icons left">videocam_off</i>', 'Participação Finalizada!', 'red darken-4'],
        SEND_SOLICITATION: ['<i class="fa fa-check"></i>', 'Solicitação enviada!', 'blue darken-1'],
        ERROR_SOLICITATION: ['<i class="fa fa-times"></i>', 'Não foi possível solicitar a vez.', 'red darken-4'],
        DUP_SOLICITATION: ['<i class="fa fa-exclamation-triangle"></i>', 'Você já encaminhou uma solicitação.<br>Aguarde a resposta.', 'amber darken-4'],
        ERR_ACP_SOLICITATION: ['<i class="fa fa-exclamation-triangle"></i>', 'Sua solicitação já foi aceita.<br>Você não pode efetuar uma nova solicitação até finalizar esta.', 'amber darken-4'],
        SEND_ACP_SOLICITATION: ['<i class="fa fa-check"></i>', 'Sua solicitação foi atendida.<br>Dentro de instantes você iniciará sua participação.', 'blue darken-1'],
        SEND_START_SOLICITATION: ['<i class="fa fa-check"></i>', 'Participação iniciada!<br>Você está transmitindo!', 'light-green'],
        NOT_ACP_SOLICITATION: ['<i class="fa fa-times"></i>', 'Sua solicitação foi negada!', 'red darken-4'],
        NO_CONNECTION: ['<i class="fa fa-times"></i>', 'Não há conexão com a sala!', 'red darken-4'],
        NO_PARTICIPANTS: ['<i class="fa fa-times"></i>', 'Não há participantes para compartilhar arquivos!', 'red darken-4'],
        ACCEPT_SOLICITATION: ['<i class="fa fa-times"></i>', 'Já existe uma solicitação aceita!<br>Finalize-a para aceitar outra.', 'red darken-4'],
        FORM_ALERT: ['<i class="fa fa-exclamation-triangle fa-lg"></i>', 'Por favor informe todos os campos indicados!', 'red darken-4'],
        DEVICE_ALERT: ['<i class="fa fa-exclamation-triangle fa-lg"></i>', 'Por favor selecione os dispositívos a serem utilizados antes de iniciar a sala!', 'red darken-4'],
        DEVICE_CONFIGURED: ['<i class="fa fa-check fa-lg"></i>', 'Dispositivos configurados com sucesso!', 'blue darken-1'],
        DISCONNECT_USER: ['<i class="fa fa-times"></i>', 'foi desconectado!', 'red darken-4'],
        CANCEL_SOLICITATION: ['<i class="fa fa-times"></i>', 'Solicitação cancelada.', 'red darken-4'],
        NEW_SOLICITATION: ['<i class="material-icons">pan_tool</i>', 'solicita a vez!', 'blue darken-1'],
        ALERT_DISCONNECTION: ['<i class="fa fa-times"></i>', 'Você foi desconectado!', 'red darken-4'],
        CAM_OFF: ['<i class="material-icons left">videocam_off</i>', 'Camera Desabilitada.', 'red darken-4'],
        CAM_ON: ['<i class="material-icons left">videocam</i>', 'Camera Habilitada.', 'blue darken-1'],
        MIC_OFF: ['<i class="material-icons left">mic_off</i>', 'Microfone Desabilitado.', 'red darken-4'],
        MIC_ON: ['<i class="material-icons left">mic</i>', 'Microfone Habilitado.', 'blue darken-1'],
        VOL_DOWN: ['<i class="material-icons left">volume_off</i>', 'Áudio Desabilitado.', 'red darken-4'],
        VOL_UP: ['<i class="material-icons left">volume_up</i>', 'Áudio Habilitado.', 'blue darken-1'],
        STOP_SHARE: ['<i class="material-icons left">stop_screen_share</i>', 'Compartilhamento de tela finalizado.', 'red darken-4'],
        START_SHARE: ['<i class="material-icons left">screen_share</i>', 'Tela compartilhada.', 'blue darken-1'],
        SUCCESS_LOCATION: ['<i class="fa fa-check fa-lg"></i>', 'Localização determinada com sucesso!', 'light-green'],
        NOTFOUND_LOCATION: ['<i class="fa fa-times fa-lg"></i>', 'Localização não determinada!', 'red darken-4'],
        INVALID_CEP: ['<i class="fa fa-times fa-lg"></i>', 'CEP inválido!', 'red darken-4'],
        NOTFOUND_CEP_LOCATION: ['<i class="fa fa-times fa-lg"></i>', 'CEP não localizado!', 'red darken-4'],
        SUCCESS_CEP_LOCATION: ['<i class="fa fa-check fa-lg"></i>', 'CEP localizado com sucesso!', 'light-green'],
    }
}

const dom = {
    /* Elementos do DOM mais utilizados */
    ADDRESS: '#address',
    ASSUNTO: '#assunto',
    BROADCASTER: '#broadcaster',
    BTN_CONF_DEVICES: '#btn-conf-devices',
    BTN_FILE_SHARING: '#file-sharing',
    BTN_SEND_MSG: '#send-message-btn',
    BTN_SUBMIT: 'button[type="submit"]',
    BTN_START_ROOM: '#btn-join-as-productor',
    CAM: '#toggle-camera',
    CITY: '#city',
    CHAT_PANEL: '#chat-panel',
    CHAT_TEXTAREA: '#chat-textarea',
    CLASS_RESPONSES: '.responses',
    CLASS_TITLE: '#class-title',
    COLLAPSIBLE: '.collapsible',
    CONFIRM_DEVICES: '#confirmDevices',
    CONNECTION_LIST: '#connection-list',
    COUNT_PEDIR: '#count-pedir-vez',
    CTL_PEDIR: '#control-pedir-vez',
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
    EXIT_SCREEN: '#exit-fullscreen',
    FILE_TRANSFERING: '#file-transfering',
    FIRST_VIDEO: '#video-preview',
    IN_ROOM: '#in-room',
    IN_SCREEN: '#in-screen',
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
    MSG_SHARE: '#msg-share',
    MODAL: '.modal',
    MUTE: '#toggle-mute',
    NAME: '#current-user',
    NUMBER: '#number',
    PAGE_MAIN_CONTENT: '#main-content',
    PEDIR: '#pedir-vez',
    POSTAL: '#postal',
    PUBLIC_CONFERENCE: '#public-conference',
    REQUIRED: '[required]',
    ROOM: '#room-id',
    ROOM_LOBBY: '#initial-access',
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
    SIDE_NAVBAR: '#slide-out',
    SIDENAV: '.sidenav',
    SOL_LIST: '#solicita-list',
    SOL_PEDIR: '#sol-pedir',
    SOL_RESPONSE: '.sol-response',
    STREET: '#st',
    SWAP_SECOND: '#swap-video',
    TARGET: '#target',
    TEXT_MESSAGE: '#text-message',
    THIRD_VIDEO: '#thirdvideo-preview',
    TOGGLE_CHAT: '#toggle-chat',
    TOGGLE_VIDEO_SIZE: '#toggle-size',
    TOOLTIPED: '.tooltipped',
    UL_CON_USERS: '#connected-users',
    URL: '#url',
    URL_CEP: '#urlcep',
    USERS_LIST: '#connected-users-list',
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
    CLASS_INVISIBLE: 'obj-invisible',
    CLASS_VISIBLE: 'obj-visible',
    CLASS_WIDTH_LIMIT: 'width-limit',
    CLASS_MAIN_CONTAINER: 'main-container',
    CLASS_MAIN_CONTAINER_FULL: 'main-container-full',
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
    ICON_FA_TV: '<i class="fa fa-television blue-text"></i>',
    ICON_FA_VIDEOCAM: '<i class="fa fa-video-camera blue-text"></i>',
    ICON_MIC: '<i class="material-icons">mic</i>',
    ICON_MUTE_MIC: '<i class="material-icons">mic_off</i>',
    ICON_PLAY: '<i class="material-icons large">play_arrow</i>',
    ICON_PLAY_CIRCLE: '<i class="material-icons medium">play_circle_outline</i>',
    ICON_SHARE_ON: '<i class="material-icons">screen_share</i>',
    ICON_SHARE_OFF: '<i class="material-icons">stop_screen_share</i>',
    ICON_VOL_ON: '<i class="material-icons">volume_up</i>',
    ICON_VOL_OFF: '<i class="material-icons">volume_off</i>',
    /*Elementos HTML para caixas de mensagens */
    DEFAULT_MSGBOX_OUT: '<p class="chat-in blue">',
    DEFAULT_MSGBOX_IN: '<p class="chat-out grey" align="right">',
    /* Elementos vizuais padrões */
    DEFAULT_SELECT_DEVICE: '<option value="" disabled selected>Selecione um dispositivo</option>'
}
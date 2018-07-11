/**
 * Definições de configuração para INICIALIZAÇÃO de componentes JS
 */
const conf = {

    structure: {
        /*Atributos de inicialização da estrutura do documento de salas */
        VIEWER: 'Calculando...',
        USER: '',
        SOLICITA: 0,
        BROADCAST_STATUS: 0,
        IS_MODERATOR: true,
        ON_LOBBY: true,
        ON_PARTICIPATION: false,
        LOCK_SOLICITATION: false,
        WAITING_FOR_VIDEO: 'waiting'
    },
    con: {
        /*Constantes de inicialização de conexão */
        URL: 'https://rtcmulticonnection.herokuapp.com:443/',
        IS_BROADCAST: true,
        MAX_RELAY: 0,
        MSG: 'Inicia-Apresentacao',
        IS_PUBLIC: true
    },
    roomdata: {
        /*Atributos de inicialização por espectadores */
        COUNT_ROOMS: 0,
        ALLOWED: false
    },
    message: {
        /*Atributos para formação de mensagens padronizadas: [ícone(html), texto, cor de fundo] */
        CHAT_MESSAGE: ['<div align="right"><i class="fa fa-comment-o blue-text"></i>', '</div>', 'grey darken-4'],
        START_TRANSMITION: ['<i class="fa fa-play-circle fa-lg"></i>', 'Transmissão iniciada!', 'blue darken-1'],
        END_TRANSMITION: ['<i class="fa fa-stop-circle fa-lg"></i>', 'Transmissão finalizada!', 'red darken-4'],
        START_PARTICIPATION: ['<i class="material-icons">videocam</i>', 'Participação iniciada!', 'blue darken-1'],
        SEND_SOLICITATION: ['<i class="fa fa-check"></i>', 'Solicitação enviada!', 'blue darken-1'],
        ERROR_SOLICITATION: ['<i class="fa fa-times"></i>', 'Não foi possível solicitar a vez.', 'red darken-4'],
        DUP_SOLICITATION: ['<i class="fa fa-exclamation-triangle"></i>', 'Você já encaminhou uma solicitação.<br>Aguarde a resposta.', 'amber darken-4'],
        ERR_ACP_SOLICITATION: ['<i class="fa fa-exclamation-triangle"></i>', 'Sua solicitação já foi aceita.<br>Você não pode efetuar uma nova solicitação até finalizar esta.', 'amber darken-4'],
        SEND_ACP_SOLICITATION: ['<i class="fa fa-check"></i>', 'Sua solicitação foi atendida.<br>Clique no botão ao lado para participar.', 'blue darken-1'],
        NOT_ACP_SOLICITATION: ['<i class="fa fa-times"></i>', 'Sua solicitação foi negada!', 'red darken-4'],
        NO_CONNECTION: ['<i class="fa fa-times"></i>', 'Não há conexão com a sala!', 'red darken-4'],
        ACCEPT_SOLICITATION: ['<i class="fa fa-times"></i>', 'Já existe uma solicitação aceita!<br>Finalize-a para aceitar outra.', 'red darken-4'],
        FORM_ALERT: ['<i class="fa fa-exclamation-triangle fa-lg"></i>', 'Por favor informe todos os campos indicados!', 'red darken-4'],
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
        START_SHARE: ['<i class="material-icons left">screen_share</i>', 'Tela compartilhada.', 'blue darken-1']
    },
    dom: {
        /* Elementos do DOM */
        ASSUNTO: '#assunto',
        BROADCASTER: '#broadcaster',
        BTN_START_ROOM: '#btn-join-as-productor',
        CAM: '#toggle-camera',
        CLASS_TITLE: '#class-title',
        CTL_PEDIR: '#control-pedir-vez',
        CURSO_LIST: '#cursos-list',
        DIV_BTN_END: '#div-end',
        DIV_ENTER: '#div-enter',
        DIV_INCOMING_VIDEO: '#div-incoming-videos',
        DIV_MAIN_VIDEO: '#div-main-video',
        END_SESSION_ACCESS: '#end-session',
        EXIT_SCREEN: '#exit-fullscreen',
        FIRST_VIDEO: '#video-preview',
        IN_ROOM: '#in-room',
        IN_SCREEN: '#in-screen',
        LABEL_USERS: '#users-counter',
        LI_CAM: '#li-toggle-camera',
        LI_MUTE: '#li-toggle-mute',
        LI_SHARE: '#li-share-screen',
        LI_VOLUME: '#li-toggle-volume',
        MATERIA: '#tema',
        MUTE: '#toggle-mute',
        NAME: '#current-user',
        PEDIR: '#pedir-vez',
        PUBLIC_CONFERENCE: '#public-conference',
        ROOM: '#room-id',
        SCREEN: '#toggle-screen',
        SECOND_VIDEO: '#secondvideo-preview',
        SESSION_ACCESS: '#enter-session',
        SHARE: '#share-screen',
        SOL_PEDIR: '#sol-pedir',
        SWAP_SECOND: '#swap-video',
        TARGET: '#target',
        TEXT_MESSAGE: '#text-message',
        THIRD_VIDEO: '#thirdvideo-preview',
        TOGGLE_CHAT: '#toggle-chat',
        USERS_LIST: '#connected-users-list',
        VIDEO_MAIN: '#span-video-preview',
        VIDEO_SECOND: '#span-video-preview-2nd',
        VIDEO_THIRD: '#span-video-preview-3rd',
        VOL: '#toggle-volume'
    },
    misc: {
        DISABLED_COLOR: 'grey',
        ON_COLOR: 'blue',
        OFF_COLOR: 'red',
        HILIGHT_COLOR: 'cyan',
        CLASS_WIDTH_LIMIT: 'width-limit',
        ICON_MIC: '<i class="material-icons">mic</i>',
        ICON_MUTE_MIC: '<i class="material-icons">mic_off</i>',
        ICON_CAM_ON: '<i class="material-icons">videocam</i>',
        ICON_CAM_OFF: '<i class="material-icons">videocam_off</i>',
        ICON_VOL_ON: '<i class="material-icons">volume_up</i>',
        ICON_VOL_OFF: '<i class="material-icons">volume_off</i>',
        ICON_SHARE_ON: '<i class="material-icons">screen_share</i>',
        ICON_SHARE_OFF: '<i class="material-icons">stop_screen_share</i>'
    }
}
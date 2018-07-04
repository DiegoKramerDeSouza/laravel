/**
 * Definições de configuração para INICIALIZAÇÃO de componentes JS
 */
const conf = {

    document: {
        /*Atributos de inicialização do documento */
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
    viewer: {
        /*Atributos de inicialização por vizualisadores */
        COUNT_ROOMS: 0,
        ALLOWED: false
    },
    dom: {
        /*Elementos do DOM dividido por cada model */
        media: {
            FIRST_VIDEO: '#video-preview',
            SECOND_VIDEO: '#secondvideo-preview',
            THIRD_VIDEO: '#thirdvideo-preview',
            MUTE: '#toggle-mute',
            SCREEN: '#toggle-screen',
            EXIT_SCREEN: '#exit-fullscreen',
            VOL: '#toggle-volume',
            CAM: '#toggle-camera',
            PEDIR: '#pedir-vez',
            SOL_PEDIR: '#sol-pedir',
            CTL_PEDIR: '#control-pedir-vez',
            SHARE: '#share-screen',
            VIDEO_SECOND: '#span-video-preview-2nd',
            SWAP_SECOND: '#swap-video',
            SESSION_ACCESS: '#enter-session',
            END_SESSION_ACCESS: '#end-session',
            DIV_BTN_END: '#div-end',
            TOGGLE_CHAT: '#toggle-chat'
        },
        room: {
            ROOM: '#room-id',
            MATERIA: '#tema',
            ASSUNTO: '#assunto',
            NAME: '#current-user',
            CURSO_LIST: '#cursos-list'
        },
        viewer: {
            TARGET: '#target'
        }
    }
}
/**
 * Definições de configuração para inicialização de componentes JS
 */
const conf = {
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
            CTL_PEDIR: '#control-pedir-vez',
            SHARE: '#share-screen',
            VIDEO_SECOND: '#span-video-preview-2nd',
            SWAP_SECOND: '#swap-video',
            SESSION_ACCESS: '#enter-session',
            END_SESSION_ACCESS: '#end-session'
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
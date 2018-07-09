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
        /*Atributos para formação de mensagens padronizadas: [ícone, texto, cor de fundo] */
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
            CURSO_LIST: '#cursos-list',
            TARGET: '#target',
            BROADCASTER: '#broadcaster',
            IN_ROOM: '#in-room',
            IN_SCREEN: '#in-screen',
        }
    }
}
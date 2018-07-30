/**
 * Contabiliza o tempo definido para expirar uma sessão por inatividade e 
 * efetua um refresh da página ao término deste
 */
class IdleHelper {

    constructor() {

        throw new Error('GeneralHelper apresenta apenas métodos estáticos.');
    }

    static idleTimer() {

        let _interval;
        let _timer = ((60 * 1000) * conf.structure.IDLE_TIME);

        window.onload = _resetTimer;
        window.onmousemove = _resetTimer;
        window.onmousedown = _resetTimer;
        window.onclick = _resetTimer;
        window.onscroll = _resetTimer;
        window.onkeypress = _resetTimer;

        function _resetTimer() {

            clearTimeout(_interval);
            _interval = setTimeout(_logout, _timer);
        }

        function _logout() {

            location.reload();
        }
    }

}
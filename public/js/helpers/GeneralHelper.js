class GeneralHelper {

    constructor() {

        throw new Error('GeneralHelper apresenta apenas métodos estáticos.');
    }

    static goBack() {

        window.history.back();
    }

    static loading() {

        let load = new LoadingController();
        load.callLoading();
    }

    static endLoading() {

        let load = new LoadingController();
        load.destroyLoading();
    }

    static devicesOff(audio, video) {

        let load = new LoadingController();
        load.devicesOff(audio, video);
    }

    static hasClass(element, cls) {

        return (` ${element.className} `).indexOf(` ${cls} `) > -1;
    }

    static getMobileOperatingSystem() {

        let userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        } else if (/android/i.test(userAgent)) {
            return "Android";
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "iOS";
        } else {
            return "unknown";
        }
    }

    static detectmob() {
        if (navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i)
        ) {
            return true;
        } else {
            return false;
        }
    }

    static showit(elem, time) {

        time ? $(elem).fadeIn(time) : $(elem).show();
        doc.TAG(elem).setAttribute(misc.ATTR_CONDITION, 'alive');
    }

    static hideit(elem, time) {

        time ? $(elem).fadeOut(time) : $(elem).hide();
        doc.TAG(elem).setAttribute(misc.ATTR_CONDITION, 'dead');
    }

}
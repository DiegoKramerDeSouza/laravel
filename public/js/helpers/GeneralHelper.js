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

    static hasClass(element, cls) {

        return (` ${element.className} `).indexOf(` ${cls} `) > -1;
    }
}
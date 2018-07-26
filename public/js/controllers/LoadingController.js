class LoadingController {

    constructor() {

        this._loading = new LoadingView();
        this._load = doc.ALL(dom.LOAD_ELEM);
        this._loadCancel = doc.ALL(dom.LOAD_CANCEL_ELEM);
    }

    deployLoading() {

        this._load.forEach(elem => {
            let isValid = true;
            elem.onclick = () => {
                let required = doc.ALL(dom.REQUIRED);
                required.forEach(event => {
                    if ($(event).is(':invalid')) isValid = false;
                });
                if (isValid) this._loading.callLoading();
            }
        });
    }

    deployLoadingCancel() {

        this._loadCancel.forEach(elem => {
            elem.onclick = () => this._loading.callLoading();
        });
    }

    destroyLoading() {

        this._loading.destroyLoading();
    }
}
/**
 * Classe voltada ao tratamento das APIs de consulta de CEP e Geolocalização 
 * no cadastro de Instituições
 * 
 * Instancia:
 * FormInstitutionView
 * MessageController
 */
class FormInstitutionController {

    constructor() {

        this._instView = new FormInstitutionView();
        this._instAlert = new MessageController();

        this._postal = doc.TAG(dom.POSTAL);
        this._url = doc.TAG(dom.URL);
        this._key = doc.TAG(dom.LOCK);
        this._urlcep = doc.TAG(dom.URL_CEP);
        this._query = doc.TAG(dom.LOCK_CEP);
        this._location = doc.TAG(dom.LOCATION);
        this._number = doc.TAG(dom.NUMBER);
        this._submit = doc.TAG(dom.BTN_SUBMIT);
        this._validateCep = /^[0-9]{8}$/;
    }

    formatCEP(evt) {

        if (evt.keyCode != 8) {
            if (this._postal.value.length == 5) {
                this._postal.value += '-';
            };
        };
    }

    numeralCEP(evt) {

        let charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
        return true;
    }

    getGeoReferenceByCEP() {

        let lat;
        let lng;
        let postalCode = this._postal.value;

        postalCode = postalCode.replace(/\D/g, '');
        if (postalCode.length != 8) {
            this._instAlert.initiateMessage(conf.message.INVALID_CEP);
            this._submit.disabled = true;
            this._postal.focus();
            return false;
        } else {
            this._postal.value = postalCode.slice(0, 5) + '-' + postalCode.slice(5, postalCode.length);
            this._instView.waitResponse();
        }

        $.post(this._url.value + '?address=' + postalCode + '&key=' + this._key.value,
            (data, status) => {
                try {
                    let obj = data;
                    if (obj['results'][0]['geometry']['location']['lat']) {

                        lat = obj['results'][0]['geometry']['location']['lat'];
                        lng = obj['results'][0]['geometry']['location']['lng'];

                        this._location.value = lat + ';' + lng;
                        this._submit.disabled = false;
                        this._instAlert.initiateMessage(conf.message.SUCCESS_LOCATION);
                    } else {
                        this._instView.enderecoClearData();
                        //this._submit.disabled = true;
                        this._instAlert.initiateMessage(conf.message.NOTFOUND_LOCATION);
                    }
                } catch (err) {
                    this._instView.enderecoClearData();
                    //this._submit.disabled = true;
                    this._instAlert.initiateMessage(conf.message.NOTFOUND_LOCATION);
                }
                this._searchcep(postalCode);
            }
        );
    }

    _searchcep(valor) {

        let cep = valor.replace(/\D/g, '');
        if (cep != "") {
            if (this._validateCep.test(cep)) {
                let script = doc.ADD(dom.SCRIPT);
                script.src = this._urlcep.value + cep + this._query.value;
                document.body.appendChild(script);
                return;
            } else {
                this._submit.disabled = true;
                this._instView.enderecoClearData();
            }
        } else {
            this._submit.disabled = true;
            this._instView.enderecoClearData();
        }
        this._instAlert.initiateMessage(conf.message.NOTFOUND_CEP_LOCATION);
    };
}
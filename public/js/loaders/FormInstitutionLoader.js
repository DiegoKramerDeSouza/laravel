/*
 *	INICIALIZA CONTROLE DE CONSULTAS EM API'S EXTERNAS PARA O FORMULÁRIO DE INSTITUIÇÕES
 *  -Controle do formulário de cadastro de Instituições 
 *	-Realiza a coleta da georeferência com a API Google Maps Geolocation e Via CEP
 */

$(document).ready(function() {

    let form = new FormInstitutionController();
    let postal = doc.TAG(dom.POSTAL);

    postal.onkeydown = evt => {

        form.formatCEP(evt);
    }

    postal.onkeypress = evt => {

        return form.numeralCEP(evt);
    }

    postal.onchange = () => {

        form.getGeoReferenceByCEP();
    }

});

/*
 *   Trata/Alimenta os campos de endereço, cidade e estado a partir do resultado da consulta
 */
function via_cep_callback(conteudo) {

    let instAlert = new MessageController();

    if (!("erro" in conteudo)) {
        let submit = doc.TAG(dom.BTN_SUBMIT);
        let number = doc.TAG(dom.NUMBER);
        doc.TAG(dom.ADDRESS).value = (conteudo.logradouro);
        doc.TAG(dom.CITY).value = (conteudo.localidade);
        doc.TAG(dom.STREET).value = (conteudo.uf).toUpperCase();
        instAlert.initiateMessage(conf.message.SUCCESS_CEP_LOCATION);
        submit.disabled = false;
        M.updateTextFields();
        number.focus();
    } else {
        let postal = doc.TAG(dom.POSTAL);
        let view = new FormInstitutionView();
        view.enderecoClearData();
        instAlert.initiateMessage(conf.message.NOTFOUND_CEP_LOCATION);
        postal.focus();
    }
}
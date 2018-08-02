/*
 *	INICIALIZA CONTROLE DE CONSULTAS EM API'S EXTERNAS PARA O FORMULÁRIO DE INSTITUIÇÕES
 *  -Controle do formulário de cadastro de Instituições 
 *	-Realiza a coleta da georeferência com a API Google Maps Geolocation e Via CEP
 */

$(document).ready(function() {

    let form = new FormInstitutionController();
    let postal = doc.TAG(dom.POSTAL);

    postal.onkeyup = evt => {

        form.formatCEP(evt);
    }

    postal.onkeypress = evt => {

        form.numeralCEP(evt);
    }

    postal.onchange = () => {

        form.getGeoReferenceByCEP();
    }

});

/*
 *   Alimenta os campos de endereço, cidade e estado a partir do resultado da consulta
 */
function via_cep_callback(conteudo) {
    if (!("erro" in conteudo)) {
        doc.TAG(dom.ADDRESS).value = (conteudo.logradouro);
        doc.TAG(dom.CITY).value = (conteudo.localidade);
        doc.TAG(dom.STREET).value = (conteudo.uf).toUpperCase();
        let instAlert = new MessageController
        instAlert.initiateMessage(conf.message.SUCCESS_CEP_LOCATION);
        //doc.TAG(dom.BTN_SUBMIT).disabled = false;
    } else {
        let view = new FormInstitutionView();
        view.enderecoClearData();
    }
}
/**
 * MANIPULAÇÃO INICIALIZAÇÃO E CONTROLE PARA REGISTRO DE DISPOSITÍVOS EM SALAS
 * Disponível apenas para usuários do tipo 0
 */
$(document).ready(function() {

    let userType = doc.TAG(dom.ROOM_TYPE).value;
    let loadDeviceSelector = doc.TAG(dom.CONFIRM_DEVICES);

    if (userType == 0) {

        let deviceController = new DevicesController();
        deviceController.initiateDevices();

        if (!GeneralHelper.detectmob()) $(dom.BTN_CONF_DEVICES).fadeIn(300);
        else doc.TAG(dom.BTN_CONF_DEVICES).disabled = true;

        loadDeviceSelector.onclick = () => {

            deviceController.setDevices();
        };
    }
});
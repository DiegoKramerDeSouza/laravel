/**
 * MANIPULAÇÃO INICIALIZAÇÃO E CONTROLE PARA REGISTRO DE DISPOSITÍVOS EM SALAS
 * Disponível apenas para usuários do tipo 0
 */
$(document).ready(function() {

    let userType = doc.TAG(dom.ROOM_TYPE);
    let userTypeValue = userType.value;
    userType.parentNode.removeChild(userType);

    let loadDeviceSelector = doc.TAG(dom.CONFIRM_DEVICES);
    let deviceController = new DevicesController();

    if (userTypeValue == 0) {

        deviceController.initiateDevices();

        if (!GeneralHelper.detectmob()) $(dom.BTN_CONF_DEVICES).fadeIn(300);
        else doc.TAG(dom.BTN_CONF_DEVICES).disabled = true;

        loadDeviceSelector.onclick = () => deviceController.setDevices();

    } else {
        deviceController.participantInitiateDevices();
    }
});
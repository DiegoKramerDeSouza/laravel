/**
 * MANIPULAÇÃO INICIALIZAÇÃO E CONTROLE PARA REGISTRO DE DISPOSITÍVOS EM SALAS
 * 
 */
$(document).ready(function() {

    let loadDeviceSelector = doc.TAG(dom.CONFIRM_DEVICES);
    if (loadDeviceSelector) {
        let roomController = new RoomController();

        console.log(GeneralHelper.detectmob());
        if (!GeneralHelper.detectmob()) $(dom.BTN_CONF_DEVICES).fadeIn(300);
        else doc.TAG(dom.BTN_CONF_DEVICES).disabled = true;

        loadDeviceSelector.onclick = () => {

            if (!roomController.checkDevices()) {
                alerta.initiateMessage(conf.message.DEVICE_ALERT);
                return;
            } else {
                let audio = doc.TAG(dom.LIST_AUDIO);
                let video = doc.TAG(dom.LIST_VIDEO);
                let deviceController = new DevicesController();
                deviceController.setCookies("audioDevice", audio.value, doc.COOKIE_LIFETIME);
                deviceController.setCookies("videoDevice", video.value, doc.COOKIE_LIFETIME);
                alerta.initiateMessage(conf.message.DEVICE_CONFIGURED);
            }
        };
    }
});
/**
 * MANIPULAÇÃO INICIALIZAÇÃO E CONTROLE PARA REGISTRO DE DISPOSITÍVOS EM SALAS
 * 
 */
$(document).ready(function() {

    let loadDeviceSelector = doc.TAG(dom.CONFIRM_DEVICES);
    let roomController = new RoomController();

    loadDeviceSelector.onclick = () => {

        if (!roomController.checkDevices()) {
            alerta.initiateMessage(conf.message.DEVICE_ALERT);
            return;
        } else {
            /*
            let audio = doc.TAG(dom.LIST_AUDIO);
            let video = doc.TAG(dom.LIST_VIDEO);
            let deviceController = new DevicesController();
            deviceController.insertDBDevices(audio.value, video.value);
            */
        }
    };
});
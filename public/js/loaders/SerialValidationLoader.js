/**
 * INICIALIZA VERIFICAÇÃO DE RECEBIMENTO DE RESPOSTAS DE VALIDAÇÃO DE TOKEN 
 * Verifica a inicialização a aplicação "Validador WebTv" e efetua o envio de mensagens de confirmação recebidos pelo token
 */
$(document).ready(function() {

    let serialController = new SerialValidationController();
    let serial = serialController.initiateSerialValidation();

    document.addEventListener(serial.msg, function(data) {
        chrome.runtime.sendMessage(serial.key, serial.msgSend);
    });

    serialController.initiateSendMessage(serial.key, serial.url);

});
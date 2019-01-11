/**
 * MANIPULAÇÃO DE MENSAGENS DE ERRO ENTRE PÁGINAS
 * Carrega e apresenta mensagem de erro da própria página
 */
$(document).ready(function() {

    let error = new PageMessageController();
    error.initiateMessage();

});
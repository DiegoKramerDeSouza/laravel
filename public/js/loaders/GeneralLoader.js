/**
 * MANIPULAÇÃO DE ELEMENTOS VISUAIS APLICÁVEIS A TODA APLICAÇÃO
 * Tratamento de elementos visuais de uso geral
 */
$(document).ready(function() {

    // Inicializa de chamada de loading===
    let load = new LoadingController();
    load.setVersion();
    load.destroyLoading();
    load.deployLoading();
    load.deployLoadingCancel();
    //====================================
    // Inicializa verificação de sessão===
    IdleHelper.idleTimer();
    //====================================
});
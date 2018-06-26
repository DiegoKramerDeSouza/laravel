/**
 * MANIPULAÇÃO DE ELEMENTOS VISUAIS APLICÁVEIS A TODA APLICAÇÃO
 * Tratamento de elementos visuais de uso geral
 * 
 */
$(document).ready(function() {
    // Inicializa verificação de eventos de cliques em botões com chamada de loading
    destroyLoading();
    deployLoading();
    deployLoadingCancel();
});
// Inicialização do tratamento de click em objetos da classe load para apresentar tela de loading
// -> Ignora chamada de loading se houver algum campo required :invalid
function deployLoading() {
    var load = document.querySelectorAll(config.classes.LOAD_ELEM);
    for (var j = 0; j < load.length; j++) {
        var isValid = true;
        load[j].onclick = function() {
            var required = document.querySelectorAll('[required]');
            for (var j = 0; j < required.length; j++) {
                if ($(required[j]).is(':invalid')) isValid = false;
            }
            if (isValid) callLoading();
        }
    }
}
// Monta e trata apresentações de loading específicos para botões Cancel
function deployLoadingCancel() {
    var load = document.querySelectorAll(config.classes.LOAD_CANCEL_ELEM);
    for (var j = 0; j < load.length; j++) {
        load[j].onclick = function() {
            callLoading();
        }
    }
}
// Inicia apresentação de tela de loading
function callLoading() {
    let center = document.querySelector(config.ids.LOAD_POSITION_ELEM);
    $(config.ids.LOAD_LAYER_ELEM).show();
    $(config.ids.LOAD_POSITION_ELEM).show();
    center.innerHTML = '<h5>' +
        '<b>Aguarde...</b><br><br>' +
        '<div class="preloader-wrapper big active">' +
        '<div class="spinner-layer spinner-blue-only">' +
        '<div class="circle-clipper left">' +
        '<div class="circle"></div>' +
        '</div><div class="gap-patch">' +
        '<div class="circle"></div>' +
        '</div><div class="circle-clipper right">' +
        '<div class="circle"></div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</h5>';
}
// Finaliza apresentação tela de loading
function destroyLoading() {
    let center = document.querySelector(config.ids.LOAD_POSITION_ELEM);
    $(config.ids.LOAD_LAYER_ELEM).fadeOut(300);
    $(config.ids.LOAD_POSITION_ELEM).fadeOut(300);
    center.innerHTML = '';
}
// Retorna a página
function goBack() {
    window.history.back();
}
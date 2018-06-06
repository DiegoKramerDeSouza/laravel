/**
 * MANIPULAÇÃO DE ELEMENTOS VISUAIS APLICÁVEIS A TODA APLICAÇÃO
 * Tratamento de elementos visuais de uso geral
 * 
 */

$(document).ready(function() {
    // Inicialização do tratamento de click em objetos da classe load para apresentar tela de loading
    // Ignora chamada de loading se houver algum campo required :invalid
    var load = document.getElementsByClassName('load');
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
});

// Inicia apresentação de tela de loading
function callLoading() {
    var center = document.getElementById('centralized');
    $('#fglayer').show();
    $('#centralized').show();
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
    var center = document.getElementById('centralized');
    $('#fglayer').fadeOut(300);
    $('#centralized').fadeOut(300);
    center.innerHTML = '';
}
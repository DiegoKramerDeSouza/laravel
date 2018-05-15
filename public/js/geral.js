/**
 * MANIPULAÇÃO DE ELEMENTOS VISUAIS APLICÁVEIS A TODA APLICAÇÃO
 * Tratamento de elementos visuais de uso geral
 * 
 */

// Inicialização do tratamento de click em objetos de determinadas classes
$(document).ready(function() {
    var load = document.getElementsByClassName('load');
    for (var j = 0; j < load.length; j++) {
        load[j].onclick = function() {
            callLoading();
        }
    }
});

// Inicia apresentação de tela de loading
function callLoading() {
    var center = document.getElementById('centralized');
    $('#fglayer').show();
    $('#centralized').show();
    center.innerHTML = '<div class="card-title">' +
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
        '</div>';
}
// Finaliza apresentação tela de loading
function destroyLoading() {
    var center = document.getElementById('centralized');
    $('#fglayer').fadeOut(300);
    $('#centralized').fadeOut(300);
    center.innerHTML = '';
}
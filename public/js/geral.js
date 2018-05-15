/**
 * Tratamento de elementos visuais de uso geral
 * 
 */

$(document).ready(function() {
    var load = document.getElementsByClassName('load');
    for (var j = 0; j < load.length; j++) {
        load[j].onclick = function() {
            callLoading();
        }
    }
});

// Apresenta tela de loading
function callLoading() {
    var center = document.getElementById('centralized');
    $('#fglayer').show();
    $('#centralized').show();
    center.innerHTML = '<h6>' +
        'AGUARDE...<br><br>' +
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
        '</h6>';
}
// Remove tela de loading
function destroyLoading() {
    var center = document.getElementById('centralized');
    $('#fglayer').fadeOut(300);
    $('#centralized').fadeOut(300);
    center.innerHTML = '';
}
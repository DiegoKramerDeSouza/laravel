/**
 * MANIPULAÇÃO DE ELEMENTOS APLICÁVEIS À PESQUISA DE CADASTROS
 * Tratamento de elementos para criação de Autocomplete
 */

/**
 * Controles de URL
 * var origin       String
 * var adminModel   String
 */
var origin = location.origin;
var adminModel = location.pathname.split('/')[3];

$(document).ready(function() {
    var searched;
    var url;
    collectDataBase(adminModel);
    // Realiza coleta a cada 60 segundos
    setInterval(function() {
        collectDataBase(adminModel);
    }, 60 * 1000);
});
/**
 * Função AJAX para coleta de dados cadastrados na base informada e criar uma listagem para consulta em autocomplete
 * admM: Nome da base a ser consultada representado na URL
 */
function collectDataBase(admM) {
    $.ajax({
        url: origin + '/admin/cadastro/' + admM + '/autocomplete/',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            $('#search-input').autocomplete({
                data: data,
                limit: 10,
                minLength: 1,
                onAutocomplete: function(evt) {
                    emitData(evt);
                }
            });
        }
    });
}
/**
 * Repassa o dado coletado e consultado em collectDataBase para a devida rota de resultado
 * txt: Dado coletado
 */
function emitData(txt) {
    if (txt != '' && txt != undefined) {
        var url = origin + '/admin/cadastro/' + adminModel + '/result/' + txt;
        location.assign(url);
    }
}
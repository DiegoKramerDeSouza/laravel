/**
 * MANIPULAÇÃO DE ELEMENTOS VISUAIS APLICÁVEIS AO FORMULÁRIO DE MÓDULOS
 * Tratamento de elementos visuais
 * 
 */
$(document).ready(function() {
    var origin = location.origin;
    $.ajax({
        url: origin + '/admin/cadastro/modulos/autocomplete',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            $('#search-modulos-input').autocomplete({
                data: data,
                limit: 10,
                minLength: 1
            });
        }
    });
    $('#search-modulos-input').on("keyup", function(event) {
        if (event.keyCode == 13) {
            var searched = document.getElementById('search-modulos-input').value;
            var url = origin + '/admin/cadastro/modulos/result/' + searched;
            location.assign(url);
        }
    });
});
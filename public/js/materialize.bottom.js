// M.*: Padrão de inicialização do MaterializeCSS
$(document).ready(function() {
    //Inicialização do Materialize
    let elems;
    let instances;
    elems = document.querySelectorAll('.dropdown-trigger');
    instances = M.Dropdown.init(elems);
    elems = document.querySelectorAll('.sidenav');
    instances = M.Sidenav.init(elems);
    elems = document.querySelectorAll('select');
    instances = M.FormSelect.init(elems);
    elems = document.querySelectorAll('.modal');
    instances = M.Modal.init(elems);
    elems = document.querySelectorAll('.collapsible');
    instances = M.Collapsible.init(elems);
    M.updateTextFields();
    $('input#input_text, textarea#textarea2').characterCounter();
    elems = document.querySelectorAll('.tooltipped');
    instances = M.Tooltip.init(elems);
    // Remove tooltip quando clicado
    for (var i = 0; i < elems.length; i++) {
        $('#' + elems[i].id).click(function(e) {
            let elem = document.getElementById(e.currentTarget.id);
            let instance = M.Tooltip.getInstance(elem);
            instance.close();
        });
    }

});
/**
 * Classe voltada à inicialização de todos os elementos do Materialize CSS
 */
class MaterializeController {

    constructor() {

        this._dropdown = doc.ALL(dom.DROPDOWN_TRG);
        this._sidenav = doc.ALL(dom.SIDENAV);
        this._select = doc.ALL(dom.SELECT);
        this._modal = doc.ALL(dom.MODAL);
        this._collapsible = doc.ALL(dom.COLLAPSIBLE);
        this._tooltip = doc.ALL(dom.TOOLTIPED);

        this._dropdownInstance;
        this._sidenavInstance;
        this._selectInstance;
        this._modalInstance;
        this._collapsibleInstance;
        this._tooltipInstance;
    }

    initiateMaterialize() {

        this._initDropdown();
        this._initSidenav();
        this._initSelect();
        this._initModal();
        this._initCollapsible();
        this._initTooltip();
        this._initTextarea();
    }

    initiateSelect() {

        this._initSelect();
    }

    _initDropdown() {

        this._dropdownInstance = M.Dropdown.init(this._dropdown);
    }

    _initSidenav() {

        this._sidenavInstance = M.Sidenav.init(this._sidenav, { edge: conf.str.NAV_EDGE });
    }

    _initSelect() {

        this._selectInstance = M.FormSelect.init(this._select);
    }

    _initModal() {

        this._modalInstance = M.Modal.init(this._modal);
    }

    _initCollapsible() {

        this._collapsibleInstance = M.Collapsible.init(this._collapsible);
    }

    _initTooltip() {

        this._tooltipInstance = M.Tooltip.init(this._tooltip);
    }

    _initTextarea() {

        M.updateTextFields();
        $('input#input_text, textarea#textarea2').characterCounter();
    }

}
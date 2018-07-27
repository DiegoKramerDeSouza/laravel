/**
 *  Classe voltada ao controle de requisições AJAX para coletar dados cadastrados no módulo informado
 *  e criar uma listagem para consulta para formação de Autocomplete;
 */
class AutocompleteController {

    constructor() {

        this._origin = location.origin;
        this._admModule = location.pathname.split('/')[3];
        this._searched = false;

        this._search = doc.TAG(dom.SEARCH);
    }

    initiateAutocomplete() {

        let autocomplete = new Autocomplete(this._origin, this._admModule, this._searched);
        this._search.onfocus = () => {
            if (!autocomplete.searched) {
                this._collectDataBase(autocomplete.origin, autocomplete.admModule);
                autocomplete.searched = true;
            }
        }
    }

    _collectDataBase(origin, admModule) {

        $.ajax({
            url: `${ origin }/admin/cadastro/${ admModule }/autocomplete/`,
            type: 'get',
            dataType: 'json',
            success: data => {
                $(dom.SEARCH).autocomplete({
                    data: data,
                    limit: 10,
                    minLength: 1,
                    onAutocomplete: evt => {
                        GeneralHelper.loading();
                        this._emitData(origin, admModule, evt);
                    }
                });
            }
        });
    }

    _emitData(origin, admModule, txt) {

        txt ? location.assign(`${ origin }/admin/cadastro/${ admModule }/result/${ txt }`) : undefined;
    }

}
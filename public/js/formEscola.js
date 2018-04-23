/*
 *	-Controle do formulário de cadastro de Instituições 
 *	-Realiza a coleta da georeferência com a API google maps geolocation
 */

//força a inserção do caracter '-' na criação do CEP
document.getElementById('postal').onkeyup = function(e) {
    if (e.keyCode != 8) {
        if (this.value.length == 5) {
            this.value += '-';
        };
    };
};
//Bloqueia o campo de CEP para qualquer outra inserção além de números
/*
 *	charCode Integer;
 */
document.getElementById('postal').onkeypress = function(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    };
    return true;
};
//Efetua a coleta de georeferenciamento a partir do CEP inserido
/*
 *	url String;
 *	val String;
 *	value String;
 *	lat Decimal;
 *	lng Decimal;
 */
document.getElementById('postal').onchange = function(evt) {
    var url = document.getElementById('url').value;
    var val = document.getElementById('lock').value;

    var value = this.value;
    //Trata e verifica o valor do CEP
    value = value.replace(/\D/g, '');
    if (value.length != 8) {
        toastContent = '<span class="white-text"><i class="fa fa-times fa-lg"></i> CEP inválido!</span>';
        M.toast({ html: toastContent, classes: 'red darken-3' });
        document.querySelector('button[type="submit"]').disabled = true;
        return false;
    } else {
        this.value = value.slice(0, 5) + '-' + value.slice(5, value.length);
    }
    //Consulta a API do Google para retornar dados de geolocalização
    //Sincronização do AJAX - Modo assincrono habilitado [true]
    //$.ajaxSetup({ async: true });
    //Debug
    //console.log(url + '?address=' + value + '&key=' + val);
    $.post(url + '?address=' + value + '&key=' + val,
        function(data, status) {
            try {
                obj = data;
                //Se o resultado conter o valor de latitude, prossegue
                if (obj['results'][0]['geometry']['location']['lat']) {
                    //Guarda valores re latitude e longitude
                    var lat = obj['results'][0]['geometry']['location']['lat'];
                    var lng = obj['results'][0]['geometry']['location']['lng'];

                    //Trata resultado - lat;lng
                    document.getElementById('location').value = lat + ';' + lng;
                    document.querySelector('button[type="submit"]').disabled = false;
                    toastContent = '<span class="white-text"><i class="fa fa-check fa-lg"></i> Localização determinada com sucesso!</span>';
                    M.toast({ html: toastContent, classes: 'green darken-1' });
                    //Trata campos de texto e efetua a pesquisa do CEP
                    waitResponse();

                    searchcep(value);
                    M.updateTextFields();
                    document.getElementById('number').focus();
                } else {
                    enderecoClearData();
                    document.querySelector('button[type="submit"]').disabled = true;
                    toastContent = '<span class="white-text"><i class="fa fa-times fa-lg"></i> CEP inválido ou localização não determinada!</span>';
                    M.toast({ html: toastContent, classes: 'red darken-3' });
                }
            } catch (err) {
                console.log(err);
                enderecoClearData();
                document.querySelector('button[type="submit"]').disabled = true;
                toastContent = '<span class="white-text"><i class="fa fa-times fa-lg"></i> Localização não encontrada!<br>Verifique se o mesmo está correto ou utilize o CEP geral de sua localidade.</span>';
                M.toast({ html: toastContent, classes: 'red darken-3' }, 1000);
            }
        }
    );
};

/*
 *   #FUNÇÕES
 */

/*
 *   Limpa campos de endereço, cidade e estado
 */
function enderecoClearData() {
    document.getElementById('address').value = ("");
    document.getElementById('city').value = ("");
    document.getElementById('st').value = ("");
}
/*
 *   Preenche os campos com "Verificando..." enquanto consulta webservice
 */
function waitResponse() {
    document.getElementById('address').value = "Verificando...";
    document.getElementById('city').value = "Verificando...";
}
/*
 *   Alimenta os campos de endereço, cidade e estado a partir do resultado da consulta
 */
function meu_callback(conteudo) {
    if (!("erro" in conteudo)) {
        document.getElementById('address').value = (conteudo.logradouro);
        document.getElementById('city').value = (conteudo.localidade);
        document.getElementById('st').value = (conteudo.uf).toUpperCase();
    } else {
        enderecoClearData();
        toastContent = '<span class="white-text"><i class="fa fa-times fa-lg"></i> CEP não localizado!</span>';
        M.toast({ html: toastContent, classes: 'red darken-3' });
    }
}
/*
 *   Efetua a pesquisa no webservice
 */
function searchcep(valor) {
    //Nova variável "cep" somente com dígitos.
    var cep = valor.replace(/\D/g, '');
    if (cep != "") {
        //Expressão regular para validar o CEP.
        var validacep = /^[0-9]{8}$/;
        //Valida o formato do CEP.
        if (validacep.test(cep)) {
            //Coleta informações do webservice
            var url = document.getElementById('urlcep').value;
            var query = document.getElementById('lockcep').value;
            //Cria um elemento javascript.
            var script = document.createElement('script');
            //Sincroniza com o callback.
            script.src = url + cep + query;
            //Insere script no documento e carrega o conteúdo.
            document.body.appendChild(script);
        } else {
            //cep é inválido.
            enderecoClearData();
            toastContent = '<span class="white-text"><i class="fa fa-times fa-lg"></i> Formato do CEP inválido!</span>';
            M.toast({ html: toastContent, classes: 'red darken-3' });
        }
    } else {
        enderecoClearData();
    }
};
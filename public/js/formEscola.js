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
    var code = value.split('-');
    try {
        value = code[0] + code[1];
    } catch (err) {
        toastContent = '<span class="white-text"><i class="fa fa-times fa-lg"></i> CEP não localizado!</span>';
        M.toast({ html: toastContent, classes: 'red darken-3' });
        return false;
    }
    $.ajaxSetup({ async: false });
    $.post(url + '?address=' + value + '&key=' + val,
        function(data, status) {
            try {
                obj = data;
                if (obj['results'][0]['geometry']['location']['lat']) {
                    var lat = obj['results'][0]['geometry']['location']['lat'];
                    var lng = obj['results'][0]['geometry']['location']['lng'];
                    document.getElementById('location').value = lat + ';' + lng;
                    document.getElementById('save').disabled = false;
                    toastContent = '<span class="white-text"><i class="fa fa-check fa-lg"></i> Localização determinada com sucesso!</span>';
                    M.toast({ html: toastContent, classes: 'green darken-1' });
                } else {
                    toastContent = '<span class="white-text"><i class="fa fa-times fa-lg"></i> CEP inválido ou localização não determinada!</span>';
                    M.toast({ html: toastContent, classes: 'red darken-3' });
                }
            } catch (err) {
                console.log(err);
                toastContent = '<span class="white-text"><i class="fa fa-times fa-lg"></i> Localização não encontrada!<br>Verifique se o mesmo está correto ou utilize o CEP geral de sua localidade.</span>';
                M.toast({ html: toastContent, classes: 'red darken-3' }, 1000);
            }
        }
    );
};

function getEndereco() {
    if ($.trim($("#campoCep").val()) != "") {
        //var url = "http://cep.republicavirtual.com.br/web_cep.php?formato=javascript&cep=";
        var url = "viacep.com.br/ws/" + $("#campoCep").val() + "/json/?callback=callback_name"
        $.getScript(url, function() {
            // o getScript dá um eval no script, então é só ler!
            //Se o resultado for igual a 1
            if (resultadoCEP["resultado"]) {
                // troca o valor dos elementos
                $("#campoLogradouro").val(unescape(resultadoCEP["tipo_logradouro"]) + " " + unescape(resultadoCEP["logradouro"]));
                //$("#campoBairro").val(unescape(resultadoCEP["bairro"]));
                $("#campoCidade").val(unescape(resultadoCEP["cidade"]));
                $("#campoEstado").val(unescape(resultadoCEP["uf"]));
                //$("#enderecoCompleto").show("slow");
                $("#campoNumero").focus();
            } else {
                alert("Endereço não encontrado");
                return false;
            }
        });
    } else {
        alert('Antes, preencha o campo CEP!')
    }

}
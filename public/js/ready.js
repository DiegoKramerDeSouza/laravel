/*
	Arquivo de inicialização de funções personalizadas
	Document ready functions
*/

var loading = "<div id='dialogLoading' align='center'>"+
				"<div>"+
				"	Aguarde...<br/>"+
				"</div>"+
				"<div id='loadGif'>"+
				"	<img src='./img/load.png' class='image_spinner_md' ></span>"+
				"</div>"+
			"</div>";
var miniloading = "<div align='center' style='position:relative; margin-top:25%; margin-Bottom:25%;'>"+
					"<div id='LoadGif'>"+
					"	<img src='./img/load.png' class='image_spinner_md' style='width:100px; height:100px;' />"+
					"</div>"+
				"</div>";
				
var panelminiloading = "<div align='center' style='position:relative; margin-top:25%; margin-Bottom:25%;'>"+
							"<div id='LoadGif' style='position:fixed; top: 50%; left:50%; transform: translate(-50%, -50%); border:1px solid red;'>"+
							"	<img src='./img/load.png' class='image_spinner_md' style='width:100px; height:100px;' />"+
							"</div>"+
						"</div>";
var verifyInt;
var verifyIdnt;
var autoplayInterval;
var allChartId;

//$("#bg").fadeIn(3000);
//$("#bgLayer").fadeIn(3500);
$(".title").fadeIn(1000);
$("#loginPanel").show(0);

//INICIALIZE---------------------------------------------------------
$( document ).ready(function(){
	Materialize.updateTextFields();
	$('select').material_select();
	$(".button-collapse").sideNav();
	$(".tooltipped").tooltip();
	//$('.carousel.carousel-slider').carousel({fullWidth: true});
	$('.modal').modal({
		dismissible: true,
		opacity: .8,
		inDuration: 500,
		outDuration: 500,
		startingTop: '4%',
		endingTop: '10%',
    });
	
	$('input#input_text, textarea#textarea1').characterCounter();
	
	$(".dropdown-button").dropdown();
	$('.chips').material_chip();
	$('.userBlock').slideDown(1000);
	$('.datepicker').pickadate({
		selectMonths: true, // Creates a dropdown to control month
		selectYears: 15, // Creates a dropdown of 15 years to control year,
		today: 'Today',
		clear: 'Clear',
		close: 'Ok',
		closeOnSelect: false // Close upon selecting a date,
	 });
});
//-------------------------------------------------------------------
//===================================================================
//Materialize CSS Functions.START
//===================================================================
function closeBtnFAB(){
	$('.fixed-action-btn').closeFAB();
}
function closeSideNav(){
	$('.button-collapse').sideNav('hide');
}
function autoplay(){
	clearInterval(autoplayInterval);
	autoplayInterval = setInterval(function(){
		$('.carousel').carousel('next');
	},10000);
}
function moveSlide(move){
	clearInterval(autoplayInterval);
	$('.carousel').carousel(move);
	autoplay();
}
function playSlide(){
	$toastContent = $('<span class="white-text"><i class="fa fa-play fa-lg"></i> <b>Monitoria iniciada!</b></span>');
	Materialize.toast($toastContent, 1000, 'green darken-1');
	autoplay();
}
function pauseSlide(){
	$toastContent = $('<span class="white-text"><i class="fa fa-pause fa-lg"></i> <b>Monitoria parada!</b></span>');
	Materialize.toast($toastContent, 1000, 'amber darken-1');
	clearInterval(autoplayInterval);
}
function closeSlide(){
	//document.getElementById('slideBody').innerHTML = "";
	$('#chartSlide_setor').modal('close');
	//$('#inputChartData').hide(0);
	var elem = document.getElementById('slideBody');
	if(hasClass(elem, 'initialized')){
		elem.classList.remove('initialized');
		var elem = document.getElementsByClassName('canvasContent');
		for(var $i=0; $i<elem.length; $i++){
			//var oldcanv = document.getElementById(elem[$i].id);
			//document.removeChild(oldcanv);

			//var canv = document.createElement('canvas');
			//canv.id = elem[$i].id;
			//document.body.appendChild(canv);
		}
	}
	clearInterval(autoplayInterval);
}
//===================================================================
//Materialize CSS Functions.END
//===================================================================

//===================================================================
//CHARTS.START
//===================================================================
var $retry = 0;

function callOPEChart(target, id, targetname, base){
	document.getElementById("information").innerHTML = "<div style='padding:100px'>"+miniloading+"</div>";
	document.getElementById('setorImgId').value = id;
	document.getElementById('setorImgName').value = targetname;
	document.getElementById('setorImgBase').value = base;
	verifyInterval("canvas");
	setTimeout(function(){
		$.post("getdata.php", {page: "canvas", target: target, setor: id, name: targetname, database: base},
			function(data,status){
				if(status == "success"){
					document.getElementById("information").innerHTML = "<div id='inputMONData'>"+data+"</div>";
					//$('select').material_select();
					$('#inputMONData').fadeIn();
				} else {
					$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao carregar gráficos!</span>');
					Materialize.toast($toastContent, 1000, 'red darken-3');
					callData("gerenciar", "operacoes");
				}
			}
		);
	}, 300);
}
function callModalSlider(){
	//verifyInterval("canvas");
	//$('#chartSlide_setor').modal('open');
	setTimeout(function(){
		$.post("getdata.php", {page: "monitorar", target: "todos-setores"},
			function(data,status){
				if(status == "success"){
					document.getElementById("slideBody").innerHTML = data;
					$('.carousel.carousel-slider').carousel({
						fullWidth: true, 
						noWrap: false, 
						onCycleTo: function(ele, slide){
							console.log('callModalSlider: ' + $(ele).index());
							var slider = document.getElementsByClassName('sliderLoading');
							var sliderId = slider[$(ele).index()].id;
							verifyElementId(sliderId);
						}
					});
					autoplay();
					$('#inputChartData').fadeIn(1000);
					
				} else {
					$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao carregar gráficos!</span>');
					Materialize.toast($toastContent, 1000, 'red darken-3');
				}
			}
		);
	}, 300);
	
}

function callChart(target){
	var id = document.getElementById('setorImgId').value;
	var targetname = document.getElementById('setorImgName').value;
	var base = document.getElementById('setorImgBase').value;
	if($retry == 0){
		document.getElementById("OPEChart").innerHTML = "<div style='padding:100px'>"+miniloading+"</div>";
	}
	document.getElementById("OPEChart").innerHTML = "<div style='padding:100px'>"+miniloading+"</div>";
	$.post( "getdata.php", { page: "chart", target: target, setor: id, name: targetname, database: base},
	function(data,status){
		try{
			obj = JSON.parse(data);
			//console.log(obj);
			loadGraph(target, obj, data, status, 0);
		} catch(err) {
			$retry++;
			console.log(err);
			$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Erro ao coletar dados de gráficos: ' + target + '!</span>');
			Materialize.toast($toastContent, 1000, 'red darken-3');
			//callChart(target);
		}
	});
}

function callAllCharts(target, id){
	allChartId = id;
	document.getElementsByClassName("sliderLoading").innerHTML = "<div class='sliderMiniload1'>"+panelminiloading+"</div>";
	$.post( "getdata.php", { page: "chart", target: target, setores: id},
	function(data,status){
		try{
			obj = JSON.parse(data);
			//console.log(data);
			$('#'+allChartId+'_Chart').hide();
			loadGraph(target, obj, data, status, allChartId);
		} catch(err) {
			$retry++;
			console.log(err);
			$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Erro ao coletar dados de gráficos: ' + target + '!</span>');
			Materialize.toast($toastContent, 1000, 'red darken-3');
			//callChart(target);
		}
	});
}

function loadGraph(target, obj, data, status, id){
			$retry = 0;
			if(status == "success"){
				if(target == 0){
					if(obj.length > 0 && data != null){
						var chart = document.getElementById("Canvas_" + id + "_Chart");
						var chartData = {
								labels: [],
								datasets: [
									{
										data: [],
										label: "Imagens",
										backgroundColor: [],
										hoverBackgroundColor: []
									}]
							};
						var red;
						var green;
						var blue;
						var color = [];											
						for(var $j = 0; $j < obj.length; $j++){
							blue = Math.floor((Math.random() * 150) + 20);
							red = Math.floor((Math.random() * 150) + 20);
							green = Math.floor((Math.random() * 150) + 20);
							chartData.labels[$j] = obj[$j].split(":")[0];
							if(chartData.labels[$j] == "Sem Imagem"){
								red = 200;
								green = 10;
								blue = 10;
							}
							color[$j] = "color:rgba("+red+","+green+","+blue+",1);";
							chartData.datasets[0].backgroundColor[$j] = "rgba("+red+","+green+","+blue+",1)";
							chartData.datasets[0].hoverBackgroundColor[$j] = "rgba("+red+","+green+","+blue+",0.9)";
							chartData.datasets[0].data[$j] = obj[$j].split(":")[1];
							
						};
							
						var myChart = new Chart(chart, {
							type: 'pie',
							data: chartData,
							options: {
								animation: {
									duration: 1500,
									animateRotate: true
								},
								legend:{
									display: false
								}
							}
						});
							
						var bg;
						var total = 0;
						var datainsert = "<div class='row'>"+
											"<div class='col s12'>"+
												"<div class='col s10'>"+
													"<b><i class='fa fa-th-large'></i> Imagens</b>"+
												"</div>"+
												"<div class='col s2'>"+
													"<b>Qtd.</b>"+
												"</div>"+
											"</div>";
						for(var $i = 0; $i < chartData.labels.length; $i++){
							bg = "transparent";
							countColor = "green";
							if($i%2 == 0){
								bg = "rgba(200,250,200,0.8)";
							}
							spliting = chartData.labels[$i].split("|")[1];
							if(spliting == "NR"){
								chartData.labels[$i] = chartData.labels[$i].split("|")[0];
								response = 		"<div class='col s10 grey-text text-darken-3 truncate'>"+
													"<span class='fa fa-exclamation-circle' style='" + color[$i] + "'></span> <span title='Imagem não registrada no sistema!'>" + chartData.labels[$i] + "</span>:"+
												"</div>";
							} else {
								if(chartData.labels[$i] == "Sem Imagem"){
									response = 	"<div class='col s10 truncate'>"+
													"<span class='fa fa-circle' style='" + color[$i] + "'></span> <span class='red-text text-darken-3'>" + chartData.labels[$i] + ":</span>"+
												"</div>";
									countColor = "red";
								} else {
									response = 	"<div class='col s10 truncate'>"+
													"<span class='fa fa-circle' style='" + color[$i] + "'></span> " + chartData.labels[$i] + ":"+
												"</div>";
								}
							}
							
							datainsert+= "<div class='col s12' style='background-color:" + bg + "'>"+
											response +
											"<div class='col s2'>"+
												"<span class='"+countColor+"-text text-darken-3'><b>" + chartData.datasets[0].data[$i] + "</b></span>"+
											"</div>"+
										"</div>";
							total += parseInt(chartData.datasets[0].data[$i]);
						}
						
						datainsert+= 	"<hr style='border: 1px solid rgba(80,80,80,0.4);' />"+
										"<div class='col s12'>"+
											"<div class='col s10 green-text text-darken-3 truncate'>"+
												"<b><i class='fa fa-hdd-o lg'></i> Total de Hardware: </b>"+
											"</div>"+
											"<div class='col s2 green-text text-darken-3'>"+
												"<b>" + total + "</b>"+
											"</div>"+
											"<div class='col s12'>"+
												"<span class='grey-text sm'><i class='fa fa-exclamation-circle'></i> Representa imagens não cadastradas no WDSMonitor.</span>"+
											"</div>"+
										"</div>"+
									"</div>";
						document.getElementById("Canvas_" + id + "_Info").innerHTML = datainsert;
					}
				} else if(target == 1){
					if(obj.length > 0 && data != null){
						var chart = document.getElementById('OPEChart');
						var chartData = {
								labels: [],
								datasets: [
									{
										data: [],
										label: "Imagens",
										backgroundColor: [],
										hoverBackgroundColor: []
									}]
							};
						var red;
						var green;
						var blue;
						var color = [];											
						for(var $j = 0; $j < obj.length; $j++){
							blue = Math.floor((Math.random() * 150) + 20);
							red = Math.floor((Math.random() * 150) + 20);
							green = Math.floor((Math.random() * 150) + 20);
							chartData.labels[$j] = obj[$j].split(":")[0];
							if(chartData.labels[$j] == "Sem Imagem"){
								red = 200;
								green = 10;
								blue = 10;
							}
							color[$j] = "color:rgba("+red+","+green+","+blue+",1);";
							chartData.datasets[0].data[$j] = obj[$j].split(":")[1];
							chartData.datasets[0].backgroundColor[$j] = "rgba("+red+","+green+","+blue+",1)";
							chartData.datasets[0].hoverBackgroundColor[$j] = "rgba("+red+","+green+","+blue+",0.9)";
						};
							
						var myChart = new Chart(chart, {
							type: 'pie',
							data: chartData,
							options: {
								animation: {
									duration: 1500,
									animateRotate: true
								},
								legend:{
									display: false
								}
							}
						});
						
						var bg;
						var total = 0;
						var datainsert = "<div class='row'>"+
											"<div class='col s12'>"+
												"<div class='col s10'>"+
													"<b><i class='fa fa-th-large'></i> Imagens</b>"+
												"</div>"+
												"<div class='col s2'>"+
													"<b>Qtd.</b>"+
												"</div>"+
											"</div>";
						for(var $i = 0; $i < chartData.labels.length; $i++){
							bg = "transparent";
							countColor = "green";
							if($i%2 == 0){
								bg = "rgba(200,250,200,0.8)";
							}
							spliting = chartData.labels[$i].split("|")[1];
							if(spliting == "NR"){
								chartData.labels[$i] = chartData.labels[$i].split("|")[0];
								response = 		"<div class='col s10 grey-text text-darken-3'>"+
													"<span class='fa fa-exclamation-circle' style='" + color[$i] + "'></span><span title='Imagem não registrada no sistema!'>" + chartData.labels[$i] + "</span>:"+
												"</div>";
							} else {
								if(chartData.labels[$i] == "Sem Imagem"){
									response = 	"<div class='col s10'>"+
													"<span class='fa fa-circle' style='" + color[$i] + "'></span><span class='red-text text-darken-3'>" + chartData.labels[$i] + ":</span>"+
												"</div>";
									countColor = "red";
								} else {
									response = 	"<div class='col s10'>"+
													"<span class='fa fa-circle' style='" + color[$i] + "'></span>" + chartData.labels[$i] + ":"+
												"</div>";
								}
							}
							
							datainsert+= "<div class='col s12' style='background-color:" + bg + "'>"+
											response +
											"<div class='col s2'>"+
												"<span class='"+countColor+"-text text-darken-3'><b>" + chartData.datasets[0].data[$i] + "</b></span>"+
											"</div>"+
										"</div>";
							total += parseInt(chartData.datasets[0].data[$i]);
						}
						
						datainsert+= 	"<hr noshaede />"+
										"<div class='col s12'>"+
											"<div class='col s10 green-text text-darken-3'>"+
												"<b><i class='fa fa-hdd-o fa-lg'></i> Total de Hardware: </b>"+
											"</div>"+
											"<div class='col s2 green-text text-darken-3'>"+
												"<b>" + total + "</b>"+
											"</div>"+
											"<div class='col s12'>"+
												"<span class='grey-text sm'><i class='fa fa-exclamation-circle'></i> Representa imagens não cadastradas no WDSMonitor.</span>"+
											"</div>"+
										"</div>"+
									"</div>";
						document.getElementById("OPEcanvas_info").innerHTML = datainsert;
						
					}
				}
			} else {
				console.log("ERROR");
			}
}

function callMonitor(target){
	console.log(target);
	$.post( "machinelist.php", { report: target },
		function(data,status){
			obj = JSON.parse(data);
			var datainsert = "";
			var computer;
			var timestamp;
			var os;
				if(status == "success"){
					for(var $i = 0; $i < obj.length; $i++){
						computer = obj[$i].split("|")[0];
						os = obj[$i].split("|")[1];
						timestamp = obj[$i].split("|")[2];
						datainsert += "<div class='col-md-6'><div class='cardStyle' style='margin:5px;'>" + (parseInt($i)+1) + ". <br /><span class='blue fa fa-desktop'></span> <b>Nome:</b> " + computer + "<br /><span class='green fa fa-microchip'></span> <b>SO:</b> " + os + "<br /><span class='red fa fa-clock-o'></span> <b>Último Logon:</b> " + timestamp + "</div></div>"; 
					}
					document.getElementById("report-Body").innerHTML = datainsert;
					document.getElementById("report-Header").innerHTML = "<span class='fa fa-desktop'></span> Máquinas offline a " + target + " dias <a href='pdfFile.php?content=" + target + "' class='btn btn-danger' target='_blank' style='position:absolute; right:5px;'><span class='fa fa-download'></span> Arquivo</a>";
				} else {
					console.log("ERROR");
				}
		}
	);
}

function verifyElement(elemtype){
	var verifyCanvas = document.createElement(elemtype);
	var verifyedCanvas = (verifyCanvas.getContext)? true : false;
	if(verifyedCanvas){
		var contentDiv = document.getElementById("OPE"+elemtype+"_graph");
		if(contentDiv != null){
			var myChart = $("#OPEChart");
			if(myChart != null){
				callChart(1);
			}
		}
	} else {
		var mydiv = document.getElementById(elemtype+"_graph");
		if(mydiv != null){
			//mydiv.innerHTML = "<span class='red-text text-darken-3'>Não há suporte a gráficos nesta versão do seu navegador.</span>";
			$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Não há suporte a gráficos nesta versão do seu navegador!</span>');
			Materialize.toast($toastContent, 1000, 'red darken-3');
		}
	}
	clearInterval(verifyInt);
}

//Verifica existencia de campos em intervalos
function verifyInterval(opt){
	clearInterval(verifyInt);
	verifyInt = setInterval(function(){
		verifyElement(opt);
		console.log("verificando...");
	}, 500);
}

//----------------------ALL CHARTS----------------------------------
function verifyElementId(elemtype){
	//Check sliderLoading-----------------------------------------
	var slider = document.getElementsByClassName('sliderLoading');
	for($i=0; $i < slider.length; $i++){
		//console.log(slider[$i].id + " limpo");
		document.getElementById(elemtype).innerHTML = "";
	}
	var setorId = elemtype.split("_")[0];
	//------------------------------------------------------------
	
	var verifyCanvas = document.getElementById(elemtype);
	if(verifyCanvas != null){
		//console.log(elemtype + " Active!");
		document.getElementById(elemtype).innerHTML = "<div class='obj-middle'>"+miniloading+"</div>";
		callAllCharts(0, setorId);
	} else {
		$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Não há suporte a gráficos nesta versão do seu navegador!</span>');
		Materialize.toast($toastContent, 1000, 'red darken-3');
	}
}
function verifyIdentity(opt){
	clearInterval(verifyIdnt);
	verifyIdnt = setInterval(function(){
		verifyElementId(opt);
		//console.log("verificando...");
	}, 500);
}
//document.getElementById("sliderLoading").innerHTML = "<div style='padding:100px'>"+miniloading+"</div>";
//--------------------------------------------------------------------------------------------------------------------
//CHARTS.END-----------------------------------------------------------------

function callData(page, target){
	closeSlide();
	closeSideNav();
	document.getElementById("information").innerHTML = "<div style='padding:100px'>"+miniloading+"</div>";
	setTimeout(function(){
		$.post("getdata.php", {page: page, target: target},
			function(data,status){
				if(status == "success"){
					document.getElementById("information").innerHTML = data;
				} else {
					$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao carregar a página!</span>');
					Materialize.toast($toastContent, 1000, 'red darken-3');
				}
			}
		);
	}, 300);
}

function createDatePick(id1, id2){
	var dia;
	var today = new Date();
	$('#'+id1).pickadate({
		min: today,
		format: 'dd/mm/yyyy',
		selectMonths: true,
		selectYears: false,
		monthsFull: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
		monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
		weekdaysFull: [ 'Doming', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado' ],
		weekdaysShort: [ 'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab' ],
		weekdaysLetter: [ 'D', 'S', 'T', 'Q', 'Q', 'S', 'S' ],
		today: 'Hoje',
		clear: 'Cancelar',
		close: 'OK',
		onClose: function(){
			dia = document.getElementById(id1).value;
			if(dia != ""){
				document.getElementById(id2).disabled = false;
				document.getElementById(id2).value = "";
				$('#'+id2).pickadate({
					min: dia,
					format: 'dd/mm/yyyy',
					selectMonths: true,
					selectYears: 5,
					monthsFull: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
					monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
					weekdaysFull: [ 'Doming', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado' ],
					weekdaysShort: [ 'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab' ],
					weekdaysLetter: [ 'D', 'S', 'T', 'Q', 'Q', 'S', 'S' ],
					today: 'Hoje',
					clear: 'Cancelar',
					close: 'OK'
				});
			}
		}
	});
}

//INSERT FUNCTIONS-------------------------------------------------------------------------------------------
function insertSetor(){
	var opename = document.getElementById('OPEname').value;
	var opednname = document.getElementById('OPEdnName').value;
	var opedn = document.getElementById('OPEdn').value;
	var opedesc = document.getElementById('OPEdescription').value;
	if(opename == "" || opednname == "" || opedn == ""){
		$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Informe todos os campos!</span>');
		Materialize.toast($toastContent, 1000, 'red darken-3');
	} else {
		document.getElementById("information").innerHTML = "<div style='padding:100px'>"+miniloading+"</div>";
		setTimeout(function(){
			$.post("getdata.php", {action: "insert", target: "setor", name: opename, dnname: opednname, dn: opedn, opedesc: opedesc},
				function(data,status){
					if(status == "success"){
						if(data == false){
							$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao criar setor!</span>');
							Materialize.toast($toastContent, 1000, 'red darken-3');
						} else {
							$toastContent = $('<span class="white-text"><i class="fa fa-check fa-lg"></i> Setor criado com sucesso!</span>');
							Materialize.toast($toastContent, 1000, 'light-green');
						}
						callData("gerenciar", "operacoes");
					} else {
						$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao criar setor!</span>');
						Materialize.toast($toastContent, 1000, 'red darken-3');
					}
				}
			);
		}, 300);
	}
}
function insertHardware(){
	var hdwname = document.getElementById('HDWname').value;
	var osname = document.getElementById('HDWos').value;
	
	if(hdwname == "" || osname == ""){
		$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Informe todos os campos!</span>');
		Materialize.toast($toastContent, 1000, 'red darken-3');
	} else {
		document.getElementById("information").innerHTML = "<div style='padding:100px'>"+miniloading+"</div>";
		setTimeout(function(){
			$.post("getdata.php", {action: "insert", target: "hardware", osname: osname, hdwname: hdwname},
				function(data,status){
					if(status == "success"){
						if(data == false){
							$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao cadastrar este Hardware!</span>');
							Materialize.toast($toastContent, 1000, 'red darken-3');
						} else {
							$toastContent = $('<span class="white-text"><i class="fa fa-check fa-lg"></i> Hardware cadastrado com sucesso!</span>');
							Materialize.toast($toastContent, 1000, 'light-green');
						}
						callData("gerenciar", "hardware");
					} else {
						$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao cadastrar este Hardware!</span>');
						Materialize.toast($toastContent, 1000, 'red darken-3');
					}
				}
			);
		}, 300);
	}
}
function insertImage(){
	var imgname = document.getElementById('IMGname').value;
	var imgversion = document.getElementById('IMGversao').value;
	var imgdesc = document.getElementById('IMGdescription').value;
	var imgsetorid = document.getElementById('IMGsetor').value;
	var imghdwid = document.getElementById('IMGhdw').value;
	
	if(imgname == "" || imgversion == "" || imgsetorid == "" || imghdwid == ""){
		$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Informe todos os campos!</span>');
		Materialize.toast($toastContent, 1000, 'red darken-3');
	} else {
		document.getElementById("information").innerHTML = "<div style='padding:100px'>"+miniloading+"</div>";
		setTimeout(function(){
			$.post("getdata.php", {action: "insert", target: "imagem", setorid: imgsetorid, hdwid: imghdwid, name: imgname, version: imgversion, desc: imgdesc},
				function(data,status){
					if(status == "success"){
						if(data == false){
							$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao cadastrar esta Imagem!</span>');
							Materialize.toast($toastContent, 1000, 'red darken-3');
						} else {
							$toastContent = $('<span class="white-text"><i class="fa fa-check fa-lg"></i> Imagem cadastrada com sucesso!</span>');
							Materialize.toast($toastContent, 1000, 'light-green');
						}
						callData("gerenciar", "imagem");
					} else {
						$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao cadastrar esta Imagem!</span>');
						Materialize.toast($toastContent, 1000, 'red darken-3');
					}
				}
			);
		}, 300);
	}
}
function insertCiclo(){
	var name = document.getElementById('CICname').value;
	var imagem = $('#CICimg').val(); //retorna um array imagem[0], imagem[1],...
	var setor = document.getElementById('CICsetor').value;
	var description = document.getElementById('CICdescription').value;
	var start = document.getElementById('CICstart').value;
	var end = document.getElementById('CICend').value;

	if(name == "" || imagem.length <= 0 || setor == "" || start == "" || end == ""){
		$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Informe todos os campos!</span>');
		Materialize.toast($toastContent, 1000, 'red darken-3');
	} else {
		document.getElementById("information").innerHTML = "<div style='padding:100px'>"+miniloading+"</div>";
		setTimeout(function(){
			$.post("getdata.php", {action: "insert", target: "ciclo", name: name, setor: setor, imagens: imagem, desc: description, start: start, end: end},
				function(data,status){
					if(status == "success"){
						console.log(data);
						if(data == false){
							$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao registrar Ciclo!</span>');
							Materialize.toast($toastContent, 1000, 'red darken-3');
						} else {
							$toastContent = $('<span class="white-text"><i class="fa fa-check fa-lg"></i> Ciclo registrado com sucesso!</span>');
							Materialize.toast($toastContent, 1000, 'light-green');
						}
						callData("gerenciar", "ciclo");
					} else {
						$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao registrar Ciclo!</span>');
						Materialize.toast($toastContent, 1000, 'red darken-3');
					}
				}
			);
		}, 300);
	}
}

//DELETE FUNCTIONS-------------------------------------------------------------------------------------------
function deleteSetor($setorId){
	document.getElementById("information").innerHTML = "<div style='padding:100px'>"+miniloading+"</div>";
	setTimeout(function(){
		$.post("getdata.php", {action: "delete", target: "setor", id: $setorId},
			function(data,status){
				if(status == "success"){
					if(data == false){
						$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao deletear setor!</span>');
						Materialize.toast($toastContent, 1000, 'red darken-3');
					} else {
						$toastContent = $('<span class="white-text"><i class="fa fa-check fa-lg"></i> Setor deletado com sucesso!</span>');
						Materialize.toast($toastContent, 1000, 'light-green');
					}
					callData("gerenciar", "operacoes");
				} else {
					$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao deletar setor!</span>');
					Materialize.toast($toastContent, 1000, 'red darken-3');
				}
			}
		);
	}, 300);
}
function deleteHdw($hdwId){
	document.getElementById("information").innerHTML = "<div style='padding:100px'>"+miniloading+"</div>";
	setTimeout(function(){
		$.post("getdata.php", {action: "delete", target: "hardware", id: $hdwId},
			function(data,status){
				if(status == "success"){
					if(data == false){
						$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao deletear Hardware!</span>');
						Materialize.toast($toastContent, 1000, 'red darken-3');
					} else {
						$toastContent = $('<span class="white-text"><i class="fa fa-check fa-lg"></i> Hardware deletado com sucesso!</span>');
						Materialize.toast($toastContent, 1000, 'light-green');
					}
					callData("gerenciar", "hardware");
				} else {
					$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao deletar Hardware!</span>');
					Materialize.toast($toastContent, 1000, 'red darken-3');
				}
			}
		);
	}, 300);
}
function deleteImagem($imagemId, $setorId, $hdwId){
	//console.log($imagemId+" - "+$setorId+" - "+$hdwId);
	document.getElementById("information").innerHTML = "<div style='padding:100px'>"+miniloading+"</div>";
	setTimeout(function(){
		$.post("getdata.php", {action: "delete", target: "imagem", id: $imagemId, setorid: $setorId, hdwid: $hdwId},
			function(data,status){
				if(status == "success"){
					if(data == false){
						$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao deletear imagem!</span>');
						Materialize.toast($toastContent, 1000, 'red darken-3');
					} else {
						$toastContent = $('<span class="white-text"><i class="fa fa-check fa-lg"></i> Imagem deletado com sucesso!</span>');
						Materialize.toast($toastContent, 1000, 'light-green');
					}
					callData("gerenciar", "imagem");
				} else {
					$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao deletar imagem!</span>');
					Materialize.toast($toastContent, 1000, 'red darken-3');
				}
			}
		);
	}, 300);
}
function deleteCiclo($cicId, $cicdatacicId){
	document.getElementById("information").innerHTML = "<div style='padding:100px'>"+miniloading+"</div>";
	setTimeout(function(){
		$.post("getdata.php", {action: "delete", target: "ciclo", id: $cicId, dataid: $cicdatacicId},
			function(data,status){
				if(status == "success"){
					if(data == false){
						$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao deletear ciclo!</span>');
						Materialize.toast($toastContent, 1000, 'red darken-3');
					} else {
						$toastContent = $('<span class="white-text"><i class="fa fa-check fa-lg"></i> Ciclo deletado com sucesso!</span>');
						Materialize.toast($toastContent, 1000, 'light-green');
					}
					callData("gerenciar", "ciclo");
				} else {
					$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao deletar ciclo!</span>');
					Materialize.toast($toastContent, 1000, 'red darken-3');
				}
			}
		);
	}, 300);
}

//EDIT FUNCTIONS-------------------------------------------------------------------------------------------
function editSetor(setorId, id, name, descricao, dn){
	console.log(setorId);
	var elem = document.getElementById(setorId);
	var cls = document.getElementsByClassName('setorCard');
	fadeNewSetor();
	$('#addNewSetor').fadeOut(500);
	for(var i = 0; i < cls.length; i++){
		if(cls[i].id != setorId){
			$("#" + cls[i].id).hide(0);
		}
	}
	elem.classList.remove('m6');
	document.getElementById(setorId+'_body').innerHTML = "<div style='padding:100px'>"+miniloading+"</div>";
	setTimeout(function(){
		$.post("getdata.php", {action: "edit", target: "setor", id: id, name: name, descricao: descricao, dn: dn},
			function(data,status){
				if(status == "success"){
					document.getElementById(setorId+'_body').innerHTML = data;
				} else {
					$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao editar setor!</span>');
					Materialize.toast($toastContent, 1000, 'red darken-3');
					callData("gerenciar", "operacoes");
				}
			}
		);
	}, 300);
	
}
function editHdw(hdwId, id, name, os){
	var elem = document.getElementById(hdwId);
	var cls = document.getElementsByClassName('setorCard');
	fadeNewHdw();
	$('#addNewHdw').fadeOut(500);
	for(var i = 0; i < cls.length; i++){
		if(cls[i].id != hdwId){
			$("#" + cls[i].id).hide(0);
		}
	}
	elem.classList.remove('m6');
	document.getElementById(hdwId+'_body').innerHTML = "<div style='padding:100px'>"+miniloading+"</div>";
	setTimeout(function(){
		$.post("getdata.php", {action: "edit", target: "hardware", hdwid: id, hdwname: name, hdwos: os},
			function(data,status){
				if(status == "success"){
					document.getElementById(hdwId+'_body').innerHTML = "<div id='inputOSData'>"+data+"</div>";
					$('select').material_select();
					$('#inputOSData').fadeIn();
				} else {
					$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao editar Hardware!</span>');
					Materialize.toast($toastContent, 1000, 'red darken-3');
					callData("gerenciar", "hardware");
				}
			}
		);
	}, 300);
}
function editImagem(divId, id, setorid, hdwid, name, descricao, versao){
	//console.log(divId+" - "+id+" - "+setorid+" - "+hdwid+" - "+name+" - "+descricao+" - "+versao);
	var elem = document.getElementById(divId);
	var cls = document.getElementsByClassName('setorCard');
	fadeNewImagem();
	$('#addNewSetor').fadeOut(500);
	for(var i = 0; i < cls.length; i++){
		if(cls[i].id != divId){
			$("#" + cls[i].id).hide(0);
		}
	}
	elem.classList.remove('m6');
	document.getElementById(divId+'_body').innerHTML = "<div style='padding:100px'>"+miniloading+"</div>";
	setTimeout(function(){
		$.post("getdata.php", {action: "edit", target: "imagem", id: id, setorid: setorid, hdwid: hdwid, name: name, descricao: descricao, versao: versao},
			function(data,status){
				if(status == "success"){
					document.getElementById(divId+'_body').innerHTML = "<div id='inputIMGData'>"+data+"</div>";
					$('select').material_select();
					$('#inputIMGData').fadeIn();
				} else {
					$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao editar setor!</span>');
					Materialize.toast($toastContent, 1000, 'red darken-3');
					callData("gerenciar", "operacoes");
				}
			}
		);
	}, 300);
}

function editImagemMon(divId, id, setorid, hdwid, name, descricao, versao){
	document.getElementById("information").innerHTML = "<div style='padding:100px'>"+miniloading+"</div>";
	setTimeout(function(){
		$.post("getdata.php", {action: "edit", target: "imagem", id: id, setorid: setorid, hdwid: hdwid, name: name, descricao: descricao, versao: versao},
			function(data,status){
				if(status == "success"){
					document.getElementById("information").innerHTML = "<div id='inputIMGData'>"+data+"</div>";
					$('select').material_select();
					$('.tooltipped').tooltip();
					$('#inputIMGData').fadeIn();
				} else {
					$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao abrir setor!</span>');
					Materialize.toast($toastContent, 1000, 'red darken-3');
					callData("gerenciar", "operacoes");
				}
			}
		);
	}, 300);
}
function editCiclo(divId, id, dataid, name, setor, start, end, desc, images){
	var elem = document.getElementById(divId);
	var cls = document.getElementsByClassName('cicloCard');
	fadeNewCiclo();
	$('#addNewCiclo').fadeOut(500);
	for(var i = 0; i < cls.length; i++){
		if(cls[i].id != divId){
			$("#" + cls[i].id).hide(0);
		}
	}
	elem.classList.remove('m6');
	document.getElementById(divId+'_body').innerHTML = "<div style='padding:100px'>"+miniloading+"</div>";
	setTimeout(function(){
		$.post("getdata.php", {action: "edit", target: "ciclo", id: id, dataid: dataid, name: name, setor: setor, start: start, end: end, desc: desc, imagem: images},
			function(data,status){
				if(status == "success"){
					document.getElementById(divId+'_body').innerHTML = "<div id='inputCICData'>"+data+"</div>";
					$('select').material_select();
					createDatePick('editCICstart', 'editCICend');
					$('#inputCICData').fadeIn();
				} else {
					$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao editar este Ciclo!</span>');
					Materialize.toast($toastContent, 1000, 'red darken-3');
					callData("gerenciar", "ciclo");
				}
			}
		);
	}, 300);
}

//CHANGE FUNCTIONS-------------------------------------------------------------------------------------------
function changeSetor(editId){
	console.log(editId);
	var name = document.getElementById('editOPEname').value;
	var dnName = document.getElementById('editOPEdnName').value;
	var dn = document.getElementById('editOPEdn').value;
	var description = document.getElementById('editOPEdescription').value;
	if(name == "" || dnName == "" || dn == ""){
		$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Todos os campos devem ser preenchidos!</span>');
		Materialize.toast($toastContent, 1000, 'red darken-3');
	} else {
		document.getElementById("information").innerHTML = "<div style='padding:100px'>"+miniloading+"</div>";
		setTimeout(function(){
			$.post("getdata.php", {action: "update", target: "setor", id: editId, name: name, dnname: dnName, dn: dn, description: description},
				function(data,status){
					if(status == "success"){
						if(data == false){
							$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao salvar alterações!</span>');
							Materialize.toast($toastContent, 1000, 'red darken-3');
						} else {
							$toastContent = $('<span class="white-text"><i class="fa fa-check fa-lg"></i> Setor atualizado com sucesso!</span>');
							Materialize.toast($toastContent, 1000, 'light-green');
						}
						callData("gerenciar", "operacoes");
					} else {
						$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao salvar alterações!</span>');
						Materialize.toast($toastContent, 1000, 'red darken-3');
					}
				}
			);
		}, 300);
	}
}
function changeHdw(editId){
	var name = document.getElementById('editHDWname').value;
	var os = document.getElementById('editHDWos').value;

	if(name == "" || os == ""){
		$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Todos os campos devem ser preenchidos!</span>');
		Materialize.toast($toastContent, 1000, 'red darken-3');
	} else {
		document.getElementById("information").innerHTML = "<div style='padding:100px'>"+miniloading+"</div>";
		setTimeout(function(){
			console.log(editId+" - "+name+" / "+os);
			$.post("getdata.php", {action: "update", target: "hardware", id: editId, name: name, os: os},
				function(data,status){
					if(status == "success"){
						if(data == false){
							$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao salvar alterações!</span>');
							Materialize.toast($toastContent, 1000, 'red darken-3');
						} else {
							$toastContent = $('<span class="white-text"><i class="fa fa-check fa-lg"></i> Hardware atualizado com sucesso!</span>');
							Materialize.toast($toastContent, 1000, 'light-green');
						}
						callData("gerenciar", "hardware");
					} else {
						$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao salvar alterações!</span>');
						Materialize.toast($toastContent, 1000, 'red darken-3');
					}
				}
			);
		}, 300);
	}
}
function changeImagem(editId, setorId, edithdwId){
	var name = document.getElementById('editIMGname').value;
	var newsetorId = document.getElementById('newIMGsetor').value;
	var newhdwId = document.getElementById('newIMGhdw').value;
	var version = document.getElementById('editIMGversion').value;
	var desc = document.getElementById('editIMGdescription').value;
	if(name == "" || newsetorId == "" || newhdwId == "" || version == ""){
		$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Todos os campos devem ser preenchidos!</span>');
		Materialize.toast($toastContent, 1000, 'red darken-3');
	} else {
		document.getElementById("information").innerHTML = "<div style='padding:100px'>"+miniloading+"</div>";
		setTimeout(function(){
			$.post("getdata.php", {action: "update", target: "imagem", id: editId, name: name, setorid: setorId, hdwid: edithdwId, newsetorid: newsetorId, newhdwid: newhdwId, version: version, desc: desc},
				function(data,status){
					if(status == "success"){
						if(data == false){
							$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Já existe uma imagem registrada para este Hardware e este setor!</span>');
							Materialize.toast($toastContent, 1000, 'red darken-3');
						} else {
							$toastContent = $('<span class="white-text"><i class="fa fa-check fa-lg"></i> Registro de imagem atualizado com sucesso!</span>');
							Materialize.toast($toastContent, 1000, 'light-green');
						}
						callData("gerenciar", "imagem");
					} else {
						$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao salvar alterações!</span>');
						Materialize.toast($toastContent, 1000, 'red darken-3');
					}
				}
			);
		}, 300);
	}
}
function changeCiclo(editId, editdataId){
	var name = document.getElementById('editCICname').value;
	var newsetorId = document.getElementById('editCICsetor').value;
	var newImg = document.getElementById('CICimg').value;
	var newstart = document.getElementById('editCICstart').value;
	var newend = document.getElementById('editCICend').value;
	var newDesc = document.getElementById('editCICdescription').value;
	if(name == "" || newsetorId == "" || newImg == "" || newstart == "" || newend == ""){
		$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Todos os campos devem ser preenchidos!</span>');
		Materialize.toast($toastContent, 1000, 'red darken-3');
	} else {
		document.getElementById("information").innerHTML = "<div style='padding:100px'>"+miniloading+"</div>";
		setTimeout(function(){
			$.post("getdata.php", {action: "update", target: "ciclo", id: editId, dataid: editdataId, name: name, setorid: newsetorId, imgid: newImg, start: newstart, end: newend, desc: newDesc},
				function(data,status){
					if(status == "success"){
						if(data == false){
							$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao salvar alterações!</span>');
							Materialize.toast($toastContent, 1000, 'red darken-3');
						} else {
							$toastContent = $('<span class="white-text"><i class="fa fa-check fa-lg"></i> Registro de Ciclo de imagens atualizado com sucesso!</span>');
							Materialize.toast($toastContent, 1000, 'light-green');
						}
						callData("gerenciar", "imagem");
					} else {
						$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao salvar alterações!</span>');
						Materialize.toast($toastContent, 1000, 'red darken-3');
					}
				}
			);
		}, 300);
	}
}

//LDAP FUNCTIONS-------------------------------------------------------------------------------------------
function getADstructure(search, ou, objId){
	console.log(objId);
	document.getElementById("entryDetail").innerHTML = miniloading;
	setTimeout(function(){
		$.post("getdata.php", {search: search, target: ou, objid: objId},
			function(data,status){
				if(status == "success"){
					document.getElementById("entryDetail").innerHTML = data;
				} else {
					console.log("ERROR!");
				}
			}
		);
	}, 300);
}

function diveIn(ou, objId){
	console.log(objId);
	document.getElementById("entryDetail").innerHTML = miniloading;
	setTimeout(function(){
		$.post("getdata.php", {search: "OrganizationalUnit", target: ou, objid: objId},
			function(data,status){
				if(status == "success"){
					document.getElementById("entryDetail").innerHTML = data;
				} else {
					console.log("ERROR!");
				}
			}
		);
	}, 300);
}
function selectOU(name, dn, index, objId){
	//console.log(objId);
	document.getElementById(objId+"Name").value = name;
	document.getElementById(objId).value = dn;
	var cls = document.getElementsByClassName('hoverColl');
	var elem = document.getElementById('c_'+index);
	var arch = document.getElementById('tc_'+index);
	var temp1;
	var temp2;

	if(elem != undefined && arch != undefined){
		for(var i=0; i < cls.length; i++){
			temp1 = document.getElementById(cls[i].id);
			temp1.classList.remove('light-green');
			temp2 = document.getElementById('t'+cls[i].id);
			temp2.classList.add('green-text');
			temp2.classList.remove('white-text');
			$('#select'+cls[i].id).slideUp();
		}
		elem.classList.add('light-green');
		arch.classList.remove('green-text');
		arch.classList.add('white-text');
		$('#selectc_'+index).slideDown(300);
	}
}
function addSetor(){
	$('#listSetor').hide();
	$('#addOPE').slideDown(500);
}
function addHdw(){
	$('#listHardware').hide();
	$('select').material_select();
	$('#addHDW').slideDown(500);
}
function addImg(){
	$('#listImagem').hide();
	$('select').material_select();
	$('#addIMG').slideDown(500);
}
function addCiclo(){
	$('#listCiclo').hide();
	$('select').material_select();
	createDatePick('CICstart', 'CICend');
	$('#addCIC').slideDown(500);
}
function fadeNewSetor(){
	$('#addOPE').slideUp(500);
	$('#listSetor').fadeIn(1500);
}
function fadeNewHdw(){
	$('#addHDW').slideUp(500);
	$('#listHardware').fadeIn(1500);
}
function fadeNewImagem(){
	$('#addIMG').slideUp(500);
	$('#listImagem').fadeIn(1500);
}
function fadeNewCiclo(){
	$('#addCIC').slideUp(500);
	$('#listCiclo').fadeIn(1500);
}
//COLETA IMAGENS REFERÊNTES AO SETOR SELECIONADO---------------------
function collectCICimg(CICsetor, divCICimg){
	var setorval = document.getElementById(CICsetor).value;
	if(setorval != ""){
		setTimeout(function(){
			$.post("getdata.php", {search: "imagesBysetor", target: "images", setor: setorval},
				function(data,status){
					if(status == "success"){
						var options = 	"<i class='fa fa-th-large fa-lg prefix green-text text-darken-3'></i>"+
										"<select multiple id='CICimg' name='CICimg'>"+
											"<option value='' disabled selected>Selecione uma ou mais imagens</option>"+ 
											data +
										"</select>"+
										"<label for='CICimg'>Imagens</label>";
						document.getElementById(divCICimg).innerHTML = options;
						$('select').material_select();
					}
				}
			);
		}, 300);
	}
}
//-------------------------------------------------------------------

function cancelModalADdive(){
	document.getElementById("OPEdnName").value = "";
	document.getElementById("OPEdn").value = "";
	var cls = document.getElementsByClassName('hoverColl');
	var temp1;
	var temp2;
	for(var i=0; i < cls.length; i++){
		temp1 = document.getElementById(cls[i].id);
		temp1.classList.remove('light-green');
		temp2 = document.getElementById('t'+cls[i].id);
		temp2.classList.add('green-text');
		temp2.classList.remove('white-text');
		$('#select'+cls[i].id).slideUp();
	}
}
function calcChar(){
	var chars = document.getElementById('OPEdescription').value;
	var result = "<b>"+chars.length+"/255</b>";
	document.getElementById('opedesc').innerHTML = result;
}
function calcCharIMG(){
	var chars = document.getElementById('IMGdescription').value;
	var result = "<b>"+chars.length+"/255</b>";
	document.getElementById('imgdesc').innerHTML = result;
}
function calcCharCIC(){
	var chars = document.getElementById('CICdescription').value;
	var result = "<b>"+chars.length+"/255</b>";
	document.getElementById('cicdesc').innerHTML = result;
}
function calcEditChar(){
	var chars = document.getElementById('editOPEdescription').value;
	var result = "<b>"+chars.length+"/255</b>";
	document.getElementById('editopedesc').innerHTML = result;
}
function calcEditIMG(){
	var chars = document.getElementById('editIMGdescription').value;
	var result = "<b>"+chars.length+"/255</b>";
	document.getElementById('editimgdesc').innerHTML = result;
}
function calcEditCIC(){
	var chars = document.getElementById('editCICdescription').value;
	var result = "<b>"+chars.length+"/255</b>";
	document.getElementById('editcicdesc').innerHTML = result;
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
//=====================OLD DATA=====================
function login(){
	$("#loading").fadeIn(300);
	setTimeout(function(){
		$ac = document.getElementById('user').value;
		$ps = document.getElementById('password').value;
		if(($ac != null && $ac != "") && ($ps != null && $ps != "")){
			$.post( "access.php", { user: $ac, password: $ps });
		} else {
			$toastContent = $('<span class="white-text"><i class="fa fa-user-times fa-lg"></i> usuário ou senha incorretos!</span>');
			Materialize.toast($toastContent, 1000, 'red');
		}
		window.location.replace("index.php");
	}, 1000);
}

function callMyData(target){
	togglemenuselection('myid');
	$.post( "getdata.php", { user: target, action: "collect" },
		function(data,status){
			obj = data;
			if(status == "success"){
				document.getElementById("information").innerHTML = data;
			} else {
				console.log("ERROR");
			}
		}
	);
}

function callMyFav(){
	togglemenuselection('star');
	$.post( "getdata.php", { bookmarks: "1", action: "collect" },
		function(data,status){
			obj = data;
			if(status == "success"){
				document.getElementById("information").innerHTML = data;
			} else {
				console.log("ERROR");
			}
		}
	);
}

function callUserData(){
	$("#loading").show();
	var search = document.getElementById('search_bar').value;
	search = btoa(search);
	if(search != null && search != ""){
		setTimeout(function(){
			$.ajaxSetup({async: false});
			$.post( "getdata.php", { contact: search, action: "collect" },
				function(data,status){
					obj = data;
					if(status == "success"){
						document.getElementById("presentation").innerHTML = data;
					} else {
						console.log("ERROR");
					}
				}
			);
			document.getElementById('search_bar').value = "";
			$("#loading").hide();
		}, 1000);
	} else {
		$("#loading").hide();
		$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Informe um contato!</span>');
		Materialize.toast($toastContent, 1000, 'red');
	}
}

function callUserDataModal(user){
	if(user != null && user != ""){
		user = btoa(user);
		//console.log(search);
		$.post( "getdata.php", { contact: user, action: "collect" },
			function(data,status){
				obj = data;
				if(status == "success"){
					document.getElementById("contact-content").innerHTML = data;
				} else {
					console.log("ERROR");
				}
			}
		);
	} else {
		$toastContent = $('<span class="white-text"><i class="fa fa-times"></i> Informe um contato!</span>');
		Materialize.toast($toastContent, 1000, 'red');
	}
}

function callList(){
	$("#loading").fadeIn(300);
	togglemenuselection('list');
	$.ajaxSetup({async: true});
	$.post( "getdata.php", { list: "1", action: "collect" },
		function(data,status){
			obj = data;
			if(status == "success"){
				$("#loading").fadeOut(300);
				document.getElementById("presentation").innerHTML = data;
			} else {
				$("#loading").fadeOut(300);
				console.log("ERROR");
			}
		}
	);
}

function callContacts(){
	$.ajaxSetup({async: false});
	$('#search_bar').autocomplete();
	$('#search_bar').on("keyup", function(event){
		if(event.keyCode >= 48 && event.keyCode <= 90 || (event.keyCode == 229)){
			var val = document.getElementById('search_bar').value;
			$.ajax({
				url: 'getdata.php',
				type: 'post',
				dataType: 'json',
				data: {autocomplete: "1", action: "collect", value: val},
				success: function(data){
					$('#search_bar').autocomplete({
						data: data, 
						limit: 10,
						minLength: 3
					});
				}
			});
			//document.getElementById('returnKey').innerHTML = event.keyCode;
		} else if(event.keyCode == 13) {
			callUserData();
		}
	});
}

function updatedata(){
	$nome = document.getElementById('update_name').value;
	$descricao = document.getElementById('description').value;
	$escritorio = document.getElementById('office').value;
	$email = document.getElementById('mail').value;
	$telefone = document.getElementById('phone').value;
	$celular = document.getElementById('mobile').value;
	$.post( "getdata.php", { update: "1", action: "insert", name: $nome, description: $descricao, office: $escritorio, mail: $email, phone: $telefone, mobile: $celular },
		function(data,status){
			obj = data;
			console.log(obj);
			if(status == "success" && obj == "success"){
				$toastContent = $('<span class="white-text"><i class="fa fa-user-plus fa-lg"></i> Dados atualizado com sucesso!</span>');
				Materialize.toast($toastContent, 1000, 'green');
			} else {
				$toastContent = $('<span class="white-text"><i class="fa fa-user-times fa-lg"></i> Falha ao atualizar dados!</span>');
				Materialize.toast($toastContent, 1000, 'red');
				console.log(obj)
			}
		}
	);
}

function listaFavorito(account){
	//console.log(account);
	$.post( "getdata.php", { addfavorito: "1", account: account },
		function(data,status){
			obj = data;
			if(status == "success" && obj == "success"){
				$toastContent = $('<span class="white-text"><i class="fa fa-user-plus fa-lg"></i> Contato adicionado à sua lista de favoritos!</span>');
				Materialize.toast($toastContent, 1000, 'green');
			} else {
				$toastContent = $('<span class="white-text"><i class="fa fa-user-times fa-lg"></i> Falha ao adicionar contato aos favoritos!</span>');
				Materialize.toast($toastContent, 1000, 'red');
				console.log(obj)
			}
		}
	);
	document.getElementById('addRmvFav').innerHTML = "<a class='btn waves-effect waves-light red white-text' id='favorito' onclick='removeFavorito(\"" + account + "\")' href='#'><i id='favorito_icon' class='fa fa-times'></i> Remover Favorito</a>";
}

function removeFavorito(account){
	//console.log(account);
	//$('#favorito').fadeOut(500);
	$.post( "getdata.php", { rmvfavorito: "1", account: account },
		function(data,status){
			obj = data;
			if(status == "success"){
				$toastContent = $('<span class="white-text"><i class="fa fa-user-times fa-lg"></i> Contato removido da lista de favoritos!</span>');
				Materialize.toast($toastContent, 1000, 'green');
			} else {
				$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao remover contato aos favoritos!</span>');
				Materialize.toast($toastContent, 1000, 'red');
				console.log(obj)
			}
		}
	);
	document.getElementById('addRmvFav').innerHTML = "<a class='btn waves-effect waves-light orange white-text' id='favorito' onclick='listaFavorito(\"" + account +"\")' href='#'><i id='favorito_icon' class='fa fa-star-o'></i> Listar Favorito</a>";
}

function removeFavoritoList(account){
	//console.log(account);
	//$('#favorito').fadeOut(500);
	$.post( "getdata.php", { rmvfavorito: "1", account: account },
		function(data,status){
			obj = data;
			if(status == "success"){
				$toastContent = $('<span class="white-text"><i class="fa fa-user-times fa-lg"></i> Contato removido da lista de favoritos!</span>');
				Materialize.toast($toastContent, 1000, 'green');
			} else {
				$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao remover contato aos favoritos!</span>');
				Materialize.toast($toastContent, 1000, 'red');
				console.log(obj)
			}
		}
	);
	callMyFav();
}

function reloadCatalog(){
	$.post( "getdata.php", { refresh: "1", action: "collect" },
		function(data,status){
			obj = data;
			if(status == "success" && obj == "success"){
				$toastContent = $('<span class="white-text"><i class="fa fa-check fa-lg"></i> Catálogo de contatos atualizado com sucesso!</span>');
				Materialize.toast($toastContent, 1000, 'green');
			} else {
				$toastContent = $('<span class="white-text"><i class="fa fa-times fa-lg"></i> Falha ao atualizar catálogo!</span>');
				Materialize.toast($toastContent, 1000, 'red');
				console.log(obj)
			}
		}
	);
}

function toggleOptions(itemId, cls){
	var elem = document.getElementById(itemId);
	if(hasClass(elem, cls)){
		elem.classList.remove(cls);
		$("#"+itemId).slideDown(500);
	} else {
		elem.classList.add(cls);
		$("#"+itemId).slideUp(500);
	}
}

function togglemenuselection(targetmenu){
	var elem;
	var $elems = document.getElementsByClassName('mouseHover-li');
	for(var i=0; i < $elems.length; i++){
		elem = document.getElementById($elems[i].id);
		elem.classList.remove('darken-2');
		elem.classList.add('darken-3');
	}
	elem = document.getElementById(targetmenu);
	elem.classList.remove('darken-3');
	elem.classList.add('darken-2');
}

function logoff(){
	$("#loading").fadeIn(300);
	window.location.replace("logout.php");
}
function gohome(){
	window.location.replace("index.php");
}

function runScript(event) {
    if (event.keyCode == 13) {
        //callUserData();
    }
}
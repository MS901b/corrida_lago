var largadas = -1;
var minhasLargadas = new Array();

function registerListeners_a1_p1(){
	var applet = document.ggbApplet;
	if (PosicaoAtual.Parte == 0){
		applet.setValue("velAagua",1);
		applet.setValue("velAterra",5);
		applet.setValue("velBagua",1);
		applet.setValue("velBterra",5);
	}
	applet.registerUpdateListener("updateListener_a1_p1");
}

function updateListener_a1_p1(objName) {
	var applet = document.ggbApplet;
	var coordXa = applet.getXcoord("A");
	var coordXb = applet.getXcoord("B");
	if ( (coordXa <= -1) || (coordXb <= -1) ){
		func_stop();
	}
}

// Quando terminarmos de animar, definimos o valor exato dos dois pontos
function func_stop() {
	
	var applet = document.ggbApplet;
	
	if (applet.isAnimationRunning()) {
		applet.stopAnimation();
		largadas++;
		minhasLargadas.push($('valor01').value+'_'+$('valor02').value);
		if(PosicaoAtual.Parte == 1){
			atualizatabela();
		}
		applet.setAnimating('kk',false);
	}
	
}

function atualizatabela(){
	var applet = document.ggbApplet;
	var item1 = Number($('valor01').value).toFixed(2) + '°';
	var item2 = Number($('valor02').value).toFixed(2) + '°';
	if ((applet.getXcoord("A")) < (applet.getXcoord("B"))){
		var item3 = "A";
	}else{
		var item3 = "B";
	}
	if (item1 == item2){
	 var item3 = "Empate";
	}
	var coluna = $('valor01').value+'_'+$('valor02').value;
	var igual = 0;
	for (var i = 0; i <= minhasLargadas.length; i++){
		if (minhasLargadas[i] == coluna){
			igual++;
		}
	}
	if (igual == 1){
	addRow(item3, item1, item2);
	}
}

function atualizatabela2(){
	
	var applet = document.ggbApplet;
	var aux = ((largadas%5) + 2);
	$('parte2_q4_a_' + aux + '1').value = (applet.getValue("angA"));
	$('parte2_q4_a_' + aux + '2').value = (applet.getValue("angB"));
	
	if ((applet.getXcoord("A")) < (applet.getXcoord("B"))){
		$('parte2_q4_a_' + aux + '3').value = "A";
	}else{
		$('parte2_q4_a_' + aux + '3').value = "B";
	}
	
	
}

var ggb = 0;
var flash = 0;
Event.observe(document, 'flash:SalvaLocal', function(ev){
	flash = 1;	
})

function ggbOnInit(){
	registerListeners_a1_p1();
	ggb = 1;
	var applet = document.ggbApplet;
	applet.setErrorDialogsActive(false);
}

Event.observe(window, 'load', function(){
	if (PosicaoAtual.Parte == 0){
		executa();
	}else{
		$('largada').trava();
		$('init01').removeAttribute('disabled');
		$('init02').removeAttribute('disabled');
	
		Event.observe('link_continuar', 'focus', function(evento){
			if(($('link_continuar').className) == 'ativado'){
				setResp('atividade_1',3);
			}
		});
	}
});



function executa(){
	if (flash){
		if ((getResp('atividade_1') == 1) || (getResp('atividade_1') == 'undefined')){
			setResp('atividade_1',2);
		}
		if (PosicaoAtual.Parte == 0){
		if(getResp('a1_box_parte1_q1') != 'undefined'){
		
			$('parte1_q1_a_' + getResp('a1_box_parte1_q1')).setChecked(true);
			
		}
		if(getResp('a1_box_parte1_q2') != 'undefined'){
			$('parte1_q2_a_' + getResp('a1_box_parte1_q2')).setChecked(true);
		}
			
		if(getResp('a1_box_parte1_q3') != 'undefined'){
			$('parte1_q3_a_' + getResp('a1_box_parte1_q3')).setChecked(true);
		}
	}
	}else{
		window.setTimeout(executa, 200);
	}
}

// função que é chamada sempre que todas as questões de uma determinada parte são acertadas
function tudoCerto()
{
	if(Partes.ParteAtual == 1){
		setResp('atividade_1',1);
	}
}



function corrige_q_1_a(valor)	
{
	for (var i = 0; i <= valor.length; i++){
		if (valor[i] == true) setResp('a1_box_parte1_q1', i+1);
	}
	return [valor[0]?true:null, valor[1]?false:null, valor[2]?false:null];
}

function corrige_q_2_a(valor)	
{
	for (var i = 0; i <= valor.length; i++){
		if (valor[i] == true) setResp('a1_box_parte1_q2', i+1);
	}
	return [valor[0]?false:null, valor[1]?true:null, valor[2]?false:null];
}

function corrige_q_3_a(valor)	
{
	for (var i = 0; i <= valor.length; i++){
		if (valor[i] == true) setResp('a1_box_parte1_q3', i+1);
	}
	return [valor[0]?true:null, valor[1]?false:null, valor[2]?false:null];
}

function corrige_q_4_a(valor)	
{
	var diferentes = 0;
	var acertos = 0;
	var conseguiu = 0;
	var k = 0 ;
	for (var k = 0; k < minhasLargadas.length; k++){
		for (var i = 0; i <= minhasLargadas.length; i++){
			if ((i != k)&&(minhasLargadas[i] == minhasLargadas[k])){
				minhasLargadas.splice(i,1);
				}
		}
	}
	
	if (minhasLargadas.length >= 5 ){
		return [true];
	}else{
		return [false];
	}
}

function definirAngulos()	
{
	
	var applet = document.ggbApplet;
	var valor01 = Number($('valor01').value).toFixed(2);
	if (!isNaN(valor01)){
		valor01 = ((valor01*Math.PI)/180);
		if ((valor01 > Math.PI)||(valor01 < 0)){
		applet.evalCommand("angA = 0");
		$('valor01').value = 0;
		$('v01_radiano').update('(0*&#960;)');
		}else{
		applet.evalCommand("angA = " + valor01);
		$('v01_radiano').update('('+roundNumber(Number($('valor01').value)/180,2)+'*&#960; rad)');
		}
	}else{
		applet.evalCommand("angA = 0");
		$('valor01').value = 0;
		$('v01_radiano').update('(0*&#960;)');
	}
	var valor02 = Number($('valor02').value).toFixed(2);
	if (!isNaN(valor02)){
		valor02 = ((valor02*Math.PI)/180);
		if ((valor02 > Math.PI)||(valor02 < 0)){
			applet.evalCommand("angB = 0");
			$('valor02').value = 0;
			$('v02_radiano').update('(0*&#960;)');
		}else{
			applet.evalCommand("angB = " + valor02);
			$('v02_radiano').update('('+roundNumber(Number($('valor02').value)/180,2)+'*&#960; rad)');
		}
	}
	else{
		$('valor02').value = 0;
		applet.evalCommand("angB = 0");
		$('v02_radiano').update('(0*&#960; rad)');
	}
	if ($('valor01').value == ''){
		$('valor01').value = 0;
		applet.evalCommand("angA = 0");
		$('v01_radiano').update('(0*&#960; rad)');
	}
	if ($('valor02').value == ''){
		$('valor02').value = 0;
		applet.evalCommand("angB = 0");
		$('v02_radiano').update('(0*&#960; rad)');
	}
}

function largada()	
{
	
	var applet = document.ggbApplet;
	if (!applet.isAnimationRunning()) {
		definirAngulos();
		applet.stopAnimation();
		applet.setValue('kk',0);
		applet.setAnimating('kk',true);
		applet.setAnimationSpeed('kk', 0.8);
		applet.startAnimation();
	}else{

		applet.stopAnimation();
		applet.setValue('kk',0);
		applet.setAnimating('kk',false);
		applet.setAnimationSpeed('kk', 0.8);
		recomecar();
		window.setTimeout(largada, 200);
	}
}

function recomecar()	
{
	var applet = document.ggbApplet;
	applet.stopAnimation();
	applet.setAnimating('kk',false);
	applet.setValue('kk', 0);
	applet.setCoords('C', 1, 0);
	applet.setCoords('D', 1, 0);
	applet.setCoords('A', 1, 0);
	applet.setCoords('B', 1, 0);
}

function set_inicial(){
	var applet = document.ggbApplet;
	var init01 = $('init01').value;
	init01 = init01.replace(",",".");
	var init02 = $('init02').value;
	init02 = init02.replace(",",".");
	if  ((init01 < 0.5)||(init01 > 10)||(init02 < 0.1)||(init02 > 2)){
	
	var Perg =  
		{
			conteudo: 'O software aceita apenas valores entre 0.1 e 2 m/s para a velocidade nadando e 0.5 e 10 para a velocidade correndo.',
			layout: ['seta_baixo','direita'],
			largura: 10,
			callback: function (){},
			respostas: [{sim: 'Ok'}]
		};
		var tmp = new PopupCallback($('link_valor_inicial'), Perg.conteudo,Perg.layout, Perg.largura, Perg.callback, Perg.respostas);
		tmp.abre();
		Event.stopObserving($('link_valor_inicial'),'click');
		//$('link_valor_inicial').writeAttribute({onclick: 'javascript:set_inicial();'});		
		Event.observe($('link_valor_inicial'), 'click', set_inicial);

	}else{
		$('valor_inicial').addClassName('desabilitada');
		$('init01').trava();
		$('init02').trava();
		$('link_valor_inicial').hide();
		$('unset_inicial').show();
		applet.setValue("velAagua",init02);
		applet.evalCommand("velAterra = " + init01);
		applet.evalCommand("velBagua = " + init02);
		applet.evalCommand("velBterra = " + init01);
		removeEsperando({Parte: 1, Questao:'parte2_q4', Item: 0}, '');
		$('largada').destrava();
	}
}

function unset_inicial()
{
	if (this.resultado == 'sim')
	{
		$('valor_inicial').removeClassName('desabilitada');
		$('init01').destrava();
		$('init02').destrava();
		adicionaEsperando({Parte:1, Questao:'parte2_q4', Item: 0});
		limpa_tabela();
		recomecar();
		$('link_valor_inicial').show();
		$('unset_inicial').hide();
		$('largada').trava();
		largadas = 0;
		minhasLargadas = new Array();
	}
}

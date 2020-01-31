function compararFuncao(func1,func2) {
	if ((func1 == '')||(func2 == '')){
		return [false];
	}

	var applet = document.ggbApplet;
	applet.deleteObject('func_1');
	applet.deleteObject('func_2');
	applet.deleteObject('func_3');
	applet.deleteObject('RespComparador');

	primeirafuncao = 'func_1(x)=' + func1;
	segundafuncao = 'func_2(x)=' + func2;

	applet.evalCommand(primeirafuncao);
	applet.setVisible('func_1',false);
	applet.evalCommand(segundafuncao);
	applet.setVisible('func_2',false);
	applet.evalCommand('func_3(x)=abs(func_1(x)-func_2(x))');
	applet.setVisible('func_3',false);
	applet.evalCommand('RespComparador = Integral[func_3(x),-1,1]');
	if (!applet.isDefined('RespComparador')){
		return [false];
	}
	applet.setVisible('RespComparador',false);
	saida = applet.getValue('RespComparador');

	if (saida<0.01)
		return [true];
	else
		return [false];
}

var ggb = 0;
var flash = 1;
var doc = 0;
Event.observe(document, 'flash:SalvaLocal', function(ev){
	flash = 1;

	checkInits();

	if (PosicaoAtual.Parte == 0){
		if (getResp('atividade_2') != 3){
				setResp('atividade_2',2);
			}
	}
});

function ggbOnInit(){

	registerListeners_a1_p1();

	var applet = document.ggbApplet;
	applet.setErrorDialogsActive(false);

	ggb = 1;

	if (getResp('atividade_2') != 3){
			setResp('atividade_2',2);
	}

	checkInits();


	if (PosicaoAtual.Parte == 1){
		if (flash){
		}
	}
}

function checkInits()
{
	// Para partes sem Geogebra
	if  (PosicaoAtual.Parte==2) ggb = 1;


	// Checagem se tanto SalvaLocal e Geogebra foram carregados.
	if  (flash && ggb && doc) initOnLoad();
}

function initOnLoad()

{

	if (!isNaN(getResp('a2p1_vel_terra'))){
		MeuBloco[0]='<em>Velocidades escolhidas como referência na parte 1<\/em>';
		MeuBloco[1]='Velocidade média correndo: ' + getResp('a2p1_vel_terra') + ' m/s.';
		MeuBloco[2]='Velocidade média nadando: ' + getResp('a2p1_vel_agua') + ' m/s.';
	}

	switch (PosicaoAtual.Parte) {
	case 0:
		if ($('init01')){
			$('init01').removeAttribute('disabled');
		}

		if ($('init02')){
			$('init02').removeAttribute('disabled');
		}

		if(getResp('a2p1_vel_agua') != 'undefined'){
			if ($('init02')){
				$('init02').value = getResp('a2p1_vel_agua');
			}
		}
		if(getResp('a2p1_vel_terra') != 'undefined'){
			if ($('init01')){
				$('init01').value = getResp('a2p1_vel_terra');
			}
		}

		if (((getResp('a2p1_vel_agua') != '0'))&&((getResp('a2p1_vel_terra') != '0'))){
			if (((!isNaN(getResp('a2p1_vel_agua'))))&&((!isNaN(getResp('a2p1_vel_terra'))))){
				set_inicial();
			}
		}

		if(getResp('parte1_q1_a') != 'undefined'){
			if ($('parte1_q1_a')){
				$('parte1_q1_a').value = getResp('parte1_q1_a');
			}
		}
		if(getResp('parte1_q2_a') != 'undefined'){
			if ($('parte1_q2_a')){
				$('parte1_q2_a').value = getResp('parte1_q2_a');
			}
		}
		if(getResp('parte1_q2_b') != 'undefined'){
			if ($('parte1_q2_b')){
				$('parte1_q2_b').value = getResp('parte1_q2_b');
			}
		}
		if(getResp('parte1_q3_a') != 'undefined'){
			if ($('parte1_q3_a')){
				$('parte1_q3_a').value = getResp('parte1_q3_a');
			}
		}
		if(getResp('parte1_q3_b') != 'undefined'){
			if ($('parte1_q3_b')){
				$('parte1_q3_b').value = getResp('parte1_q3_b');
			}
		}

		Event.observe('parte1_q1_a', 'change', function(evento){
			if ($('parte1_q1_a')){
				if ($('parte1_q1_a').value != ""){
					setResp('parte1_q1_a',$('parte1_q1_a').value);
				}
			}
		});

		Event.observe('parte1_q2_a', 'change', function(evento){
			if ($('parte1_q2_a')){
				if ($('parte1_q2_a').value != ""){
				setResp('parte1_q2_a',$('parte1_q2_a').value);
			}
			}
		});

		Event.observe('parte1_q2_b', 'change', function(evento){
			if ($('parte1_q2_b')){
				if ($('parte1_q2_b').value != ""){
				setResp('parte1_q2_b',$('parte1_q2_b').value);
			}
			}
		});

		Event.observe('parte1_q3_b', 'change', function(evento){
			if ($('parte1_q3_b')){
				if ($('parte1_q3_b').value != ""){
				setResp('parte1_q3_b',$('parte1_q3_b').value);
			}
			}
		});
	break;
	case 1:

		$('a2p2_a').update(getResp('q3a'));
		$('a2p2_b').update(getResp('q3b'));
		if (getResp('atividade_2') != 3){
			setResp('atividade_2',2);
		};
		if(getResp('parte2_q4_a') != 'undefined'){
			$('parte2_q4_a').value = getResp('parte2_q4_a');
		};
		if(getResp('parte2_q4_b') != 'undefined'){
			$('parte2_q4_b').value = getResp('parte2_q4_b');
		};
		if(getResp('parte2_q4_c') != 'undefined'){
			$('parte2_q4_c').value = getResp('parte2_q4_c');
		};
		if(getResp('parte2_q5_a') != 'undefined'){
			$('parte2_q5_a').value = getResp('parte2_q5_a');
		};
		if(getResp('parte2_q5_b') != 'undefined'){
			$('parte2_q5_b').value = getResp('parte2_q5_b');
		};
		if(getResp('parte2_q6_a') != 'undefined'){
			$('parte2_q6_a').value = getResp('parte2_q6_a');
		};
		if(getResp('a2_box_parte2_q6') != 'undefined'){
		$('parte2_q6_b_' + getResp('a2_box_parte2_q6')).setChecked(true);
		};
		Event.observe('parte2_q4_a', 'change', function(evento){
			if ($('parte2_q4_a').value != ""){
				setResp('parte2_q4_a',$('parte2_q4_a').value);
			}
		});

		Event.observe('parte2_q4_b', 'change', function(evento){

			if ($('parte2_q4_b').value != ""){
				setResp('parte2_q4_b',$('parte2_q4_b').value);
			}
		});

		Event.observe('parte2_q4_c', 'change', function(evento){
			if ($('parte2_q4_c').value != ""){
				setResp('parte2_q4_c',$('parte2_q4_c').value);
			}
		});

		Event.observe('parte2_q5_a', 'change', function(evento){
			if ($('parte2_q5_a').value != ""){
				setResp('parte2_q5_a',$('parte2_q5_a').value);
			}
		});

		Event.observe('parte2_q5_b', 'change', function(evento){
			if ($('parte2_q5_b').value != ""){
				setResp('parte2_q5_b',$('parte2_q5_b').value);
			}
		});

		Event.observe('parte2_q6_a', 'change', function(evento){
			if ($('parte2_q6_a').value != ""){
				setResp('parte2_q6_a',$('parte2_q6_a').value);
			}
		});


		//Geogebra
		var applet = document.ggbApplet;
		applet.setValue("v_a", getResp('a2p1_vel_agua'));
		applet.setValue("v_t", getResp('a2p1_vel_terra'));
		criei = 1;
		var x_derivada = applet.getXcoord("pDerivada");
		if (isNaN(x_derivada)){
			if (applet.getValue("fZero") > applet.getValue("fPi")){
				x_derivada = applet.getXcoord("fZero");
			}else{
				x_derivada = 3.14159265;
			}
		}
		applet.evalCommand("yMaximoA = f("+x_derivada+")");

				if (applet.getValue("yMaximoA") > 330){
					if (applet.getValue("yMaximoA") > 660){
						applet.setCoordSystem(-0.3, 3.53, -60, applet.getValue("yMaximoA") + 60);
					}else{
						applet.setCoordSystem(-0.3, 3.53, -30, applet.getValue("yMaximoA") + 20);
					}
				}else{
					if (applet.getValue("yMaximoA") < 110){
						applet.setCoordSystem(-0.3, 3.53, -1, applet.getValue("yMaximoA") + 2);
					}else{
						applet.setCoordSystem(-0.3, 3.53, -30, applet.getValue("yMaximoA") + 20);
					}
				}

	break;
	case 2:
		if (($('XXX'))&&($('tanto1'))&&($('tanto2'))){
		$('XXX').update(getResp('frase_conclusao'));
		$('tanto1').update(getResp('a2p1_vel_terra'));
		$('tanto2').update(getResp('a2p1_vel_agua'));
		setResp('atividade_2',3);
		}
	break;
	}


}


Event.observe(window, 'load', function(){

	doc = 1;
	checkInits();

});



function registerListeners_a1_p1(){
	var applet = document.ggbApplet;
	applet.registerUpdateListener("updateListener_a1_p1");
	applet.registerAddListener("addListener_a3_p1");
}
function addListener_a3_p1(objName) {
	var applet = document.ggbApplet;
	applet.setVisible(objName, false);
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
	applet = document.ggbApplet;
	if (applet.isAnimationRunning()) {
		applet.stopAnimation();
		applet.setAnimating('kk',false);
	}
}

// função que é chamada sempre que todas as questões de uma determinada parte são acertadas
function tudoCerto()
{
	('Parabénss, você acertou tudo');
}



function corrige_q_1_a(valor)
{
	var resp = (compararFuncao(valor[0],'50*x'));
	if (resp == 'true'){
		setResp('parte1_q1_a',valor[0]);
		return [true];
	}else{
		return [false];
	}
}

function corrige_q_1_b(valor)
{
	setResp('parte1_q1_b',valor[0]);
	return [valor[0]?true:null, valor[1]?false:null, valor[2]?false:null];
}

function corrige_q_2_a(valor)
{
	var applet = document.ggbApplet;
	var resp =  (compararFuncao(valor[0],'pi-x'));

	if (resp == 'true'){
		setResp('parte1_q2_a',valor[0]);
		applet.setLabelVisible("beta", true);
		return [true];
	}else{
		return [false];
	}
}
function corrige_q_2_b(valor)
{
	var applet = document.ggbApplet;

	applet.setErrorDialogsActive(false);
	var expressao = valor[0];
	for (var i = 0; i < expressao.length/3; i++){
		expressao = expressao.replace(/sen/i,"sin");
		expressao = expressao.replace(/,/i,".");
	}
	expressao = expressao.replace("X","x");

	var resp = (compararFuncao(expressao,'100*cos(x/2)'));
	if (resp == 'true'){
		setResp('parte1_q2_b',expressao);
		return [true];
	}else{
		return [false];
	}
}

function corrige_q_3_a(valor)
{
	var expressao = valor[0];
	for (var i = 0; i < expressao.length/3; i++){
		expressao = expressao.replace(/sen/i,"sin");
		expressao = expressao.replace(/,/i,".");
	}
	expressao = expressao.replace("X","x");
	valor[0] = expressao;
	var resp = compararFuncao(valor[0],'50*x/'+getResp('a2p1_vel_terra'));
	if (resp == 'true'){
		setResp('parte1_q3_a',valor[0]);
		setResp('q3a', valor[0]);
		return [true];
	}else{
		return [false];
	}
}

function corrige_q_3_b(valor)
{
	var applet = document.ggbApplet;

	applet.setErrorDialogsActive(false);
	var expressao = valor[0];
	for (var i = 0; i < expressao.length/3; i++){
		expressao = expressao.replace(/sen/i,"sin");
		expressao = expressao.replace(/,/i,".");
	}
	expressao = expressao.replace("X","x");
	var resp = compararFuncao(expressao,'100*cos(x/2)/'+getResp('a2p1_vel_agua'));

	if (resp == 'true'){
		setResp('parte1_q3_b',valor[0]);
		setResp('q3b', valor[0]);
		return [true];
	}else{
		return [false];
	}
}

var resp4a = 0;
function corrige_q_4_a(valor)
{
	var applet = document.ggbApplet;

	var x_derivada = applet.getXcoord("pDerivada");
	var xMaximo = applet.getValue("Xraiz");
	var yMaximo = applet.getValue("maximo");
	var expressao = valor[0];
	expressao = expressao.replace(",",".");
	valor[0] = expressao;
	setResp('parte2_q4_a',valor[0]);
		if (applet.getValue("fZero") > applet.getValue("fPi")){
			if (yMaximo > applet.getValue("fZero")){
			resp4a = 2;
			if (((valor[0] - yMaximo) < 0.26)&&((valor[0] - yMaximo) > - 0.26)){
				return [true];
			}else{
				return [false];
			}
			}else{
				resp4a = 0;
				return corrige_q_5_a(valor);
			}
		}else{
			if (yMaximo > applet.getValue("fZero")){
				resp4a = 2;
			if (((valor[0] - yMaximo) < 0.26)&&((valor[0] - yMaximo) > - 0.26)){

				return [true];
			}else{
				return [false];
			}
			}else{
				resp4a = 1;
				return corrige_q_5_b(valor);
			}
		}
}

function corrige_q_4_b(valor)
{
	var applet = document.ggbApplet;
	var xMaximo = applet.getValue("Xraiz");
	var yMaximo = applet.getValue("maximo");
	var expressao = valor[0];
	expressao = expressao.replace(",",".");
	valor[0] = expressao;
	setResp('parte2_q4_b',valor[0]);
		if (applet.getValue("fZero") > applet.getValue("fPi")){
			if (yMaximo > applet.getValue("fZero")){
				resp4a = 2;
			}else{
				resp4a = 0;
			}
		}else{
			if (yMaximo > applet.getValue("fZero")){
				resp4a = 2;
			}else{
				resp4a = 1;
			}
		}
	if (resp4a == 0){
			if (valor[0] == '0'){
				return [true];
			}
			else{
				return [false]
			}
		}else{
			if (resp4a == 1){
				return compararFuncao(valor[0],'pi');
			}else{
				if (((valor[0] - xMaximo) < 0.1)&&((valor[0] - xMaximo) > - 0.1)){
					return [true];
				}else{
					return [false];
				}
			}
		}
}

function corrige_q_4_c(valor){
	var applet = document.ggbApplet;
	var xMaximo = applet.getValue("Xraiz");
	var yMaximo = applet.getValue("maximo");
	var expressao = valor[0];
	expressao = expressao.replace(",",".");
	valor[0] = expressao;
	setResp('parte2_q4_c',valor[0]);

		if (applet.getValue("fZero") > applet.getValue("fPi")){
			if (yMaximo > applet.getValue("fZero")){
			resp4a = 2;
			}else{
				resp4a = 0;
			}
		}else{
			if (yMaximo > applet.getValue("fZero")){
				resp4a = 2;
			}else{
				resp4a = 1;
			}
		}
	if (resp4a == 0){
			if (valor[0] == '0'){
				return [true];
			}
			else{
				return [false]
			}
		}else{
			if (resp4a == 1){
			return compararFuncao(valor[0],'180');
		}else{
			if (((valor[0] - (xMaximo*(180/Math.PI)) < 2)&&((valor[0] - (xMaximo*(180/Math.PI))  > - 2)))){
				return [true];
			}else{
				return [false];
			}
		}
	}
}

function corrige_q_5_a(valor)
{
	var applet = document.ggbApplet;
	var expressao = valor[0];
	expressao = expressao.replace(",",".");
	valor[0] = expressao;
	setResp('parte2_q5_a',valor[0]);
	if (((valor[0] - applet.getValue("fZero")) < 0.26)&&((valor[0] - applet.getValue("fZero")) > - 0.26)){
		return [true];
	}else{
		return [false];
	}
}

function corrige_q_5_b(valor)
{
	var applet = document.ggbApplet;
	var expressao = valor[0];
	expressao = expressao.replace(",",".");
	valor[0] = expressao;
	setResp('parte2_q5_b',valor[0]);
	if (((valor[0] - applet.getValue("fPi")) < 0.26)&&((valor[0] - applet.getValue("fPi")) > - 0.26)){
		return [true];
	}else{
		return [false];
	}
}

var resp = -1;

function corrige_q_6_a(valor)
{
	var applet = document.ggbApplet;
	setResp('parte2_q6_a',valor[0]);
	if (applet.getValue("fZero") < applet.getValue("fPi")){
		resp = 0;
		setResp('frase_conclusao', ' fazer todo o percurso por água.');
		return corrige_q_5_a(valor);
	}else{
		setResp('frase_conclusao', ' fazer todo o percurso por terra.');
		resp = 1;
		return corrige_q_5_b(valor);
	}
}

function corrige_q_6_b(valor)
{
	var applet = document.ggbApplet;

	if (applet.getValue("fZero") < applet.getValue("fPi")){
		resp = 0;
	}else{
		resp = 1;
	}
	if (!criei){
		return [valor[0]?false:null, valor[1]?false:null, valor[2]?false:null,  valor[3]?false:null,  valor[4]?false:null];
	}
	for (var i = 0; i <= valor.length; i++){
		if (valor[i] == true) setResp('a2_box_parte2_q6', i+1);
	}
	if (!resp){
		return [valor[0]?true:null, valor[1]?false:null, valor[2]?false:null,  valor[3]?false:null,  valor[4]?false:null];
	}else{
		return [valor[0]?false:null, valor[1]?false:null, valor[2]?false:null,  valor[3]?false:null,  valor[4]?true:null];
	}

}



function selecionou_q_1_a(){
	var applet = document.ggbApplet;
	applet.setVisible("c", true);
	applet.setVisible("C", true);
	applet.setVisible("g", true);
	applet.setVisible("b", false);
	applet.setVisible("d", false);
	applet.setVisible("e", true);
	applet.setVisible("beta", false);
	}

function selecionou_q_2_a(){
	var applet = document.ggbApplet;
	applet.setVisible("C", true);
	applet.setVisible("c", false);
	applet.setVisible("g", false);
	applet.setVisible("b", false);
	applet.setVisible("d", true);
	applet.setVisible("e", true);
	applet.setVisible("beta", true);
}

function selecionou_q_2_b(){
	var applet = document.ggbApplet;
	applet.setVisible("C", true);
	applet.setVisible("c", false);
	applet.setVisible("g", false);
	applet.setVisible("b", true);
	applet.setVisible("d", true);
	applet.setVisible("e", true);
	applet.setVisible("beta", false);
}
function selecionou_q_3_a(){
	var applet = document.ggbApplet;
	applet.setVisible("C", true);
	applet.setVisible("c", false);
	applet.setVisible("g", false);
	applet.setVisible("b", true);
	applet.setVisible("d", true);
	applet.setVisible("e", true);
	applet.setVisible("beta", false);
}
function definirAngulos()
{
}

function largada()
{
}

function recomecar()
{
	var applet = document.ggbApplet;
	applet.stopAnimation();
	applet.setAnimating('kk',false);
	applet.setCoords('A', 1, 0);
	applet.setCoords('B', 1, 0);
	applet.setCoords('C', 1, 0);
	applet.setCoords('D', 1, 0);
	applet.setValue('kk', 0);
}

function set_inicial(){
	var init01 = $('init01').value;
	init01 = init01.replace(",",".");
	var init02 = $('init02').value;
	init02 = init02.replace(",",".");
	$('init01').value = init01;
	$('init02').value = init02;
	if  ((init01 < 0.5)||(init01 >10)||(init02 < 0.1)||(init02 > 2)){

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
		$('init01').writeAttribute({disabled: 'disabled'});
		$('init02').writeAttribute({disabled: 'disabled'});
		setResp('a2p1_vel_terra', init01);
		setResp('a2p1_vel_agua', init02);
		MeuBloco[0]='<em>Velocidades escolhidas como referência na parte 1<\/em>';
		MeuBloco[1]='Velocidade média correndo: ' + getResp('a2p1_vel_terra') + ' m/s.';
		MeuBloco[2]='Velocidade média nadando: ' + getResp('a2p1_vel_agua') + ' m/s.';
		removeEsperando({Parte: 0, Questao:'parte2_q1', Item: 0}, '');
		removeEsperando({Parte: 0, Questao:'parte2_q2', Item: 0}, '');
		removeEsperando({Parte: 0, Questao:'parte2_q2', Item: 1}, '');
		removeEsperando({Parte: 0, Questao:'parte2_q3', Item: 0}, '');
		removeEsperando({Parte: 0, Questao:'parte2_q3', Item: 1}, '');
		$('link_valor_inicial').hide();
		$('unset_inicial').show();
		$('msgErrDin1').update(init01);
		$('msgErrDin2').update(init02);

	}
}

function unset_inicial()
{
	if (this.resultado == 'sim')
	{
		$('valor_inicial').removeClassName('desabilitada');
		$('init01').removeAttribute('disabled');
		$('init02').removeAttribute('disabled');
		adicionaEsperando({Parte:0, Questao:'parte2_q1', Item: 0});
		adicionaEsperando({Parte: 0, Questao:'parte2_q2', Item: 0});
		adicionaEsperando({Parte: 0, Questao:'parte2_q2', Item: 1});
		adicionaEsperando({Parte: 0, Questao:'parte2_q3', Item: 0});
		adicionaEsperando({Parte: 0, Questao:'parte2_q3', Item: 1});
		$('link_valor_inicial').show();
		$('unset_inicial').hide();

		$('SalvaLocal').Salva(nomeSoft, 'automacao_atividade_'+PosicaoAtual.Atividade+'_parte_1', '1');
		$('SalvaLocal').Salva(nomeSoft, 'automacao_atividade_'+PosicaoAtual.Atividade+'_parte_2', '1');
		if (flash){
			setResp('a2p1_vel_terra', 0);
			setResp('a2p1_vel_agua', 0);
		}
		 permiteContinuar(false);
		setResp('automacao_atividade_2_parte_1',0);
		gerencia_partes();

	}
}

var exibir = 0;
var criei = 0;
function exibir_funcao(){
	var applet = document.ggbApplet;
	if (!criei){
		applet.setValue("v_a", getResp('a2p1_vel_agua'));
		applet.setValue("v_t", getResp('a2p1_vel_terra'));
		criei = 1;
	}
	if (exibir == 0){
	applet.setVisible("f", true);
	applet.setVisible("c", true);
	applet.setVisible("d", true);
	applet.setVisible("A", true);
	applet.setVisible("texto1", true);
	exibir = 1;
	}else{
		exibir = 0;
	applet.setVisible("f", false);
	applet.setVisible("c", false);
	applet.setVisible("d", false);
	applet.setVisible("A", false);
	applet.setVisible("texto1", false);
	}
}

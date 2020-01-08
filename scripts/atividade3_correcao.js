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

	if (saida<0.05) 
		return [true];
	else
		return [false];
}
Event.observe(document, 'flash:SalvaLocal', function(ev){
	flash = 1;
	checkInits();

	
	
})
var ggb = 0;
var doc = 0;
function ggbOnInit(){
	ggb = 1;
	var applet = document.ggbApplet;
	applet.setErrorDialogsActive(false);
	checkInits();
}


function checkInits()
{	
	// Checagem se tanto SalvaLocal e Geogebra foram carregados.
	if  (flash && ggb && doc) initOnLoad();
	
}

function initOnLoad()

{

	if (getResp('atividade_3') != 3){
			setResp('atividade_3',2);
	}

	if(getResp('a3_box_parte1_q1') != 'undefined'){
		$('parte1_q1_a_' + getResp('a3_box_parte1_q1')).setChecked(true);
	}
	if(getResp('a3_parte1_q2_a') != 'undefined'){
			$('parte1_q2_a').value = getResp('a3_parte1_q2_a');
	}
	
	Event.observe('link_continuar', 'focus', function(evento){
		if (flash){
			if(($('link_continuar').className) == 'ativado'){
				setResp('atividade_3',3);
			}
		}
	});
	
}
Event.observe(window, 'load', function(){

	doc = 1; 
	checkInits();

});

// função que é chamada sempre que todas as questões de uma determinada parte são acertadas
function tudoCerto()
{
	//('Parabénss, você acertou tudo');
}

function corrige_q_1_a(valor)	
{
	for (var i = 0; i <= valor.length; i++){
		if (valor[i] == true) setResp('a3_box_parte1_q1', i+1);
	}
	return [valor[0]?false:null, valor[1]?true:null, valor[2]?false:null];
}

function corrige_q_2_a(valor)	
{
	var applet = document.ggbApplet;
	applet.setErrorDialogsActive(false);	
	var expressao = valor[0];
	for (var i = 0; i < expressao.length/3; i++){
		expressao = expressao.replace(/sen/i,"sin");
		expressao = expressao.replace(/,/i,".");
		expressao = expressao.replace(/PI/i,"pi");
	}
	expressao = expressao.replace("X","x");
	
	setResp('a3_parte1_q2_a', expressao);
	return (compararFuncao(expressao,'6/pi'));
}
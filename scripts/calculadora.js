var calcAberta = false;
var LinhaAtual = new Array();
var Historico = new Array();
var UltimoResultado = null;
var UltimoResultadoStr = null;
var AngulosEmGraus = true;
var shimmer_calc = false;

var TIPO_ELEMENTO_OPERACAO = 1;
var TIPO_ELEMENTO_NUMERO = 2;
var TIPO_ELEMENTO_FUNCAO = 4;


var simbolos = new Hash({
		"Pi": {display: "&#960;", calc: 'Math.PI'},
		"e": {display: "&#101;", calc: 'Math.E'}
		});

var funcoes = new Hash({
		"Sqrt": {display: "&radic;", calc: 'Math.sqrt(#)', angulo:0},
		"log": {display: "log ", calc: 'calcLog(#,10)', angulo:0},
		"ln":  {display: "ln ", calc: 'Math.log(#)', angulo:0},
		"sen":  {display: "sen ", calc: 'Math.sin(#)', angulo:1},
		"arcsen":  {display: "arcsen ", calc: 'Math.asin(#)', angulo:-1},		
		"cos":  {display: "cos ", calc: 'Math.cos(#)', angulo:1},		
		"arccos":  {display: "arccos ", calc: 'Math.acos(#)', angulo:-1},		
		"tg":  {display: "tg ", calc: 'Math.tan(#)', angulo:1},
		"arctg":  {display: "arctg ", calc: 'Math.atan(#)', angulo:-1}
		});

		

var DIGITOS_MAXIMOS_NUMERO = 8;
var DECIMAIS_MAXIMOS_RESPOSTA = 10;



Event.observe(window, 'load', function(){
	var div = $('calc');
	div.insert(fechar = new Element('a', {id: 'calc_fechar', href: '/'}));
	div.insert(new Element('a', {id: 'calc_interrogacao'}).update('?'));
	
	fechar.observe('click', calculadora);
	
	var popup = new PopupClick($('calc_interrogacao'), 'Essa calculadora está sujeita às imprecisões inerentes a cálculos realizados por computador.', ['seta_baixo', 'esquerda'], 10);	
	popup.fixa();
	
	var painel = new Element('div', {id: 'calc_painel'});
	painel.insert(new Element('div', {id: 'calc_resultado3'}).update(''));
	painel.insert(new Element('div', {id: 'calc_expressao3'}).update(''));
	painel.insert(new Element('br', {className: 'limpador'}));
	painel.insert(new Element('div', {id: 'calc_resultado2'}).update(''));
	painel.insert(new Element('div', {id: 'calc_expressao2'}).update(''));
	painel.insert(new Element('br', {className: 'limpador'}));
	painel.insert(new Element('div', {id: 'calc_resultado1'}).update(''));
	painel.insert(new Element('div', {id: 'calc_expressao1'}).update(''));
	painel.insert(new Element('br', {className: 'limpador'}));
	
	div.insert(painel);
	div.insert(new Element('div', {id: 'calc_label'}).update(''));
	div.insert(new Element('div', {id: 'calc_unidade'}).update('graus'));
	
	var botoes = new Element('div', {id: 'calc_botoes'});
	
	botoes.insert(new Element('a', {id: 'calc_botao7', 				className: 'calc_botao_preto', 			value: '7'})		.update('7'));
	botoes.insert(new Element('a', {id: 'calc_botao8', 				className: 'calc_botao_preto', 			value: '8'})		.update('8'));
	botoes.insert(new Element('a', {id: 'calc_botao9', 				className: 'calc_botao_preto', 			value: '9'})		.update('9'));
	botoes.insert(new Element('a', {id: 'calc_botao_dividir', 		className: 'calc_botao_vermelho', 		value: '/'})		.update('&divide;'));
	botoes.insert(new Element('a', {id: 'calc_botao_raiz', 			className: 'calc_botao_cinza', 			value: 'Sqrt'})		.update('&radic;'));
	botoes.insert(new Element('a', {id: 'calc_botao_sen', 			className: 'calc_botao_cinza_medio', 	value: 'sen'})		.update('sen'));
	botoes.insert(new Element('a', {id: 'calc_botao_arcsen', 		className: 'calc_botao_cinza_grande', 	value: 'arcsen'})	.update('arcsen'));
	botoes.insert(new Element('a', {id: 'calc_botao_mais_menos',	className: 'calc_botao_mais_menos', 	value: '+-'})		.update('&nbsp;'));
	botoes.insert(new Element('a', {id: 'calc_botao_e', 			className: 'calc_botao_azul', 			value: 'E'})		.update('E'));
	
	botoes.insert(new Element('div', {className: 'calc_limpador'}));
	
	botoes.insert(new Element('a', {id: 'calc_botao4', 				className: 'calc_botao_preto', 			value: '4'})		.update('4'));
	botoes.insert(new Element('a', {id: 'calc_botao5', 				className: 'calc_botao_preto', 			value: '5'})		.update('5'));
	botoes.insert(new Element('a', {id: 'calc_botao6', 				className: 'calc_botao_preto', 			value: '6'})		.update('6'));
	botoes.insert(new Element('a', {id: 'calc_botao_multiplicacao', className: 'calc_botao_vermelho', 		value: '*'})		.update('&times;'));
	botoes.insert(new Element('a', {id: 'calc_botao_y2', 			className: 'calc_botao_y2', 			value: '^'})		.update('&nbsp;'));
	botoes.insert(new Element('a', {id: 'calc_botao_cos', 			className: 'calc_botao_cinza_medio', 	value: 'cos'})		.update('cos'));
	botoes.insert(new Element('a', {id: 'calc_botao_arccos', 		className: 'calc_botao_cinza_grande', 	value: 'arccos'})	.update('arccos'));
	botoes.insert(new Element('a', {id: 'calc_botao_resp', 			className: 'calc_botao_azul_grande', 	value: 'resp'})		.update('RESP'));
	
	botoes.insert(new Element('div', {className: 'calc_limpador'}));
	
	botoes.insert(new Element('a', {id: 'calc_botao1',				className: 'calc_botao_preto',			value: '1'})		.update('1'));
	botoes.insert(new Element('a', {id: 'calc_botao2', 				className: 'calc_botao_preto', 			value: '2'})		.update('2'));
	botoes.insert(new Element('a', {id: 'calc_botao3', 				className: 'calc_botao_preto', 			value: '3'})		.update('3'));
	botoes.insert(new Element('a', {id: 'calc_botao_menos', 		className: 'calc_botao_vermelho', 		value: '-'})		.update('&minus;'));
	botoes.insert(new Element('a', {id: 'calc_botao_e_pequeno', 	className: 'calc_botao_cinza', 			value: 'e'})		.update('e'));
	botoes.insert(new Element('a', {id: 'calc_botao_tg', 			className: 'calc_botao_cinza_medio', 	value: 'tg'})		.update('tg'));
	botoes.insert(new Element('a', {id: 'calc_botao_arctg', 		className: 'calc_botao_cinza_grande', 	value: 'arctg'})	.update('arctg'));
	botoes.insert(new Element('a', {id: 'calc_botao_rad', 			className: 'calc_botao_azul_grande', 	value: 'angulo'})	.update('rad'));
	
	botoes.insert(new Element('div', {className: 'calc_limpador'}));
	
	botoes.insert(new Element('a', {id: 'calc_botao_virgula',		className: 'calc_botao_preto', 			value: ','})		.update(','));
	botoes.insert(new Element('a', {id: 'calc_botao0', 				className: 'calc_botao_preto', 			value: '0'})		.update('0'));
	botoes.insert(new Element('a', {id: 'calc_botao_igual', 		className: 'calc_botao_amarelo', 		value: '='})		.update('='));
	botoes.insert(new Element('a', {id: 'calc_botao_mais', 			className: 'calc_botao_vermelho', 		value: '+'})		.update('+'));
	botoes.insert(new Element('a', {id: 'calc_botao_pi', 			className: 'calc_botao_pi', 			value: 'Pi'})		.update('&nbsp;'));
	botoes.insert(new Element('a', {id: 'calc_botao_ln', 			className: 'calc_botao_cinza_medio', 	value: 'ln'})		.update('ln'));
	botoes.insert(new Element('a', {id: 'calc_botao_log', 			className: 'calc_botao_cinza_grande', 	value: 'log'})		.update('log'));
	botoes.insert(new Element('a', {id: 'calc_botao_apagar', 		className: 'calc_botao_apagar', 		value: 'apagar'})	.update('apagar'));
	div.insert(botoes);
	
	div.observe('mousedown', function(ev){ev.stop();})
	
	// observa as teclas no document pra acessibilidade da calc
	//document.observe('keydown', pegaTeclas);
	
	botoes.select('a').each(function(el)
	{
		el.href = './';
		el.addClassName('calc_botao');
		el.observe('mousedown', TeclaPressionada);
		el.observe('mousedown', function(ev){Event.element(ev).addClassName('active')});
		el.observe('mouseup', function(ev){Event.element(ev).removeClassName('active')});
		el.observe('click', function(ev){ev.stop()});
	});
	
});

function calculadora(ev)
{
	if(ev) ev.stop();
	if (calcAberta)
	{
		$('calc').hide();
		calcAberta = false;
		
		if (shimmer_calc)
			shimmer_calc.remove();
		shimmer_calc = false;
	}
	else
	{
		fechaFerramentas();
		$('calc').show();
		$('calc').removeClassName('escondido')
		calcAberta = true;
		
		shimmer_calc = montaShimmer({
			height: ($('calc').getHeight()+2)+'px',
			width: $('calc').getWidth()+'px',
			left: '40px',
			bottom: '56px'
		}).setStyle({position: 'fixed'});
	}
}

function pegaTeclas(ev)
{
	var key = ev.which | ev.keyCode;
	if(!calcAberta)
		return;
	
	
	tecla = false;
	
	if(key == 27)									calculadora();
	if(key == 13)									tecla = '=';
	if(key >= 48 && key <= 57 && !ev.shiftKey)		tecla = String(key-48);
	if(key >= 96 && key <= 105)						tecla = String(key-96);
	if(key == 106 || (key == 56 && ev.shiftKey))	tecla = '*';
	if(key == 107)									tecla = '+';
	if(key == 109)									tecla = '-';
	if(key == 110 || key == 194
	|| key == 190 || key == 188)					tecla = ',';
	if(key == 111 || key == 193)					tecla = '/';
	
	if(tecla)
	{
		TeclaPressionada(tecla);
		ev.stop();
	}
}

function TeclaPressionada(ev)
{
	if(typeof ev == 'string')
		valor = ev;
	else
	{
		valor = Event.element(ev).readAttribute('value');
		ev.stop();
	}
	
	switch (valor)
	{
		case '0': case '1': case '2': case '3': case '4':case '5':case '6':case '7': case '8':case '9':case ',': case 'E':
			insereNumero(String(valor));
			break
		case '*':  case '-': case '/': case '+': case '^':
			insereOperacao(String(valor))
			break
		case 'Pi':  case 'e':
			insereNumero(String(valor))
			break;
		case 'Sqrt': case 'log': case 'ln': case 'sen': case 'arcsen': case 'cos': case 'arccos': case 'tg': case 'arctg':
			insereFuncao(String(valor));
			break;
		case '=':
			calcResultadoAtual();
			break;
		case '+-':
			trocaSinal();
			break;
		case 'apagar':
			LinhaAtual.clear();
			break;
		case 'resp':
			botaoResp();
			break;
		case 'angulo':
			mudaModoAngulo();
			break;
			
			

	};

	$('calc_label').update(displayLinhaAtual(false));
}

function insereNumero(valor)
{

	if (LinhaAtual.length>0) 
	{
		if (LinhaAtual.last().tipo==TIPO_ELEMENTO_NUMERO) 
		{
			LinhaAtual.last().addDigit(valor);
		} 
		else
		{
			LinhaAtual.push(new elementoCalculadora(TIPO_ELEMENTO_NUMERO,valor));
		}
	}
	else
	{
		LinhaAtual.push(new elementoCalculadora(TIPO_ELEMENTO_NUMERO,valor));
	}
};


function insereOperacao(valor)
{

	if ( ((contaOperacoes(LinhaAtual)>0) || (contaFuncoes(LinhaAtual)>0)) && (LinhaAtual.last().tipo==TIPO_ELEMENTO_NUMERO) )
	{
		calcResultadoAtual();
		insereOperacao(valor);
	} 
	else
	{
		if (LinhaAtual.length==0)
		{
			if (UltimoResultado!=null) 
			{
				LinhaAtual.push(new elementoCalculadora(TIPO_ELEMENTO_NUMERO,UltimoResultadoStr));
				insereOperacao(valor);
			}
		} else if (LinhaAtual.last().tipo!=TIPO_ELEMENTO_OPERACAO) LinhaAtual.push(new elementoCalculadora(TIPO_ELEMENTO_OPERACAO,valor));	
	}
	
}


function insereFuncao(valor)
{

	if (LinhaAtual.length==0)
	{
		LinhaAtual.push(new elementoCalculadora(TIPO_ELEMENTO_FUNCAO,valor));
	} 

	if ((LinhaAtual.length==1) && (LinhaAtual.last().tipo==TIPO_ELEMENTO_NUMERO))
	{
		LinhaAtual.unshift(new elementoCalculadora(TIPO_ELEMENTO_FUNCAO,valor));
		calcResultadoAtual();
	}
	
	if ((LinhaAtual.length==3) && (contaFuncoes(LinhaAtual)==0) && (contaOperacoes(LinhaAtual)==1))
	{
		calcResultadoAtual();
		LinhaAtual.push(new elementoCalculadora(TIPO_ELEMENTO_FUNCAO,valor));
		botaoResp();
		calcResultadoAtual();
	}	
}


function trocaSinal()
{
	
	if ((LinhaAtual.length==0) || ((LinhaAtual.last().tipo!=TIPO_ELEMENTO_NUMERO) ))
	{
		LinhaAtual.push(new elementoCalculadora(TIPO_ELEMENTO_NUMERO,'-'));
	} 
	else LinhaAtual.last().trocaSinal(); 

}

function contaOperacoes(linha)
{
	var res = 0;
	for (var i=0;i<linha.length;i++) 
		if (linha[i].tipo==TIPO_ELEMENTO_OPERACAO) res++;
	
	return res;
}

function contaFuncoes(linha)
{
	var res = 0;
	for (var i=0;i<linha.length;i++) 
		if (linha[i].tipo==TIPO_ELEMENTO_FUNCAO) res++;
	
	return res;
}


function formataResultado(resultado)
{
	if (resultado!=null)
	{	
		//resultado = calcRoundNumber(resultado,DECIMAIS_MAXIMOS_RESPOSTA);
		//alert(resultado);
		if (String(resultado).length>DIGITOS_MAXIMOS_NUMERO) resultado = resultado.toPrecision(DIGITOS_MAXIMOS_NUMERO);
		
		resultado = String(resultado).replace('.',',');
		resultado = resultado.replace('e','E');

		
		if (resultado.indexOf('E')>-1) 
		{
			var resultado_split = String(resultado).split('E');
			resultado_split[0] = resultado_split[0].replace(/^0+|0+$/g, '') ;
			if (resultado_split[0].indexOf(',')>-1) 
			{
				resultado_split[0].replace(/^\0+|\0+$/g, '') ;
				if (resultado_split[0].endsWith(',')) resultado_split[0]= resultado_split[0].substring(0, resultado_split[0].length-1); 
				//resultado_split[0] = resultado_split[0].replace(',','.');
				//resultado_split[0] = String(calcRoundNumber(Number(resultado_split[0]),DECIMAIS_MAXIMOS_RESPOSTA));
				//resultado_split[0] = resultado_split[0].replace(',','.');
			} 
			else
			{
				while (resultado_split[0].endsWith('0')) 
				{
					resultado_split[0]= resultado_split[0].substring(0, resultado_split[0].length-1);
					resultado_split[1] = Number(resultado_split[1]) + 1;
				}
			}
			
			resultado = resultado_split[0] + 'E' + resultado_split[1];
		} 
		
		
		

	}
	
	return resultado;


}



function calcResultadoAtual()
{
	var resultado = "Erro";
	if (LinhaAtual.length>0) 
	{
		try
		{
			if ((LinhaAtual[0].tipo==TIPO_ELEMENTO_NUMERO) && ((LinhaAtual.length==3)))
			{
				if ( (LinhaAtual[1].tipo!=TIPO_ELEMENTO_OPERACAO) && (LinhaAtual[2].tipo!=TIPO_ELEMENTO_NUMERO) ) throw "Erro";

				var num1 = LinhaAtual[0].getValor();
				var num2 = LinhaAtual[2].getValor();
				
				if ((num1==null) || (num2==null)) throw "Erro";
				
				if (LinhaAtual[1].conteudo!='^') 
				{
					var op = ' ' + LinhaAtual[1].conteudo + ' ';
					resultado = eval( num1 + op + num2)			
				} 
				else
				{
					resultado = Math.pow(num1,num2)
				}
			} 

			if ((LinhaAtual[0].tipo==TIPO_ELEMENTO_NUMERO) && ((LinhaAtual.length==1)))
			{ 
				resultado = LinhaAtual[0].getValor(); 
			} 
				
			if ((LinhaAtual[0].tipo==TIPO_ELEMENTO_FUNCAO) && ((LinhaAtual.length==2) && (LinhaAtual[1].tipo==TIPO_ELEMENTO_NUMERO)))
			{
				
				var num1 = LinhaAtual[1].getValor();
				if (num1==null) throw "Erro";
				var el = funcoes.get(LinhaAtual[0].conteudo);
				if ((AngulosEmGraus) && (el.angulo==1))
					num1 = num1 * Math.PI / 180;
				var temp = el.calc.replace('#',String(num1));
				if (el!=undefined)
					resultado = eval(temp);
				if (isNaN(resultado)) throw "Erro";
				
				if ((AngulosEmGraus) && (el.angulo==-1))
					resultado = resultado * 180 / Math.PI;
					
					resultado = calcRoundNumber(resultado,DECIMAIS_MAXIMOS_RESPOSTA);
					//alert(resultado);

					//alert(resultado);
			}

			
			
			if ((resultado==Infinity) || (resultado== -Infinity)) throw "Estouro";
			if (resultado == null) throw "Erro";
			Historico.unshift([displayLinhaAtual(true),formataResultado(resultado)])
		}
		catch (err) 
		{
			//console.log("Erro: ",err);
			Historico.unshift([displayLinhaAtual(true),'Erro'])
			resultado = null;
		}


		LinhaAtual.clear();
		if (Historico.length>3) Historico.pop();

		displayHistorico();
		$('calc_label').update(displayLinhaAtual(false));
		
		UltimoResultado = resultado;
		UltimoResultadoStr=formataResultado(resultado);
		return(resultado!="Erro");
	}
}

function displayLinhaAtual(spaces)
{
	var display = '';
	var elemento = '';
	for (var i = 0;i<LinhaAtual.length;i++)
	{
		elemento = LinhaAtual[i].getDisplayConteudo();
		if ((spaces) && (LinhaAtual[i].tipo==TIPO_ELEMENTO_OPERACAO)) elemento = ' ' + elemento + ' ';
		display += elemento;
	}
	return display;
}

function displayHistorico()
{
	for (var i=0;i<Historico.length;i++) 
	{

		$('calc_expressao'+(i+1)).update(Historico[i][0]+'&nbsp;&nbsp;=&nbsp;&nbsp;');
		$('calc_resultado'+(i+1)).update(Historico[i][1]);
	}
	
	for (var i=Historico.length;i<3;i++) 
	{
		$('calc_expressao'+(i+1)).update('');
		$('calc_resultado'+(i+1)).update('');
	}
	
	
}

function calcLog(n,b)
{
	return Math.log(n)/Math.log(b);
}

function mudaModoAngulo()
{
	if (AngulosEmGraus) 
	{
		$('calc_unidade').update('rad');
		AngulosEmGraus = false;
		$('calc_botao_rad').update('grad');
	}
	else
	{
		$('calc_unidade').update('grad');
		AngulosEmGraus = true;
		$('calc_botao_rad').update('rad');
	
	}
}	

function botaoResp()
{
	if ((!isNaN(UltimoResultado)) && (UltimoResultado!=null) )
	{
		if ((LinhaAtual.length==0) || (LinhaAtual.last().tipo!=TIPO_ELEMENTO_NUMERO)) 
			LinhaAtual.push(new elementoCalculadora(TIPO_ELEMENTO_NUMERO,UltimoResultadoStr))
		else LinhaAtual.last().conteudo=UltimoResultadoStr;
	}
}

function calcRoundNumber(num, dec) {
	var result = Number(num.toFixed(dec))
	return result;
}


var elementoCalculadora = Class.create
({
	tipo: null,
	conteudo: '',
	initialize: function (tipo, conteudo)
	{
		this.tipo = tipo;
		
		if ((tipo==TIPO_ELEMENTO_NUMERO) && (conteudo.length==1)) this.addDigit(conteudo)
		else this.conteudo = conteudo;
	},
	addDigit: function(digit) 
	{
		
		if (this.tipo==null) { this.tipo = TIPO_ELEMENTO_NUMERO }
		

		if ((this.tipo==TIPO_ELEMENTO_NUMERO) && (this.conteudo.length<=DIGITOS_MAXIMOS_NUMERO))
		{
			if (this.conteudo.length==0)
			{
				if (digit==',') this.conteudo = '0';
				if (digit=='E') this.conteudo = '1';
			}
			else
			{
				var simbolo = simbolos.get(digit);
				if (simbolo==undefined) 
				{
					if ((digit==',') && (  (this.conteudo.indexOf(',')>-1) || (this.conteudo.indexOf('E')>-1) )) return;
					if ((digit=='E') && (  (this.conteudo.indexOf('E')>-1) || (this.conteudo.endsWith(',')) )) return;
				}
				else
				{
					if ((this.conteudo.indexOf(digit)>-1) || (this.conteudo.indexOf('E')>-1) && (this.conteudo.indexOf(',')>-1)) return
				}
			}
			this.conteudo += String(digit);
			
		}
	},
	setOper: function(oper)
	{
		this.tipo = TIPO_ELEMENTO_OPERACAO;
		this.conteudo = oper;
	},
	getValor: function()
	{
		var resp = null;
		if (this.tipo==TIPO_ELEMENTO_NUMERO)
		{
			if (this.conteudo.indexOf('E')>-1)
			{
				resp =  this.conteudo.split('E')[0].replace(',','.') + ' * ' + 'Math.pow(10,'+this.conteudo.split('E')[1]+')'
			}
			else 
			{
				resp = this.conteudo.replace(',','.');
			}
			resp = this.converteSimbolosValor(resp);
			try
			{
				return eval(resp);
			} 
			catch (err)
			{
				return null;
			}
			
		} else return null;
	},
	trocaSinal: function()
	{
		if (this.tipo==TIPO_ELEMENTO_NUMERO) 
		{
		
			if (this.conteudo.indexOf('E')>-1)
			{
				var direita = this.conteudo.split('E')[1];
				if (direita.startsWith('-')) direita = direita.replace('-','')
				else direita = '-'+direita;
				this.conteudo = this.conteudo.split('E')[0]+'E'+direita;
			} 
			else
			{
				if (this.conteudo.startsWith('-')) this.conteudo = this.conteudo.replace('-','')
				else this.conteudo = '-'+this.conteudo;
			}
		}
	
	},
	converteSimbolosDisplay: function(valor)
	{

		simbolos.each(function(el){
			valor = valor.replace(el.key,el.value.display)
			})
		return valor;
	},
	converteSimbolosValor: function(valor)
	{

		simbolos.each(function(el){
			valor = valor.replace(el.key,'*'+el.value.calc+'*')
			})
		valor = valor.replace(/^\*+|\*+$/g, '') ;
		valor = valor.replace('**','*');
		valor = valor.replace('-*','-');
		return valor;
	},
	
	getDisplayConteudo: function() 
	{
		switch (this.tipo) 
		{
			case TIPO_ELEMENTO_NUMERO:
			
				return this.converteSimbolosDisplay(this.conteudo);
				break;
			case TIPO_ELEMENTO_OPERACAO:
				switch (this.conteudo) 
				{
					case '-':
						return '&minus;';
						break;
					case '+':
						return '+';
						break;
					case '/':
						return '&divide;';
						break;
					case '*':
						return '&lowast;';
						break;
					case '^':
						return '^';
						break;
				}
			break;
			case TIPO_ELEMENTO_FUNCAO:
				var el = funcoes.get(this.conteudo);
				if (el!=undefined) return el.display ;
				else return null;
			break;
		}
	
		}
});


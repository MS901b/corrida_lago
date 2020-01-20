/*
	Padronização do ID: 
		- [['p/parte','q/questao','/item'],'_'] vai gerar um id do tipo p1_q2_1
		- [['p/parte','q/questao','/itemletra'],'_'] vai gerar um id do tipo p1_q2_a
	Palavras-chave: questao, parte, item, itemletra, subitem
	Devem ser precedidas de uma barra '/'.
	A palavra-chave subitem será usada somente em questões com mais de um campo
*/
 
var IdPadrao = [['parte/parte','q/questao','/itemletra','/subitem'],'_'];

/*
	Questoes
	
	Aqui ficam concentrados todos os conteudos das questões da atividade!
	Veja que está separado por Parte/Questão/Item
	
	ATENÇÃO: Cada tipo possui um formato de entrada característico.
*/
var Partes = ['1', '2', 'C'];

var Questoes = 
[
	{//Parte 1
		parte2_q1: //Questão 1
		{
			itens: 
			[
				{//A
					tipo: 'input',
					corrigir: corrige_q_1_a,
					esperando: true,
					dependente: false,
					associado: false,
					enunciado: 'Qual é a medida do arco D<sub>T</sub>, indicado na figura, em função do ângulo x (em radianos)? Note que essa medida corresponde à distância percorrida em terra pelo competidor.',
					selecionada: selecionou_q_1_a,
					msgAjuda: 'Lembre-se que a medida do ângulo x está sendo considerada em radianos. Você pode usar uma regra de três para calcular o valor de Dt em função de x.',
					msgErro: 'O comprimento do arco é proporcional à medida do ângulo.'
				}
			]
		},
		parte2_q2: //Questão 1
		{
			itens: 
			[
				{//A
					tipo: 'input',
					corrigir: corrige_q_2_a,
					esperando: true,
					dependente: false,
					associado: false,
					caracteres_especiais: true,
					enunciado: 'Qual é a medida (em radianos) do ângulo indicado na figura em função do ângulo x.',
					selecionada: selecionou_q_2_a,
					msgErro: 'Note que o ângulo é complementar de x.'
				},
				{
					tipo: 'input',
					corrigir: corrige_q_2_b,
					esperando: true,
					dependente: false,
					associado: false,
					caracteres_especiais: true,
					enunciado: 'Qual a medida da <a id="corda">corda</a> D<sub>A</sub> indicada em vermelho?',
					selecionada: selecionou_q_2_b,
					msgErro: 'Note que, com essa corda, você pode formar um triângulo isósceles com dois raios do círculo.'
				}
			]
		},
		parte2_q3: //Questão 1
		{
			enunciadoGeral: 'Sabemos que Velocidade  Média = Distância/Tempo. A partir disso, responda:',
			itens: 
			[
				{//A
					tipo: 'input',
					corrigir: corrige_q_3_a,
					esperando: true,
					dependente: false,
					associado: false,
					caracteres_especiais: true,
					selecionada: selecionou_q_1_a,
					enunciado: 'Quanto tempo, em função de x, o competidor gasta correndo?',
					msgErro: 'Use a resposta obtida na questão 1 e lembre-se de que a velocidade de corrida é igual a <span id="msgErrDin1">#</span>.'
				},
				{//A
					tipo: 'input',
					corrigir: corrige_q_3_b,
					esperando: true,
					dependente: false,
					associado: false,
					
					selecionada: selecionou_q_3_a,
					enunciado: 'Quanto tempo, em função de x, o competidor gasta nadando? ',
					msgErro: 'Use a resposta obtida no item A da questão 2 e lembre-se de que a velocidade nadando escolhida é igual a <span id="msgErrDin2"></span>.'
				}
			]
		}
	},
	// Parte 2
	{
		parte2_q4:
		{
			enunciadoGeral: 'Analisando visualmente o gráfico da função, responda:',
			itens:
			[
				{//A
					tipo: 'input',
					corrigir: corrige_q_4_a,
					esperando: false,
					dependente: false,
					associado: false,
					enunciado: 'Qual é o máximo da função, ou seja, qual é o maior tempo que o corredor poderia levar na disputa?',
					msgErro: 'Você pode movimentar o ponto azul no gráfico para obter a resposta.'
				},
				{//B
					tipo: 'input',
					corrigir: corrige_q_4_b,
					esperando: false,
					dependente: false,
					associado: false,
					enunciado: 'Qual é o ângulo (em radianos) em que o competidor deveria saltar para obter esse maior tempo?',
					msgErro: 'Você pode movimentar o ponto azul no gráfico para obter a resposta.'
				},
				{//B
					tipo: 'input',
					corrigir: corrige_q_4_c,
					esperando: false,
					dependente: false,
					associado: false,
					enunciado: 'Qual o valor em graus desse ângulo?',
					msgErro: 'Converta o valor obtido no item anterior para graus. Lembre-se que pi pode ser aproximado para 3,14.'
				}
			]
		},
		parte2_q5:
		{
			itens:
			[
				{//A
					tipo: 'input',
					corrigir: corrige_q_5_a,
					esperando: false,
					dependente: false,
					associado: false,
					enunciado: 'Quanto tempo o competidor leva se fizer todo o percurso nadando?',
					msgErro: 'Essa situação ocorre quando o ângulo é igual a 0.'
				},
				{//B
					tipo: 'input',
					corrigir: corrige_q_5_b,
					esperando: false,
					dependente: false,
					associado: false,
					enunciado: 'Quanto tempo o competidor leva se fizer todo o percurso correndo?',
					msgErro: 'Essa situação ocorre quando o ângulo é igual a 180&&deg;, ou seja, pi radianos.'
				}
			]
		},
		parte2_q6: //Questão 1
		{
			itens: 
			[
				{//A
					tipo: 'input',
					corrigir: corrige_q_6_a,
					esperando: false,
					dependente: false,
					associado: false,
					enunciado: 'Qual é o menor tempo possível para completar o percurso?',
					msgErro: 'Veja o menor valor assumido pela função no domínio estabelecido pelo problema.'
				},
				{//B
					tipo: 'multipla_escolha',
					corrigir: corrige_q_6_b,
					enunciado: 'Qual é o ângulo em que o competidor deveria saltar na água para obter esse menor tempo?',
					dados:	[
						{value: '1', label: '0&deg;, ou seja, já no início.'},
						{value: '0', label: '45&deg;'},
						{value: '0', label: '90&deg;'},
						{value: '0', label: '135&deg;'},
						{value: '1', label: '180&deg;, ou seja, não saltar.'}
						],
					msgErro: 'Veja qual o menor valor assumido pela função no domínio estabelecido pelo problema.'
				}
			]
		}
	},
	// Parte C
	{
	}
]

var MeuBloco = new Array(
);


Event.observe(window, 'load', function(){
	BlocoNotas = new Blocao();

});

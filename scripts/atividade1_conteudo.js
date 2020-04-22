/*
	Padronização do ID: 
		- [['p/parte','q/questao','/item'],'_'] vai gerar um id do tipo p1_q2_1
		- [['p/parte','q/questao','/itemletra'],'_'] vai gerar um id do tipo p1_q2_a
	Palavras-chave: questao, parte, item, itemletra, subitem
	Devem ser precedidas de uma barra '/'.
	A palavra-chave subitem será usada somente em questões com mais de um campo
*/

var IdPadrao = [
    ['parte/parte', 'q/questao', '/itemletra', '/subitem'], '_'
];

/*
	Questoes
	
	Aqui ficam concentrados todos os conteudos das questões da atividade!
	Veja que está separado por Parte/Questão/Item
	
	ATENÇÃO: Cada tipo possui um formato de entrada característico.
*/
var Partes = ['1', '2'];

var Questoes = [{ //Parte 1
        parte1_q1: //Questão 1
        {
            itens: [{ //A
                tipo: 'multipla_escolha',
                corrigir: corrige_q_1_a,
                enunciado: 'Quem vence a disputa se A saltar quando &#945=90&deg; e B quando &#946=50&deg;?',
                dados: [
                    { value: '1', label: 'Competidor A' },
                    { value: '0', label: 'Competidor B' },
                    { value: '0', label: 'Empate' }
                ],
                msgErro: 'Preencha os valores dos ângulos na parte inferior do quadro ao lado e, depois, clique o botão "Largada!" para simular a disputa.'
            }]
        },
        parte1_q2: //Questão 2
        {
            itens: [{ //A
                tipo: 'multipla_escolha',
                corrigir: corrige_q_2_a,
                enunciado: 'Quem vence a disputa se A saltar quando &#945=90&deg; e B quando &#946;=125&deg;?',
                dados: [
                    { value: '0', label: 'Competidor A' },
                    { value: '1', label: 'Competidor B' },
                    { value: '0', label: 'Empate' }
                ],
                msgErro: 'Preencha os valores dos ângulos na parte inferior do quadro ao lado e, depois, clique o botão "Largada!" para simular a disputa.'
            }]
        },
        parte1_q3: //Questão 3
        {
            itens: [{ //A
                tipo: 'multipla_escolha',
                corrigir: corrige_q_3_a,
                enunciado: 'Quem vence a disputa se A fizer todo o percurso correndo e B todo o percurso nadando?',
                dados: [
                    { value: '1', label: 'Competidor A' },
                    { value: '0', label: 'Competidor B' },
                    { value: '0', label: 'Empate' }
                ],
                msgErro: 'Para que o competidor A faça todo o percurso correndo, o valor de &#945; deve ser 180&deg; e para que o competidor B faça todo o percurso nadando, o valor de &#946; deve ser 0&deg;.'
            }]
        }
    },
    { // Parte2
        parte2_q4: //Questão 4
        {
            itens: [{ //B
                tipo: 'generico',
                corrigir: corrige_q_4_a,
                esperando: true,
                associado: false,
                dependente: false,
                enunciado: 'Agora, simule pelo menos 5 disputas, no quadro ao lado, com as velocidades definidas acima. Os resultados ficarão registrados na tabela abaixo.',
                dados: '<div style="float:left;"><div id="listaJogadas" style="height: 153px; width=310px; overflow-x:hidden;y:scroll;"> <table border="0"> <tr> <td valign="top"> <table id="tabelaDados" name="tabelaDados" class="tabela"> <THEAD> <tr><th class="largura5">&#945 (Competidor A)</th><th class="largura5">&#946 (Competidor B)</th><th class="largura5">Vencedor</th></tr></THEAD><TBODY></TBODY></table></td></tr></table></div></div>',
                msgErro: 'Você ainda não fez 5 disputas com as novas velocidades. Se desejar, você pode redefinir as velocidades, mas os valores da tabela serão perdidos.'
            }]
        }
    }
]

var MeuBloco = new Array();

Event.observe(window, 'load', function() {
    BlocoNotas = new Bloco();
});
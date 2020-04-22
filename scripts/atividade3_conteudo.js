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
var Partes = ['1'];

var Questoes = [{ //Parte 1
    parte1_q1: //Questão 1
    {
        itens: [{ //A
            tipo: 'multipla_escolha',
            corrigir: corrige_q_1_a,
            enunciado: 'Se as velocidades em terra e em água forem iguais, qual será a melhor estratégia?',
            dados: [
                { value: '0', label: 'Fazer todo o percurso por terra.' },
                { value: '1', label: 'Fazer todo o percurso por água.' },
                { value: '0', label: 'Trocar de meio exatamente quando x=90&deg;' }
            ],
            msgErro: 'Ajuste os seletores para que as velocidades sejam iguais e analise o gráfico.'
        }]
    },
    parte1_q2: {
        itens: [{ //A
            tipo: 'input',
            corrigir: corrige_q_2_a,
            esperando: false,
            dependente: false,
            associado: false,
            enunciado: 'Se a velocidade por terra for igual a 3 m/s, qual deve ser a velocidade na água para que o tempo nos casos extremos sejam o mesmo?',
            msgErro: 'Tente calcular esse valor algebricamente usando a função T<sub>T</sub>(x).'
        }]
    }
}]
var MeuBloco = new Array();


Event.observe(window, 'load', function() {
    BlocoNotas = new Bloco();

});
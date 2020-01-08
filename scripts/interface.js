var PopupReferencias = null;
var BlocoNotas = null;
var CorrigeTudoPopup;
var Calculadora;
var nomeSoft;
var Partes;

var Referencias = new Array();
var NoValorInicial = false;

var Alertou = false, iQuestao = 0;
var incorreta = null;

var corrigindo = false;
var interface_salva_local_loaded = false;
var interface_document_loaded = false;

var Letras = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','X','W','Y','Z'];


Event.observe(window, 'load', function()
{
	// trata do css (grande e normal) gerenciado por cookie
	css = readCookie('css');
	if (css == 'grande')
	{
		for(i=0; (a = document.getElementsByTagName("link")[i]); i++) 
		{
			if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) 
			{
				a.disabled = true;
				if(a.getAttribute("title") == 'grande') a.disabled = false;
			}
		}
		$('link_acessibilidade').href = 'javascript:setActiveStyleSheet("normal");';
	}
	else
	{
		$('link_acessibilidade').href = 'javascript:setActiveStyleSheet("grande");';
	}
});

Event.observe(document, 'flash:SalvaLocal', function(ev)
{
	interface_salva_local_loaded = true;
	gerencia_corrige_tudo();
	gerencia_partes();
});


document.observe("dom:loaded", function()
{
	var protocol = window.location.protocol;
	if (protocol != 'http:' && protocol != 'https:')
	{
		location.href = 'index.html';
		return;
	}
	
	var Questao = null, Item = null, ajuda = null, PartesAnteriores = 0;	
	
	for(var a = 0; a < PosicaoAtual.Parte; a++)
		PartesAnteriores+= $H(Questoes[a]).keys().length;
	
	if (Questoes != null)
		QuestoesDados = $H(Questoes[PosicaoAtual.Parte]);
	else
		QuestoesDados = [];
	
	QuestoesDados.each( function (dados)
	{
		var QuestaoCont = $(dados.key);
		var Conteudo = $H(dados.value);
		var paragrafo = false;
		
		if(!QuestaoCont)
		{
			alerta('Não foi possível encontrar a div \''+dados.key+'\' \npara inserir a questão na página.\n\n O script foi cancelado.');
			throw $break;
		}
		
		var Questao = new Element('div', {className: 'questao'});
		var EnunciadoGeral = Conteudo.get('enunciadoGeral');
		var QuestaoDados = Conteudo.get('itens');
		var Iniciais = Conteudo.get('itens');
		
		var iItem = 0;
		var iInicial = 0;
		var Contador = 0;
		
		
		while (Contador < QuestaoDados.length)
		{
			ItemDados = $H(QuestaoDados[Contador]);
			Item = new Element('div', {className: 'questao_item'});

			if (ItemDados.get('tipo') != 'valor_inicial')
			{
				divCont = new Element('div', {className: 'colchao'});
				
				if(ItemDados.get('esperando'))
				{
					if (Iniciais[iInicial].Selecao)
					{
						var b = Iniciais[iInicial].Selecao.posicao;
						var pai = PegaInicial(b);
						var selecionaInicial = new ValorInicial(pai, divCont);
					}
					else
					{
						if ($('valor_inicial'))
						{
							var selecionaInicial = new ValorInicial(null, divCont);
						}
						else
							alert('É preciso ter uma div com o id chamada valor_inicial no seu html');
					}
					
				}
					
				divCont.insert(new Element('span', {className: 'icone_questao'}).update(Letras[iItem]));
				if (ItemDados.get('enunciado'))
				{
					divCont.insert(new Element('p').update(ItemDados.get('enunciado')));
					paragrafo = true;
				}
				if (ItemDados.get('tipo') == 'generico')
				{
					if (ItemDados.get('dados'))
					{
						divCont.insert(new Element('br', {className:'limpador'}));
						divCont.insert(new Element('div', {className:'input_texto margem_questao'}).update(ItemDados.get('dados')));
						paragrafo = true;
					}
				}
				if (ItemDados.get('unidade'))
				{
					divCont.insert(new Element('p', {className:'unidade'}).update('Dê a(s) resposta(s) em '+ItemDados.get('unidade')));
					paragrafo = true;
				}
				if (ItemDados.get('imagem'))
				{
					if (ItemDados.get('borda') == 'não')
						tem_borda = 'sem_borda';
					else
						tem_borda = '';
						
					if (paragrafo)
						divCont.insert(new Element('p').update(new Element('img', {src: ItemDados.get('imagem'), className: 'margem_questao imagem_dentro '+ tem_borda}).insert('')));
					else
						divCont.insert(new Element('p').update(new Element('img', {src: ItemDados.get('imagem'), className: 'imagem_dentro '+ tem_borda}).insert('')));
				}
				if (ItemDados.get('depois_enunciado'))
				{
					divCont.insert(new Element('div', {style: 'margin-bottom: 10px;'}).update(ItemDados.get('depois_enunciado')));
				}
				divCont.insert(new Element('br', {className: 'limpador'}));
				Item.insert(divCont);
				
				
				
				if(ItemDados.get('esperando'))
				{
					divCont.addClassName('esperando');
				}
			}
			
			
			switch(ItemDados.get('tipo'))
			{
				
				
				case 'valor_inicial':
					var dateObject = new Date();
					var nome =
						dateObject.getFullYear() + '' +
						dateObject.getMonth() + '' +
						dateObject.getDate() + '' +
						dateObject.getTime();
					  
					var Caixa = new Element('div', {className: 'item sem_titulo'});
					Caixa.insert(new Element('a', {name: nome, className: 'ancora'}));
					Caixa.insert(new Element('p').insert(ItemDados.get('enunciado')));
					Caixa.insert(new Element('br', {className: 'limpador'}));
					
					
					var Dentro = new Element('div', {className: 'conteudo'});
					var itens = new Array();
					
					for (var a = 0; a < ItemDados.get('dados').length; a++)
					{
						for (var b = 0; b < ItemDados.get('dados')[a].length; b++)
						{
							var input = new Element('input', {className: 'input', id: ItemDados.get('dados')[a][b].id});
							itens.push(input);
							var label = new Element('div', {className: 'label'}).update(ItemDados.get('dados')[a][b].label);
							var divisinha = new Element('div', {className: 'a_esquerda caixas'});
							divisinha.insert(label);
							divisinha.insert(new Element('br', {className: 'limpador'}));
							divisinha.insert(input);
							
							Dentro.insert(divisinha);
						}
						if (a+1 != ItemDados.get('dados').length)
							Dentro.insert(new Element('div', {className: 'limpador entre_linhas'}));
					}
					
					Caixa.insert(Dentro);
					Caixa.insert(new Element('br', {className: 'limpador'}));
					var setaValor = new Element('a', {onclick: 'return false;', href: 'javascript:;'}).insert('OK');
					Caixa.insert(setaValor);
					Caixa.insert(new Element('p').insert(new Element('em').insert(ItemDados.get('usado'))));
					Caixa.insert(new Element('div', {className: 'limpador'}));
					
					var divCont = new Element('div', {className: 'valor_dentro'}).insert(Caixa);
					
					Item.insert(divCont);
					iInicial = iItem;
					
					Iniciais[iItem].Selecao = new Selecao(divCont, itens, setaValor, ItemDados.get('seta'), ItemDados.get('tira'));
					Iniciais[iItem].Selecao.posicao = {Parte: PosicaoAtual.Parte, Questao: dados.key, Item:iItem};
					Iniciais[iItem].Selecao.nome = nome;
					
					iItem--;
					
				break;
				
				case 'drag':
					var tmp_drag;
					var verdadeiro = new Element('input', {className: 'some', type: 'checkbox', id: MontaID(PosicaoAtual.Parte+1, iQuestao+1+PartesAnteriores, iItem+1), name: MontaID(PosicaoAtual.Parte+1, iQuestao+1+PartesAnteriores, iItem+1)});
					var dados_drag = $(ItemDados.get('html')).removeClassName('escondido');
					divCont.insert(new Element('div', {className: 'input_texto'}).insert(new Element('div').insert(verdadeiro).insert(tmp = new Element('div'))));
					tmp.replace(dados_drag);
					
					divCont.insert(new Element('br', {className: 'limpador'}));
					colocaAjuda(ItemDados, divCont);
					QuestaoDados[iItem].Corrigir = new Corrigir(ItemDados.get('associado'), ItemDados.get('selecionada'), ItemDados.get('corrigir'),[verdadeiro], ItemDados.get('msgErro'), '', 'drag')
				break;
				
				case 'input':
					var antes = '';
					var depois = '';
					var largura = 306;
					if (ItemDados.get('antes'))
					{
						if (ItemDados.get('antes').length <=5 )
						{
							antes = new Element('span', {className:'a_esquerda margem_questao antes_depois primeiro_modulo'}).insert(ItemDados.get('antes'));
							largura = largura - 40;
						}
						else if (ItemDados.get('antes').length <=9 )
						{
							antes = new Element('span', {className:'a_esquerda margem_questao antes_depois segundo_modulo'}).insert(ItemDados.get('antes'));
							largura = largura -70;
						}
						else
						{
							antes = new Element('span', {className:'a_esquerda margem_questao antes_depois terceiro_modulo'}).insert(ItemDados.get('antes'));
							largura = largura - 100;
						}
					}
					if (ItemDados.get('depois'))
					{
						depois = new Element('span', {className:'a_esquerda antes_depois depois'}).insert(ItemDados.get('depois'));
						
						if (ItemDados.get('depois').length > 8 )						
							largura = largura - 130;
						else if (ItemDados.get('depois').length <= 4 )						
							largura = largura - 40;
						else if (ItemDados.get('depois').length <= 8 )						
							largura = largura - 70;
							
						
					}
					
					var input = new Element('input', {type: 'text', id: MontaID(PosicaoAtual.Parte+1, iQuestao+1+PartesAnteriores, iItem+1), name: MontaID(PosicaoAtual.Parte+1, iQuestao+1+PartesAnteriores, iItem+1)});
					
					var resultado = new Element('div').insert(antes);
					resultado.insert(input);
					resultado.insert(depois);
					divCont.insert(new Element('div', {className: 'input_texto'}).insert(resultado));
					
					
					//alert(largura);
					if (largura > 220 )
						largura = 250;
					if (largura > 190 && largura <= 220 )
						largura = 220;
					if (largura > 160 && largura <= 190 )
						largura = 190;
					if (largura > 140 && largura <= 160 )
						largura = 160;
					if (largura > 110 && largura <= 140 )
						largura = 140;
					if (largura > 80 && largura <= 110 )
						largura = 110;
					if (largura > 20 && largura <= 80 )
						largura = 80;
						
					largura = largura - 13;
					
					if (antes != '' || depois != '')
						input.setStyle({width:largura+'px'});
					if (antes != '')
						input.setStyle({marginLeft: '0px'});
					if (depois != '')
						input.setStyle({marginRight: '5px'});
						
					colocaAjuda(ItemDados, divCont);
						
					if(ItemDados.get('esperando'))
						QuestaoDados[iItem].Corrigir = new Corrigir(ItemDados.get('associado'), ItemDados.get('selecionada'), ItemDados.get('corrigir'),[input], ItemDados.get('msgErro'), null,null,true)
					else
						QuestaoDados[iItem].Corrigir = new Corrigir(ItemDados.get('associado'), ItemDados.get('selecionada'), ItemDados.get('corrigir'),[input], ItemDados.get('msgErro'))
				break;
				
				case 'instrucao':
					var verdadeiro = new Element('input', {className: 'some', type: 'checkbox', id: MontaID(PosicaoAtual.Parte+1, iQuestao+1+PartesAnteriores, iItem+1), name: MontaID(PosicaoAtual.Parte+1, iQuestao+1+PartesAnteriores, iItem+1)});
					divCont.insert(new Element('div', {className: 'input_texto'}).insert(new Element('div').insert(verdadeiro)));
					
					colocaAjuda(ItemDados, divCont);
					if(ItemDados.get('esperando'))
						QuestaoDados[iItem].Corrigir = new Corrigir(ItemDados.get('associado'), ItemDados.get('selecionada'), ItemDados.get('corrigir'),[verdadeiro], ItemDados.get('msgErro'), '', 'radio', true)
					else
						QuestaoDados[iItem].Corrigir = new Corrigir(ItemDados.get('associado'), ItemDados.get('selecionada'), ItemDados.get('corrigir'),[verdadeiro], ItemDados.get('msgErro'), '', 'radio')
				break;
				
				
				case 'generico':
					var verdadeiro = new Element('input', {className: 'some', type: 'checkbox', id: MontaID(PosicaoAtual.Parte+1, iQuestao+1+PartesAnteriores, iItem+1), name: MontaID(PosicaoAtual.Parte+1, iQuestao+1+PartesAnteriores, iItem+1)});
					divCont.insert(new Element('div', {className: 'input_texto'}).insert(new Element('div').insert(verdadeiro)));
					
					colocaAjuda(ItemDados, divCont);
					if(ItemDados.get('esperando'))
						QuestaoDados[iItem].Corrigir = new Corrigir(ItemDados.get('associado'), ItemDados.get('selecionada'), ItemDados.get('corrigir'),[verdadeiro], ItemDados.get('msgErro'), '', 'radio', true)
					else
						QuestaoDados[iItem].Corrigir = new Corrigir(ItemDados.get('associado'), ItemDados.get('selecionada'), ItemDados.get('corrigir'),[verdadeiro], ItemDados.get('msgErro'), '', 'radio')
				break;
				
				
				case 'multipla_escolha':
					var dadosArray = ItemDados.get('dados');
					var dadosObj = new Hash();
					for (var a = 0; a < dadosArray.length; a++)
						dadosObj.set(MontaID(PosicaoAtual.Parte+1, iQuestao+1+PartesAnteriores, iItem+1, a+1), dadosArray[a]);
					
					var mp = new MultiplaEscolha(dadosObj);
					
					divCont.insert(mp.divCont);
					colocaAjuda(ItemDados, divCont);
					if(ItemDados.get('esperando'))
						QuestaoDados[iItem].Corrigir = new Corrigir(ItemDados.get('associado'), ItemDados.get('selecionada'), ItemDados.get('corrigir'), mp.itens, ItemDados.get('msgErro'), divCont, 'radio', true);
					else
						QuestaoDados[iItem].Corrigir = new Corrigir(ItemDados.get('associado'), ItemDados.get('selecionada'), ItemDados.get('corrigir'), mp.itens, ItemDados.get('msgErro'), divCont, 'radio');
				break;
				
				case 'multiplo_input':
					var dependente = ItemDados.get('dependente');
					var multiplo = new Multiplo(ItemDados.get('dados'),[PosicaoAtual.Parte+1, iQuestao+1+PartesAnteriores, iItem+1]);
					
					divCont.insert(multiplo.divCampos);
					divCont.insert(new Element('br',{className: 'limpador'}));
					
					colocaAjuda(ItemDados, divCont);
					if (!dependente)
						if(ItemDados.get('esperando'))
							QuestaoDados[iItem].Corrigir = new Corrigir(ItemDados.get('associado'), ItemDados.get('selecionada'), ItemDados.get('corrigir'), multiplo.itens, ItemDados.get('msgErro'), divCont, null, true);
						else
							QuestaoDados[iItem].Corrigir = new Corrigir(ItemDados.get('associado'), ItemDados.get('selecionada'), ItemDados.get('corrigir'), multiplo.itens, ItemDados.get('msgErro'), divCont);
					else
						if(ItemDados.get('esperando'))
							QuestaoDados[iItem].Corrigir = new Corrigir(ItemDados.get('associado'), ItemDados.get('selecionada'), ItemDados.get('corrigir'), multiplo.itens, ItemDados.get('msgErro'), divCont, 'multiplo', true);
						else
							QuestaoDados[iItem].Corrigir = new Corrigir(ItemDados.get('associado'), ItemDados.get('selecionada'), ItemDados.get('corrigir'), multiplo.itens, ItemDados.get('msgErro'), divCont, 'multiplo');
				break;
				
				
				case 'multiplo_input_com_unidade':
					var multiplo = new MultiploUnidade(ItemDados.get('dados'),[PosicaoAtual.Parte+1, iQuestao+1+PartesAnteriores, iItem+1]);
					
					divCont.insert(multiplo.divCampos);
					divCont.insert(new Element('br',{className: 'limpador'}));
					
					colocaAjuda(ItemDados, divCont);
					if (!dependente)
						if(ItemDados.get('esperando'))
							QuestaoDados[iItem].Corrigir = new Corrigir(ItemDados.get('associado'), ItemDados.get('selecionada'), ItemDados.get('corrigir'), multiplo.itens, ItemDados.get('msgErro'), divCont, null, true);
						else
							QuestaoDados[iItem].Corrigir = new Corrigir(ItemDados.get('associado'), ItemDados.get('selecionada'), ItemDados.get('corrigir'), multiplo.itens, ItemDados.get('msgErro'), divCont);
					else
						if(ItemDados.get('esperando'))
							QuestaoDados[iItem].Corrigir = new Corrigir(ItemDados.get('associado'), ItemDados.get('selecionada'), ItemDados.get('corrigir'), multiplo.itens, ItemDados.get('msgErro'), divCont, 'multiplo', true);
						else
							QuestaoDados[iItem].Corrigir = new Corrigir(ItemDados.get('associado'), ItemDados.get('selecionada'), ItemDados.get('corrigir'), multiplo.itens, ItemDados.get('msgErro'), divCont, 'multiplo');
				break;
				
				
				case 'matriz':
				
					var antes = '';
					var depois = '';
					var tem_antes = false;
					if (ItemDados.get('antes'))
					{
						if (ItemDados.get('antes').length <=4 )
						{
							antes = new Element('span', {className:'a_esquerda margem_questao antes_depois'}).insert(ItemDados.get('antes'));
							largura = 35;
							tem_antes =  true;
						}
						else if (ItemDados.get('antes').length <=8 )
						{
							antes = new Element('span', {className:'a_esquerda margem_questao antes_depois'}).insert(ItemDados.get('antes'));
							largura = 70;
							tem_antes =  true;
						}
						else
						{
							antes = new Element('span', {className:'a_esquerda margem_questao antes_depois'}).insert(ItemDados.get('antes'));
							largura = 120;
							tem_antes =  true;
						}
					}
				
					if (ItemDados.get('depois'))
						depois = new Element('span', {className:'a_esquerda antes_depois depois'}).insert(ItemDados.get('depois'));
				
					for (var a = 0; a < ItemDados.get('dados').length; a++)
						for (var b = 0; b < ItemDados.get('dados')[a].length; b++)
							ItemDados.get('dados')[a][b].id = MontaID(PosicaoAtual.Parte+1, iQuestao+1+PartesAnteriores, iItem+1, [a+1,b+1].join(''));
					
					var matriz = new Matriz(ItemDados.get('dados'), tem_antes);
					if (antes != '')
					{
						divCont.insert(antes);
						antes.setStyle({marginTop: (matriz.linhas*11)+'px', width: largura+'px'});
						matriz.divCont.removeClassName('margem_questao');
						matriz.divCont.setStyle({marginLeft:0});
					}	
					
						
					divCont.insert(matriz.divCont);
					
					if (depois != '')
					{
						divCont.insert(depois);
						depois.setStyle({marginTop: (matriz.linhas*11)+'px', marginLeft: '10px'});
					}
					
					colocaAjuda(ItemDados, divCont);
					divCont.insert(new Element('br',{className: 'limpador'}));
					if(ItemDados.get('esperando'))
						QuestaoDados[iItem].Corrigir = new Corrigir(ItemDados.get('associado'), ItemDados.get('selecionada'), ItemDados.get('corrigir'), matriz.itens, ItemDados.get('msgErro'), divCont, null, true);
					else
						QuestaoDados[iItem].Corrigir = new Corrigir(ItemDados.get('associado'), ItemDados.get('selecionada'), ItemDados.get('corrigir'), matriz.itens, ItemDados.get('msgErro'), divCont);
				break;
					
				case 'tabela':
					for (var a = 0; a < ItemDados.get('dados').length; a++)
						for (var b = 0; b < ItemDados.get('dados')[a].length; b++)
							ItemDados.get('dados')[a][b].id = MontaID(PosicaoAtual.Parte+1, iQuestao+1+PartesAnteriores, iItem+1, [a+1,b+1].join(''));
					
					var tabela = new Tabela(ItemDados.get('dados'),[PosicaoAtual.Parte+1, iQuestao+1+PartesAnteriores, iItem+1], ItemDados.get('id'));
					divCont.insert(tabela.divCont);
					divCont.insert(new Element('br',{className: 'limpador'}));
					colocaAjuda(ItemDados, divCont);
					if(ItemDados.get('esperando'))
						QuestaoDados[iItem].Corrigir = new Corrigir(ItemDados.get('associado'), ItemDados.get('selecionada'), ItemDados.get('corrigir'), tabela.itens, ItemDados.get('msgErro'), divCont, null, true);
					else
						QuestaoDados[iItem].Corrigir = new Corrigir(ItemDados.get('associado'), ItemDados.get('selecionada'), ItemDados.get('corrigir'), tabela.itens, ItemDados.get('msgErro'), divCont);
				break;
				
				case 'tabela_adjacencia':
					for (var a = 0; a < ItemDados.get('dados').length; a++)
						for (var b = 0; b < ItemDados.get('dados')[a].length; b++)
							ItemDados.get('dados')[a][b].id = MontaID(PosicaoAtual.Parte+1, iQuestao+1+PartesAnteriores, iItem+1, [a+1,b+1].join(''));
					
					var tabela = new TabelaAdjacencia(ItemDados.get('dados'),[PosicaoAtual.Parte+1, iQuestao+1+PartesAnteriores, iItem+1], ItemDados.get('id'));
					divCont.insert(tabela.divCont);
					divCont.insert(new Element('br',{className: 'limpador'}));
					colocaAjuda(ItemDados, divCont);
					if(ItemDados.get('esperando'))
						QuestaoDados[iItem].Corrigir = new Corrigir(ItemDados.get('associado'), ItemDados.get('selecionada'), ItemDados.get('corrigir'), tabela.itens, ItemDados.get('msgErro'), divCont, null, true);
					else
						QuestaoDados[iItem].Corrigir = new Corrigir(ItemDados.get('associado'), ItemDados.get('selecionada'), ItemDados.get('corrigir'), tabela.itens, ItemDados.get('msgErro'), divCont);
				break;
			}

			
			if(QuestaoDados[iItem])
			{
				if(QuestaoDados[iItem].Corrigir != undefined)
					QuestaoDados[iItem].Corrigir.posicao = {Parte: PosicaoAtual.Parte, Questao: dados.key, Item:iItem};
			}
			
			Item.insert(new Element('div', {className: 'canto sup_esq'})); Item.insert(new Element('div', {className: 'canto sup_dir'}));
			Item.insert(new Element('div', {className: 'canto inf_esq'})); Item.insert(new Element('div', {className: 'canto inf_dir'}));
			Questao.insert(Item);
			
			//Procura por inputs de texto caso tenha sido especificado para tal, para colocar o combobox de caracteres especiais;
			var caracteres;
			if(caracteres = ItemDados.get('caracteres_especiais'))
			{
				var inputs_especiais = divCont.select('input[type="text"]');
				if(!inputs_especiais.length)
					alerta('Questão especificada para por select de caracteres especiais, mas não foi encontrados inputs do tipo text.');
				
				for(var a = 0; a < inputs_especiais.length; a++)
				{
					inputs_especiais[a].addClassName('caracteres_especiais');
					if(caracteres !== true)
						inputs_especiais[a].writeAttribute({quais: caracteres});
				}
			}
			
			iItem++;
			Contador++;
		}
		
		QuestaoCont.insert(new Element('h2').insert('Questão '+(iQuestao+1+PartesAnteriores)));
		if(EnunciadoGeral)
			QuestaoCont.insert(new Element('div', {className: 'enunciado_geral'}).update(EnunciadoGeral));
		QuestaoCont.insert(Questao);
		QuestaoCont.addClassName('questao_container');
		iQuestao++;
	});
	
	
	Event.observe('link_bloco', 'click', function(){
		var abre = !BlocoNotas.divCont.visible();
		fechaFerramentas();
		if(abre)
			BlocoNotas.abre();
	});
	
	PopupReferencias = new Notas();
	Event.observe('link_notas', 'click', function(){	
		var abre = !PopupReferencias.popup.divCont.visible();
		fechaFerramentas();
		if(abre)
			PopupReferencias.abre();
	});
	
	interface_document_loaded = true;
	
	
	gerencia_corrige_tudo();
	gerencia_partes();
	
	document.fire('dom:afterLoaded');
});

function colocaAjuda(ItemDados, divCont)
{
	if(ItemDados.get('msgAjuda'))
	{
		ajuda = new Element('a', {className: 'ajuda geral'});
		var popup = new PopupClick(ajuda, ItemDados.get('msgAjuda'), ['seta_direita','central'], 10);
		divCont.insert(ajuda);
		
		Event.observe(ajuda, 'focus', function(ev){Event.element(ev).addClassName('ativo');});
		Event.observe(ajuda, 'blur', function(ev){Event.element(ev).removeClassName('ativo');});
		
		ajuda.hide();
	}
}

function alerta(texto)
{
	if(!Alertou)
	{
		alert(texto);
		Alertou = true;
	}
}

function MontaID(parte, questao, item, subitem)
{
	if(IdPadrao instanceof Array && IdPadrao.length == 2 && IdPadrao[0] instanceof Array)
	{
		var Id = new Array();
		for(var a = 0; a < IdPadrao[0].length; a++)
		{
			tmp = IdPadrao[0][a]
			tmp = tmp.replace(/\/parte/, parte);
			tmp = tmp.replace(/\/questao/, questao);
			tmp = tmp.replace(/\/itemletra/, Letras[item-1].toLowerCase());
			tmp = tmp.replace(/\/item/, item);
			if(subitem)
				tmp = tmp.replace(/\/subitem/, subitem);
			else
				tmp = tmp.replace(/\/subitem/, '');
			
			if(!tmp.blank())
				Id.push(tmp);
		}
		
		Id = Id.join(IdPadrao[1]);
		
		if(Letras.indexOf(Id.substr(0,1).toUpperCase()) == -1)
		{
			alerta('Não se pode começar um ID com um número.\n\nCorrija o código, retirando o número do primeiro caractere,\nou não defina a variável IdPadrao.');
		}
		else
		{
			return Id;
		}
	}
	return ('p'+parte+'_q'+questao+'_'+item);
}


var ValorInicial = Class.create({
	pai: null, divCont: null, a:null, p:null, depois:null, 
	initialize: function (pai, divCont)
	{
		this.pai = pai;
		this.divCont = divCont;
		
		this.p = new Element('p').insert('Aguardando definição de ');
		this.a = new Element('a', {href: '#'}).insert('valor acima.');
		
		var bind;
		if (this.pai)	bind = this.pai.divCont;
		else			bind = $('valor_inicial');
		
		Event.observe(this.a, 'click', function(ev)
		{
			ev.stop();
			this.scrollTo();
		}.bind(bind));

		this.p.insert(this.a);
		
		this.depois = new Element('p', {className: 'depois'}).insert('');
		var div = new Element('div', {className: 'msg_valor_inicial'}).insert(this.p);
		div.insert(this.depois);
		this.depois.hide();		
		this.divCont.insert(div);	

		if(this.pai)
			Event.observe(this.a, 'click',  this.seleciona.bind(this));

	},
	seleciona: function ()
	{
		NoValorInicial = true;
		this.pai.seleciona();
	}
});


var Selecao = Class.create({
	li: null, divCont: null, posicao: null, selecionada : null, inputs: null, 
	link:null, setar: null, tirar:null,
	initialize: function (divCont, ids, link, setar, tirar)
	{
		this.divCont = divCont;
		this.li = this.divCont.up();
		this.link = link;
		this.setar = setar;
		this.tirar = tirar;
		
		Event.observe(this.li, 'click', this.seleciona.bind(this));
		Event.observe(this.link, 'click', this.desabilita.bind(this));
		
		this.inputs = new Array();
		
		ids.each(function(item)
		{
			var it = $(item);
			this.inputs.push(it);
		}.bind(this));
	},
	seleciona: function ()
	{
		if (!this.selecionada)
		{
			if(PegaQuestao(PosicaoAtual))
				PegaQuestao(PosicaoAtual).desseleciona();
			
			this.li.addClassName('selecionada');
			this.selecionada = true;
			
			atividade = PosicaoAtual.Atividade;
			PosicaoAtual = this.posicao;
			PosicaoAtual.Atividade = atividade;
			try
			{
				this.inputs[0].focus();
			}
			catch (err) {}
		}
	},
	desseleciona: function ()
	{		
		this.li.removeClassName('selecionada');
		this.selecionada = false;
	},
	desabilita: function ()
	{
		this.setar();
		this.divCont.addClassName('desabilitada');
		this.link.update('Alterar valor');
		for (a=0; a<this.inputs.length; a++)
		{
			this.inputs[a].trava();
		}
		
		Event.stopObserving(this.link, 'click');
		//Event.observe(this.link, 'click', this.habilita.bind(this));
		
		var Perg =  
			{
				conteudo: 'Você deseja alterar o valor, isto fará com que você precise refazer as questões que tinham como base este valor?',
				layout: ['seta_baixo','direita'],
				largura: 10,
				callback: this.habilita,
				// se o usuário clicar em 'Sim', o popup chamará a funcao funcao_pede na qual this.resultado será 'sim'
				// Veja que essa função deve estar definida, ou ser definida nesse exato momento (como no exemplo "pede2")
				respostas: [{sim: 'Sim'}, {nao: 'Não'}]
			};
		var tmp = new PopupCallback(this.link,Perg.conteudo,Perg.layout, Perg.largura, Perg.callback, Perg.respostas, this);
		
		
		ProximoItem = PegaQuestao(this.posicao);
		if (ProximoItem)
		{
			window.setTimeout(function(){this.inputs[0].focus();}.bind(ProximoItem), 100);
		}
		
		
	},
	habilita: function ()
	{
	

		var args = $A(arguments);
		var este = args[0];

		if (this.resultado=='sim') 
		{
			este.tirar();
			este.divCont.removeClassName('desabilitada');
			este.link.update('OK');
			
			for (a=0; a<este.inputs.length; a++)
			{
				este.inputs[a].destrava();
			}
			
			Event.stopObserving(este.link, 'click');
			Event.observe(este.link, 'click', este.desabilita.bind(este));
		}
	}
});



var Corrigir = Class.create({
	a: null, span: null, li: null, divCont: null, inputs:null, 
	corrigir: null, radio: null, multiplo: null, MsgErro: null, correto: null, selecionou: null,
	posicao: null, jaAbriu: false, travado: null, selecionada: null, associado:null, drag: null,
	initialize: function (associado, selecionou, corrigir, ids, msg, divCont, tipo, travado)
	{
	
		this.corrigir = corrigir;
		this.selecionou = selecionou;
		this.travado = travado == true;
		this.associado = associado;
		
		if(msg)
			this.MsgErro = new MsgErro(msg);
		
		this.radio = false;
		this.multiplo = false;
		this.drag = false;
		
		
		if(tipo)
		{
			if(tipo == 'radio')
				this.radio = true;
			if(tipo == 'multiplo')
				this.multiplo = true;
			if(tipo == 'drag')
				this.drag = true;
		}

		
		this.a = new Element('a', {href: 'javascript:;', onclick: 'return false;', className: 'feedback'}).update('Corrigir item');
		this.span = new Element('span', {className: 'feedback'}).update(this.a);
		
		this.inputs = new Array();
		
		ids.each(function(item)
		{
			var it = $(item);
			this.inputs.push(it);
			Event.observe(it, 'focus', this.seleciona.bind(this));
			Event.observe(it, 'click', this.seleciona.bind(this));
			Event.observe(it, 'change', this.nada.bind(this));
			Event.observe(it, 'input:change', this.nada.bind(this));
			Event.observe(it, 'keypress', function(ev){
				var key = ev.which | ev.keyCode;
				if(key != Event.KEY_TAB)
					this.nada();
			}.bind(this));
			
			if (travado)
				it.writeAttribute({disabled: 'disabled'});
			
		}.bind(this));
		
		if (travado)
			this.a.writeAttribute({disabled: 'disabled'});
		
		if(divCont)
			this.divCont = divCont;
		else
			this.divCont = this.inputs[0].up().up().up();
			
		this.divCont.insert(this.span);
		this.divCont.insert(new Element('div', {className: 'limpador'}).update('&nbsp;'));
		this.li = this.divCont.up();
		if(msg)
			this.li.insert(this.MsgErro.divCont);
		
		Event.observe(this.a, 'click', this.disparaCorrigir.bind(this));
		Event.observe(this.a, 'click', this.seleciona.bind(this));
		Event.observe(this.li, 'click', this.seleciona.bind(this));
		
		if(travado)
		{
			this.divCont.select('input').each(function(el){el.trava();});
		}
	},
	seleciona: function ()
	{
		if (!NoValorInicial && !this.selecionada)
		{
			
			if (this.associado)
			{
				$('borda_applet').addClassName('borda_associado');
				$('applet').addClassName('associado');
				
				$('associado').setStyle({
					top: (this.divCont.cumulativeOffset().top + +50) +'px', 
					left: ($('applet').cumulativeOffset().left -14) +'px'
				});
				$('associado').show();
				
				$('associacao').setStyle({
					bottom: '10px', 
					left: '10px'
				});
				$('associacao').show();
				
				var iLen = String(this.posicao.Questao).length;
				if (String(this.posicao.Questao).substr(iLen-3, 1) == 'q')
					var qual_questao = String(this.posicao.Questao).substr(iLen-2, 2);
				else
					var qual_questao = String(this.posicao.Questao).substr(iLen-1, 1);
				
				var qual_item = new Element('span', {className: 'icone_questao'});
				qual_item.update(Letras[this.posicao.Item]);
				
				var texto = new Element('span', {className:'a_esquerda'}).update('Associado à Questão '+qual_questao);
				
				$('associacao').update(texto);
				$('associacao').insert(qual_item);
				
				
				paraNavegacao = true;
			}
			else
			{
				$('borda_applet').removeClassName('borda_associado');
				$('applet').removeClassName('associado');
				$('associado').hide();
				$('associacao').hide();
				paraNavegacao = false;
			}
			
			this.selecionada = true;
			
			if(PegaInicial(PosicaoAtual))
				PegaInicial(PosicaoAtual).desseleciona();
				
			if(PegaQuestao(PosicaoAtual))
				PegaQuestao(PosicaoAtual).desseleciona();
			
			if(this.li.viewportOffset().top+this.li.getHeight()+60 > document.viewport.getHeight())
				Effect.ScrollTo(this.li, {duration: 0.4, offset: -(document.viewport.getHeight()-this.li.getHeight()-60)});
			
			
			this.li.addClassName('selecionada');
			try
			{
				this.inputs[0].focus();
			}
			catch (err) {}
			
			if(this.correto == false && !this.jaAbriu)
			{
				this.MsgErro.abre();
				this.jaAbriu = true;
			}
			
			//alert(this.posicao.Questao);
			atividade = PosicaoAtual.Atividade;
			PosicaoAtual = this.posicao;
			PosicaoAtual.Atividade = atividade;
			
			var div = this.li.firstDescendant();
			var ajuda = div.getElementsByClassName('ajuda');
			if (ajuda[0])
				ajuda[0].show();
			
			
			if (this.selecionou)
				this.selecionou(); 
		}
		else
			NoValorInicial = false;
	},
	desseleciona: function ()
	{		
		this.li.removeClassName('selecionada');
		this.selecionada = false;
		var div = this.li.firstDescendant();
		var ajuda = div.getElementsByClassName('ajuda');
		if (ajuda[0])
			ajuda[0].hide();
	},
	disparaCorrigir: function (evento)
	{
		var correcao = this.corrigir(this.valores());
		var tudo_certo = true;
		
		if (!this.travado)
		{
			if (!correcao.compact().length)
			{
				tudo_certo = false;
			}
			
			for(var a = 0; a < correcao.length; a++)
			{
				if(correcao[a] == true)
				{
					this.certo(a);
				}
				//if(correcao[a] == false || correcao[a] == null)
				if(correcao[a] == false)
				{
					this.errado(a);
					tudo_certo = false;
				}
			}
			
			if(tudo_certo)
			{
				this.span.setStyle({backgroundImage: 'url(img_layout/certo.gif)'});
				if(evento != false && this.posicao.Item < $H(Questoes[this.posicao.Parte]).get(this.posicao.Questao).itens.length-1)
				{
					ProximoItem = PegaQuestao({Parte: this.posicao.Parte, Questao: this.posicao.Questao, Item: this.posicao.Item+1});
					if (ProximoItem)
					{
						if(ProximoItem.correto == null)
							window.setTimeout(function(){this.inputs[0].focus();}.bind(ProximoItem), 800);
					}
				}
				if(this.MsgErro && evento != false)
				{
					this.MsgErro.fecha();
				}
			}
			else
			{
				this.span.setStyle({backgroundImage: 'url(img_layout/errado.gif)'});
				if(this.MsgErro && evento != false)
				{
					this.jaAbriu = true;
					this.MsgErro.abre();
				}
			}
				
			this.span.show();
			this.correto = tudo_certo;
			
			if (evento != false)
			{
				corrigindo = true;
				corrige_tudo();
				corrigindo = false;
			}
		}
	},
	soCorrige: function()
	{
		var correcao = this.corrigir(this.valores());
		var tudo_certo = true;

		
		if (correcao)
		{
			if (!this.travado)
			{
				if (!correcao.compact().length)
				{
					tudo_certo = false;
				}
				
				for(var a = 0; a < correcao.length; a++)
				{
					if(correcao[a] == false)
					{
						tudo_certo = false;
					}
				}
			}
		}
		else if (!this.correto)
		{
			tudo_certo = false;
		}
		return tudo_certo;
	},
	valores: function()
	{
		var valores = new Array();
		if(this.radio == true)
		{
			for(var a = 0; a < this.inputs.length; a++)
				valores.push(this.inputs[a].checked);
		}
		else
		{
			for(var a = 0; a < this.inputs.length; a++)
				valores.push(this.inputs[a].value);
		}
		return valores;
	},
	certo: function (i)
	{
		if(this.multiplo)
		{
			this.inputs[i].up().up().removeClassName('incorreto');
			this.inputs[i].up().up().addClassName('correto');
		}
		else
		{
			this.inputs[i].up().removeClassName('incorreto');
			this.inputs[i].up().addClassName('correto');
		}
		
	},
	errado: function (i)
	{
		if(this.multiplo)
		{
			this.inputs[i].up().up().removeClassName('correto');
			this.inputs[i].up().up().addClassName('incorreto');
		}
		else
		{
			this.inputs[i].up().removeClassName('correto');
			this.inputs[i].up().addClassName('incorreto');
		}
	},
	nada: function (ev)
	{
		if (this.multiplo)
		{
			this.inputs.each(function(item){
				item.up().up().removeClassName('correto');
				item.up().up().removeClassName('incorreto');
			}.bind(this));
		}
		else
		{			
			this.inputs.each(function(item){
				item.up().removeClassName('correto');
				item.up().removeClassName('incorreto');
			}.bind(this));
			
		}
		this.correto = null;
		this.span.setStyle({backgroundImage: 'none'});
	},
	scrollTo: function (offset)
	{
		if(!offset)
			offset = -40;
		Effect.ScrollTo(this.li,{offset: offset, duration: 0.8});
		this.inputs[0].focus();
		this.seleciona();
	}
});

var MsgErro = Class.create({
	a: null, divCont: null, aberto: false,
	initialize: function(msg)
	{
		this.divCont = new Element('div', {className:'pq_errei', style: 'display: none;'});
		this.divCont.insert(new Element('p').update(msg));
		this.divCont.insert(this.a = new Element('a',{href: '#'}).update('Fechar'));
		this.divCont.insert(new Element('div', {className: 'limpador'}).update('&nbsp;'));
		Event.observe(this.a, 'click', this.fecha.bind(this));
	},
	abre: function()
	{
		if(!this.aberto)
		{
			this.aberto = true;
			new Effect.BlindDown(this.divCont, {duration: 0.3});
		}
	},
	fecha: function (ev)
	{
		if(ev)
			ev.stop();
		this.a.up().up().select('a.feedback')[0].focus();
		if(this.aberto)
		{
			this.aberto = false;
			new Effect.BlindUp(this.divCont, {duration: 0.3});
		}
	}
});

var MultiplaEscolha = Class.create({
	ids: new Array(), divCont: null, itens: new Array(),
	initialize: function (opcoes)
	{
		this.itens = new Array();
		var name = 'a'+Math.round(Math.random()*10000);
		this.ids = opcoes.keys();
		var itens = opcoes.values();
		
		var div = new Element('div',{className: 'input_radio'});
		
		for (var a = 0; a < this.ids.length; a++)
		{
			input = new Element('input',{id: this.ids[a], type: 'radio', name: name, value: itens[a].value });
			label = new Element('label',{htmlFor: this.ids[a]}).update(new Element('span').update(itens[a].label));
			div.insert(new Element('div').insert(input).insert(label).insert('<br style="clear: both;" />'))
			this.itens.push(input);
		}
		this.divCont = div;
	}
});

var Tabela = Class.create({
	ids: new Array(), itens: new Array(),  divCont: null, tabela: null, id: null,
	initialize: function(data, questao) 
	{
		var uniqueId = 'mtr' + Math.floor(Math.random()*10000);
		this.id = uniqueId;
		
		var coluna = new Element('div', {className: 'seta_coluna', id: this.id+'seta_coluna'});
		var linha = new Element('div', {className: 'seta_linha', id: this.id+'seta_linha'});
		
		this.itens = new Array();
		this.tabela = new Element('table', {className: 'tabela margem_questao', id: this.id});
		
		this.divCont = new Element('div', {style: 'position: relative;'})
			.insert(this.tabela)
			.insert(linha)
			.insert(coluna);
		
		var larguras = new Array();
		var alturas = new Array();
		var ids = new Array();
		//HEAD:
		var thead = new Element('thead');
		var tr = new Element('tr');
		for(var a = 0; a <= data[0].length; a++)
		{
			if(a == data[0].length)
			{
				tmp = new Element('th', {className: 'sem_borda', id: this.id+'verificacao_altura_tabela0'});
				tr.insert(tmp);
			}
			
			if($H(data[0][a]).get('value'))
			{
				if(a != data[0].length)
				{
					if(!$H(data[0][a]).get('largura'))
						$H(data[0][a]).set('largura', 1)
					larguras.push($H(data[0][a]).get('largura'));
					tmp = new Element('th', {className: 'largura'+$H(data[0][a]).get('largura')}).update($H(data[0][a]).get('value'));
					tr.insert(tmp);
					if(a == data[0].length-1)
					{
						tmp.addClassName('ultima_borda');
					}
				}
			}
			else if (a != data[0].length)
			{
				alerta('Os headers (primeira linha) têm que ter o atributo \'value\'.');
				return;
			}
		}
		thead.update(tr);
		
		//BODY:
		var tmp;
		var tbody = new Element('tbody');
		for(var y = 1; y < data.length; y++)
		{
			tr = new Element('tr');
			for(var x = 0; x <= data[y].length; x++)
			{
				id = $H(data[y][x]).get('id');

				if (x == data[y].length)
				{
					tmp = new Element('td', {id: this.id+'verificacao_altura_tabela'+y, className: 'sem_borda'});
					tr.insert(tmp);
				}
				else
				{
				
					switch($H(data[y][x]).get('tipo'))
					{
						case 'input':
							tmp = new Element('input', {type: 'text', style: 'width:'+(larguras[x]*20-10)+'px;', id: id});
							
							//posicionamento da setinha
							Event.observe(tmp, 'focus', this.ajustaSetinha.bind(this));
							Event.observe(tmp, 'blur', this.tiraSetinha.bind(this));
							
							tr.insert(new Element('td').update(tmp));
							
							this.itens.push(tmp);
							if(id)
							{
								tmp.writeAttribute({id:id, name:id});
								this.ids.push(id);
							}
							
							
						break;
						
						case 'texto':
							tmp = new Element('td').update($H(data[y][x]).get('value'));
							if(id)
								tmp.writeAttribute({id: id});
							tr.insert(tmp);
						break;
						
						case 'calculado':
							div = new Element('div', {className: 'calculado'}).update('&nbsp;');
							tmp = new Element('td').update(div);
							if(id)
								div.writeAttribute({id: id});
							tr.insert(tmp);
						break;

						
						default:
							alerta('O item da linha '+y+' e coluna '+(x+1)+' da tabela da questão '+questao[1]+'\nnão possui o termo \'tipo\', ou está mal configurado;');
						break;
					}
				}
			}
			tbody.insert(tr);
			
			
		}
		this.tabela.insert(thead);
		this.tabela.insert(tbody);
		
		tmp = 0;
		for(var a = 0; a < larguras.length; a++)
			tmp+= larguras[a]*20;		//20 de cada módulo +4 de padding (2 de cada lado) +1 de borda
		
		paddings = (larguras.length)*2;
		
		this.divCont.setStyle({width: (tmp+paddings+31)+'px'});
		this.divCont.insert(new Element('br', {className: 'limpador'}));
		
		

	},
	ajustaSetinha: function(ev)
	{
		var el = ev.findElement('input').addClassName('tabela_ativo');
		var pai = el.up('table');
		
		var iLen = String(Event.element(ev).id).length-1;
		var posicao_linha = String(Event.element(ev).id).substr(12, iLen - 12) - 1;
		
		
		altura = 0;
		for (a = 0; a<posicao_linha; a++)
		{
			altura = altura + $(pai.id+'verificacao_altura_tabela'+a).getHeight(); 
		}
		
		altura_atual = $(pai.id+'verificacao_altura_tabela'+posicao_linha).getHeight(); 
		
		var iLen = String(Event.element(ev).id).length;
		var posicao_coluna = String(Event.element(ev).id).substring(iLen, iLen - 1);
		
		
		posicao_linha = [altura+(altura_atual/2)-5,'px'].join('');
		
		tamanho = Event.element(ev).getWidth();
		esquerda = Event.element(ev).cumulativeOffset().left;
		posicao_coluna = [esquerda-60+(tamanho/2)-3,'px'].join('');
		$(pai.id+'seta_linha').setStyle({top: posicao_linha, display: 'block' });
		$(pai.id+'seta_coluna').setStyle({left: posicao_coluna, display: 'block' });
	},
	tiraSetinha: function(ev)
	{
		var el = ev.findElement('input').removeClassName('tabela_ativo');
		var pai = el.up('table');
		$(pai.id+'seta_linha').hide();
		$(pai.id+'seta_coluna').hide();
	}
});



var TabelaAdjacencia = Class.create({
	ids: new Array(), itens: new Array(),  divCont: null, tabela: null, id: null,
	initialize: function(data, questao) 
	{
		
		var dateObject = new Date();
		var uniqueId =
          dateObject.getFullYear() + '' +
          dateObject.getMonth() + '' +
          dateObject.getDate() + '' +
          dateObject.getTime();
		
	
		this.id = uniqueId;
		
		this.itens = new Array();

		
		this.tabela = new Element('table', {className: 'tabela margem_questao', id: this.id});
		
		var linha = new Element('div', {className: 'seta_linha', id: this.id+'seta_linha'});
		var coluna = new Element('div', {className: 'seta_coluna', id: this.id+'seta_coluna'});
		
		this.divCont = new Element('div', {style: 'position: relative;'}).insert(this.tabela);
		this.divCont.insert(linha);
		this.divCont.insert(coluna);
		
		var larguras = new Array();
		var ids = new Array();


		//HEAD:
		for(var a = 0; a < data[0].length; a++)
		{
			
			if($H(data[0][a]).get('value'))
			{
				if(!$H(data[0][a]).get('largura'))
					$H(data[0][a]).set('largura', 1)
				larguras.push($H(data[0][a]).get('largura'));
			}
		}
		
		
		//BODY:
		var tmp;
		var tbody = new Element('tbody');
		for(var y = 0; y < data.length; y++)
		{
			tr = new Element('tr');
			for(var x = 0; x <= data[y].length; x++)
			{
				if($H(data[y][x]).get('id'))
					id = $H(data[y][x]).get('id');
				else
					id = null;
					
				
				if (x == data[y].length)
				{
					tmp = new Element('td', {id: this.id+'verificacao_altura_tabela'+y, className: 'sem_borda'}).update('');
					tr.insert(tmp);
				}				
				else
				{				
					
					switch($H(data[y][x]).get('tipo'))
					{
						case 'input':
							tmp = new Element('input', {type: 'text', style: 'width:'+(larguras[x]*20-10)+'px;', id: id});
							
							//posicionamento da setinha
							Event.observe(tmp, 'focus', function(ev){
							
								pai = this.up().up().up().up();
									
								Event.element(ev).addClassName('tabela_ativo');
								var iLen = String(Event.element(ev).id).length-1;
								var posicao_linha = String(Event.element(ev).id).substr(12, iLen - 12) - 1;
								
								
								altura = 0;
								for (a = 0; a<posicao_linha; a++)
								{
									altura = altura + $(pai.id+'verificacao_altura_tabela'+a).getHeight(); 
								}
								
								altura_atual = $(pai.id+'verificacao_altura_tabela'+posicao_linha).getHeight(); 
							
								Event.element(ev).addClassName('tabela_ativo');
								var iLen = String(Event.element(ev).id).length-1;
								var posicao_linha = String(Event.element(ev).id).substring(iLen, iLen - 1) - 1;
								var iLen = String(Event.element(ev).id).length;
								var posicao_coluna = String(Event.element(ev).id).substring(iLen, iLen - 1);
								
								posicao_linha = [altura+(altura_atual/2)-5,'px'].join('');
								
								tamanho = Event.element(ev).getWidth();
								esquerda = Event.element(ev).cumulativeOffset().left;
								posicao_coluna = [esquerda-60+(tamanho/2)-3,'px'].join('');
								$(pai.id+'seta_linha').setStyle({top: posicao_linha, display: 'block' });
								$(pai.id+'seta_coluna').setStyle({left: posicao_coluna, display: 'block' });
							});
								
							Event.observe(tmp, 'blur', function(ev){
								pai = this.up().up().up().up();
								
								Event.element(ev).removeClassName('tabela_ativo');
								$(pai.id+'seta_linha').setStyle({display: 'none' });
								$(pai.id+'seta_coluna').setStyle({display: 'none' });
							});
							
							tr.insert(new Element('td', {className: 'largura'+larguras[x]}).update(tmp));
							this.itens.push(tmp);
							if(id)
							{
								tmp.writeAttribute({id:id, name:id});
								this.ids.push(id);
							}
							
							
						break;
						
						case 'texto':
							tmp = new Element('td', {className: 'largura'+larguras[x]}).update($H(data[y][x]).get('value'));
							if(id)
								tmp.writeAttribute({id: id});
							tr.insert(tmp);
						break;
						
						case 'destacado':
							tmp = new Element('th', {className: 'largura'+larguras[x]}).update($H(data[y][x]).get('value'));
							if(id)
								tmp.writeAttribute({id: id});
							tr.insert(tmp);
						break;
						
						case 'semi_destacado':
							tmp = new Element('td', {className: 'largura'+larguras[x]+' semi_destacado'}).update($H(data[y][x]).get('value'));
							if(id)
								tmp.writeAttribute({id: id});
							tr.insert(tmp);
						break;
						
						case 'calculado':
							div = new Element('div', {className: 'calculado'}).update('&nbsp;');
							tmp = new Element('td', {className: 'largura'+larguras[x]}).update(div);
							if(id)
								div.writeAttribute({id: id});
							tr.insert(tmp);
						break;
						
						default:
							alerta('O item da linha '+y+' e coluna '+(x+1)+' da tabela da questão '+questao[1]+'\nnão possui o termo \'tipo\', ou está mal configurado;');
						break;
					}
				}
			}
			tbody.insert(tr);
		}
		this.tabela.insert(tbody);
		
		tmp = 0;
		for(var a = 0; a < larguras.length; a++)
			tmp+= larguras[a]*20;		//20 de cada módulo +4 de padding (2 de cada lado) +1 de borda

		paddings = (larguras.length)*4;
		this.divCont.setStyle({width: (tmp+paddings+31)+'px'});
		this.divCont.insert(new Element('br', {className: 'limpador'}));
	}
});



var Matriz = Class.create({
	ids: new Array(), itens: new Array(), divCont: null, linhas: null,
	initialize: function (data, antes, fora)
	{
		this.itens = new Array();
		if (fora)
			this.divCont = new Element('div', {className: 'matriz_fora'});
		else
			this.divCont = new Element('div', {className: 'matriz margem_questao'});
		this.divCont.insert(new Element('div', {className: 'supe_esq'}));
		this.divCont.insert(new Element('div', {className: 'supe_dir'}));
		
		var tmp, tr;
		this.linhas = 0;

		for (var a = 0; a < data.length; a++)
		{
			tr = new Element("tr");
			this.linhas += 1;
			for (var b = 0; b < data[a].length; b++)
			{
				if($H(data[a][b]).get('id'))
					id = $H(data[a][b]).get('id');
				else
					id = null;
				value = $H(data[a][b]).get('value');
				
				switch($H(data[a][b]).get('tipo'))
				{
					case 'input':
						if (b == 0 && !antes)
							tmp = new Element('input',{type: 'text', className: 'margem_estranha_ie', value: (value?value:'') });
						else
							tmp = new Element('input',{type: 'text', value: (value?value:'') });
						this.divCont.insert(tmp);
						if(id)
						{
							tmp.writeAttribute({id: id, name: id});
						this.ids.push(id);
						}
						this.itens.push(tmp);
					break;
					
					case 'texto':
						tmp = new Element('span').update(value);
						this.divCont.insert(tmp);
						if(id)
							tmp.writeAttribute({id: id});
					break;
					
					case 'calculado':
						tmp = new Element('span',{className: 'calculado'}).update(value);
						this.divCont.insert(tmp);
						if(id)
							tmp.writeAttribute({id: id});
					break;
					
					default:
						alerta('O item da linha '+(a+1)+' e coluna '+(b+1)+' da matriz da questão '+questao[1]+'\nnão possui o termo \'tipo\', ou está mal configurado;');
					break;
				}
			}
			this.divCont.insert(new Element('br', {className: 'limpador'}));
		}
		
		this.divCont.insert(new Element('div', {className: 'esquerda inferior infe_esq'}));
		this.divCont.insert(new Element('div', {className: 'direita inferior infe_dir'}));
	}
});

var Multiplo = Class.create({
	ids: new Array(), itens: new Array(), divCampos: null, PE: null, input: new Array(),
	initialize: function (data, questao)
	{
		var afastamento = '';
		var tamanho = '';
		var desativo = '';
		var ativo = '';
		var anterior = '';
		this.itens = new Array();
		
		
		
		this.divCampos = new Element('div', {className: 'input_texto margem_questao'});
		for (var a=0; a < data.length; a++)
		{
			this.input[a] = new Array();
			for (var b=0; b < data[a].length; b++)
			{
				afastamento = '0;';
				tamanho = '70px;';
				var classe = 'input_'+data[a][b].tipo
				
				id = MontaID(questao[0], questao[1], questao[2], [a+1,b+1].join(''));
				
				if (classe == 'input_normal')
				{
					if (b == data[a].length - 1)
						classe += ' sem_margem';
					
					this.input[a][b] = new Element('input', {type: 'text', id: id, className: classe});
					
					var label = new Element('label',{htmlFor: id}).update(new Element('span', {className: 'label_multiplo'}).update(data[a][b].label));
					var divisinha = new Element('div', {className: 'a_esquerda', style: 'position: relative;'});
					divisinha.insert(label);
					divisinha.insert(this.input[a][b]);
				}
				else
				{
					if (classe=='input_pequeno')
					{
						tamanho = '70px;'
					}
					if (classe=='input_grande')
					{
						tamanho = '140px;';
						if ((b==0 || b==2 || b==4 || b==6) && anterior != 'input_pequeno')
							afastamento = '40px;';
					}
					this.input[a][b] = new Element('input', {type: 'text', id: id, className: classe});
					
					var label = new Element('label',{htmlFor: id}).update(new Element('div', {className: 'label_multiplo'}).update(data[a][b].label));
					var divisinha = new Element('div', {className: 'com_quebra', style:'position: relative; margin-right:'+afastamento+ 'width:'+tamanho});
					divisinha.insert(label);
					divisinha.insert(new Element('br',{className: 'limpador'}));
					divisinha.insert(this.input[a][b]);
				}
				
				if (data[a][b].ajuda)
				{
					ajuda = new Element('a', {className: 'ajuda multiplo'});
						
					if(!this.input[a][b].hasClassName('input_normal'))
						ajuda.addClassName('quebra');
					
					var popup = new PopupClick(ajuda, data[a][b].ajuda, ['seta_baixo','central'], 10);
					popup.tempo = 3;
					divisinha.insert(ajuda);
					ajuda.hide();
					Event.observe(ajuda, 'blur', this.podeEsconder.bind(this));
					Event.observe(ajuda, 'focus', this.addFocus.bind(this));
					Event.observe(this.input[a][b], 'blur', this.podeEsconder.bind(this));
					Event.observe(this.input[a][b], 'focus', this.addFocus.bind(this));
				}
				
				this.divCampos.insert(divisinha);
				
				Event.observe(this.input[a][b], 'focus', function(ev){
					Event.element(ev).up().addClassName('multiplo_ativo');
				});
				
				Event.observe(this.input[a][b], 'blur', function(ev){
					Event.element(ev).up().removeClassName('multiplo_ativo');
				});
					
				anterior = classe;
				
				this.itens.push(this.input[a][b]);
				this.ids.push(id);
			}
			this.divCampos.insert(new Element('br',{className: 'limpador'}));
			if (a != data.length - 1)
				this.divCampos.insert(new Element('div',{className: 'limpador entre_linhas'}));
		}
	},
	addFocus: function(ev)
	{
		var el = ev.findElement('div');
		el.addClassName('com_focus');
		el.down('a.ajuda').show();
	},
	podeEsconder: function(ev)
	{
		var el = ev.findElement('div');
		el.removeClassName('com_focus');
		window.setTimeout(this.sePuderEsconde.bind(el), 100);
	},
	sePuderEsconde: function()
	{
		if(!this.hasClassName('com_focus'))
			this.down('a.ajuda').hide();
	}
});



var MultiploUnidade = Class.create({
	ids: new Array(), itens: new Array(), divCampos: null, PE: null, input: new Array(),
	initialize: function (data, questao)
	{
		var desativo = '';
		var ativo = '';
		this.itens = new Array();
		
		
		this.divCampos = new Element('div', {className: 'input_texto margem_questao'});
		for (var a=0; a < data.length; a++)
		{
			this.input[a] = new Array();
			for (var b=0; b < data[a].length; b++)
			{
				id = MontaID(questao[0], questao[1], questao[2], [a+1,b+1].join(''));
				
				this.input[a][b] = new Element('input', {type: 'text', id: id});
				
				var antes = '';
				var depois = '';
				
				if (data[a][b].antes) antes = new Element('span', {className:'a_esquerda antes_depois'}).insert(data[a][b].antes);
				if (data[a][b].depois) depois = new Element('span', {className:'a_esquerda antes_depois depois'}).insert(data[a][b].depois);
				
				var divisinha = new Element('div', {className: 'a_esquerda', style: 'position: relative;'});
				
				divisinha.insert(antes);
				divisinha.insert(this.input[a][b]);
				divisinha.insert(depois);
				
				var largura = '65';
				if (data[a][b].antes)
					conteudo_antes = data[a][b].antes.trim();
				else
					conteudo_antes = '';

				if (conteudo_antes.length <=4 && conteudo_antes.length > 0 )
				{
					antes.setStyle({width: '40px'});
				}
				else if (conteudo_antes.length > 0)
				{
					largura = '40';
					antes.setStyle({width: '65px'});
				}
					
					
				if (b == 0)
					depois.setStyle({width: '43px'});
				this.input[a][b].setStyle({marginRight: '5px', width: largura+'px', marginLeft: '0'});
				
				if (data[a][b].ajuda)
				{
					ajuda = new Element('a', {className: 'ajuda multiplo'});
						
					if(largura == '65')
						ajuda.setStyle({marginRight: '0px', right: '40px'});
					else
						ajuda.setStyle({marginRight: '0px', right: '30px'});
					
					var popup = new PopupClick(ajuda, data[a][b].ajuda, ['seta_baixo','central'], 10);
					popup.tempo = 3;
					divisinha.insert(ajuda);
					ajuda.hide();
					Event.observe(ajuda, 'blur', this.podeEsconder.bind(this));
					Event.observe(ajuda, 'focus', this.addFocus.bind(this));
					Event.observe(this.input[a][b], 'blur', this.podeEsconder.bind(this));
					Event.observe(this.input[a][b], 'focus', this.addFocus.bind(this));
				}
				
				Event.observe(this.input[a][b], 'focus', function(ev){
					ev.findElement('input').up().addClassName('multiplo_ativo');
				});
				
				Event.observe(this.input[a][b], 'blur', function(ev){
					ev.findElement('input').up().removeClassName('multiplo_ativo');
				});
				
				this.divCampos.insert(divisinha);

				this.itens.push(this.input[a][b]);
				this.ids.push(id);
			}
			this.divCampos.insert(new Element('br',{className: 'limpador'}));
			if (a != data.length - 1)
				this.divCampos.insert(new Element('div',{className: 'limpador entre_linhas'}));
		}
	},
	addFocus: function(ev)
	{
		var el = ev.findElement('div');
		el.addClassName('com_focus');
		el.down('a.ajuda').show();
	},
	podeEsconder: function(ev)
	{
		var el = ev.findElement('div');
		el.removeClassName('com_focus');
		window.setTimeout(this.sePuderEsconde.bind(el), 100);
	},
	sePuderEsconde: function()
	{
		if(!this.hasClassName('com_focus'))
			this.down('a.ajuda').hide();
	}
});





function gerencia_corrige_tudo()
{
	if(!(interface_salva_local_loaded && interface_document_loaded)) return;
	
	if ($('corrigir_tudo'))
		Event.observe('corrigir_tudo', 'click', corrige_tudo);
	else
	{
		if (iQuestao == 0)
		{
			permiteContinuar(true);
			document.fire('dom:afterPermiteContinuar');
		}
	}
}

function gerencia_partes()
{
	if(!(interface_salva_local_loaded && interface_document_loaded)) return;
	
	if(nomeSoft == null)
		return alerta('A variável nomeSoft não está definida.');
	if(PosicaoAtual.Atividade == null)
		return alerta('A atividade atual deve ser especificada na variável PosicaoAtual.Atividade.');
	
	var status = $('SalvaLocal').Pega(nomeSoft, 'automacao_atividade_'+PosicaoAtual.Atividade+'_parte_0');
	if (status != '3')
		$('SalvaLocal').Salva(nomeSoft, 'automacao_atividade_'+PosicaoAtual.Atividade+'_parte_0', '2');
	
	if(Partes != null)
	{
		if ($('partes'))
			$('partes').update('');
			
		for(var b = 0; b < Partes.length; b++)
		{
			var status = $('SalvaLocal').Pega(nomeSoft, 'automacao_atividade_'+PosicaoAtual.Atividade+'_parte_'+b);
			var li = new Element('li', {className:'partes'}).insert(Partes[b]);
			
			if (PosicaoAtual.Parte == b)
			{
				if (status != '2' && status != '3')
				{
					history.back();
					break;
				}
				
				if (status != '3')
					$('SalvaLocal').Salva(nomeSoft, 'automacao_atividade_'+PosicaoAtual.Atividade+'_parte_'+b, '2');
				
				li.addClassName('parte_atual');
			}
			else
			{
				var link = 'atividade'+PosicaoAtual.Atividade+'_parte'+(b+1)+'.html';
				var a = new Element('a', {href: link}).insert(Partes[b]);
				
				switch (status)
				{
					case '2':
						li.addClassName('parte_quase_feita');
						li.update(a);
						break;
					
					case '3':
						li.addClassName('parte_feita');
						li.update(a);
						break;
					
					default:
						li.addClassName('parte_proxima');
						break;
				}
			}
			$('partes').insert(li);
		}
	}
}



function remove (objeto)
{
	objeto.removeClassName('multiplo_ativo');
}

function PegaQuestao (Posicao)
{
	if($H(Posicao).get('Questao'))
	{
		return $H(Questoes[Posicao.Parte]).get(Posicao.Questao).itens[Posicao.Item].Corrigir;
	}
	return null;
}

function PegaInicial (Posicao)
{
	if($H(Posicao).get('Questao'))
	{
		return $H(Questoes[Posicao.Parte]).get(Posicao.Questao).itens[Posicao.Item].Selecao;
	}
	return null;
}

function removeEsperando(Item, msg)
{
	var QuestaoEsperando = null;
	QuestaoEsperando = PegaQuestao(Item);
	QuestaoEsperando.travado = false;
	var filho = QuestaoEsperando.divCont.firstDescendant();
	if (msg != '')
	{
		if (filho.className == 'msg_valor_inicial')
		{
			netos = filho.descendants();
			netos[0].hide();
			netos[2].show();
			netos[2].update(msg);
		}
	}
	else
		filho.hide();
	
	QuestaoEsperando.a.removeAttribute('disabled');	
	QuestaoEsperando.divCont.removeClassName('esperando');
	QuestaoEsperando.divCont.select('input').each(function(input)
	{
		input.destrava();
	});
	
	QuestaoEsperando.divCont.select('select').each(function(input)
	{
		input.destrava();
	});
}

function adicionaEsperando(Item)
{
	var QuestaoEsperando = null;
	QuestaoEsperando = PegaQuestao(Item);
	QuestaoEsperando.travado = true;
	QuestaoEsperando.nada();
	var filho = QuestaoEsperando.divCont.firstDescendant();

	if (filho.className == 'msg_valor_inicial')
	{
		netos = filho.descendants();
		netos[2].hide();
		netos[0].show();
	}
	filho.show();
		
	QuestaoEsperando.divCont.addClassName('esperando');
	QuestaoEsperando.divCont.select('input').each(function(input)
	{
		input.trava();
	});
	QuestaoEsperando.divCont.select('select').each(function(input)
	{
		input.trava();
	});
}

function fechaFerramentas()
{
	PopupReferencias.fecha();
	BlocoNotas.fecha();
	if(calcAberta)
		calculadora();
}

function corrige_tudo()
{
	var deu_erro = false;
	incorreta = false;
	
	
	var QuestoesIds = $H(Questoes[PosicaoAtual.Parte]).keys();

	for(var a = 0; a < QuestoesIds.length; a++)
	{
		Itens = $H(Questoes[PosicaoAtual.Parte]).get(QuestoesIds[a]).itens;
		for(var b = 0; b < Itens.length; b++)
		{
			if (Itens[b].Corrigir)
			{
				if (corrigindo)
				{
					if (Itens[b].Corrigir.correto != true )
						deu_erro = true;
				}
				else
				{
					Itens[b].Corrigir.disparaCorrigir(false);
					if(Itens[b].Corrigir.correto == false)
					{
						deu_erro = true;
						if(incorreta == false)
							incorreta = {Parte: PosicaoAtual.Parte, Questao: QuestoesIds[a], Item: b};
					}
				}
			}
		}
	}
	
	

	if(deu_erro == true)
	{
		if(corrigindo == false)
		{
			CorrigeTudoPopup = new PopupCallback(
				$('corrigir_tudo'),
				'Algumas questões estão incorretas.',
				['seta_baixo','esquerda'], 12,
				function()
				{
					PegaQuestao(incorreta).scrollTo()
				},
				[{1:'Deseja ir para a primeira questão incorreta?'}]
			)
			CorrigeTudoPopup.abre(CorrigeTudoPopup.bind);
			$('corrigir_tudo').addClassName('algo_errado');
			Event.stopObserving($('corrigir_tudo'), 'click');
			Event.observe($('corrigir_tudo'), 'click', corrige_tudo);
			window.setTimeout(function(){CorrigeTudoPopup.fecha();}, 7000); 
		}
		permiteContinuar(false);
	}
	else
	{
		permiteContinuar(true);
		try
		{
			$('corrigir_tudo').removeClassName('algo_errado');
			$('corrigir_tudo').addClassName('tudo_certo');
		}
		catch(err) {}
		try
		{
			tudoCerto();
		}
		catch(err) {}
	}
}

function permiteContinuar(permite)
{
	var a = $('link_continuar');
	if (a)
	{
		if (permite)
		{
			Event.stopObserving(a, 'click');
			a.setAttribute('href', ProximaParte);
			a.setAttribute('onclick', '');
			a.addClassName('ativado');
			$('SalvaLocal').Salva(nomeSoft, 'automacao_atividade_'+PosicaoAtual.Atividade+'_parte_'+PosicaoAtual.Parte, '3');
			if($('SalvaLocal').Pega(nomeSoft, 'automacao_atividade_'+PosicaoAtual.Atividade+'_parte_'+(PosicaoAtual.Parte+1)) != '3')
				$('SalvaLocal').Salva(nomeSoft, 'automacao_atividade_'+PosicaoAtual.Atividade+'_parte_'+(PosicaoAtual.Parte+1), '2');
			
			gerencia_partes();
		}
		else
		{
			a.setAttribute('href', 'javascript:');
			a.removeClassName('ativado');
			Popups.each(function(item)
			{
				var pai = $(item.key);
				if (item.key == 'link_continuar')
				{
					config = item.value;
				    var tmp = new PopupClick(pai, config.conteudo, config.layout, config.largura);
				}
			});
		}
	}
}

function irProMapa()
{
	location.href= 'mapa.html';
}

function FlashTag(swf, id, largura, altura)
{
	return '<object type="application/x-shockwave-flash" data="applets/Mapinha.swf" width="275" height="80"><param name="menu" value="false" /><param name="movie" value="applets/Mapinha.swf" /></object>';
	
	var obj = new Element('object', {type:'application/x-shockwave-flash', data: swf, width: largura*60+(largura-1)*20, height: altura*60+(altura-1)*20});
	obj.insert(new Element('param', {name: 'menu', value: 'false'}));
	obj.insert(new Element('param', {name: 'movie', value: swf}));
	return obj;
}

function setActiveStyleSheet(title) 
{
	var i, a, main;
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++) 
	{
	
		if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) 
		{
			a.disabled = true;
			if(a.getAttribute("title") == title) a.disabled = false;
			createCookie('css', title);
		}
	}
	
	if (title == 'grande')
		$('link_acessibilidade').href = 'javascript:setActiveStyleSheet("normal");';
	else
		$('link_acessibilidade').href = 'javascript:setActiveStyleSheet("grande");';

}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}


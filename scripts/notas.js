var Referencias = $H({});

if(typeof Popup != 'function')
{
	alert('As Classes de Notas Bibliográficas precisam ter o Prototype e o popup.js disponíveis,\nassegure-se que o arquivos js do prototype e do popup\nforam incluidos antes do notas.js na tag <head>');
}
else
{
	var Notas = Class.create({
		popup: null, conteudo: null, titulo: null, texto: null, itens: new Array(),
		linkAnterior: null, linkProxima: null, refAtual: 0,
		initialize: function ()
		{
			this.conteudo = new Element('div', {
				className: 'notas',
				style: 'width:'+(this.largura-20)+'px; height: '+(this.altura-20)+'px'
			})
			
			this.referencias = new Element('div', {id: 'referencias'});
			
			this.linkAnterior = new Element('a', {href: '/', className: 'anterior_nota'});
			this.referencias.insert(this.linkAnterior);
			
			for (var a = 0; a < Referencias.length; a++)
			{
				tmp = new Element('a', {href: '/', className: 'cada_referencia'}).update(a+1);
				this.referencias.insert(tmp);
				this.itens.push(tmp);
				Event.observe(tmp, 'click', this.clicaAbreRef.bind(this));
				
				if($H(Referencias[a]).get('link'))
				{
					var link = $($H(Referencias[a]).get('link'));
					if(link)
					{
						link.writeAttribute({href: '/', className: 'link_nota'});
						Event.observe(link,'click', function(ev)
						{
							ev.stop();
							this[0].abreRef(this[1]);
							this[0].abre();
						}.bind([this, a]));
					}
				}
			}
			
			this.linkProxima = new Element('a', {href: '/', className: 'proxima_nota'}).update('&nbsp;');
			this.referencias.insert(this.linkProxima);
			
			this.titulo = new Element('h3', {className: 'titulo'});
			this.texto = new Element('div', {className: 'texto'});
			
			this.conteudo.insert(new Element('h2').update('Referências'));
			this.conteudo.insert(this.referencias);
			this.conteudo.insert(this.titulo);
			this.conteudo.insert(this.texto);
			this.fecharPopup = new Element('a', {href: '/', className: 'fechar_popup'}).update('Fechar');
			
			Event.observe(this.fecharPopup, 'click', this.fecha.bind(this));
			
			this.conteudo.insert(this.fecharPopup);
				
			if(Referencias.length)
				this.abreRef(this.refAtual);
			this.popup = new Popup($('link_notas'), this.conteudo, ['seta_baixo', 'esquerda'], 20, 345);
			this.popup.divCont.writeAttribute({id: 'notas_de_referencia', style: 'position: fixed; display: none;'});
			
		},
		clicaAbreRef: function (ev)
		{
			var pagina = Event.element(ev).innerHTML;
			this.abreRef(pagina-1);
			ev.stop();
		},
		abreRef: function(pagina)
		{
			this.refAtual = pagina;
			Event.stopObserving(this.linkAnterior);
			Event.stopObserving(this.linkProxima);
			
			if(pagina == 0)
				this.linkAnterior
					.addClassName('desativado')
					.observe('click', function(ev){ev.stop()});
			else
				this.linkAnterior
					.removeClassName('desativado')
					.observe('click', this.menosPagina.bind(this));
			
			if(pagina == this.itens.length-1)
				this.linkProxima
					.addClassName('desativado')
					.observe('click', function(ev){ev.stop()});
			else
				this.linkProxima
					.removeClassName('desativado')
					.observe('click', this.maisPagina.bind(this));
			
			for(var a = 0; a < this.itens.length; a++)
			{
				if(a == pagina)
					this.itens[a].addClassName('selecionada');
				else	
					this.itens[a].removeClassName('selecionada');
			}
			
			this.titulo.update((pagina+1)+'. '+$H(Referencias[pagina]).get('titulo'));
			this.texto.update('<p>'+$H(Referencias[pagina]).get('texto').join('</p><p>')+'</p>');
		},
		abre: function (){ this.popup.abre(); this.popup.divCont.setStyle({top: 'auto'});},
		fecha: function (ev){ if(ev) ev.stop(); this.popup.fecha(); },
		maisPagina: function(ev){ this.abreRef(this.refAtual+1); ev.stop();},
		menosPagina: function(ev){ this.abreRef(this.refAtual-1); ev.stop();}
	});
}
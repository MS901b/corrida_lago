var Popups = $H({});
var PopupsDesesperados = $H({});
var Aviso = $H({});
var Links = $H({});
var Perguntas = $H({});


if(typeof Prototype != 'object')
{
	alert('As Classes de PopUp precisam ter o Prototype disponível,\nassegure-se que o arquivo js do prototype foi incluido antes do popup.js na tag <head>');
}
else
{
	Event.observe(window, 'load', function(){
		Popups.each(function(item)
		{
			var pai = $(item.key);
			if(!pai)
			{
				alerta('Não foi possível encontrar o link \''+item.key+'\' na página para gerar o popup.\n O script foi cancelado.');
				throw $break;
			}
			config = item.value;
			var tmp = new PopupClick(pai, config.conteudo, config.layout, config.largura);
		});
		
		PopupsDesesperados.each(function(item)
		{
			var pai = $(item.key);
			if(!pai)
			{
				alerta('Não foi possível encontrar o link \''+item.key+'\' na página para gerar o popup.\n O script foi cancelado.');
				throw $break;
			}
			config = item.value;
			var tmp = new PopupDesesperados(config.conteudo, config.largura, pai);
		});
		
		Links.each(function(item)
		{
			var pai = $(item.key);
			if(pai)
			{
				config = item.value;
				pai.className = "link_informativo";
				var tmp = new PopupClick(pai, config.conteudo, config.layout, config.largura);
				tmp.tempo = 3;
			}
			else
			{
				throw "Não foi possível encontrar o link " + item.key;
			}
		});

		Aviso.each(function(item)
		{
			var pai = $(item.key);
			if(!pai)
			{
				alerta('Não foi possível encontrar o link \''+item.key+'\' na página para gerar o popup no link.\n O script foi cancelado.');
				throw $break;
			}
			config = item.value;
			var tmp = new PopupAviso(pai, config.conteudo, config.layout, config.largura);
			tmp.tempo = 0.2;
		});

		Perguntas.each(function(item)
		{
			var pai = $(item.key);
			if(!pai)
			{
				alerta('Não foi possível encontrar o link \''+item.key+'\' na página para gerar o popup com pergunta.\n O script foi cancelado.');
				throw $break;
			}
			config = item.value;
			var tmp = new PopupCallback(pai,config.conteudo,config.layout, config.largura, config.callback, config.respostas);
		});
	});
	var Popup = Class.create({
		layout: null, setinha: null, largura: null, 
		pai: null, divCont: null, divText: null, aberto: false, shimmer:null,
		sombraD: null, sombraB: null, alturaFixa: false,
		initialize: function(pai, texto, layout, largura, altura)
		{
			this.largura = largura*20;
			this.layout = layout;
			this.pai = pai;
			this.textoConteudo = texto;
			
			this.montaPopup();
			
			if(altura)
			{
				this.alturaFixa = true;
				this.altura = altura;
				this.divText.setStyle({height: (this.altura-24)+'px'});
			}
			
			this.fecha();
		},
		montaPopup: function ()
		{
			this.setinha = new Element('div', {className : this.layout[0]})
			if (this.layout[0] == 'seta_baixissimo')
				this.divCont = new Element('div', {className: 'popup_container aviso'});
			else
				this.divCont = new Element('div', {className: 'popup_container'});
			this.divText = new Element('div', {
				className: 'popup',
				style: 'width:'+(this.largura)+'px;'
			}).update(this.textoConteudo);
			if (this.layout[0] == 'seta_cima')
				this.divCont.insert(this.setinha);
			this.divCont.insert(this.divText);
			
			if (this.layout[0] != 'seta_baixissimo')
			{			
				this.sombraD = new Element('div', {className: 'sombra_direita'});
				this.sombraB = new Element('div', {className: 'sombra_baixo'});
			}
			else
			{
				this.sombraD = new Element('div', {className: 'sombra_direita2'});
				this.sombraB = new Element('div', {className: 'sombra_baixo2'});
			}
			
			this.divCont.insert(this.sombraD);
				this.divCont.insert(this.sombraB);
			
			if (this.layout[0] != 'seta_cima')
				this.divCont.insert(this.setinha);
			
			document.body.appendChild(this.divCont);
		},
		abre: function (ev)
		{
			if(ev)
				ev.stop();
			
			if(this.aberto)
				return;
			
			
			var top = this.pai.cumulativeOffset().top;
			var left = this.pai.cumulativeOffset().left;
			
			if(!this.alturaFixa)
			{
				this.divCont.show();
				this.altura = this.divText.getHeight();
				this.divCont.hide();
			}
			
			
			var seta = this.layout[0];
			var seta_top = 0, seta_left = 0;
			if(seta == "seta_baixo")
				top-= this.altura + 20;
				
			if(seta == "seta_baixissimo")
				top-= this.altura + 5;
				
			if(seta == "seta_cima")
				top += 35;
			
			if(seta == "seta_direita")
				left-= this.largura + 40;
				
			switch(this.layout[1])
			{
				case 'central':
					if(seta == "seta_direita"){ top-= this.altura/2-this.pai.getHeight()/2; seta_top = this.altura/2-12;}
					if(seta == "seta_baixo"){ left-= this.largura/2-this.pai.getWidth()/2; seta_left = this.largura/2-12;}
					if(seta == "seta_cima"){ left-= this.largura/2-this.pai.getWidth()/2; seta_left = this.largura/2-12;}
				break;
				case 'direita':
					if(seta == "seta_baixo"){ left-=this.largura-30-this.pai.getWidth()/2; seta_left = this.largura-40;}
					if(seta == "seta_cima"){ left-=this.largura-30-this.pai.getWidth()/2; seta_left = this.largura-40;}
				break;
				case 'esquerda':
					if(seta == "seta_baixo"){ left-=43-this.pai.getWidth()/2; seta_left = 30;}
					if(seta == "seta_baixissimo"){ left-=43-this.pai.getWidth()/2; seta_left = 30;}
					if(seta == "seta_cima"){ left-=43-this.pai.getWidth()/2; seta_left = 30;}
				break;
				case 'topo':
					if(seta == "seta_direita"){ top-=43-this.pai.getHeight()/2; seta_top = 30;}
				break;
				case 'baixo':
					if(seta == "seta_direita"){ top-=this.altura-30-this.pai.getHeight()/2; seta_top = this.altura-40;}
			}
			
			if(seta == "seta_baixo")
				this.setinha.setStyle({left: seta_left+'px'});
			if(seta == "seta_baixissimo")
				this.setinha.setStyle({left: seta_left+'px'});
			if(seta == "seta_cima")
				this.setinha.setStyle({left: seta_left+'px'});
			if(seta == "seta_direita")
				this.setinha.setStyle({top: seta_top+'px'});
			
			this.sombraB.setStyle({width: (this.largura+22)+'px'});
			this.sombraD.setStyle({height:(this.altura)+'px'});
			
			this.divCont.setStyle({
				left: left+'px',
				top: top+'px'
			});
			
			if (this.pai.up('#applet'))
			{
				var compensa = 0;
				if (document.viewport.getScrollOffsets().top < 100)
					compensa = 80 - document.viewport.getScrollOffsets().top;
				top = this.pai.offsetTop - this.altura + compensa;
				this.divCont.setStyle({
					position: 'fixed',
					top: top+'px'
				});
			}
			
			this.shimmer = montaShimmer({
				height: (this.divCont.getHeight()+2)+'px',
				width: (this.divCont.getWidth()+2)+'px',
				left: (left-1)+'px',
				top: (top-1)+'px'
			});
			
			if (this.pai.up('#applet') || this.divCont.style.position == 'fixed')
			{
				this.shimmer.setStyle({
					position: 'fixed',
					height: (this.divCont.getHeight()+10)+'px'
				});
			}
			
			document.body.appendChild(this.shimmer);
			
			this.divCont.show();
			this.aberto = true;
			this.divCont.fire('popup:abriu');
		},
		fecha: function ()
		{
			this.divCont.hide();
			if (this.shimmer)
				this.shimmer.remove();
			this.aberto = this.shimmer = false;
		},
		texto: function(texto)
		{
			this.divText.update(texto);
		},
		fixa : function ()
		{
			this.divCont.setStyle({position: 'fixed'});
		}
	});

	var PopupClick = Class.create(Popup, {
		deixaFechar: true, aberto: false, PE: null, tempo: 4,
		initialize: function ($super, pai, texto, seta, largura, tempo)
		{
			if (tempo)
			{
				this.tempo = tempo;
			}
			$super($(pai), texto, seta, largura);
			if ($(pai).href == '' || $(pai).href == 'javascript:;')
			{
				
				pai.writeAttribute({href: 'javascript:;', onclick: 'return false;'});
				Event.observe(pai, 'click', this.abre.bind(this));
				Event.observe(pai, 'mouseout', this.disparaContador.bind(this));
				Event.observe(pai, 'mouseover', this.cancelaFechar.bind(this));
				Event.observe(pai, 'keydown', this.fechaNoTab.bind(this));
				
				Event.observe(this.divCont, 'mouseout', this.disparaContador.bind(this));
				Event.observe(this.divCont, 'mousedown', function(ev){this.deixaFechar = false;}.bind(this));
				Event.observe(this.divCont, 'mouseover', this.cancelaFechar.bind(this)); 
				
				Event.observe(document.body, 'mousedown', this.fechaSupetao.bind(this));
			}
			if ($(pai).type == 'button')
			{
				Event.observe(pai, 'click', this.abre.bind(this));
				Event.observe(this.divCont, 'mouseout', this.disparaContador.bind(this));
				Event.observe(this.divCont, 'mousedown', function(ev){this.deixaFechar = false;}.bind(this));
				Event.observe(this.divCont, 'mouseover', this.cancelaFechar.bind(this)); 
				Event.observe(document.body, 'mousedown', this.fechaSupetao.bind(this));
			}
		},
		fechaNoTab: function(ev)
		{
			var key = ev.which | ev.keyCode;
			if(key == Event.KEY_TAB)
				this.fechaSupetao();
		},
		fechaSupetao: function ()
		{
			if(!this.deixaFechar)
				return this.deixaFechar = true;
			
			this.fecha();
			this.cancelaFechar();
		},
		cancelaFechar: function()
		{
			if(this.PE)
			{
				this.PE.stop();
				this.PE = null;
			}
		},
		disparaContador: function ()
		{
			if(this.PE == null)
				this.PE = new PeriodicalExecuter(this.fechaSupetao.bind(this),this.tempo);
		}
	});
	
	var PopupAviso = Class.create(Popup, {
		deixaFechar: false, aberto: false, PE: null, tempo: 4,
		initialize: function ($super, pai, texto, seta, largura)
		{
			$super($(pai), texto, seta, largura);
							
				
			Event.observe(pai, 'mouseover', this.abre.bind(this));
			Event.observe(pai, 'mouseout', this.disparaContador.bind(this));
			//Event.observe(this.divCont, 'mouseout', this.disparaContador.bind(this));
			//Event.observe(document.body, 'click', this.fechaSupetao.bind(this));
			//Event.observe(pai, 'mouseover', this.cancelaFechar.bind(this));
			//Event.observe(this.divCont, 'mouseover', this.cancelaFechar.bind(this)); 
			
		},
		abre: function (ev)
		{
			
			if(ev)
				ev.stop();
			
			if(this.aberto)
				return;
			
			var top = this.pai.cumulativeOffset().top;
			var left = this.pai.cumulativeOffset().left;
			
			if(!this.alturaFixa)
			{
				this.divCont.show();
				this.altura = this.divText.getHeight();
				this.divCont.hide();
			}
			
			
			var seta = this.layout[0];
			var seta_top = 0, seta_left = 0;
			if(seta == "seta_baixo")
				top-= this.altura + 20;
				
			if(seta == "seta_baixissimo")
				top-= this.altura + 5;
				
			if(seta == "seta_cima")
				top += 35;
			
			if(seta == "seta_direita")
				left-= this.largura + 40;
				
			switch(this.layout[1])
			{
				case 'central':
					if(seta == "seta_direita"){ top-= this.altura/2-this.pai.getHeight()/2; seta_top = this.altura/2-12;}
					if(seta == "seta_baixo"){ left-= this.largura/2-this.pai.getWidth()/2; seta_left = this.largura/2-12;}
					if(seta == "seta_cima"){ left-= this.largura/2-this.pai.getWidth()/2; seta_left = this.largura/2-12;}
				break;
				case 'direita':
					if(seta == "seta_baixo"){ left-=this.largura-30-this.pai.getWidth()/2; seta_left = this.largura-40;}
					if(seta == "seta_cima"){ left-=this.largura-30-this.pai.getWidth()/2; seta_left = this.largura-40;}
				break;
				case 'esquerda':
					if(seta == "seta_baixo"){ left-=43-this.pai.getWidth()/2; seta_left = 30;}
					if(seta == "seta_baixissimo"){ left-=43-this.pai.getWidth()/2; seta_left = 30;}
					if(seta == "seta_cima"){ left-=43-this.pai.getWidth()/2; seta_left = 30;}
				break;
				case 'topo':
					if(seta == "seta_direita"){ top-=43-this.pai.getHeight()/2; seta_top = 30;}
				break;
				case 'baixo':
					if(seta == "seta_direita"){ top-=this.altura-30-this.pai.getHeight()/2; seta_top = this.altura-40;}
			}
			
			if(seta == "seta_baixo")
				this.setinha.setStyle({left: seta_left+'px'});
			if(seta == "seta_baixissimo")
				this.setinha.setStyle({left: seta_left+'px'});
			if(seta == "seta_cima")
				this.setinha.setStyle({left: seta_left+'px'});
			if(seta == "seta_direita")
				this.setinha.setStyle({top: seta_top+'px'});
			
			this.sombraB.setStyle({width: (this.largura+22)+'px'});
			this.sombraD.setStyle({height:(this.altura)+'px'});
			
			this.divCont.setStyle({
				left: left+'px',
				top: top+'px'
			});

			
			this.divCont.show();
			this.aberto = true;
			
		},
		fechaSupetao: function ()
		{
			this.fecha();
			this.cancelaFechar();
		},
		cancelaFechar: function()
		{
			if(this.PE)
			{
				this.PE.stop();
				this.PE = null;
			}
		},
		disparaContador: function ()
		{
			if(this.PE == null)
				this.PE = new PeriodicalExecuter(this.fechaSupetao.bind(this),this.tempo);
		}
	});

	var PopupCallback = Class.create(PopupClick, {
		callb: null, itens: new Array(), PE: null, $super: null,
		initialize: function ($super, pai, texto, seta, largura, callb, itens, tudo)
		{
			if(typeof callb != 'function')
			{
				alerta('A classe PopupCallback precisa receber uma função no seu 5° parâmetro de inicialização;')
				return false;
			}
			this.callb = callb;
			this.itens = itens;
			texto = new Element('div').update(texto);
			div = new Element('div', {style: 'float: right;'});

			for(var a = 0; a < itens.length; a++)
			{
				this.itens[a] = $H(this.itens[a]);
				key = this.itens[a].keys()[0]
				this.itens[a].set('a', new Element('a', {onclick: 'return false;', href: 'javascript:;'}).update(this.itens[a].get(key)));
				
				div.insert(this.itens[a].get('a'));
				if(a != itens.length-1)
				{
					div.insert('&nbsp;/&nbsp;');
				}
				Event.observe(this.itens[a].get('a'), 'click', this.callb.bind({resultado: key}, tudo));
				Event.observe(this.itens[a].get('a'), 'click', this.fechaClick.bind(this));
			}
			
			texto.insert(div);
			texto.insert('<br class="limpador"/>');
			
			$super($(pai), texto, seta, largura, 1000);
			Event.stopObserving(this.divCont, 'click');
			Event.observe(this.divCont, 'popup:abriu', function(){this.itens[0].get('a').focus()}.bind(this))
		},
		fechaClick: function()
		{
			this.pai.focus();
			this.fecha();
		},
		fecha: function()
		{
			this.aberto = false;
			this.divCont.hide();
			if(this.PE)
				this.PE.stop();
				
			if (this.shimmer)
			{
				try
				{
					document.body.removeChild(this.shimmer);
				}
				catch(err) {}
			}
		},
		deleta: function ()
		{
			this.PE.stop();
			Event.stopObserving(pai, 'click', this.chamaAbrir.bind(this));
			Event.stopObserving(pai, 'mouseout', this.chamaFechar.bind(this));
			Event.stopObserving(pai, 'mouseover', this.cancelaFechar.bind(this));
			this.divCont.remove();
		}
	});
	
	var PopupOver = Class.create(Popup, {
		PE: null,
		initialize: function($super, pai, texto, seta, largura)
		{
			$super($(pai), texto, seta, largura);
			$(pai).writeAttribute({href: 'javascript:;'});
			Event.observe(pai, 'mouseover', this.abre.bind(this));
			Event.observe(pai, 'mouseover', this.cancelaFechar.bind(this));
			Event.observe(this.divCont, 'mouseover', this.cancelaFechar.bind(this));
			Event.observe(pai, 'mouseout', this.disparaFechar.bind(this));
			Event.observe(this.divCont, 'mouseout', this.disparaFechar.bind(this));
		},
		disparaFechar: function ()
		{
			if(this.PE == null)
			{
				this.PE = new PeriodicalExecuter(this.fecha.bind(this), 3);
			}
		},
		cancelaFechar: function ()
		{
			if(this.PE != null)
			{
				this.PE.stop();
				this.PE = null;
			}
		}
	});
	
	
	
	
	var PopupDesesperados = Class.create({
		layout: null, setinha: null, largura: null, 
		pai: null, divCont: null, divText: null, aberto: false, shimmer:null, fechar: null,
		sombraD: null, sombraB: null, alturaFixa: false,
		initialize: function(texto, largura, pai)
		{
			this.largura = largura*20;
			this.textoConteudo = texto;
			this.pai = false;
			
			if(pai)
			{
				this.pai = pai;
				this.pai.writeAttribute({href: '#'});
				Event.observe(this.pai, 'click', this.abre.bind(this));
			}
			
			this.montaPopup();
			Event.observe(document, 'click', this.fecha.bind(this));
			
			if(!this.pai)
			{
				if ($('continuar_mesmo_assim'))
					Event.observe($('continuar_mesmo_assim'), 'click', this.fechaClick.bind(this));
				if ($('fechar_desesperado'))
					Event.observe($('fechar_desesperado'), 'click', this.fechaClick.bind(this));
			}
			
			if(this.pai)
				this.fecha();

		},
		montaPopup: function ()
		{
			
			this.divCont = new Element('div', {className: 'popup_container desesperados'});
			this.divText = new Element('div', {
				className: 'popup',
				style: 'width:'+(this.largura)+'px;'
			}).update(this.textoConteudo);
			
			if(this.pai)
			{
				this.fechar = new Element('a', {className: 'a_direita', href: '#'}).update('Fechar');
				this.fechar.observe('click', this.fechaClick.bind(this));
				this.divText.insert(this.fechar);
				this.divText.insert('<br class="limpador" />');
				
			}
			
			this.sombraD = new Element('div', {className: 'sombra_direita'});
			this.sombraB = new Element('div', {className: 'sombra_baixo'});
			
			this.divCont.insert(this.divText);
			this.divCont.insert(this.sombraD);
			this.divCont.insert(this.sombraB);
			this.divCont.observe('click', function(ev){if(!ev.findElement('a'))ev.stop();});
			
			document.body.appendChild(this.divCont);
			
			if(!this.pai)
				this.abre();
		},
		abre: function (ev)
		{
			if(ev)	ev.stop();
			if(this.aberto)	return;
			
			this.divCont.show();
			this.altura = this.divText.getHeight();
			this.divCont.hide();

			
			this.sombraB.setStyle({width: (this.largura+22)+'px'});
			this.sombraD.setStyle({height:(this.altura)+'px'});
			
			var top = (document.viewport.getHeight() / 2) - (this.altura / 2) - 80;
			var left = (960 / 2) - (this.largura / 2);
			
			if(top < 0) top = 0;
			
			this.divCont.setStyle({left: left+'px'});
			this.divCont.setStyle({top: top+'px'});
			
			
			this.divCont.show();
			this.aberto = true;
			document.body.appendChild(new Element('div', {id: 'velatura'}));
			$('velatura').show();
			$('velatura').setOpacity(0.8);
			
			
			this.shimmer = new Element('iframe');
			this.shimmer.setStyle({
				filter: 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)',
				width: '100%',
				height: '100%',
				position: 'fixed',
				top: '0px',
				left: '0px',
				zIndex: '499'
			});
			this.shimmer.setAttribute('frameborder','0');
			
			document.body.appendChild(this.shimmer);
			
		},
		fechaClick: function(ev)
		{
			if(ev)
				ev.stop();
			this.fecha();
		},
		fecha: function ()
		{
			this.divCont.hide()
			this.aberto = false;
			
			if (this.shimmer)
				this.shimmer.remove();
			this.shimmer = false;
			
			if($('velatura'))
				$('velatura').remove();
		},
		texto: function(texto)
		{
			this.divText.update(texto);
		}
	});
	
	
	
}
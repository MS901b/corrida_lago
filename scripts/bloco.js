if(typeof Prototype != 'object')
{
	alert('As Classes do Bloco de Notas precisam ter o Prototype disponível,\nassegure-se que o arquivo js do prototype foi incluido antes do bloco.js na tag <head>');
}
else
{
	var Bloco = Class.create({
		atual: 0, paginacao: new Array(),
		anterior:null, proxima: null, textoAdicionando: null,
		indice: 0, charPos: null, PE: null, gigante : null,
		initialize: function(gigante)
		{
			this.gigante = gigante;
			this.divCont = new Element('div', {id: 'bloco'});
			this.textCont = new Element('div', {className: 'texto'});
			this.divCont.insert(this.textCont);
			document.body.appendChild(this.divCont);
			
			this.anterior = new Element('a', {href: 'javascript:;', onclick: 'return false;', className: 'bloco_anterior'}).update(new Element('span',{className: 'escondido'}).update('anterior'));
			this.proxima = new Element('a', {href: 'javascript:;', onclick: 'return false;', className: 'bloco_proxima'}).update(new Element('span',{className: 'escondido'}).update('próxima'));
			this.fechar = new Element('a', {href: 'javascript:;', onclick: 'return false;', className: 'bloco_fechar'}).update('Fechar');
			
			this.divCont.insert(this.anterior);		this.divCont.insert(' ');
			this.divCont.insert(this.proxima);		this.divCont.insert(' ');
			this.divCont.insert(this.fechar);		this.divCont.insert(' ');
			
			this.fecha();
			
			Event.observe(this.fechar, 'click', this.fecha.bind(this));
		},
		abre: function ()
		{
			this.divCont.show();
			this.mostra(this.atual);
			
			this.shimmer = montaShimmer({
				height: this.divCont.getHeight()+'px',
				width: this.divCont.getWidth()+'px',
				left: '40px',
				bottom: '56px'
			});
			this.shimmer.setStyle({position: 'fixed'});
		},
		fecha: function ()
		{
			this.divCont.hide();
			if (this.shimmer)
				this.shimmer.remove();
			this.shimmer = false;
		},
		mostra: function (pagina)
		{
			var i = 0;
			this.atual = pagina;
			Event.stopObserving(this.anterior, 'click');
			Event.stopObserving(this.proxima, 'click');

			if(pagina == 0)
			{
				this.anterior.addClassName('desativado');
			}
			else
			{
				this.anterior.removeClassName('desativado');
				Event.observe(this.anterior, 'click', this.menosPagina.bind(this))
			}
			
			for(var a = 0; a < this.paginacao.length && a != pagina; a++)
				i+=this.paginacao[a];
			
			a = i;
			this.textCont.update();
			for(; i < MeuBloco.length; i++)
			{
				if(typeof MeuBloco[i] == 'object')
				{
					tabela = new Tabela(MeuBloco[i]);
					tmpP = tabela.tabela;
					tabela.tabela.className = '';
				}
				else
				{
					tmpP = new Element('p').update(MeuBloco[i]);
				}
				
				this.textCont.insert(tmpP);


				if(this.textCont.getHeight() > 230 && !this.gigante)
				{
					this.paginacao.push(i-a);
					tmpP.remove();
					this.proxima.removeClassName('desativado');
					Event.observe(this.proxima, 'click', this.maisPagina.bind(this))
					break;
				}
				else if(this.textCont.getHeight() > 360 && this.gigante)
				{
					this.paginacao.push(i-a);
					tmpP.remove();
					this.proxima.removeClassName('desativado');
					Event.observe(this.proxima, 'click', this.maisPagina.bind(this))
					break;
				}
				else
				{
					this.proxima.addClassName('desativado');
				}
				
			}

		},
		maisPagina: function ()
		{
			this.mostra(this.atual+1);
		},
		menosPagina: function ()
		{
			this.mostra(this.atual-1);
		},
		novaNota: function (texto)
		{
			this.textoAdicionando = texto;
			MeuBloco.push(texto);
			this.abre();
			while(!this.proxima.hasClassName('desativado'))
				this.maisPagina();
				
			if(this.PE == null)
			{
				this.indice = MeuBloco.length-1;
				this.charPos = 0;
				MeuBloco[this.indice] = '';
				this.mostra(this.atual);
				this.PE = new PeriodicalExecuter(this.adicionaTexto.bind(this), 0.05);
			}
		},
		adicionaTexto: function ()
		{
			
			MeuBloco[this.indice] = '';
			this.charPos++;this.charPos++;
			if(this.charPos >= this.textoAdicionando.length)
			{
				this.charPos = this.textoAdicionando.length;
				this.PE.stop();
				this.PE = null;
				window.setTimeout(this.fecha.bind(this), 1800);
			}
			MeuBloco[this.indice] = this.textoAdicionando.substr(0, this.charPos);
			this.mostra(this.atual);
		}
	});
	
	var Blocao = Class.create(Bloco, {
		bloco: null,
		initialize: function ($super)
		{
			$super();
			this.divCont.addClassName('blocao');
		}
	});
	
	var SuperBlocao = Class.create(Bloco, {
		bloco: null,
		initialize: function ($super)
		{
			$super(true);
			this.divCont.addClassName('super_blocao');
		}
	});
}
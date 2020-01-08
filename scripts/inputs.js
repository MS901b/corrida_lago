
Element.addMethods('input',
{
	trava: function (element)
	{
		element = $(element);
		//element.fire('input:disable');
		element.disabled = true;
		element.addClassName('desabilitado');
	},
	destrava: function (element)
	{
		element.disabled = false;
		element = $(element);
		element.removeClassName('desabilitado');
		window.setTimeout(function(){this.fire('input:enable');}.bind(element), 200);
	},
	setValue: function (element, value)
	{
		element.value = value;
		$(element).fire('input:change');
		return $(element);
	},
	setChecked: function (element, bool)
	{
		element.checked = bool;
		$(element).fire('input:change');
		return $(element);
	}
});

Element.addMethods('select',
{
	trava: function (element)
	{
		element = $(element);
		//element.fire('input:disable');
		element.addClassName('desabilitado');
		element.disabled = true;
	},
	destrava: function (element)
	{
		element.disabled = false;
		element = $(element);
		element.removeClassName('desabilitado');
		window.setTimeout(function(){this.fire('input:enable');}.bind(element), 100);
	},
	setValue: function (element, value)
	{
		element.value = value;
		$(element).fire('input:change');
		return $(element);
	}
});


Event.observe(document, 'dom:afterLoaded', function()
{
	$$('input.caracteres_especiais').each(function(input)
	{
		var select = new Element('select', {className: 'caracteres_especiais', quais: input.readAttribute('quais')});
		var padding = eval(input.getStyle('paddingLeft').replace('px', '') + '+' + input.getStyle('paddingRight').replace('px', ''));
		input.insert({after: select});
		input.setStyle({width: (input.getWidth()-50-padding-4)+'px'});
		Event.observe(select, 'input:change', function(ev){this.setValue(this.value+Event.element(ev).value);}.bind(input));
		
		if(input.disabled)
			select.trava();
	});
	
	$$('input[type="slider"]').each(function(el)
	{
		new Slider(el);
	});
	
	$$('input[type="spinner"]').each(function(el)
	{
		new Spinner(el);
	});
	
	$$('select').each(function(el){
		new Select(el);
	});;
	
	$$('input[type="ggbToolbar"]').each(function(el)
	{
		new GgbToolbar(el);
	});
	
	// $$('input[type="radio"]').each(function(el)
	// {
		// new Radio(el);
	// });
	
	// $$('input[type="checkbox"]').each(function(el)
	// {
		// new Check(el);
	// });
})


var Slider = Class.create(Control.Slider, {
	divCont: undefined, handle: undefined, passo:null, casas: 1, ultimo_slide:null,
	initialize: function ($super, min, max, valor_inicial, passo)
	{
		var id = '', style = '';
		this.input = null;
		if(typeof min == 'object')
		{
			this.input = min;
			min = Number(this.input.readAttribute('min'));
			max = Number(this.input.readAttribute('max'));
			valor_inicial = Number(this.input.readAttribute('value'));
			this.passo = Number(this.input.readAttribute('passo'));
			id = this.input.readAttribute('id');
			style = this.input.readAttribute('style');
			for (this.casas = 0; this.casas < 2; this.casas++)
				if(this.passo == this.passo.toFixed(this.casas))
					break;
		}
		
		this.divCont = new Element('div', {className: 'slider'})
		this.divCont.insert(this.handle = new Element('input', {type:'text', id: id, className:'handle', style: style}));
		
		var left;
		var valores = new Array();
		var espacamento = 318/(max)*this.passo;
		
		if(this.passo != 'NaN' && min != 'NaN' && max != 'NaN' && min < max)
		{
			for(var a = min; a <= max; a+=this.passo)
			{
				a = Number(a.toFixed(this.casas)); // hack tosco pra melhorar o float do JS
				valores.push(a);
				if(espacamento > 10)
				{
					left = Math.round((a-(min))*318/(max-(min))+13);
					ponto = new Element('div',{className: 'ponto', style: 'left:'+ left + 'px'});
					Event.observe(ponto, 'click', function(){if(!this[0].disabled) this[0].setValue(this[1])}.bind([this,a]));
					this.divCont.insert({top:ponto});
				}
			}
		}
		
		this.divCont.insert({top: new Element('div', {className:'face', style: 'width:'+(left-10)+'px;'})});
		this.imprime(this.input);
		
		Event.observe(this.handle, 'input:disable', this.desabilita.bind(this));
		Event.observe(this.handle, 'input:enable', this.habilita.bind(this));
		Event.observe(this.handle, 'change', this.change.bind(this))
		Event.observe(this.handle, 'input:change', this.change.bind(this));
		Event.observe(this.handle, 'keydown', this.keyDown.bind(this));
		
		$super(this.handle, this.divCont, {
			range: $R(min, max),
			values: valores,
			onSlide: function(value) {
				this.handle.value = value.toFixed(this.casas);
				if(this.handle.value != this.ultimo_slide)
					this.handle.fire('input:slide');
				this.ultimo_slide = this.handle.value;
			}.bind(this),
			onChange: function(value) {
				this.handle.value = value.toFixed(this.casas);
			}.bind(this)
		})
		this.setValue(valor_inicial);
	},
	change: function (ev)
	{
		this.setValue(Event.element(ev).value)
	},
	keyDown: function (ev)
	{
		var key = ev.which | ev.keyCode;
		switch(key)
		{
			case Event.KEY_UP:
			case Event.KEY_RIGHT:
				this.handle.setValue(Number(this.handle.value)+Number(this.passo));
				ev.stop();
				break;
				
			case Event.KEY_DOWN:
			case Event.KEY_LEFT:
				this.handle.setValue(Number(this.handle.value)-Number(this.passo));
				ev.stop();
				break;
		}
		
	},
	desabilita: function()
	{
		this.setDisabled();
		this.divCont.addClassName('desabilitado');
	},
	habilita: function()
	{
		this.setEnabled();
		this.divCont.removeClassName('desabilitado');
	},
	imprime: function (el)
	{
		if(el)
		{
			el.replace(this.divCont);
		}
		else
		{
			document.write('<div id="aaaaaa"</div>');
			$('aaaaaa').replace(this.divCont);
		}
	}
});


var Spinner = Class.create({
	max: 0, min: 0, padrao: 0, PE: null, tempo: 0.2,
	divCont: null,
	initialize: function (input)
	{
		this.max = input.readAttribute('max');
		this.min = input.readAttribute('min');
		this.padrao = input.readAttribute('value');
		
		this.input = new Element('input',{type: 'text', id: input.id, value: this.padrao});
		this.input.setStyle({width: ((this.max.length>this.min.length)?this.max.length:this.min.length)*11+'px'});
		
		this.up = new Element('div',{className: 'up'});
		this.down = new Element('div',{className: 'down'});
		this.divCont = new Element('div', {className: 'spinner', style: input.readAttribute('style')});
		this.divCont.insert(this.input).insert(this.down).insert(this.up).insert(new Element('div',{className: 'limpador'}));
		
		Event.observe(this.up, 'mousedown', this.sobe.bind(this));
		Event.observe(this.down, 'mousedown', this.desce.bind(this));
		Event.observe(this.input, 'keydown', this.filtra.bind(this));
		Event.observe(this.input, 'keyup', this.filtra2.bind(this));
		Event.observe(this.input, 'blur', this.vazio.bind(this));
		Event.observe(this.input, 'input:disable', this.desabilita.bind(this));
		Event.observe(this.input, 'input:enable', this.habilita.bind(this));
		Event.observe(this.input, 'input:change', this.filtra2.bind(this));
		Event.observe(document, 'mouseup', this.para.bind(this));
		
		input.replace(this.divCont);
		this.divCont.insert({after: new Element('div', {className: 'limpador'})});
	},
	desabilita: function ()
	{
		this.divCont.addClassName('desabilitado');
	},
	habilita: function ()
	{
		this.divCont.removeClassName('desabilitado');
	},
	s: function()
	{
		if(!this.input.disabled && Number(this.input.value) < Number(this.max))
		{
			this.input.value++;
			this.input.fire('input:change');
		}
	},
	
	d: function()
	{
		if(!this.input.disabled && Number(this.input.value) > Number(this.min))
		{
			this.input.value--;
			this.input.fire('input:change');
		}
	},
	sobe: function()
	{
		//this.filtra();
		this.s();
		this.para();
		this.PE = new PeriodicalExecuter(this.s.bind(this), this.tempo);
		this.up.addClassName('press');
	},
	desce: function()
	{
		//this.filtra();
		this.d();
		this.para();
		this.PE = new PeriodicalExecuter(this.d.bind(this), this.tempo);
		this.down.addClassName('press');
	},
	para: function()
	{
		this.down.removeClassName('press');
		this.up.removeClassName('press');
		if(this.PE)
		{
			this.PE.stop();
			this.PE = null;
		}
	},
	vazio: function()
	{
		if(this.input.value == '')
			this.input.value = this.padrao;
	},
	filtra: function(ev)
	{
		var key = ev.which | ev.keyCode;
		
		switch(key)
		{
			case Event.KEY_UP:
			case Event.KEY_RIGHT:
				this.sobe();
				this.para();
				return;
				
			case Event.KEY_DOWN:
			case Event.KEY_LEFT:
				this.desce();
				this.para();
				return;
		}
		
		
		var cond1 = (key >= 48 && key <= 57);
		var cond2 = (key >= 96 && key <= 105);
		var cond3 = (key == 109);
		if(!(cond1 || cond2 || cond3) && [Event.KEY_BACKSPACE, Event.KEY_DELETE, Event.KEY_LEFT, Event.KEY_RIGHT, Event.KEY_TAB].indexOf(key) == -1)
		{
			Event.stop(ev);
		}
	},
	filtra2: function ()
	{
		if(this.input.value == '')
			return;
		
		if(Number(this.input.value) == Number.NaN)
		{
			this.input.value = this.padrao;
		}
		if(this.input.value < Number(this.min))
			this.input.value = this.min;
		if(this.input.value > Number(this.max))
			this.input.value = this.max;
		
	}
});


var Select = Class.create({
	values: null, especial: null, span: null, seta: null, input: null,
	caracteres:new Hash({
		pi:				{codigo: "&#960;",	nome: 'π'}
	}),
	initialize: function (input)
	{
		this.values = new Hash();
		this.divCont = new Element('div', {className: 'select'});
		this.divCont.insert(this.span  = new Element('span', {className: 'value'}));
		this.divCont.insert(this.seta  = new Element('a', {className: 'seta', href: 'javascript:;'}).update(' '));
		this.input = $(input);
		this.input.insert({before: this.divCont});
		this.input.hide();
		this.opcoes = new Element('div', {className: 'opcoes'});
		
		this.absolute = this.input.up('div#questoes') != undefined;
		if(this.absolute)
			document.body.appendChild(this.opcoes);
		else
			this.divCont.insert(this.opcoes);
		
		// Se for especial, monta um input antes pro script não se perder
		this.especial = this.input.hasClassName('caracteres_especiais');
		if(this.especial)
		{
			var especiais = this.input.readAttribute('quais');
			this.input.writeAttribute({quais: null});
			
			if(especiais)	especiais = especiais.split(',');
			else			especiais = this.caracteres.keys();
			
			for(var a = 0; a < especiais.length; a++)
			{
				qual = especiais[a].trim();
				dados = this.caracteres.get(qual);
				
				if(dados)
					this.input.insert(new Element('option', {value: dados.nome}).update(dados.codigo));
				else
					this.input.insert(new Element('option', {value: 'null'}).update('NÃO ACHEI: '+qual));
			}
		}
		
		// Monta as opções
		var opcoes = this.input.select('option');
		opcoes.each(function(op)
		{
			tmp = new Element('span',{value: op.getAttribute('value')}).update(op.innerHTML);
			this.values.set(op.getAttribute('value'), op.innerHTML);
			this.opcoes.insert(tmp);
			
			Event.observe(tmp, 'mouseover', this.overItem.bind(this));
			Event.observe(tmp, 'click', this.seleciona.bind(this));
		}.bind(this));
		
		
		if(this.divCont.getWidth() > this.opcoes.getWidth()+20)
			largura = (this.divCont.getWidth()+8);
		else
			largura = (this.opcoes.getWidth()+34);
		
		if(this.especial)
			largura = 45;
		
		this.opcoes.setStyle({width: largura+'px'});
		this.seta.setStyle({left: (largura-21)+'px'});
		this.divCont.setStyle({cssFloat: 'left', width: largura+'px'});
		this.opcoes.hide();
		this.divCont.insert({after: new Element('div', {className: 'limpador'}).update(' ')});
		
		if(this.especial)
		{
			this.divCont.setStyle({marginLeft: '5px'})
		}
		
		Event.observe(this.seta, 'mousedown', function(ev){ev.stop()});
		Event.observe(this.seta, 'blur', this.fechaBlur.bind(this));
		Event.observe(this.seta, 'keydown', this.navega.bind(this));
		Event.observe(this.input, 'input:disable', this.trava.bind(this));
		Event.observe(this.input, 'input:enable', this.destrava.bind(this));
		Event.observe(this.input, 'input:change', this.atualizaValor.bind(this));
		Event.observe(this.divCont, 'click', this.abrefecha.bind(this));
		Event.observe(document, 'click', this.fecha.bind(this));
		
		this.atualizaValor();
	},
	limpaItens: function()
	{
		this.opcoes.select('span.selecionado').each(function(span)
		{
			span.removeClassName('selecionado');
		});
	},
	overItem: function(ev)
	{
		this.limpaItens();
		Event.element(ev).addClassName('selecionado');
	},
	abrefecha: function(ev)
	{
		if(this.opcoes.visible())
			this.fecha(ev);
		else
			this.abre(ev);
	},
	abre: function(ev)
	{
		if(this.input.disabled)
			return;
		
		var left_offset = 2, top_offset = 2;
		
		this.opcoes.show();
		if(this.absolute)
			this.opcoes.setStyle({
				top: (this.divCont.cumulativeOffset().top+this.divCont.getHeight()-1+top_offset)+'px',
				left: (this.divCont.cumulativeOffset().left+left_offset)+'px',
				width: (this.divCont.getWidth()-2)+'px',
				position: 'absolute',
				zIndex: 20
			});
		else
			this.opcoes.setStyle({	
				marginTop: '-20px',
				marginLeft: '-1px',
				width: (this.divCont.getWidth()-2)+'px',
				position: 'absolute',
				zIndex: 20
			});
		
		this.limpaItens();
		var a_selecionar = this.opcoes.select('span[value="'+this.input.value+'"]');
		if(a_selecionar.length)
			a_selecionar[0].addClassName('selecionado');
		
		if(this.opcoes.viewportOffset().top+this.opcoes.getHeight() > document.viewport.getHeight())
			window.setTimeout(function(){Effect.ScrollTo(this.opcoes, {duration: 0.4, offset: -(document.viewport.getHeight()-this.opcoes.getHeight()-60)})}.bind(this), 500);
	},
	fecha: function(ev)
	{
		switch(Event.element(ev))
		{
			case this.divCont:
			case this.seta:
			case this.span:
				return;
				break;
		}
		this.opcoes.hide();
	},
	fechaBlur: function(ev)
	{
		if(!ev.isLeftClick())
			this.opcoes.hide();
	},
	navega: function(ev)
	{
		var key = ev.which | ev.keyCode;
		switch(key)
		{
			case Event.KEY_DOWN:
			case Event.KEY_UP:
				if(!this.opcoes.visible())
				{
					this.abre();
					ev.stop();
					return;
				}	
				var itens = this.opcoes.select('span');
				var selecionado = -1;
				
				for(var a=0; a < itens.length; a++)
					if(itens[a].hasClassName('selecionado'))
						selecionado = a;
				
				switch(key){
					case Event.KEY_UP:		selecionado--;	break;
					case Event.KEY_DOWN:	selecionado++;	break;
				}
				
				selecionado = selecionado%itens.length;
				if(selecionado < 0)	selecionado = itens.length-1;
				
				this.limpaItens();
				itens[selecionado].addClassName('selecionado');
				ev.stop();
				break;
			
			case Event.KEY_RETURN:
				this.seleciona(ev);
				this.fechaBlur(ev);
				break;
		}
		
		
	},
	seleciona: function(ev)
	{
		var value = this.opcoes.select('.selecionado')[0].getAttribute('value');
		this.input.setValue(value);
		
		if(ev)
			ev.stop();
		
		this.fecha(ev);
	},
	atualizaValor: function(ev)
	{
		this.span.update(this.values.get(this.input.getValue()));
	},
	trava: function()
	{
		this.divCont.addClassName('desabilitado');
	},
	destrava: function()
	{
		this.divCont.removeClassName('desabilitado');
	}
});


var Radio = Class.create({span: null,
	initialize: function (input)
	{
		this.span = new Element('a', {className: 'radio', href:'#'});
		
		this.oldInput = input;
		this.oldInput.insert({before: this.span});
		this.oldInput.hide();

		Event.observe(this.span, 'click', this.alterna.bind(this));
		Event.observe(this.span, 'keypress', this.keyHandler.bind(this));
		Event.observe(this.oldInput, 'change', function(ev){this.oldInput.fire('input:change');}.bind(this));
		Event.observe(this.oldInput, 'input:change', this.atualiza.bind(this));
		Event.observe(this.oldInput, 'input:atualiza', this.atualiza.bind(this));
		Event.observe(this.oldInput, 'input:disable', this.trava.bind(this));
		Event.observe(this.oldInput, 'input:enable', this.destrava.bind(this));
		
		if(this.oldInput.disabled)
			this.trava();
	},
	keyHandler: function(ev)
	{
		var key = ev.which | ev.keyCode;
		if(key == 32)
			this.alterna(ev);
	},
	alterna: function(ev)
	{
		if(!this.oldInput.checked && !this.oldInput.disabled)
		{
			this.oldInput.checked = true;
			this.oldInput.fire('input:change');
		}
		ev.stop();
	},
	atualiza: function(ev)
	{
		if (this.oldInput.disabled)
			return;
		
		
		if (this.oldInput.checked)
		{
			this.span.addClassName('radio_checado');
			$$('input[name="'+this.oldInput.name+'"]').each(function(input){this.atualizaOutros(input)}.bind(this));
		}
		else
		{
			this.span.removeClassName('radio_checado');
		}
	},
	atualizaOutros: function(input)
	{
		if(input != this.oldInput)
			input.fire('input:atualiza');
			
	},
	trava: function(ev)
	{
		this.span.addClassName('desabilitado');
	},
	destrava: function(ev)
	{
		this.span.removeClassName('desabilitado');
	}
});


var Check = Class.create({span: null,
	initialize: function (input)
	{
		if (!(input.hasClassName('some')))
		{
			this.span = new Element('a', {className: 'check', href: '#'});
			
			this.oldInput = input;
			this.oldInput.insert({before: this.span});
			this.oldInput.hide();

			Event.observe(this.span, 'click', this.alterna.bind(this));
			Event.observe(this.span, 'keypress', this.keyHandler.bind(this));
			Event.observe(this.oldInput, 'change', this.change.bind(this));
			Event.observe(this.oldInput, 'input:change', this.atualiza.bind(this));
			Event.observe(this.oldInput, 'input:disable', this.trava.bind(this));
			Event.observe(this.oldInput, 'input:enable', this.destrava.bind(this));
			
			if(this.oldInput.disabled)
				this.trava();
		}
	},
	keyHandler: function(ev)
	{
		var key = ev.which | ev.keyCode;
		if(key == 32)
			this.alterna(ev);
	},
	alterna: function(ev)
	{
		this.oldInput.checked = !this.oldInput.checked;
		this.oldInput.fire('input:change');
		ev.stop();
	},
	change: function(ev)
	{
		this.oldInput.fire('input:change');
	},
	atualiza: function(ev)
	{
		if (this.oldInput.checked)
			this.span.addClassName('check_checado');
		else
			this.span.removeClassName('check_checado');
	},
	trava: function(ev)
	{
		this.span.addClassName('desabilitado');
	},
	destrava: function(ev)
	{
		this.span.removeClassName('desabilitado');
	}
});


var GgbToolbar = Class.create({
	botaoSelec: -1,
	idApplet: null,
	botoesCtrl: new Array(),
	botoesLista:new Hash({
		0: {imagem: "img_layout/ggb_mode_move.jpg", 				desc: "Mover", 															numGgb:0}, // MODE_MOVE
		1: {imagem: "img_layout/ggb_mode_point.jpg", 				desc: "Novo ponto", 													numGgb:1}, // MODE_POINT
		2: {imagem: "img_layout/ggb_mode_join.jpg", 				desc: "Reta Definida por Dois Pontos", 									numGgb:2}, // MODE_JOIN
		3: {imagem: "img_layout/ggb_mode_parallel.jpg", 			desc: "Reta Paralela", 													numGgb:3}, // MODE_PARALLEL
		4: {imagem: "img_layout/ggb_mode_orthogonal.jpg", 			desc: "Reta Perpendicular", 											numGgb:4}, // MODE_ORTHOGONAL
		5: {imagem: "img_layout/ggb_mode_intersect.jpg", 			desc: "Interseção de Dois Objetos", 									numGgb:5}, // MODE_INTERSECT
		6: {imagem: "img_layout/ggb_mode_delete.jpg", 				desc: "Apagar Objeto", 													numGgb:6}, // MODE_DELETE
		7: {imagem: "img_layout/ggb_mode_vector.jpg", 				desc: "Vetor definido por Dois Pontos", 								numGgb:7}, // MODE_VECTOR
		8: {imagem: "img_layout/ggb_mode_linebisector.jpg", 		desc: "Mediatriz", 														numGgb:8}, // MODE_LINE_BISECTOR
		9: {imagem: "img_layout/ggb_mode_angularbisector.jpg", 		desc: "Bissetriz", 														numGgb:9}, // MODE_ANGULAR_BISECTOR
		10: {imagem: "img_layout/ggb_mode_circle2.jpg", 			desc: "Círculo definido pelo centro e um de seus pontos", 				numGgb:10}, // MODE_CIRCLE_TWO_POINTS
		11: {imagem: "img_layout/ggb_mode_circle3.jpg", 			desc: "Círculo definido por três pontos", 								numGgb:11}, // MODE_CIRCLE_THREE_POINTS
		12: {imagem: "img_layout/ggb_mode_conic5.jpg", 				desc: "Cônica Definida por Cinco Pontos", 								numGgb:12}, // MODE_CONIC_FIVE_POINTS
		13: {imagem: "img_layout/ggb_mode_tangent.jpg",				desc: "Tangentes", 														numGgb:13}, // MODE_TANGENTS
		14: {imagem: "img_layout/ggb_mode_relation.jpg",			desc: "Relação entre Dois Objetos", 									numGgb:14}, // MODE_RELATION
		15: {imagem: "img_layout/ggb_mode_segment.jpg", 			desc: "Segmento definido por Dois Pontos", 								numGgb:15}, // MODE_SEGMENT
		16: {imagem: "img_layout/ggb_mode_polygon.jpg", 			desc: "Polígono", 														numGgb:16}, // MODE_POLYGON
		17: {imagem: "img_layout/ggb_mode_text.jpg", 				desc: "Inserir Texto", 													numGgb:17}, // MODE_TEXT
		18: {imagem: "img_layout/ggb_mode_ray.jpg", 				desc: "Semirreta Definida por Dois Pontos", 							numGgb:18}, // MODE_RAY
		19: {imagem: "img_layout/ggb_mode_midpoint.jpg", 			desc: "Ponto Médio ou Centro", 											numGgb:19}, // MODE_MIDPOINT
		20: {imagem: "img_layout/ggb_mode_circlearc3.jpg", 			desc: "Arco circular dados o centro e dois pontos", 					numGgb:20}, // MODE_CIRCLE_ARC_THREE_POINTS
		21: {imagem: "img_layout/ggb_mode_circlesector3.jpg", 		desc: "Setor circular dados o centro e dois pontos", 					numGgb:21}, // MODE_CIRCLE_SECTOR_THREE_POINTS
		22: {imagem: "img_layout/ggb_mode_circumcirclearc3.jpg",	desc: "Arco circular dados o centro e dois pontos", 					numGgb:22}, // MODE_CIRCUMCIRCLE_ARC_THREE_POINTS
		23: {imagem: "img_layout/ggb_mode_circumcirclesector3.jpg", desc: "Arco circuncircular dados três pontos", 							numGgb:23}, // MODE_CIRCUMCIRCLE_SECTOR_THREE_POINTS
		24: {imagem: "img_layout/ggb_mode_semicircle.jpg", 			desc: "Semicírculo Definido por Dois Pontos",							numGgb:24}, // MODE_SEMICIRCLE
		25: {imagem: "img_layout/ggb_mode_slider.jpg", 				desc: "Seletor",														numGgb:25}, // MODE_SLIDER
		26: {imagem: "img_layout/ggb_mode_image.jpg", 				desc: "Incluir Imagem", 												numGgb:26}, // MODE_IMAGE
		27: {imagem: "img_layout/ggb_mode_showhideobject.jpg", 		desc: "Exibir / Esconder Objeto", 										numGgb:27}, // MODE_SHOW_HIDE_OBJECT
		28: {imagem: "img_layout/ggb_mode_showhidelabel.jpg",		desc: "Exibir / Esconder Rótulo", 										numGgb:28}, // MODE_SHOW_HIDE_LABEL
		29: {imagem: "img_layout/ggb_mode_mirroratpoint.jpg", 		desc: "Reflexão com Relação a um Ponto", 								numGgb:29}, // MODE_MIRROR_AT_POINT
		30: {imagem: "img_layout/ggb_mode_mirroratline.jpg", 		desc: "Reflexão com Relação a uma Reta", 								numGgb:30}, // MODE_MIRROR_AT_LINE
		31: {imagem: "img_layout/ggb_mode_translatebyvector.jpg", 	desc: "Transladar Objeto por um Vetor", 								numGgb:31}, // MODE_TRANSLATE_BY_VECTOR
		32: {imagem: "img_layout/ggb_mode_rotatebyangle.jpg", 		desc: "Girar em Torno de um Ponto por um Ângulo", 						numGgb:32}, // MODE_ROTATE_BY_ANGLE
		33: {imagem: "img_layout/ggb_mode_dilatefrompoint.jpg", 	desc: "Ampliar ou Reduzir Objeto dados Centro e Fator da Homotetia", 	numGgb:33}, // MODE_DILATE_FROM_POINT
		34: {imagem: "img_layout/ggb_mode_circlepointradius.jpg", 	desc: "Círculo dados centro e raio", 									numGgb:34}, // MODE_CIRCLE_POINT_RADIUS
		35: {imagem: "img_layout/ggb_mode_copyvisualstyle.jpg", 	desc: "Copiar Estilo Visual", 											numGgb:35}, // MODE_COPY_VISUAL_STYLE
		36: {imagem: "img_layout/ggb_mode_angle.ggb", 				desc: "Ângulo", 														numGgb:36}, // MODE_ANGLE
		37: {imagem: "img_layout/ggb_mode_vectorfrompoint.jpg", 	desc: "Vetor a Partir de um Ponto", 									numGgb:37}, // MODE_VECTOR_FROM_POINT
		38: {imagem: "img_layout/ggb_mode_distance.jpg", 			desc: "Distância, Comprimento ou Perímetro", 							numGgb:38}, // MODE_DISTANCE
		39: {imagem: "img_layout/ggb_mode_moverotate.jpg", 			desc: "Girar em Torno de um Ponto", 									numGgb:39}, // MODE_MOVE_ROTATE
		40: {imagem: "img_layout/ggb_mode_translateview.jpg", 		desc: "Deslocar Eixos", 												numGgb:40}, // MODE_TRANSLATEVIEW
		41: {imagem: "img_layout/ggb_mode_zoomin.jpg", 				desc: "Ampliar", 														numGgb:41}, // MODE_ZOOM_IN
		42: {imagem: "img_layout/ggb_mode_zoomout.jpg", 			desc: "Reduzir", 														numGgb:42}, // MODE_ZOOM_OUT
		43: {imagem: "img_layout/ggb_mode_tool.jpg", 				desc: "Linha de Algebra", 												numGgb:43}, // MODE_ALGEBRA_INPUT
		44: {imagem: "img_layout/ggb_mode_polardiameter.jpg", 		desc: "Reta Polar ou Diametral", 										numGgb:44}, // MODE_POLAR_DIAMETER
		45: {imagem: "img_layout/ggb_mode_segmentfixed.jpg", 		desc: "Segmento com Comprimento Fixo", 									numGgb:45}, // MODE_SEGMENT_FIXED
		46: {imagem: "img_layout/ggb_mode_anglefixed.jpg", 			desc: "Ângulo com amplitude fixa", 										numGgb:46}, // MODE_ANGLE_FIXED
		47: {imagem: "img_layout/ggb_mode_locus.jpg", 				desc: "Lugar Geométrico", 												numGgb:47}, // MODE_LOCUS
		48: {imagem: "img_layout/ggb_mode_tool.jpg", 				desc: "Ferramenta", 													numGgb:48}, // MODE_MACRO
		49: {imagem: "img_layout/ggb_mode_area.jpg", 				desc: "Área", 															numGgb:49}, // MODE_AREA
		50: {imagem: "img_layout/ggb_mode_slope.jpg", 				desc: "Inclinação", 													numGgb:50}, // MODE_SLOPE
		51: {imagem: "img_layout/ggb_mode_regularpolygon.jpg", 		desc: "Polígono Regular", 												numGgb:51}, // MODE_REGULAR_POLYGON
		52: {imagem: "img_layout/ggb_mode_showcheckbox.jpg", 		desc: "Caixa para Exibir/Esconder Objetos", 							numGgb:52}, // MODE_SHOW_HIDE_CHECKBOX
		53: {imagem: "img_layout/ggb_mode_compasses.jpg", 			desc: "Compasso", 														numGgb:53}, // MODE_COMPASSES
		54: {imagem: "img_layout/ggb_mode_mirroratcircle.jpg", 		desc: "Inversão", 														numGgb:54}, // MODE_MIRROR_AT_CIRCLE
		55: {imagem: "img_layout/ggb_mode_ellipse3.jpg", 			desc: "Elipse", 														numGgb:55}, // MODE_ELLIPSE_THREE_POINTS
		56: {imagem: "img_layout/ggb_mode_hyperbola3.jpg", 			desc: "Hipérbole", 														numGgb:56}, // MODE_HYPERBOLA_THREE_POINTS
		57: {imagem: "img_layout/ggb_mode_parabola.jpg", 			desc: "Parábola", 														numGgb:57}, // MODE_PARABOLA
		58: {imagem: "img_layout/ggb_mode_fitline.jpg", 			desc: "Reta de Regressão Linear", 										numGgb:58}, // MODE_FITLINE
		59: {imagem: "img_layout/ggb_mode_recordtospreadsheet.jpg", desc: "Gravar para a Planilha de Cálculos", 							numGgb:59} // MODE_RECORD_TO_SPREADSHEET
	}),
	initialize: function (input)
	{
		var botoes = input.readAttribute('botoes');
		this.idApplet = input.readAttribute('idApplet');
		var tag_id = input.readAttribute('id');
		if (botoes)	botoes = botoes.split(',');
		else botoes = ["0"];

		this.divCont = new Element('div', {className: 'ggbToolbar'});
		
		for(var i = 0; i < botoes.length; i++)
			{
				qual = botoes[i].trim();
				dados = this.botoesLista.get(qual);
				if(dados)
					{
					var elemento = new Element('input', {type: 'button', className: 'botao', id: tag_id+'_'+(this.botoesCtrl.length), alt: dados.desc});
					elemento.setStyle({background: 'url('+dados.imagem+')'});
					this.botoesCtrl.push({elem: elemento, numGgb: dados.numGgb});
					this.divCont.insert(this.botoesCtrl.last().elem);
					Event.observe(this.botoesCtrl.last().elem, 'mouseover', this.mouseover.bind(this));
					Event.observe(this.botoesCtrl.last().elem, 'mouseout', this.mouseout.bind(this));
					Event.observe(this.botoesCtrl.last().elem, 'click', this.seleciona.bind(this));
					}
			}
		input.replace(this.divCont);
	},
	mouseover: function(ev)
	{
		var elem = Event.element(ev);
		var numBotao = Number(elem.getAttribute('id').split('_').last());
		if (this.botaoSelec!=numBotao) elem.addClassName('mouseover');
	},
	mouseout: function(ev)
	{
		Event.element(ev).removeClassName('mouseover');
	},
	seleciona: function(ev)
	{
		var elem = Event.element(ev);
		var numBotao = Number(elem.getAttribute('id').split('_').last());
		
		if (this.botaoSelec!=numBotao) 
			{

				if (this.botaoSelec>-1) this.botoesCtrl[this.botaoSelec].elem.removeClassName('selecionado');
				this.botoesCtrl[numBotao].elem.removeClassName('mouseover');
				this.botoesCtrl[numBotao].elem.addClassName('selecionado');
				this.botaoSelec=numBotao;
				
				// Chamada para o geogebra
				var applet = document.applets[this.idApplet];
				applet.setMode(this.botoesCtrl[numBotao].numGgb);
			}
	}
	
});

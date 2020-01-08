if(typeof Prototype != 'object')
{
	alert('A função de rolagem precisa ter o Prototype disponível,\nassegure-se que o arquivo js do prototype foi incluido antes do rolagem.js na tag <head>');
}
else
{
	var ondeEstava = 0;
	

	Event.observe(window, 'load', function ()
	{
		new PeriodicalExecuter(rolagem, 0.05);
		
		if ($('ir_applet'))
			$('ir_applet').hide();
		
		if ($('voltar_questao'))
			$('voltar_questao').hide();
		
		if ($('vai_applet'))
			Event.observe($('vai_applet'), 'click', function (ev)
			{
				ondeEstava = $('vai_applet').cumulativeOffset().top;
				$('conteudo').scrollTo();
				ev.stop();
			});
		
		if ($('volta_questao'))
			Event.observe($('volta_questao'), 'click', function (ev)
			{
				window.scrollTo(0, ondeEstava-20);
				ev.stop();
			});
			
		// Shimmer para a barrinha de ferramentas
		var shimmer = montaShimmer({
			height: $('ferramentas').getHeight()+'px',
			width: $('ferramentas').getWidth()+'px',
			left: $('ferramentas').cumulativeOffset().left+'px',
			top: $('ferramentas').cumulativeOffset().top+'px'
		}).setStyle({
			position: 'fixed',
			zIndex: 1000
		});
		new PeriodicalExecuter(function()
		{
			this[0].setStyle({
				height: this[1].getHeight()+'px',
				width: this[1].getWidth()+'px',
				left: this[1].cumulativeOffset().left+'px',
				top: this[1].cumulativeOffset().top+'px',
				position: 'fixed'
			});
		}.bind([shimmer, $('ferramentas')]), 0.5)
	});
	
	nunca = false;

	function rolagem(){
		var top = document.viewport.getScrollOffsets().top;
		var width = document.viewport.getScrollOffsets().width;
		var largura = document.body.clientWidth;
		var altura;
		var larguraElemento;
		
		if (largura<990)
		{
			
				
			if (window.innerHeight){
			   //navegadores baseados em mozilla
			   altura = window.innerHeight - 70;
			}else{
			   if (document.documentElement.clientHeight){
				  //Navegadores baseados em IExplorer, pois nao tenho innerheight
				  altura = document.documentElement.clientHeight - 53;
			   }else{
				   //outros navegadores
				   altura = 500;
			   }
			} 
			
			
			$('ferramentas').style.bottom = null;
			if ($('bloco')) 
				$('bloco').style.bottom = null;
			if ($('notas_de_referencia')) 
				$('notas_de_referencia').style.bottom = null;
			if ($('calc')) 
				$('calc').style.bottom = null;
			if ($('shimmer')) 
				$('shimmer').style.bottom = null;
				
			$('ferramentas').setStyle({
				top: (top+altura)+'px',
				position: 'absolute'
			});
			
			
			if (!$('shim'))
			{
				a = document.createElement('iframe');
				a.id='shim';
			}
			else
				a = $('shim');
			
			a.style.position='absolute';
			a.style.width='240px';
			a.style.height='50px';
			a.style.top= (top+altura)+'px';
			a.style.left='40px';
			a.style.zIndex='1000';
			a.setAttribute('frameborder','0');
			if (!$('shim'))
				document.body.appendChild(a);
			
			
			if ($('bloco')) 
			{
				if ($('bloco').className != 'super_blocao')
				{
					$('bloco').setStyle({
						top: (top+altura-312)+'px',
						position: 'absolute',
						zIndex: 1201
					});
					if ($('shimmer') && $('bloco').visible())
					{
						$('shimmer').setStyle({
							top: (top+altura-312)+'px',
							position: 'absolute',
							zIndex: 1200
						});
					}
				}
				else
				{
					$('bloco').setStyle({
						top: (top+altura-452)+'px',
						position: 'absolute',
						zIndex: 1201
					});
					if ($('shimmer') && $('bloco').visible())
					{
						$('shimmer').setStyle({
							top: (top+altura-452)+'px',
							position: 'absolute',
							zIndex: 1200
						});
					}
				}
			}
			if ($('calc')) 
			{
				$('calc').setStyle({
					top: (top+altura-264)+'px',
					position: 'absolute',
					zIndex: 1201
				});
				if ($('shimmer') && $('calc').className != 'escondido')
					$('shimmer').setStyle({
						top: (top + altura - 264)+'px',
						position: 'absolute',
						zIndex: 1200
					});
			}
			if ($('notas_de_referencia')) 
			{
				$('notas_de_referencia').setStyle({
					top: (top + altura - 360)+'px',
					position: 'absolute',
					zIndex: 1201
				});
				if ($('shimmer') && $('notas_de_referencia').visible())
					$('shimmer').setStyle({
						top: (top + altura - 360)+'px',
						position: 'absolute',
						zIndex: 1200
					});
			}
		}
		else
		{

			$('ferramentas').style.top = null;
			if ($('bloco')) 
				$('bloco').style.top = null;
			if ($('calc')) 
				$('calc').style.top = null;
			if ($('notas_de_referencia')) 
				$('notas_de_referencia').style.top = null;
			
			$('ferramentas').setStyle({
				left: 40+'px',
				bottom: 4+'px',
				position: 'fixed'
			});
			
			if (!$('shim'))
			{
				a = document.createElement('iframe');
				a.id='shim';
			}
			else
				a = $('shim');
			
			a.style.position='fixed';
			a.style.width='240px';
			a.style.height='50px';
			a.style.top= null;
			a.style.bottom= '4px';
			a.style.left='40px';
			a.style.zIndex='1000';
			a.setAttribute('frameborder','0');
			if (!$('shim'))
				document.body.appendChild(a);
			
			if ($('bloco')) 
			{
				$('bloco').setStyle({
					left: 22+'px',
					bottom: 56+'px',
					position: 'fixed',
					zIndex: 1201
				});
				if ($('shimmer') && $('bloco').visible())
					$('shimmer').setStyle({
						left: 22+'px',
						bottom: 56+'px',
						position: 'fixed',
						zIndex: 1200
					});
			}
				
			if ($('calc')) 
			{
				//alert('teste');
				$('calc').setStyle({
					left: 39+'px',
					bottom: 58+'px',
					position: 'fixed',
					zIndex: 1201
				});
				if ($('shimmer') && $('calc').className != 'escondido')
				{
					$('shimmer').setStyle({
						left: 39+'px',
						bottom: 58+'px',
						position: 'fixed',
						zIndex: 1200
					});
				}	
			}
			if ($('notas_de_referencia')) 
			{
				$('notas_de_referencia').setStyle({
					left: 27+'px',
					bottom: 70+'px',
					position: 'fixed',
					zIndex: 1201
				});
				if ($('shimmer') && $('notas_de_referencia').visible())
					$('shimmer').setStyle({
						left: 27+'px',
						bottom: 70+'px',
						position: 'fixed',
						zIndex: 1200
					});
			}
		}
	}
}
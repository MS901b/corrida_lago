var paraNavegacao = false;

if(typeof Prototype != 'object')
{
	alert('A função de rolagem precisa ter o Prototype disponível,\nassegure-se que o arquivo js do prototype foi incluido antes do rolagem.js na tag <head>');
}
else
{
	Event.observe(window, 'load', function ()
	{
		new PeriodicalExecuter(rolagem, 0.05);
		$('associado').hide();
		$('associacao').hide();
		
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
	
	function rolagem(){
		var top = document.viewport.getScrollOffsets().top;
		
		if(!paraNavegacao)
		{
			if (top > 100)
			{
				var top_applet = (top+$('applet').cumulativeOffset().top)/2+10;
				var top_applet_max = $('container').getHeight()-$('applet').getHeight()-50;
				if(top_applet < top_applet_max)
					$('applet').setStyle({top: top_applet+'px'});
				else
					$('applet').setStyle({top: top_applet_max+'px'});
			}
			else
				$('applet').setStyle({top: '100px'});
		}
		else
		{
			a = PegaQuestao(PosicaoAtual).divCont.cumulativeOffset().top;
			$('applet').setStyle({top: (a-10)+'px'});
		}
	}
}
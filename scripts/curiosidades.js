/*
aqui devem ser colocadas as variáveis que vão controlar o sistema de curiosidades
*/

var Curiosidades = new Array(
	{
		id: 'lenda_dido',
		ordem: 'c1'
	},
	{
		id: 'lenda_fu',
		ordem: 'c2'
	},
	{
		id: 'lenda_qualquer',
		ordem: 'c3'
	}
);
var qual_curiosidade;

/*
código que monta o sistema de curiosidades, favor não alterar
*/


Event.observe(window, 'load', function()
{
	for (var a = 0; a < Curiosidades.length; a++)
	{
		if($H(Curiosidades[a]).get('id'))
		{
			var link = $($H(Curiosidades[a]).get('id'));
			if(link)
			{
				link.writeAttribute({href: 'javascript:abreCuriosidade("'+$H(Curiosidades[a]).get('ordem')+'");', className: 'link_curiosidade'});
			}
			else
			{
				//alerta('Erro na referencia bibliográfica: não foi possível encontrar o link '+$H(Referencias[a]).get('link'));
			}
			qual = $H(Curiosidades[a]).get('ordem');
			if (qual)
			{
				if ($('curiosidade'+qual))
					$('curiosidade'+qual).hide();
			}
		}
	}
	qual_curiosidade = get_url_variable('id');
	if (qual_curiosidade)
	{
		var atual = $(qual_curiosidade);
		if (atual)
		{
			atual.removeClassName('curiosidade');
			atual.addClassName('curiosidade_atual');
			$('curiosidade'+qual_curiosidade).show();
		}
		
	}
	

});


function abreCuriosidade(id)
{
	window.location.href = 'curiosidades.html?id='+id;
}

function navegaCuriosidade(id)
{
	for (var a = 0; a < Curiosidades.length; a++)
	{
		if($H(Curiosidades[a]).get('id'))
		{
			qual = $H(Curiosidades[a]).get('ordem');
			if (qual)
			{
				$(''+qual+'').removeClassName('curiosidade_atual');
				$(''+qual+'').addClassName('curiosidade');
				$('curiosidade'+qual).hide();
			}
		}
	}
	$('curiosidade'+id).show();
	$(''+id+'').removeClassName('curiosidade');
	$(''+id+'').addClassName('curiosidade_atual');
}

function get_url_variable(variable) 
{
  var url = window.location.search.substring(1);
  var vars = url.split("&");
  for (var i = 0; i < vars.length; i++) 
	{
    var pair = vars[i].split("=");
    if (pair[0] == variable) 
		{
      return pair[1];
    }
  }
  return false;
}

Event.observe(window, 'load', function(){


	for (a=0; a < atividadeFeita.length; a++)
	{
		if (atividadeFeita[a] == 4 || atividadeFeita[a] == 5 || atividadeFeita[a] == 6 || atividadeFeita[a] == 7)
		{
			$('atividade'+atividadeFeita[a]).addClassName('ja_feita');
			$('atividade'+atividadeFeita[a]).removeClassName('aberta');
			
			var concluida = new Element('div', {className: 'concluida'}).insert('Atividade já concluída.');
			$('pai_atividade'+atividadeFeita[a]).insert(concluida);
		}
	}
});


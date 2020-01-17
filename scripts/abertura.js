var PopupFichaTecnica = null;

Event.observe(window, 'load', function ()
{
	PopupFichaTecnica = new FichaTecnica('Ficha técnica da unidade', FichaUnidade, 'ficha_tecnica_unidade');
	PopupFichaProjeto = new FichaTecnica('Ficha técnica do projeto', FichaProjeto, 'ficha_tecnica_projeto');

	analisaAmbiente();
});


var FichaTecnica = Class.create({
	popup: null, conteudo: null, titulo: null, texto: null,
	initialize: function (titulo, vetor, pai)
	{
		this.conteudo = new Element('div', {
			className: 'ficha_tecnica',
			style: 'width:'+(this.largura-20)+'px; height: '+(this.altura-20)+'px'
		})


		this.titulo = new Element('h2');
		this.titulo.update(titulo);

		this.texto = new Element('div', {className: 'texto'});

		this.texto.insert(this.titulo);

		for (var a = 0; a < vetor.length; a++)
		{

			var subtitulo =  new Element('h3');
			subtitulo.update(vetor[a]['titulo']);
			var conteudo =  new Element('p');
			conteudo.update(vetor[a]['texto']);
			this.texto.insert(subtitulo);
			this.texto.insert(conteudo);
		}

		this.conteudo.insert(this.texto);

		this.popup = new PopupCallback($(pai), this.conteudo, ['seta_baixo', 'esquerda'], 20, function() {}, [{fechar: 'Fechar'}]);
	}
});

function detectar_mobile() {
	if( navigator.userAgent.match(/Android/i)
	|| navigator.userAgent.match(/webOS/i)
	|| navigator.userAgent.match(/iPhone/i)
	|| navigator.userAgent.match(/iPad/i)
	|| navigator.userAgent.match(/iPod/i)
	|| navigator.userAgent.match(/BlackBerry/i)
	|| navigator.userAgent.match(/Windows Phone/i)
	){
			return true;
	 }
	else {
			return false;
	 }
}

function analisaAmbiente()
{
	/*var flashRequiredMajorVersion = 9.0;
	var flashRequiredMinorVersion = 0;
	var flashRequiredRevision = 0;

	var javaRequiredVersion="1.4+";
	var hasReqestedVersion = DetectFlashVer(flashRequiredMajorVersion, flashRequiredMinorVersion, flashRequiredRevision);*/

	var protocol = window.location.protocol;

	if (protocol != 'http:' && protocol != 'https:')
	{
		var conteudo =
			'<p><strong>Erro de execução – Não abra esse arquivo html diretamente.</strong></p>'
			+ '<p>Este software deve ser visualizado de um servidor na internet ou utilizando o programa AcessarProdutos fornecido com ele.</p>'
			+ '<p><a id="fechar_desesperado" style="float:right; href="#">Fechar</a></p>'
			+ '<br class="limpador" />';

		var tmp = new PopupDesesperados(conteudo, 30);

		$('iniciar_software').remove();
		return;
	}


	if ((BrowserDetect.browser=='Firefox' && BrowserDetect.version>=66)) {
		if ((BrowserDetect.browser=='Chrome' && BrowserDetect.version>=75)) {
			var conteudo = '<p><strong>Erro de compatibilidade – Navegador</strong></p><p>O seu navegador não é compatível com este software, para usar este software você precisa ter um dos seguintes navegadores de internet: </p><p>1. Chrome 75+ (mais recomendado)<br />2. Firefox 66.0+';
			conteudo += '<p style="float:right;"><a href="detect.html">Ver relatório de compatibilidade completo</a></p><br class="limpador" />';
			conteudo += '<p><a id="fechar_desesperado" style="float:right; href="#">Fechar</a><a id="continuar_mesmo_assim" style="float:right; margin-right:10px;"" href="#">Continuar mesmo assim</a><a style="float:right; margin-right:10px;" href="https://www.google.com/chrome/">Instalar o Chrome</a></p><br class="limpador" />';
			var tmp = new PopupDesesperados(conteudo, 20);
			return;
		}

	}

	if (detectar_mobile())
	{
		var conteudo = '<p><strong>Dispositivo não recomendado</strong></p><p>Este software não foi testado para o uso em dispositivo mobile, por conta disso é aconselhado o acesso pelo navegador de um computador ou notebook.</p>';
		conteudo += '<p style="float:right;"><a href="detect.html">Ver relatório de compatibilidade completo</a></p><br class="limpador" />';
		conteudo += '<p><a id="fechar_desesperado" style="float:right; href="#">Fechar</a><a id="continuar_mesmo_assim" style="float:right; margin-right:10px;"" href="#">Continuar mesmo assim</a>';
		var tmp = new PopupDesesperados(conteudo, 20);
		return;
	}
	/* Não utiliza mais Java e nem flash
	if (!hasReqestedVersion)
	{
		var conteudo = '<p><strong>Erro de compatibilidade – Adobe Flash Player</strong></p><p>A versão mínima necessária do plugin para usar este software é <strong><em>Adobe Flash Player '+flashRequiredMajorVersion+'</em></strong>.</p>';
		conteudo += '<p style="float:right;"><a href="detect.html">Ver relatório de compatibilidade completo</a></p><br class="limpador" />';
		conteudo += '<p><a id="fechar_desesperado" style="float:right; href="#">Fechar</a><a id="continuar_mesmo_assim" style="float:right; margin-right:10px;"" href="#">Continuar mesmo assim</a><a style="float:right; margin-right:10px;" href="http://www.adobe.com/go/getflash">Instalar o Plugin do Flash</a></p><br class="limpador" />';
		var tmp = new PopupDesesperados(conteudo, 20);
		return;
	}

	if (!deployJava.versionCheck(javaRequiredVersion))
	{
		var conteudo = '<p><strong>Erro de compatibilidade – Java Virtual Machine</strong></p><p>A versão mínima necessária da Java Virtual Machine para usar este software é <strong><em>'+javaRequiredVersion+'</em></strong>.</p>';
		conteudo += '<p style="float:right;"><a href="detect.html">Ver relatório de compatibilidade completo</a></p><br class="limpador" />';
		conteudo += '<p><a id="fechar_desesperado" style="float:right; href="#">Fechar</a><a id="continuar_mesmo_assim" style="float:right; margin-right:10px;"" href="#">Continuar mesmo assim</a><a style="float:right; margin-right:10px;" href="http://www.java.com">Instalar Java VM</a></p><br class="limpador" />';
		var tmp = new PopupDesesperados(conteudo, 20);
		return;
	}*/
}

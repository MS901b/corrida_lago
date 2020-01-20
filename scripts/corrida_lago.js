/******************************************************************************************************************************************************
 ****    Flash                         *******
 ******************************************************************************************************************************************************/

function getResp(id) {
 return $('SalvaLocal').Pega(nomeSoft,id);
}
 
function setResp(id,valor) {
 $('SalvaLocal').Salva(nomeSoft,id,valor);
}

function apagaTodasResp() {
 return ($('SalvaLocal').ApagaTudo(nomeSoft));
}

function init() {
 return ($('SalvaLocal').ApagaTudo(nomeSoft));
}




function roundNumber(num, dec) {
	var result = Math.round( Math.round( num * Math.pow( 10, dec + 1 ) ) / Math.pow( 10, 1 ) ) / Math.pow(10,dec);
	return result;
}

function processaNumero(respStr) 
{	
	var respStrSplited = respStr.split('/');
	
	var respostaValida = true;
	if (respStrSplited.length>1) 
	{
		
		for (var i=0;i<respStrSplited.length;i++)
		{	
			respStrSplited[i]=processaNumero(respStrSplited[i]);
			if (respStrSplited[i]==null) respostaValida=false;
			if (respostaValida) 
			{
				if (i==0) 
				{
					var resp=respStrSplited[i];
				} 
				else 
				{
					resp=resp/respStrSplited[i];
				}
				
			}
		}
		if (respostaValida) return resp;
		else return null;
	} 
	else
	{
		if (respStr.indexOf('%')>-1) 
		{
			respStr=respStr.replace(/%/,'');
			var porcento=true;
		} else var procento=false;
		
		respStr=respStr.replace(/,/g,'.');
		if ( !isNaN(respStr) && (respStr.length>0) ) 
		{
			if (porcento) respStr=respStr/100;
		} else respStr=null;
		return respStr;
	}

}

function muda_cor(objeto, cor){
	var applet = document.ggbapplet;
	if (cor == "preto") applet.setColor(objeto, 0, 0, 0);
	if (cor == "branco") applet.setColor(objeto, 255,255, 255);
	if (cor == "cinza") applet.setColor(objeto, 153,153, 153);
	if (cor == "vermelho") applet.setColor(objeto, 255,0, 0);
	if (cor == "azul") applet.setColor(objeto, 0,0, 255);
}

function validar_numeros(id){
	if(isNaN($(id).value)){
		$(id).value = "";
	}
}

function validar_numeros_limites(id, min, max){
	if((isNaN($(id).value))||(($(id).value)<min)||(($(id).value)>max)){
		$(id).value = "";
	}
}

function addRow(valorMax,valorDado1,valorDado2){

	var tbody = document.getElementById("tabelaDados").getElementsByTagName("TBODY")[0];
    var row = document.createElement("TR");

	//adiciona os dois primeiros dados
	td = document.createElement("TD");	
	doc = document.createTextNode(valorDado1);td.appendChild(doc);
    row.appendChild(td);	
	td = document.createElement("TD");	
	doc = document.createTextNode(valorDado2);	td.appendChild(doc);	
	
    row.appendChild(td);	
	

	//adiciona os valores de Maximo e Vencedor
    td = document.createElement("TD");	
	doc = document.createTextNode(valorMax); td.appendChild(doc);	
    row.appendChild(td);
	
	// adiciona a row no tbody.
    tbody.appendChild(row);
}

function limpa_tabela(){
	// apaga, linha por linha, a tabela.
	var tbody = document.getElementById("tabelaDados").getElementsByTagName("TBODY")[0];
	for (var i=tbody.rows.length-1; i>=0; i--) {
		tbody.deleteRow(i);
	}
}
class Mapinha {
    constructor(param1, param2, param3) {
        this.itens = {};
        this.curiosidades = [];

        this.msgFinal = "";
        this.k = 10;
        this.viewbox_h = 500;
        this.viewbox_w = 576;

        this.selected = null;

        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.l_panel = document.createElement("div");
        this.r_panel = document.createElement("div");

        this.svg.classList.add("mapinha");

        this.r_panel.classList.add("r_panel_mapinha");
        this.l_panel.classList.add("l_panel_mapinha");


        this.pai = param1;
        this.nomeSoft = param2;
    }

    pegaEstado(item) {
        var variavelSL;
        switch (item.tipo) {
            case 'atividade':
                variavelSL = 'atividade_' + item.id.substr(1);
                break;

            case 'desafio':
                variavelSL = 'desafio_' + item.id.substr(1);
                break;

            case 'transicao':
                variavelSL = 'transicao_' + item.id.substr(1);
                break;
        }

        variavelSL = $('SalvaLocal').Pega(this.nomeSoft, variavelSL);
        variavelSL = ((variavelSL == null || variavelSL == undefined) ? ("") : (variavelSL.toString()));
        //console.log(variavelSL);
        if (variavelSL == "0" || variavelSL == "1" || variavelSL == "2" || variavelSL == "3")
            item.status = variavelSL;
    }

    parseXml(data) {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(data, "text/xml");
        var doc = xmlDoc.getElementsByTagName("software");

        if (doc == undefined)
            console.error("sem definição de <software> na estrutura");
        else {
            if (this.nomeSoft === undefined || this.nomeSoft == null)
                this.nomeSoft = doc[0].getAttribute("nome");

            this.msgFinal = doc[0].getElementsByTagName("msgFinal");

            for (var item of doc[0].getElementsByTagName("item")) {
                //le item
                try {
                    var novoItem = {
                        id: item.getElementsByTagName("id")[0].childNodes[0].nodeValue,
                        tipo: item.getElementsByTagName("tipo")[0].childNodes[0].nodeValue,
                        nome: item.getElementsByTagName("nome")[0].childNodes[0].nodeValue,
                        descricao: item.getElementsByTagName("descricao")[0].childNodes[0].nodeValue,
                        status: "1",
                        posicao: {
                            coluna: item.getElementsByTagName("posicao")[0].getElementsByTagName("coluna")[0].childNodes[0].nodeValue,
                            altura: item.getElementsByTagName("posicao")[0].getElementsByTagName("altura")[0].childNodes[0].nodeValue
                        },
                        rotulo: "",
                        ligacoes: []
                    };
                    //le ligacoes
                    if (item.getElementsByTagName("ligacoes") != undefined && item.getElementsByTagName("ligacoes").length > 0)
                        for (var item_pai of item.getElementsByTagName("ligacoes")[0].getElementsByTagName("com")) {
                            novoItem.ligacoes.push(item_pai.childNodes[0].nodeValue);
                        }

                    //le estado inicial
                    if (item.getElementsByTagName("estadoinicial") != undefined && item.getElementsByTagName("estadoinicial").length > 0)
                        novoItem.status = item.getElementsByTagName("estadoinicial")[0].childNodes[0].nodeValue;

                    //pega estado inicial do SalvaLocal	
                    this.pegaEstado(novoItem);

                    //rotulos
                    if (novoItem.tipo == "atividade")
                        novoItem.rotulo = item.getElementsByTagName("rotulo")[0].childNodes[0].nodeValue;
                    else if (novoItem.tipo == "transicao")
                        novoItem.rotulo = "t";
                    else if (novoItem.tipo == "desafio")
                        novoItem.rotulo = "✶";


                    this.itens[novoItem.id] = novoItem;
                } catch (err) {
                    console.error("estrutura mal formada (itens)", err);
                }
            }
            //le curiosidades
            for (var item of doc[0].getElementsByTagName("curiosidades")) {
                try {
                    //console.log(item);
                    this.curiosidades.push({
                        id: item.getElementsByTagName("curiosidade")[0].getElementsByTagName("id")[0].childNodes[0].nodeValue,
                        titulo: item.getElementsByTagName("curiosidade")[0].getElementsByTagName("titulo")[0].childNodes[0].nodeValue
                    });
                } catch (err) {
                    console.error("estrutura mal formada (curiosidades)", err);
                }
            }
        }
    }


    createHex(x, y, item) {
        var pth1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pth1.classList.add("hex_mapinha");
        pth1.setAttribute("d", "M" + (x + 3.5 * this.k) + " " + (y) + " L" + (x + 7 * this.k) + " " + (y + 2 * this.k) + " L" + (x + 7 * this.k) + " " + (y + 6 * this.k) + " L" + (x + 3.5 * this.k) + " " + (y + 8 * this.k) + " L" + (x) + " " + (y + 6 * this.k) + " L" + (x) + " " + (y + 2 * this.k) + " Z");

        switch (item.status) {

            case '0':
                pth1.classList.add("fill_0_mapinha");
                break;
            case '2':
                pth1.classList.add("fill_2_mapinha");
                break;
            case '3':
                pth1.classList.add("fill_3_mapinha");
                break;
            default:
                pth1.classList.add("fill_1_mapinha");
        }

        pth1.addEventListener('click', e => this.criaCard(item, pth1));


        this.svg.appendChild(pth1);
    }

    createHexPequeno(x, y, item) { //hexagono pequeno == transicao
        var pth1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pth1.classList.add("hex_pequeno_mapinha");
        pth1.setAttribute("d", "M" + (x + 3.5 * this.k) + " " + (y + 2 * this.k) + " L" + (x + 5.25 * this.k) + " " + (y + 3 * this.k) + " L" + (x + 5.25 * this.k) + " " + (y + 5 * this.k) + " L" + (x + 3.5 * this.k) + " " + (y + 6 * this.k) + " L" + (x + 1.75 * this.k) + " " + (y + 5 * this.k) + " L" + (x + 1.75 * this.k) + " " + (y + 3 * this.k) + " Z");

        switch (item.status) {
            case '0':
                pth1.classList.add("fill_0_mapinha");
                break;
            case '2':
                pth1.classList.add("fill_2_mapinha");
                break;
            case '3':
                pth1.classList.add("fill_3_mapinha");
                break;
            default:
                pth1.classList.add("fill_1_mapinha");
        }

        pth1.addEventListener('click', e => this.criaCard(item, pth1));
        this.svg.appendChild(pth1);
    }

    createLabel(x, y, item) {
        var label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("style", "font-size: " + 5 * this.k + "px;");
        label.classList.add("label_mapinha");
        label.appendChild(document.createTextNode(item.rotulo));
        this.svg.appendChild(label);

        switch (item.tipo) {
            case 'atividade':
                label.setAttribute("x", x - 1.25 * this.k);
                label.setAttribute("y", y + 1.50 * this.k);
                break;
            case 'desafio':
                label.setAttribute("x", x - 2.5 * this.k);
                label.setAttribute("y", y + 1.75 * this.k);
                break;
            case 'transicao':
                label.setAttribute("x", x - 1.25 * this.k);
                label.setAttribute("y", y + 1.50 * this.k);
                break;
            case 'curiosidade':
                label.setAttribute("x", x - 1.25 * this.k);
                label.setAttribute("y", y + 1.50 * this.k);
                break;

        }
    }

    createCuriosidade(x, y) {
        var pth1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pth1.classList.add("hex_curiosidade_mapinha");
        pth1.classList.add("fill_1_mapinha");
        pth1.setAttribute("d", "M" + (x + 3.5 * this.k) + " " + (y) + " L" + (x + 7 * this.k) + " " + (y + 2 * this.k) + " L" + (x + 7 * this.k) + " " + (y + 6 * this.k) + " L" + (x + 3.5 * this.k) + " " + (y + 8 * this.k) + " L" + (x) + " " + (y + 6 * this.k) + " L" + (x) + " " + (y + 2 * this.k) + " Z");

        pth1.addEventListener('click', e => this.criaCardCuriosidade(pth1));
        this.svg.appendChild(pth1);
    }


    createAresta(x1, y1, x2, y2, status) {
        var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.classList.add("line_mapinha");
        if (status == 0)
            line.classList.add("line_dashed_mapinha"); //line.setAttribute("stroke-dasharray", "5,5");
        this.svg.appendChild(line);
    }


    adicionaBotoesItens() {
        var min_altura = 0;
        var max_altura = 0;
        var min_coluna = 0;
        var max_coluna = 0;
        var x = 0;
        var y = 0;

        //verifica dimensoes da area dos hexagonos
        for (var key in this.itens) {
            if (this.itens[key].posicao.altura < min_altura)
                min_altura = this.itens[key].posicao.altura;
            else if (this.itens[key].posicao.altura > max_altura)
                max_altura = this.itens[key].posicao.altura;
            if (this.itens[key].posicao.coluna > max_coluna)
                max_coluna = this.itens[key].posicao.coluna;
            else if (this.itens[key].posicao.coluna < min_coluna)
                min_coluna = this.itens[key].posicao.coluna;
        }

        //equanto nao couber, aumenta tela do desenho
        while ((max_coluna - min_coluna) * 12 * this.k > this.viewbox_h) {
            this.viewbox_h += 12 * this.k;
            this.viewbox_w += 12 * this.k;
        }
        while ((max_altura - min_altura) * 12 * this.k > this.viewbox_w) {
            this.viewbox_h += 12 * this.k;
            this.viewbox_w += 12 * this.k;
        }

        //define onde comeca a desenhar
        x = this.viewbox_w / 2 - (max_altura - min_altura) * 4 * this.k;
        y = this.viewbox_h / 2 - (max_coluna - min_coluna) * 4 * this.k;

        //define o tamanho da tela do desenho (que sera ajustado na div)
        this.svg.setAttribute("viewBox", "0 0 " + this.viewbox_w + " " + this.viewbox_h + "");


        //desenha arestas
        for (var key in this.itens) {
            for (var com of this.itens[key].ligacoes) {
                if (this.itens[key].tipo == 'transicao') {
                    if (this.itens[com].tipo == 'transicao') { //de transicao para transicao (transicao == hexagono pequeno)
                        this.createAresta(
                            x - ((this.itens[key].posicao.altura - 1) * 8) * this.k,
                            y + ((this.itens[key].posicao.coluna - 1) * 16) * this.k,
                            x - ((this.itens[com].posicao.altura - 1) * 8) * this.k,
                            y + ((this.itens[com].posicao.coluna - 1) * 16) * this.k,
                            this.itens[com].status);
                    } else {
                        this.createAresta( //de transicao para hexagono
                            x - ((this.itens[key].posicao.altura - 1) * 8) * this.k,
                            y + ((this.itens[key].posicao.coluna - 1) * 16) * this.k,
                            x - ((this.itens[com].posicao.altura - 1) * 8) * this.k,
                            y + ((this.itens[com].posicao.coluna - 1) * 12) * this.k,
                            this.itens[com].status);
                    }
                } else {
                    if (this.itens[com].tipo == 'transicao') { //de hexagono para transicao
                        this.createAresta(
                            x - ((this.itens[key].posicao.altura - 1) * 8) * this.k,
                            y + ((this.itens[key].posicao.coluna - 1) * 12) * this.k,
                            x - ((this.itens[com].posicao.altura - 1) * 8) * this.k,
                            y + ((this.itens[com].posicao.coluna - 1) * 16) * this.k,
                            this.itens[com].status);
                    } else {
                        this.createAresta( //de hexagono para hexagono
                            x - ((this.itens[key].posicao.altura - 1) * 8) * this.k,
                            y + ((this.itens[key].posicao.coluna - 1) * 12) * this.k,
                            x - ((this.itens[com].posicao.altura - 1) * 8) * this.k,
                            y + ((this.itens[com].posicao.coluna - 1) * 12) * this.k,
                            this.itens[com].status);
                    }
                }
            }

        }

        //desenha hexagonos e rotulos
        for (var key in this.itens) {
            switch (this.itens[key].tipo) {
                case 'atividade':
                    this.createHex(x - ((this.itens[key].posicao.altura - 1) * 8 + 3.5) * this.k, y + ((this.itens[key].posicao.coluna - 1) * 12 - 4) * this.k, this.itens[key]);
                    this.createLabel(x - ((this.itens[key].posicao.altura - 1) * 8) * this.k, y + ((this.itens[key].posicao.coluna - 1) * 12) * this.k, this.itens[key]);
                    break;
                case 'desafio':
                    this.createHex(x - ((this.itens[key].posicao.altura - 1) * 8 + 3.5) * this.k, y + ((this.itens[key].posicao.coluna - 1) * 12 - 4) * this.k, this.itens[key]);
                    this.createLabel(x - ((this.itens[key].posicao.altura - 1) * 8 - 0.5) * this.k, y + ((this.itens[key].posicao.coluna - 1) * 12) * this.k, this.itens[key]);

                    break;
                case 'transicao':
                    this.createHexPequeno(x - ((this.itens[key].posicao.altura - 1) * 8 + 3.5) * this.k, y + ((this.itens[key].posicao.coluna - 1) * 16 - 4) * this.k, this.itens[key]);
                    this.createLabel(x - ((this.itens[key].posicao.altura - 1) * 8 - 0.50) * this.k, y + ((this.itens[key].posicao.coluna - 1) * 15.50) * this.k, this.itens[key]);
                    break;

            }
        }

        //desenha curiosidades
        if (this.curiosidades.length > 0) {
            this.createCuriosidade(this.k, this.k);
            this.createLabel(this.k * 4, this.k * 5, { rotulo: "C", tipo: "curiosidade" });
        }

        this.l_panel.appendChild(this.svg);
        document.getElementById(this.pai).appendChild(this.l_panel);
        document.getElementById(this.pai).appendChild(this.r_panel);

    }


    limpaCard() {
        while (this.r_panel.firstChild) {
            this.r_panel.removeChild(this.r_panel.firstChild);
        }
        if (this.selected != null)
            this.selected.classList.remove("selected_hex_mapinha");
    }

    criaCard(item, hex) {
        this.limpaCard();
        hex.classList.add("selected_hex_mapinha");
        this.selected = hex;

        var card = document.createElement("div");
        var texto_titulo = document.createElement("b");
        var titulo = document.createElement("h2");
        var descricao = document.createElement("p");
        var obs = document.createElement("p");
        var btn = document.createElement("button");
        var btn_close = document.createElement("button");
        var span = document.createElement("div");

        card.classList.add("card_mapinha");

        texto_titulo.appendChild(document.createTextNode(item.nome));
        titulo.appendChild(texto_titulo);
        titulo.classList.add("titulo_mapinha");

        descricao.appendChild(document.createTextNode(item.descricao));

        btn_close.appendChild(document.createTextNode("X"));
        btn_close.addEventListener('click', e => this.limpaCard());
        card.appendChild(btn_close);

        card.appendChild(titulo);
        card.appendChild(descricao);
        card.appendChild(document.createElement("hr"));
        btn.classList.add("btn_mapinha");
        btn_close.classList.add("btn_close_mapinha");
        obs.classList.add("obs_mapinha");
        span.classList.add("span_mapinha");


        if (item.status != 0) { //TODO trocar status por constantes
            switch (item.tipo) {
                case 'atividade':
                    btn.addEventListener('click', function() {
                        location.href = "atividade" + item.id.substr(1) + "_parte1.html";
                    });
                    break;
                case 'desafio':
                    btn.addEventListener('click', function() {
                        location.href = "desafio" + item.id.substr(1) + ".html";
                    });
                    break;
                case 'transicao':
                    btn.addEventListener('click', function() {
                        location.href = "transicao" + item.id.substr(1) + ".html";
                    });
                    break;
            }
            span.appendChild(btn);
            card.appendChild(span);
        }

        if (item.status == 0) {

            if (item.tipo == 'transicao')
                obs.appendChild(document.createTextNode("Você ainda não tem acesso a este texto."));
            else
                obs.appendChild(document.createTextNode("Você ainda não tem acesso a esta atividade."));
        }
        if (item.status == 1) {
            switch (item.tipo) {
                case 'atividade':
                    obs.appendChild(document.createTextNode("Você ainda não começou esta atividade"));
                    btn.appendChild(document.createTextNode("Fazer atividade"));
                    break;
                case 'desafio':
                    obs.appendChild(document.createTextNode("Você ainda não começou esta atividade"));
                    btn.appendChild(document.createTextNode("Fazer desafio"));
                    break;
                case 'transicao':
                    obs.appendChild(document.createTextNode("Você ainda não leu este texto."));
                    btn.appendChild(document.createTextNode("Ler texto"));
                    break;
            }
        }
        if (item.status == 2) {
            switch (item.tipo) {
                case 'atividade':
                    obs.appendChild(document.createTextNode("Você já começou a fazer esta atividade mas não terminou."));
                    btn.appendChild(document.createTextNode("Voltar à atividade"));
                    break;
                case 'desafio':
                    obs.appendChild(document.createTextNode("Você já começou a fazer esta atividade mas não terminou."));
                    btn.appendChild(document.createTextNode("Fazer desafio"));
                    break;
                case 'transicao':
                    btn.appendChild(document.createTextNode("Reler texto"));
                    break;
            }
        }
        if (item.status == 3) {
            switch (item.tipo) {
                case 'atividade':
                    obs.appendChild(document.createTextNode("Você já completou essa atividade."));
                    btn.appendChild(document.createTextNode("Rever atividade"));
                    break;
                case 'desafio':
                    obs.appendChild(document.createTextNode("Você já completou essa atividade."));
                    btn.appendChild(document.createTextNode("Refazer desafio"));
                    break;
                case 'transicao':
                    btn.appendChild(document.createTextNode("Reler texto"));
                    break;
            }
        }

        card.appendChild(obs);

        this.r_panel.appendChild(card);
    }

    criaCardCuriosidade(hex) {
        this.limpaCard();
        hex.classList.add("selected_hex_mapinha");
        this.selected = hex;

        var card = document.createElement("div");
        var texto_titulo = document.createElement("b");
        var titulo = document.createElement("h2");
        var btn_close = document.createElement("button");

        btn_close.appendChild(document.createTextNode("X"));
        btn_close.addEventListener('click', e => this.limpaCard());
        btn_close.classList.add("btn_close_mapinha");
        card.appendChild(btn_close);

        card.classList.add("card_mapinha");

        texto_titulo.appendChild(document.createTextNode("Curiosidades"));
        titulo.appendChild(texto_titulo);
        titulo.classList.add("titulo_mapinha");

        card.appendChild(titulo);


        for (var cur of this.curiosidades) {
            var btn = document.createElement("button");
            btn.setAttribute("type", "button");
            btn.classList.add("btn_mapinha");
            btn.classList.add("btn_curiosidade_mapinha");
            btn.appendChild(document.createTextNode(cur.titulo));
            btn.addEventListener('click', function() {
                location.href = "curiosidades.html?id=" + cur.id;
            });

            card.appendChild(btn);
        }

        this.r_panel.appendChild(card);
    }
}
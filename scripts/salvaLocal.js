var nomeSoft = 'corrida_lago';

var SalvaLocal = new (Class.create({
    Salva: function(soft, key, value) {
      var item = localStorage.getItem(soft);
      software = item ? JSON.parse(item) : {};
      software[key] = value;
      localStorage.setItem(soft, JSON.stringify(software));  
    },
    Pega: function(soft, key) {
      item = localStorage.getItem(soft);
      software = item ? JSON.parse(item) : {};
      return software[key] ? software[key] : null;
    },
    Apaga: function (soft, key){
      var item = localStorage.getItem(soft);
  
      if(!item)
        return
  
      software = item ? JSON.parse(item) : {};
      delete software[key];
      localStorage.setItem(soft, JSON.stringify(software));    
    },
    ApagaTudo: function (soft) {
      localStorage.removeItem(soft)
    }
  }))
  
  var hades = $;
  
  $ = function(...args) {
    if (args[0] === 'SalvaLocal' || args[0] === 'Mapinha') {
      console.log("CAIU AQUI")
      return SalvaLocal;
    } else {
      return hades(...args)
    }
  };
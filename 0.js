class Componente {
  constructor() {
    this.e = document.createElement("span")
  }
  adicione(filho) {
    this.e.appendChild(filho.e)
  }
  set altura(valor) {
    this.e.style.height = valor
  }
  set cresce(valor) {
    this.e.style.flexGrow = valor
  }
}

class Coluna extends Componente {
  constructor() {
    super()
    this.e.style.display = "flex"
    this.e.style.flexDirection = "column"
  }
}

class Linha extends Componente {
  constructor() {
    super()
    this.e.style.display = "flex"
    this.e.style.flexDirection = "row"
  }
}

class Barra extends Linha {
  constructor() {
    super()
    this.e.style.backgroundColor = COR_PRINCIPAL
    this.e.style.color = "#fff"
    this.e.style.padding = "16px"
  }
}

class Texto extends Componente {
  constructor(texto) {
    super()
    this.e.textContent = texto
  }
}

class Título extends Texto {
  constructor(texto) {
    super(texto)
    this.cresce = 1
    this.e.style.fontSize = "24px"
  }
}

class Ícone extends Componente {
  constructor(nome) {
    super()
    this.e.classList.add("material-icons")
    this.e.textContent = nome
    this.e.style.fontSize = 24
    this.e.style.padding = "12px"
  }
}

class Lista extends Coluna {
  constructor() {
    super()
  }
}

class Espaço extends Componente {
  constructor() {
    super()
    this.e.style.flexGrow = 1
  }
}

const COR_PRINCIPAL = "#cd0000"

window.addEventListener("load", () => {
  document.body.style.margin = 0
  document.body.style.height = "100vh"
  let coluna = new Coluna()
  document.body.appendChild(coluna.e)
  coluna.altura = "100%"
  let barra_superior = new Barra()
  coluna.adicione(barra_superior)
  let título = new Título("0")
  barra_superior.adicione(título)
  let linha = new Linha()
  coluna.adicione(linha)
  let início = new Ícone("home")
  linha.adicione(início)
  let lista = new Lista()
  coluna.adicione(lista)
  lista.cresce = 1
  let barra_inferior = new Barra()
  coluna.adicione(barra_inferior)
  let página_lista = new Ícone("list")
  barra_inferior.adicione(página_lista)
  let espaço = new Espaço()
  barra_inferior.adicione(espaço)
  let adicionar = new Ícone("add")
  barra_inferior.adicione(adicionar)
})

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
  ao_clicar(chame) {
    this.e.addEventListener("click", chame)
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
    this.e.style.gap = "12px"
    this.e.style.alignItems = "center"
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

class Tela extends Coluna {
  constructor(texto_título) {
    super()
    document.body.appendChild(this.e)
    this.e.style.position = "absolute"
    this.e.style.top = 0
    this.e.style.left = 0
    this.e.style.width = "100%"
    this.e.style.height = "100%"
    this.e.style.backgroundColor = "#fff"
    this.barra_superior = new Barra()
    this.adicione(this.barra_superior)
    this.título = new Título(texto_título)
    this.barra_superior.adicione(this.título)
  }
}

class TelaTemporária extends Tela {
  constructor(texto_título) {
    super(texto_título)
    let voltar = new Ícone("arrow_back")
    this.barra_superior.adicione(voltar)
    voltar.ao_clicar(() => {
      document.body.removeChild(this.e)
    })
    this.barra_superior.adicione(this.título)
  }
}

class TelaLista extends Tela {
  constructor() {
    super("0")
    let linha = new Linha()
    this.adicione(linha)
    let início = new Ícone("home")
    linha.adicione(início)
    let lista = new Lista()
    this.adicione(lista)
    lista.cresce = 1
    let barra_inferior = new Barra()
    this.adicione(barra_inferior)
    let página_lista = new Ícone("list")
    barra_inferior.adicione(página_lista)
    let espaço = new Espaço()
    barra_inferior.adicione(espaço)
    let adicionar = new Ícone("add")
    barra_inferior.adicione(adicionar)
    adicionar.ao_clicar(() => {
      new TelaTemporária("Adicionar")
    })
  }
}

const COR_PRINCIPAL = "#cd0000"

window.addEventListener("load", () => {
  document.body.style.margin = 0
  document.body.style.height = "100vh"
  new TelaLista()
})

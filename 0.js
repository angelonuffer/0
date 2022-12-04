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

class CampoSenha extends Coluna {
  constructor(texto_rótulo) {
    super()
    this.e.style.padding = "16px"
    let rótulo = document.createElement("label")
    this.e.appendChild(rótulo)
    rótulo.textContent = texto_rótulo + ":"
    this.campo = document.createElement("input")
    this.e.appendChild(this.campo)
    this.campo.type = "password"
    this.campo.style.padding = "8px"
  }
}

class Botão extends Componente {
  constructor(texto, chame) {
    super()
    this.e.textContent = texto
    this.habilitar()
    this.e.style.color = "#fff"
    this.e.style.textAlign = "center"
    this.e.style.margin = "16px"
    this.e.style.padding = "8px"
    this.e.style.borderRadius = "50vh"
    this.e.addEventListener("click", () => {
      if (this.habilitado) chame()
    })
  }
  desabilitar() {
    this.habilitado = false
    this.e.style.backgroundColor = "#aaa"
  }
  habilitar() {
    this.habilitado = true
    this.e.style.backgroundColor = COR_PRINCIPAL
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

class TelaLogin extends Tela {
  constructor() {
    super("Login Github")
    let pat = new CampoSenha("Personal Access Token")
    this.adicione(pat)
    pat.campo.addEventListener("paste", evento => {
      pat.campo.value = evento.clipboardData.getData("text")
      pat.campo.blur()
    })
    let nome = new Texto("")
    this.adicione(nome)
    nome.e.style.padding = "16px"
    pat.campo.addEventListener("blur", () => {
      nome.e.textContent = ""
      entrar.desabilitar()
      fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: "bearer " + pat.campo.value,
        },
        body: JSON.stringify({
          query: "query { viewer { login } }",
        })
      }).then(r => r.json()).then(resposta => {
        nome.e.textContent = "github.com/" + resposta.data.viewer.login
        entrar.habilitar()
      })
    })
    this.adicione(new Espaço())
    let entrar = new Botão("ENTRAR", () => {
      document.body.removeChild(this.e)
      new TelaLista()
    })
    this.adicione(entrar)
    entrar.desabilitar()
  }
}

const COR_PRINCIPAL = "#cd0000"

window.addEventListener("load", () => {
  document.body.style.margin = 0
  document.body.style.height = "100vh"
  new TelaLogin()
})

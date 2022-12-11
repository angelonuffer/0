const COR_PRINCIPAL = "#cd0000"

const conta_github = {
  nome: "",
  atributos: [
    {
      nome: "Personal Access Token",
      tipo: "Senha",
      valor: "",
    },
  ],
}

const atributo = (objeto, nome) => objeto.atributos.find(atributo => atributo.nome === nome)

let _pat = atributo(conta_github, "Personal Access Token").valor
Object.defineProperty(atributo(conta_github, "Personal Access Token"), "valor", {
  set(valor) {
    _pat = valor
    conta_github.nome = ""
    if (valor.length === 40) {
      consulte_github("query { viewer { login } }", resposta => conta_github.nome = resposta.viewer.login)
    }
  },
  get() {
    return _pat
  }
})

const consulte_github = (consulta, responda) => {
  fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: "bearer " + atributo(conta_github, "Personal Access Token").valor,
    },
    body: JSON.stringify({
      query: consulta,
    })
  }).then(r => r.json()).then(resposta => responda(resposta.data))
}

const represente_atributo = (atributo) => {
  const span = document.createElement("span")
  span.style.display = "flex"
  span.style.flexDirection = "column"
  const label = document.createElement("label")
  label.textContent = atributo.nome + ":"
  span.appendChild(label)
  const input = document.createElement("input")
  if (atributo.tipo === "Senha") input.type = "password"
  input.style.padding = "8px"
  input.style.borderWidth = "0px"
  input.style.borderBottomWidth = "1px"
  input.style.outline = "0px"
  input.textContent = atributo.nome + ":"
  input.addEventListener("keyup", () => atributo.valor = input.value)
  span.appendChild(input)
  return span
}

const represente_objeto = (objeto) => {
  const span = document.createElement("span")
  span.style.display = "flex"
  span.style.flexDirection = "column"
  span.style.flexGrow = 1
  const barra_superior = document.createElement("span")
  barra_superior.style.backgroundColor = COR_PRINCIPAL
  barra_superior.style.padding = "16px"
  barra_superior.style.color = "#fff"
  barra_superior.style.fontSize = "24px"
  let _nome = objeto.nome
  Object.defineProperty(objeto, "nome", {
    set(novo_nome) {
      _nome = novo_nome
      if (novo_nome.length > 0) {
        barra_superior.textContent = novo_nome
        span.insertBefore(barra_superior, span.firstChild)
        span.appendChild(barra_inferior)
      } else {
        if (span.contains(barra_superior)) span.removeChild(barra_superior)
        if (span.contains(barra_inferior)) span.removeChild(barra_inferior)
      }
    },
  })
  const corpo = document.createElement("span")
  corpo.style.padding = "16px"
  corpo.style.flexGrow = 1
  objeto.atributos.map(represente_atributo).forEach(filho => corpo.appendChild(filho))
  span.appendChild(corpo)
  const barra_inferior = document.createElement("span")
  barra_inferior.style.backgroundColor = COR_PRINCIPAL
  barra_inferior.style.padding = "16px"
  barra_inferior.style.color = "#fff"
  barra_inferior.style.display = "flex"
  barra_inferior.style.gap = "12px"
  const lista = ícone("list")
  barra_inferior.appendChild(lista)
  const formulário = ícone("edit_document")
  barra_inferior.appendChild(formulário)
  selecione(formulário)
  return span
}

const ícone = (nome) => {
  const span = document.createElement("span")
  span.style.padding = "12px"
  span.style.borderRadius = "8px"
  span.classList.add("material-icons")
  span.textContent = nome
  return span
}

const selecione = (elemento) => {
  elemento.style.backgroundColor = "#fff2"
}

window.addEventListener("load", () => {
  document.body.style.margin = 0
  document.body.style.fontFamily = "sans-serif"
  document.body.style.display = "flex"
  document.body.style.height = "100vh"
  document.body.appendChild(represente_objeto(conta_github))
})
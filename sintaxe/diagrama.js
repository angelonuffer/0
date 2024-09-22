const svgNS = "http://www.w3.org/2000/svg"

const span = document.createElement('span')
span.style.fontFamily = 'monospace'
span.style.fontSize = '16px'
span.textContent = '0'
document.body.appendChild(span)
const rect = span.getBoundingClientRect()
const largura_caractere = rect.width
const altura_caractere = rect.height
document.body.removeChild(span)

export default sintaxe => {
  const div = document.createElement("div")
  for (const nome in sintaxe) {
    const div_nome = document.createElement("div")
    div_nome.textContent = nome
    div.appendChild(div_nome)
    const svg = document.createElementNS(svgNS, "svg")
    svg.style.border = "1px solid black"
    svg.style.borderRadius = "5px"
    const g_nomes = document.createElementNS(svgNS, "g")
    g_nomes.setAttribute("fill", "black")
    g_nomes.setAttribute("font-family", "monospace")
    g_nomes.setAttribute("font-size", "16px")
    svg.appendChild(g_nomes)
    const {
      trilho,
      textos,
      largura,
      altura,
    } = item(sintaxe[nome], 30, 10)
    for (const texto of textos) {
      const text = document.createElementNS(svgNS, "text")
      text.setAttribute("x", texto.x)
      text.setAttribute("y", texto.y)
      text.innerHTML = texto.texto
      g_nomes.appendChild(text)
    }
    svg.setAttribute("width", largura + 60)
    svg.setAttribute("height", altura + 20)
    const path = document.createElementNS(svgNS, "path")
    path.setAttribute("fill", "none")
    path.setAttribute("stroke", "black")
    path.setAttribute("stroke-width", 2)
    path.setAttribute("d", `M 20 ${20} l -10 5 l 0 -10 l 10 5 h 10 ${trilho} h 10 m 10 0 l -10 -5 l 0 10 l 10 -5`)
    svg.appendChild(path)
    div.appendChild(svg)
  }
  return div
}

const item = (declaração, x, y) => {
  if (typeof declaração === "string") {
    const largura = declaração.length * largura_caractere
    return {
      trilho: `m 10 -10 a 10 10 0 0 0 -10 10 a 10 10 0 0 0 10 10 h ${largura} a 10 10 0 0 0 10 -10 a 10 10 0 0 0 -10 -10 h -${largura} m ${largura + 10} 10`,
      textos: [{
        x: x + 10,
        y: y + altura_caractere - 5,
        texto: declaração,
      }],
      largura: largura + 20,
      altura: 20,
    }
  }
  if (declaração["."]) {
    let texto = ""
    if (typeof declaração["."] === "string") texto = `'${declaração["."]}'`
    if (Array.isArray(declaração["."])) {
      texto = `'${declaração["."][0]}' . '${declaração["."][1]}'`
      if (declaração["."].length === 3) texto += ` - '${declaração["."][2]}'`
    }
    const largura = largura_caractere * texto.length
    return {
      trilho: `m 5 -10 a 5 5 0 0 0 -5 5 v 10 a 5 5 0 0 0 5 5 h ${largura} a 5 5 0 0 0 5 -5 v -10 a 5 5 0 0 0 -5 -5 h -${largura} m ${largura + 5} 10`,
      textos: [{
        x: x + 5,
        y: y + altura_caractere - 5,
        texto,
      }],
      largura: largura + 10,
      altura: 20,
    }
  }
  if (declaração["$"]) {
    const largura = largura_caractere * declaração["$"].length
    return {
      trilho: `m 0 -10 v 20 h ${largura + 10} v -20 h -${largura + 11} m ${largura + 11} 10`,
      textos: [{
        x: x + 5,
        y: y + altura_caractere - 5,
        texto: declaração["$"],
      }],
      largura: largura + 10,
      altura: 20,
    }
  }
  if (declaração["+"]) {
    const {
      trilho: trilho_subitem,
      textos: textos_subitem,
      largura: largura_subitem,
      altura: altura_subitem,
    } = item(declaração["+"], x + 20, y + 30)
    return {
      trilho: `a 10 10 0 0 1 10 10 v 10 a 10 10 0 0 0 10 10 ${trilho_subitem} a 10 10 0 0 0 10 -10 v -10 a 10 10 0 0 0 -10 -10 h -${largura_subitem} a 10 10 0 0 0 -10 10 m ${largura_subitem + 20} 0 a 10 10 0 0 1 10 -10`,
      textos: textos_subitem,
      largura: largura_subitem + 40,
      altura: altura_subitem + 30,
    }
  }
  if (Array.isArray(declaração)) {
    let trilho = ""
    const textos = []
    let largura = 0
    let altura = 0
    const finais = []
    if (declaração.length > 1) {
      trilho += "h 30"
      largura = 30
      x += 30
    }
    const x_base = x
    let altura_subitem_anterior
    for (let i = 0; i < declaração.length; i++) {
      if (i === 1) {
        trilho += `m -${x - x_base + 30} 0 a 10 10 0 0 1 10 10 v ${altura_subitem_anterior - 10} a 10 10 0 0 0 10 10 h 10`
        altura += 10
        y += altura_subitem_anterior + 10
      }
      if (i > 1) {
        trilho += `m -${x - x_base + 20} -10 v ${altura_subitem_anterior + 10} a 10 10 0 0 0 10 10 h 10`
        altura += 10
        y += altura_subitem_anterior + 10
      }
      x = x_base
      if (Array.isArray(declaração[i])) {
        let largura_série = 0
        let altura_série = 0
        for (let j = 0; j < declaração[i].length; j++) {
          if (j > 0) {
            trilho += "h 10"
            largura_série += 10
            x += 10
          }
          const {
            trilho: trilho_subitem,
            textos: textos_subitem,
            largura: largura_subitem,
            altura: altura_subitem,
          } = item(declaração[i][j], x, y)
          trilho += trilho_subitem
          textos.push(...textos_subitem)
          largura_série += largura_subitem
          altura_série = Math.max(altura_série, altura_subitem)
          x += largura_subitem
        }
        if (declaração.length === 1) largura = largura_série
        else largura = Math.max(largura_série + 60, largura)
        altura += altura_série
        altura_subitem_anterior = altura_série
      }
      else if (declaração[i] !== null) {
        const {
          trilho: trilho_subitem,
          textos: textos_subitem,
          largura: largura_subitem,
          altura: altura_subitem,
        } = item(declaração[i], x, y)
        trilho += trilho_subitem
        textos.push(...textos_subitem)
        if (declaração.length === 1) largura = largura_subitem
        else largura = Math.max(largura_subitem + 60, largura)
        x += largura_subitem
        altura += altura_subitem
        altura_subitem_anterior = altura_subitem
      }
      if (declaração[i] === null) altura += 10
      finais.push([x, y])
    }
    if (declaração.length > 1) {
      const maior_x = Math.max(...finais.map(f => f[0]))
      for (let i = finais.length - 1; i >= 0; i--) {
        trilho += `m ${finais[i][0] - x} ${finais[i][1] - y} h ${maior_x - finais[i][0] + 10}`
        x += finais[i][0] - x
        y += finais[i][1] - y
        x += maior_x - finais[i][0] + 10
        if (i === 0) {
          trilho += "h 20"
          x += 20
        }
        if (i === 1) {
          trilho += `a 10 10 0 0 0 10 -10 v ${finais[0][1] - finais[1][1] + 20} a 10 10 0 0 1 10 -10`
          x += 20
          y += finais[0][1] - finais[1][1]
        }
        if (i > 1) {
          trilho += `a 10 10 0 0 0 10 -10 v ${finais[i - 1][1] - finais[i][1]} m 0 10`
          x += 10
          y += finais[i - 1][1] - finais[i][1]
        }
      }
    }
    return {
      trilho,
      textos,
      largura,
      altura,
    }
  }
  console.error(declaração)
  throw new Error("Erro de definição da sintaxe.")
}
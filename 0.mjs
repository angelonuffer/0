import fs from "node:fs"

class Variável {
  constructor (classe, nome) {
    this.classe = classe
    this.nome = nome
  }
}

class Função {
  constructor (classe_de_retorno, classes_dos_argumentos, chame) {
    this.classe_de_retorno = classe_de_retorno
    this.classes_dos_argumentos = classes_dos_argumentos
    this.chame = chame
    this.classe = "Função"
  }
}

class Macro {
  constructor (chame) {
    this.chame = chame
  }
}

class Classe {
  constructor (atributos, nomes_métodos, métodos) {
    this.classe = "Classe"
    this.atributos = atributos
    this.nomes_métodos = nomes_métodos
    this.métodos = métodos
  }
}

class Objeto {
  constructor (classe) {
    this.classe = classe
  }
}

const GLOBAIS = {
  "#0": new Macro((escopo, chamada) => {
    const novo_escopo = {...GLOBAIS}
    const código = avalie(novo_escopo, fs.readFileSync(chamada[1].slice(1, -1), {encoding: "utf-8"}))
    if (chamada[2] === "*") Object.keys(novo_escopo).forEach(chave => escopo[chave] = novo_escopo[chave])
    return Buffer.from("(()=>{" + código + "})();")
  }),
  "#1": new Macro((escopo, [macro, nome, apelido]) => {
    if (! escopo.hasOwnProperty(nome)) throw "Nome '" + nome + "' não encontrado."
    escopo[apelido] = escopo[nome]
    return Buffer.from("")
  }),
  "#2": new Macro((escopo, [macro, expressão]) => {
    const FIM = ["\r", "\n", undefined]
    const ESPAÇOS = [" ", "\t", ...FIM]
    let chamadas = []
    let chamada = []
    let i = 0
    let j = 0
    let parênteses = 0
    while (j < expressão.length + 1) {
      if (i === j) {
        if (ESPAÇOS.includes(expressão[i])) i++
      } else {
        if (expressão[i] === "(" && expressão[j - 1] === "(") parênteses++
        if (expressão[i] === "(" && expressão[j - 1] === ")") parênteses--
        if (
          (expressão[i] === "(" && expressão[j - 1] === ")" && parênteses == 0) ||
          (expressão[i] === "\"" && expressão[j - 1] === "\"" && j > i + 1) ||
          (expressão[i] !== "(" && expressão[i] !== "\"" && ESPAÇOS.includes(expressão[j]))
        ) {
          chamada.push(expressão.slice(i, j))
          if (FIM.includes(expressão[j])) {
            chamadas.push(chamada)
            chamada = []
          }
          i = j + 1
        }
      }
      j++
    }
    return chamadas
  }),
  "#3": new Macro((escopo, [macro, expressão]) => {
    if (expressão.startsWith('(') && expressão.endsWith(')')) return avalie(escopo, expressão.slice(1, -1))
    if (["Código", "Função"].indexOf(classe_de(escopo, expressão)) === -1) {
      if (escopo.hasOwnProperty(expressão)) return escopo[expressão].nome
      return expressão
    }
    const chamadas = analise(expressão)
    if (chamadas.length === 1) {
      if (expressão.includes("[")) return Buffer.from(expressão.slice(0, -1).split("[").map(parte => avalie(escopo, parte)).join("[") + "]")
      if (expressão.includes(".") && ! expressão.includes('"')) {
        const [nome, atributo] = expressão.split(".")
        return Buffer.from(nome + "[" + escopo[nome].classe.atributos.indexOf(atributo) + "]")
      }
    }
    return Buffer.concat(chamadas.map(chamada => {
      if (escopo.hasOwnProperty(chamada[0]) && escopo[chamada[0]] instanceof Macro) return escopo[chamada[0]].chame(escopo, chamada)
      if (escopo.hasOwnProperty(chamada[1]) && escopo[chamada[1]] instanceof Macro) return escopo[chamada[1]].chame(escopo, chamada)
      if (escopo.hasOwnProperty(chamada[0]) && escopo[chamada[0]] instanceof Função) return escopo[chamada[0]].chame(escopo, ...chamada.slice(1).map(a => avalie(escopo, a)))
      if (escopo.hasOwnProperty(chamada[1]) && escopo[chamada[1]] instanceof Função) return escopo[chamada[1]].chame(escopo, avalie(escopo, chamada[0]), ...chamada.slice(2).map(a => avalie(escopo, a)))
      if (chamada[0].includes(".")) {
        const [nome, método] = chamada[0].split(".")
        if (escopo[nome] instanceof Objeto) {
          return Buffer.from(Object.keys(escopo)[Object.values(escopo).indexOf(escopo[nome].classe)] + "[" + escopo[nome].classe.nomes_métodos.indexOf(método) + "](" + nome + "," + chamada.slice(1).map(a => avalie(escopo, a)).join(",") + ");")
        }
      }
      throw "(" + chamada.join(" ") + ") Chamada inválida."
    }))
  }),
  "#5": new Macro((escopo, [macro, nome_teste, código]) => Buffer.from("(()=>{" + avalie({...escopo}, código) + "})();")),
  "#6": new Macro((escopo, [código, macro, mensagem_esperada]) => {
    mensagem_esperada = mensagem_esperada.slice(1, -1)
    let passou = false
    try {
      avalie({...escopo}, código)
      passou = true
    } catch (erro) {
      if (erro !== mensagem_esperada) throw [
        "Ao executar:",
        "  " + código,
        "Esperava erro com a mensagem:",
        "  " + mensagem_esperada,
        "Deu erro com a mensagem:",
        "  " + erro,
      ].join("\n")
    }
    if (passou) throw [
      "Ao executar:",
      "  " + código,
      "Esperava erro com a mensagem:",
      "  " + mensagem_esperada,
      "Não deu erro.",
    ].join("\n")
    return Buffer.from("")
  }),
  "#7": new Macro((escopo, [nome, macro, ...valor]) => {
    if (nome.startsWith("@")) return Buffer.from("_[" + escopo.atributos.indexOf(nome.slice(1)) + "]=" + avalie(escopo, valor[0]) + ";")
    const classe = classe_de(escopo, valor[0])
    if (classe === "Classe") {
      escopo[nome] = new Objeto(escopo[valor[0]])
      return Buffer.from("let " + nome + "=[" + valor.slice(1).map(a => avalie(escopo, a)).join(",") + "];")
    }
    let _let = "let "
    if (nome.includes("[")) {
      nome = nome.slice(0, -1).split("[").map(parte => avalie(escopo, parte)).join("[") + "]"
      _let = ""
    } else if (escopo.hasOwnProperty(nome)) {
      if (classe !== escopo[nome].classe) throw "Variável '" + nome + "' é da classe '" + escopo[nome].classe + "'."
      _let = ""
    } else {
      escopo[nome] = new Variável(classe, nome)
    }
    return Buffer.from(_let + nome + "=" + avalie(escopo, valor[0]) + ";")
  }),
  "#8": new Macro((escopo, [macro, expressão]) => {
    if (/^-?\d+$/.test(expressão)) return "Número"
    if (expressão.startsWith('"') && expressão.endsWith('"')) return "Texto"
    if (escopo.hasOwnProperty(expressão)) return escopo[expressão].classe
    return "Código"
  }),
  "#9": new Macro((escopo, [código, macro, valor_esperado]) => {
    valor_esperado = avalie(escopo, valor_esperado)
    return Buffer.from([
      "if (" + avalie(escopo, código) + "!==" + valor_esperado + ") ",
      "throw '",
        [
          "Ao executar:",
          "  " + código,
          "Esperava:",
          "  " + valor_esperado,
          "Recebeu:",
          "  ' + " + avalie(escopo, código),
        ].join("\\n"),
      ";",
    ].join(""))
  }),
  "#10": new Variável("Lógico", true),
  "#11": new Variável("Lógico", false),
  "#12": new Função("Lógico", ["Lógico"], (escopo, a) => Buffer.from("!" + a)),
  "#13": new Função("Lógico", ["Lógico", "Lógico"], (escopo, a, b) => Buffer.from(a + "&&" + b)),
  "#14": new Função("Lógico", ["Lógico", "Lógico"], (escopo, a, b) => Buffer.from(a + "||" + b)),
  "#15": new Função("Lógico", ["Número", "Número"], (escopo, a, b) => Buffer.from(a + "===" + b)),
  "#16": new Função("Lógico", ["Número", "Número"], (escopo, a, b) => Buffer.from(a + "!==" + b)),
  "#17": new Função("Lógico", ["Número", "Número"], (escopo, a, b) => Buffer.from(a + ">" + b)),
  "#18": new Função("Lógico", ["Número", "Número"], (escopo, a, b) => Buffer.from(a + "<" + b)),
  "#19": new Função("Lógico", ["Número", "Número"], (escopo, a, b) => Buffer.from(a + ">=" + b)),
  "#20": new Função("Lógico", ["Número", "Número"], (escopo, a, b) => Buffer.from(a + "<=" + b)),
  "#21": new Função("Número", ["Número", "Número"], (escopo, a, b) => Buffer.from(a + "+" + b)),
  "#22": new Função("Número", ["Número", "Número"], (escopo, a, b) => Buffer.from(a + "-" + b)),
  "#23": new Função("Número", ["Número", "Número"], (escopo, a, b) => Buffer.from(a + "*" + b)),
  "#24": new Função("Número", ["Número", "Número"], (escopo, a, b) => Buffer.from(a + "/" + b)),
  "#25": new Macro((escopo, [macro, condição, código_se, senão, código_senão]) => Buffer.from("if(" + avalie(escopo, condição) + "){" + avalie(escopo, código_se) + "}else{" + avalie(escopo, código_senão) + "};")),
  "#26": new Macro((escopo, [macro, condição, código]) => Buffer.from("while(" + avalie(escopo, condição) + "){" + avalie(escopo, código) + "};")),
  "#27": new Função("Nulo", ["Número"], (escopo, a) => Buffer.from(a + "++;")),
  "#28": new Função("Nulo", ["Número"], (escopo, a) => Buffer.from(a + "--;")),
  "#29": new Macro((escopo_da_declaração, [macro, classe_de_retorno, nome, argumentos, código]) => {
    const novo_escopo = {...escopo_da_declaração}
    argumentos = argumentos.slice(1, -1).split(", ").filter(a => a.length > 0).map(a => a.split(" "))
    argumentos.forEach(([classe, nome]) => novo_escopo[nome] = new Variável(classe, nome))
    escopo_da_declaração[nome] = new Função(classe_de_retorno, argumentos.map(a => a[0]), (escopo_da_chamada, ...argumentos_da_chamada) => {
      return Buffer.from(nome + "(" + argumentos_da_chamada.map(a => avalie(escopo_da_chamada, a)).join(",") + ")" + (classe_de_retorno === "Nulo" ? ";" : ""))
    })
    return Buffer.from("const " + nome + "=(" + argumentos.map(a => a[1]).join(",") + ")=>{" + avalie(novo_escopo, código) + "};")
  }),
  "#30": new Macro((escopo, [nome, macro, valor]) => Buffer.from(nome + "+=" + avalie(escopo, valor) + ";")),
  "#31": new Macro((escopo, [nome, macro, valor]) => Buffer.from(nome + "-=" + avalie(escopo, valor) + ";")),
  "#32": new Macro((escopo, chamada) => Buffer.from("")),
  "#33": new Macro((escopo, [macro, valor]) => Buffer.from("return " + avalie(escopo, valor) + ";")),
  "#34": new Macro((escopo, [macro, nome, classe]) => {
    nome = nome.slice(0, -2)
    escopo[nome] = new Variável("Lista", nome)
    return Buffer.from("let " + nome + "=[];")
  }),
  "#35": new Função("Número", ["Lista"], (escopo, lista) => Buffer.from(lista + ".length")),
  "#36": new Macro((escopo, [lista, macro, valor]) => Buffer.from(avalie(escopo, lista) + ".push(" + avalie(escopo, valor) + ");")),
  "#37": new Função("Nulo", ["Lista", "Número"], (escopo, lista, i) => Buffer.from(lista + ".splice(" + i + ",1);")),
  "#38": new Macro((escopo, [macro, valor]) => Buffer.from(valor.slice(1, -1))),
  "#39": new Macro((escopo, chamada) => Buffer.from("console.log(" + chamada.slice(1).join("+") + ");")),
  "#40": new Macro((escopo, [macro, nome, código]) => {
    const atributos = []
    const nomes_métodos = []
    const métodos = []
    avalie({
      atributo: new Macro((escopo, [macro, classe, nome]) => {
        atributos.push(nome)
        return Buffer.from("")
      }),
      método: new Macro((escopo_da_declaração, [macro, classe_de_retorno, nome, argumentos, código]) => {
        nomes_métodos.push(nome)
        const novo_escopo = {
          ...escopo_da_declaração.escopo_da_declaração_da_classe,
          atributos,
        }
        argumentos = argumentos.slice(1, -1).split(", ").filter(a => a.length > 0).map(a => a.split(" "))
        argumentos.forEach(([classe, nome]) => novo_escopo[nome] = new Variável(classe, nome))
        métodos.push(Buffer.from("(_," + argumentos.map(a => a[1]).join(",") + ")=>{" + avalie(novo_escopo, código) + "}"))
        return Buffer.from("")
      }),
      escopo_da_declaração_da_classe: escopo,
      estende: new Macro((escopo, [macro, classe]) => {
        atributos.push(...escopo.escopo_da_declaração_da_classe[classe].atributos)
        return Buffer.from("")
      }),
    }, código)
    escopo[nome] = new Classe(atributos, nomes_métodos, métodos)
    return Buffer.from("let " + nome + "=[" + métodos.join(",") + "];")
  })
}

const importe = caminho => GLOBAIS["#0"].chame({}, ["#0", '"' + caminho + '"'])
const analise = expressão => GLOBAIS["#2"].chame({}, ["#2", expressão])
const avalie = (escopo, expressão) => GLOBAIS["#3"].chame(escopo, ["#3", expressão])
const classe_de = (escopo, código) => GLOBAIS["#8"].chame(escopo, ["#8", código])

process.stdout.write(importe(process.argv[2]))
import { ordenar } from "./lista.js"

const item = ({ entrada, posição }) => ({
  valor: entrada[posição],
  posição: posição + 1,
})

const entrada_tokenizada = entrada => Array.isArray(entrada)
  && (entrada.length === 0 || typeof entrada[0] === "object")

const tipo_do_item = item => item?.tipo
  ?? Object.keys(item ?? {}).find(chave => chave !== "início" && chave !== "fim")

const valor_do_item = (entrada, posição) => entrada_tokenizada(entrada)
  ? entrada[posição]?.valor ?? entrada[posição]?.[tipo_do_item(entrada[posição])]
  : entrada[posição]

const posição = ({ posição }) => ({
  valor: posição,
  posição,
})

const sucesso = valor => ({ posição }) => ({
  valor,
  posição,
})

const falha = erro => ({ posição }) => ({
  erro,
  posição,
})

const então = (analisador, continuação) => ({ entrada, posição }) => {
  const resultado_1 = analisador({ entrada, posição })
  if (resultado_1.erro) return resultado_1
  return continuação(resultado_1.valor)({ entrada, posição: resultado_1.posição })
}

const senão = (analisador, continuação) => ({ entrada, posição }) => {
  const resultado_1 = analisador({ entrada, posição })
  if (! resultado_1.erro) return resultado_1
  return continuação(resultado_1.erro)({ entrada, posição: resultado_1.posição })
}

export const alternativa = (...analisadores) => então(
  posição,
  início => senão(
    analisadores[0],
    erro_1 => então(
      posição,
      fim => {
        if (analisadores.length === 1 || fim > início) return falha(erro_1)
        return senão(
          alternativa(
            ...analisadores.slice(1)
          ),
          erro_2 => falha(
            ordenar([...new Set(`${erro_1} | ${erro_2}`.split(" | "))]).join(" | ")
          )
        )
      }
    )
  )
)

export const sequência = (...analisadores) => ({ entrada, posição }) => {
  const tokenizada = entrada_tokenizada(entrada)
  let valor = tokenizada ? [] : ""
  let posição_atual = posição

  for (const analisador of analisadores) {
    const resultado = analisador({ entrada, posição: posição_atual })
    if (resultado.erro) return resultado
    valor = tokenizada ? [...valor, resultado.valor] : valor + resultado.valor
    posição_atual = resultado.posição
  }

  return { valor, posição: posição_atual }
}

export const símbolo = texto => ({ entrada, posição }) => {
  const tokenizada = entrada_tokenizada(entrada)
  const encontrado = tokenizada
    ? valor_do_item(entrada, posição)
    : entrada.slice(posição, posição + texto.length)
  if (encontrado === texto) return {
    valor: tokenizada ? entrada[posição] : texto,
    posição: posição + (tokenizada ? 1 : texto.length),
  }
  return { erro: `"${texto.replace(/"/g, '\\"')}"`, posição }
}

export const faixa = (de, até) => ({ entrada, posição }) => {
  const valor = valor_do_item(entrada, posição)
  if (typeof valor === "string" && valor.length === 1 && valor >= de && valor <= até) return {
    valor: entrada_tokenizada(entrada) ? entrada[posição] : valor,
    posição: posição + 1,
  }
  return { erro: `/[${de}-${até}]/`, posição }
}

export const lista = (analisador) => ({ entrada, posição }) => {
  const resultado_1 = analisador({ entrada, posição })
  if (resultado_1.posição <= posição) return {
    valor: [],
    posição,
  }
  const prosseguir = posição => {
    const resultado_2 = lista(analisador)({ entrada, posição })
    if (resultado_2.posição <= posição) return { valor: [resultado_1.valor], posição: resultado_1.posição }
    return {
      valor: [resultado_1.valor, ...resultado_2.valor],
      posição: resultado_2.posição,
    }
  }
  return prosseguir(resultado_1.posição)
}

export const opcional = (analisador, valor_padrão) => ({ entrada, posição }) => {
  const resultado = analisador({ entrada, posição })
  if (! resultado.erro) return resultado
  if (resultado.posição > posição) return resultado
  return {
    valor: valor_padrão,
    posição,
  }
}

export const tente = analisador => ({ entrada, posição }) => {
  const resultado = analisador({ entrada, posição })
  if (! resultado.erro) return resultado
  return {
    ...resultado,
    posição,
  }
}

export const inverso = analisador => ({ entrada, posição }) => {
  if (posição >= entrada.length) return { erro: "/./", posição }
  const resultado = analisador({ entrada, posição })
  if (resultado.erro) return {
    valor: entrada[posição],
    posição: posição + 1,
  }
  return { erro: `! "${valor_do_item(entrada, posição)}"`, posição }
}

export const encadeamento = (analisador, continuação) => ({ entrada, posição }) => {
  const resultado_1 = analisador({ entrada, posição })
  if (resultado_1.erro) return resultado_1
  return continuação(resultado_1.valor)({ entrada, posição: resultado_1.posição })
}

export const mapear = (analisador, transformação) => ({ entrada, posição }) => {
  const resultado = analisador({ entrada, posição })
  if (resultado.erro) return resultado
  return {
    ...resultado,
    valor: transformação(resultado.valor),
  }
}

export const localizar = (analisador, tipo) => ({ entrada, posição }) => {
  const resultado = analisador({ entrada, posição })
  if (resultado.erro) return resultado
  const tokenizada = entrada_tokenizada(entrada)
  const primeiro = tokenizada ? entrada[posição] : undefined
  const último = tokenizada ? entrada[resultado.posição - 1] : undefined
  return {
    valor: {
      valor: tokenizada && resultado.valor?.valor !== undefined
        ? resultado.valor.valor
        : resultado.valor,
      início: primeiro?.início ?? posição,
      fim: último?.fim ?? resultado.posição,
      tipo,
    },
    posição: resultado.posição,
  }
}

export const repetição = analisador => ({ entrada, posição }) => {
  const resultado_1 = analisador({ entrada, posição })
  if (resultado_1.erro) {
    if (resultado_1.posição > posição) return resultado_1
    return {
      valor: entrada_tokenizada(entrada) ? [] : "",
      posição,
    }
  }
  const resultado_2 = repetição(analisador)({ entrada, posição: resultado_1.posição })
  return {
    valor: entrada_tokenizada(entrada)
      ? [resultado_1.valor, ...(Array.isArray(resultado_2.valor) ? resultado_2.valor : [resultado_2.valor])]
      : resultado_1.valor + resultado_2.valor,
    posição: resultado_2.posição,
  }
}

export const direita = (esquerda, direita) => ({ entrada, posição }) => {
  const resultado_1 = esquerda({ entrada, posição })
  if (resultado_1.erro) return resultado_1
  const resultado_2 = direita({ entrada, posição: resultado_1.posição })
  return resultado_2
}

export const esquerda = (esquerda, direita) => ({ entrada, posição }) => {
  const resultado_1 = esquerda({ entrada, posição })
  if (resultado_1.erro) return resultado_1
  const resultado_2 = direita({ entrada, posição: resultado_1.posição })
  if (resultado_2.erro) return resultado_2
  return {
    valor: resultado_1.valor,
    posição: resultado_2.posição,
  }
}

export const prever = (condição, analisador_se, analisador_senão) => ({ entrada, posição }) =>
  (condição({ entrada, posição }) ? analisador_se : analisador_senão)({ entrada, posição })

export const tipo = tipo => ({ entrada, posição }) => {
  const item = entrada[posição]
  const valor = item?.[tipo] ?? item?.valor
  if (tipo_do_item(item) === tipo) return {
    valor: { [tipo]: valor },
    posição: posição + 1,
  }
  return { erro: tipo, posição }
}

export const fim = ({ entrada, posição }) => {
  if (posição !== entrada.length) return { erro: "fim da entrada", posição }
  return {
    valor: undefined,
    posição: entrada[posição - 1]?.fim ?? posição,
  }
}
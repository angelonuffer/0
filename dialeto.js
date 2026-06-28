import { ordenar } from "./lista.js"

const item = ({ entrada, posição }) => ({
  valor: entrada[posição],
  posição: posição + 1,
})

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
  return continuação(resultado_1.erro)({ entrada, posição })
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

export const sequência = (...analisadores) => então(
  analisadores[0],
  valor_1 => {
    if (analisadores.length === 1) return sucesso(valor_1)
    return então(
      sequência(
        ...analisadores.slice(1)
      ),
      valor_2 => sucesso(
        valor_1 + valor_2
      )
    )
  }
)

export const símbolo = texto => ({ entrada, posição }) => entrada.startsWith(texto, posição) ? {
  valor: texto,
  posição: posição + texto.length,
} : { erro: `"${texto.replace(/"/g, '\\"')}"`, posição }

export const faixa = (de, até) => ({ entrada, posição }) => entrada[posição] >= de && entrada[posição] <= até ? {
  valor: entrada[posição],
  posição: posição + 1,
} : { erro: `/[${de}-${até}]/`, posição }

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
  if (resultado.posição > posição) return resultado
  return {
    valor: valor_padrão,
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
  return { erro: `! "${entrada[posição]}"`, posição }
}

export const encadeamento = (analisador, continuação) => ({ entrada, posição }) => {
  const resultado_1 = analisador({ entrada, posição })
  if (resultado_1.erro) return resultado_1
  return continuação(resultado_1.valor)({ entrada, posição: resultado_1.posição })
}

export const localizar = (analisador, tipo) => ({ entrada, posição }) => {
  const resultado = analisador({ entrada, posição })
  if (resultado.erro) return resultado
  return {
    valor: {
      valor: resultado.valor,
      início: posição,
      fim: resultado.posição,
      tipo,
    },
    posição: resultado.posição,
  }
}

export const repetição = analisador => ({ entrada, posição }) => {
  const resultado_1 = analisador({ entrada, posição })
  if (resultado_1.erro) return {
    valor: "",
    posição,
  }
  const resultado_2 = repetição(analisador)({ entrada, posição: resultado_1.posição })
  return {
    valor: resultado_1.valor + resultado_2.valor,
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

export const tipo = tipo => ({ entrada, posição }) => {
  if (entrada[posição]?.tipo === tipo) return {
    valor: entrada[posição],
    posição: posição + 1,
  }
  return { erro: tipo, posição }
}
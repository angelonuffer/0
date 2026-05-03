import { ordenar } from "./lista.js"

export const vazio = ({ posição }) => ({ posição })

export const símbolo = texto => ({ entrada, posição }) => entrada.startsWith(texto, posição) ? {
  valor: texto,
  posição: posição + texto.length,
} : { erro: `"${texto.replace(/"/g, '\\"')}"`, posição }

export const faixa = (de, até) => ({ entrada, posição }) => entrada[posição] >= de && entrada[posição] <= até ? {
  valor: entrada[posição],
  posição: posição + 1,
} : { erro: `/[${de}-${até}]/`, posição }

export const alternativa = (...analisadores) => ({ entrada, posição }) => {
  const resultado_1 = analisadores[0]({ entrada, posição })
  if (! resultado_1.erro || resultado_1.posição > posição || analisadores.length === 1) return resultado_1
  const resultado_2 = alternativa(...analisadores.slice(1))({ entrada, posição })
  if (! resultado_2.erro || resultado_2.posição > posição) return resultado_2
  const mensagens = ordenar([...new Set(`${resultado_1.erro} | ${resultado_2.erro}`.split(" | "))]).join(" | ")
  return { erro: mensagens, posição }
}

export const sequência = (...analisadores) => ({ entrada, posição }) => {
  const resultado_1 = analisadores[0]({ entrada, posição })
  if (resultado_1.erro) return resultado_1
  if (analisadores.length === 1) return {
    valor: [resultado_1.valor],
    posição: resultado_1.posição,
  }
  const resultado_2 = sequência(...analisadores.slice(1))({entrada, posição: resultado_1.posição})
  if (resultado_2.erro) return resultado_2
  return {
    valor: [resultado_1.valor, ...resultado_2.valor],
    posição: resultado_2.posição,
  }
}

export const sequência_literal = (...analisadores) => ({ entrada, posição }) => {
  const resultado_1 = analisadores[0]({entrada, posição})
  if (resultado_1.erro || analisadores.length === 1) return resultado_1
  const resultado_2 = sequência_literal(...analisadores.slice(1))({ entrada, posição: resultado_1.posição })
  if (resultado_2.erro) return resultado_2
  return {
    valor: resultado_1.valor + resultado_2.valor,
    posição: resultado_2.posição,
  }
}

export const zero_ou_mais = analisador => ({ entrada, posição }) => {
  const resultado = analisador({ entrada, posição })
  if (resultado.erro) return {
    valor: [],
    posição,
  }
  const resultado_2 = zero_ou_mais(analisador)({ entrada, posição: resultado.posição })
  if (resultado_2.erro) return resultado
  return {
    valor: [resultado.valor, ...resultado_2.valor],
    posição: resultado_2.posição,
  }
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

export const transformação = (analisador, transformador) => ({ entrada, posição }) => {
  const resultado = analisador({ entrada, posição })
  if (resultado.erro) return resultado
  return {
    valor: transformador(resultado.valor, posição, resultado.posição),
    posição: resultado.posição,
  }
}
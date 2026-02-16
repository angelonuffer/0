import { número } from "./número.js"

// Parser de soma no estilo continuations.
// Entrada: uma cadeia contendo dois números separados por '+' e opcionalmente espaços.
// Uso: soma({ resultado, estágio, caractere }) -> continuation
// - estágio: 0 = lendo primeiro número, 1 = esperando '+', 2 = lendo segundo número

export const soma = ({
  resultado,
  estágio,
  caractere,
}) => {
  // estado: lendo um número (usaremos o parser número como continuation)
  if (estágio === 0) {
    // iniciamos o parser de número para o primeiro operando
    return próximo_caractere => {
      const primeiro = número({ valor: "", caractere })
      const primeiroValor = primeiro(próximo_caractere)
      // após consumir o primeiro número, avançamos para esperar '+'
      // repassamos o caractere já consumido para que o estado seguinte o processe
      return soma({ resultado: primeiroValor, estágio: 1, caractere: próximo_caractere })
    }
  }

  // estado: esperando o sinal '+' (pode haver espaços)
  if (estágio === 1) {
    if (caractere === ' ' || caractere === '\t' || caractere === '\n') {
      return próximo_caractere => soma({ resultado, estágio: 1, caractere: próximo_caractere })
    }
    if (caractere === '+') {
      // começar a ler o segundo número
      return próximo_caractere => soma({ resultado, estágio: 2, caractere: próximo_caractere })
    }
    // caractere inesperado: retornamos NaN para sinalizar erro
    return () => NaN
  }

  // estado: lendo o segundo número
  if (estágio === 2) {
    // usamos o parser número para ler o segundo operando
    if (caractere >= '0' && caractere <= '9') {
      return próximo_caractere => {
        const segundo = número({ valor: "", caractere })
        const segundoValor = segundo(próximo_caractere)
        return resultado + segundoValor
      }
    }
    // pular espaços antes do número
    if (caractere === ' ' || caractere === '\t' || caractere === '\n') {
      return próximo_caractere => soma({ resultado, estágio: 2, caractere: próximo_caractere })
    }
    return () => NaN
  }

  return () => NaN
}

export const testar = () => {
  // construímos a cadeia: "3+4" simulando chamadas de caractere por caractere
  const seq = ['3', '+', '4', ' ']
  // inicializamos a máquina
  let f = soma({ resultado: 0, estágio: 0, caractere: seq[0] })
  for (let i = 1; i < seq.length; i++) {
    f = f(seq[i])
  }
  // ao final, f contém o resultado
  return f === 7
}

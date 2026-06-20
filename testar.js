import { testar } from "./uniteste.js"
import { interpretar } from "./0.js";
import { bloco } from "./texto.js"

const teste = ({
  entrada,
  saída_esperada = "",
  erro_esperado = "",
}) => ({
  argumento: { entrada, arquivo: "testar.js" },
  retorno_esperado: {
    saída: saída_esperada,
    erro: erro_esperado,
  }
})

const resultado = testar([
  {
    função: interpretar,
    testes: [
      teste({
        entrada: bloco(`
          . 1
        `),
        saída_esperada: bloco(`
          . 1
        `),
      }),
      teste({
        entrada: bloco(`
          .  1
        `),
        saída_esperada: bloco(`
          . 1
        `),
      }),
      teste({
        entrada: bloco(`
          . 1 // comentário
        `),
        saída_esperada: bloco(`
          . 1
        `),
      }),
      teste({
        entrada: bloco(`
          . +
        `),
        erro_esperado: bloco(`
          . ⛔ "_" | "!" | "(" | "[" | "\\"" | "#" | "\`" | /[0-9]/ | /[a-z]/ | /[A-Z]/
          . 📄 testar.js
          . 👉 1: +
          .       ^ 1
        `),
      }),
      teste({
        entrada: bloco(`
          . 42 + 5
        `),
        saída_esperada: bloco(`
          . 47
        `),
      }),
      teste({
        entrada: bloco(`
          . 8 - 4
        `),
        saída_esperada: bloco(`
          . 4
        `),
      }),
      teste({
        entrada: bloco(`
          . 3 * 4
        `),
        saída_esperada: bloco(`
          . 12
        `),
      }),
      teste({
        entrada: bloco(`
          . 8 / 2
        `),
        saída_esperada: bloco(`
          . 4
        `),
      }),
      teste({
        entrada: bloco(`
          . 2147483647 + 1
        `),
        saída_esperada: bloco(`
          . 2147483648
        `),
      }),
      teste({
        entrada: bloco(`
          . 4 - 2 - 1
        `),
        saída_esperada: bloco(`
          . 1
        `),
      }),
      teste({
        entrada: bloco(`
          . 2 + 3 * 4
        `),
        saída_esperada: bloco(`
          . 14
        `),
      }),
      teste({
        entrada: bloco(`
          . 10 - 6 / 2
        `),
        saída_esperada: bloco(`
          . 7
        `),
      }),
      teste({
        entrada: bloco(`
          . 8 / 2 + 3 * 2
        `),
        saída_esperada: bloco(`
          . 10
        `),
      }),
      teste({
        entrada: bloco(`
          . (2 + 3) * 4
        `),
        saída_esperada: bloco(`
          . 20
        `),
      }),
      teste({
        entrada: bloco(`
          . 10 - (6 / 2)
        `),
        saída_esperada: bloco(`
          . 7
        `),
      }),
      teste({
        entrada: bloco(`
          . 1 + 2 * 3 - 4 / 2
        `),
        saída_esperada: bloco(`
          . 5
        `),
      }),
      teste({
        entrada: bloco(`
          . 2 > 8
        `),
        saída_esperada: bloco(`
          . 0
        `),
      }),
      teste({
        entrada: bloco(`
          . 8 > 2
        `),
        saída_esperada: bloco(`
          . 1
        `),
      }),
      teste({
        entrada: bloco(`
          . 8 > 8
        `),
        saída_esperada: bloco(`
          . 0
        `),
      }),
      teste({
        entrada: bloco(`
          . 2 < 8
        `),
        saída_esperada: bloco(`
          . 1
        `),
      }),
      teste({
        entrada: bloco(`
          . 8 < 2
        `),
        saída_esperada: bloco(`
          . 0
        `),
      }),
      teste({
        entrada: bloco(`
          . 8 < 8
        `),
        saída_esperada: bloco(`
          . 0
        `),
      }),
      teste({
        entrada: bloco(`
          . 2 == 8
        `),
        saída_esperada: bloco(`
          . 0
        `),
      }),
      teste({
        entrada: bloco(`
          . 8 == 2
        `),
        saída_esperada: bloco(`
          . 0
        `),
      }),
      teste({
        entrada: bloco(`
          . 8 == 8
        `),
        saída_esperada: bloco(`
          . 1
        `),
      }),
      teste({
        entrada: bloco(`
          . 2 != 8
        `),
        saída_esperada: bloco(`
          . 1
        `),
      }),
      teste({
        entrada: bloco(`
          . 8 != 2
        `),
        saída_esperada: bloco(`
          . 1
        `),
      }),
      teste({
        entrada: bloco(`
          . 8 != 8
        `),
        saída_esperada: bloco(`
          . 0
        `),
      }),
      teste({
        entrada: bloco(`
          . 2 >= 8
        `),
        saída_esperada: bloco(`
          . 0
        `),
      }),
      teste({
        entrada: bloco(`
          . 8 >= 2
        `),
        saída_esperada: bloco(`
          . 1
        `),
      }),
      teste({
        entrada: bloco(`
          . 8 >= 8
        `),
        saída_esperada: bloco(`
          . 1
        `),
      }),
      teste({
        entrada: bloco(`
          . 2 <= 8
        `),
        saída_esperada: bloco(`
          . 1
        `),
      }),
      teste({
        entrada: bloco(`
          . 8 <= 2
        `),
        saída_esperada: bloco(`
          . 0
        `),
      }),
      teste({
        entrada: bloco(`
          . 8 <= 8
        `),
        saída_esperada: bloco(`
          . 1
        `),
      }),
      teste({
        entrada: bloco(`
          . 0 && 0
        `),
        saída_esperada: bloco(`
          . 0
        `),
      }),
      teste({
        entrada: bloco(`
          . 0 && 1
        `),
        saída_esperada: bloco(`
          . 0
        `),
      }),
      teste({
        entrada: bloco(`
          . 1 && 0
        `),
        saída_esperada: bloco(`
          . 0
        `),
      }),
      teste({
        entrada: bloco(`
          . 1 && 2
        `),
        saída_esperada: bloco(`
          . 2
        `),
      }),
      teste({
        entrada: bloco(`
          . 0 || 0
        `),
        saída_esperada: bloco(`
          . 0
        `),
      }),
      teste({
        entrada: bloco(`
          . 0 || 1
        `),
        saída_esperada: bloco(`
          . 1
        `),
      }),
      teste({
        entrada: bloco(`
          . 1 || 0
        `),
        saída_esperada: bloco(`
          . 1
        `),
      }),
      teste({
        entrada: bloco(`
          . 1 || 2
        `),
        saída_esperada: bloco(`
          . 1
        `),
      }),
      teste({
        entrada: bloco(`
          . ! 0
        `),
        saída_esperada: bloco(`
          . 1
        `),
      }),
      teste({
        entrada: bloco(`
          . ! 1
        `),
        saída_esperada: bloco(`
          . 0
        `),
      }),
      teste({
        entrada: bloco(`
          . ! ! 0
        `),
        saída_esperada: bloco(`
          . 0
        `),
      }),
      teste({
        entrada: bloco(`
          . 0 && (1 / 0)
        `),
        saída_esperada: bloco(`
          . 0
        `),
      }),
      teste({
        entrada: bloco(`
          . a = 11
          . 12 + a
        `),
        saída_esperada: bloco(`
          . 23
        `),
      }),
      teste({
        entrada: bloco(`
          . a = 5
          . b = 8
          . 2 + a + b
        `),
        saída_esperada: bloco(`
          . 15
        `),
      }),
      teste({
        entrada: bloco(`
          . a = 5
          . b = 8
          . 3 + c
        `),
        erro_esperado: bloco(`
          . ⛔ a | b
          . 📄 testar.js
          . 👉 3: 3 + c
          .           ^ 5
        `),
      }),
      teste({
        entrada: bloco(`
          . a = 5
          . b = 8
          . a + b
        `),
        saída_esperada: bloco(`
          . 13
        `),
      }),
      teste({
        entrada: bloco(`
          . a = 2
          . b = 3
          . a + b
        `),
        saída_esperada: bloco(`
          . 5
        `),
      }),
      teste({
        entrada: bloco(`
          . x = 4
          . y = 5
          . x * y
        `),
        saída_esperada: bloco(`
          . 20
        `),
      }),
      teste({
        entrada: bloco(`
          . valor = 10
          . valor + 5
        `),
        saída_esperada: bloco(`
          . 15
        `),
      }),
      teste({
        entrada: bloco(`
          . a = 2
          . b = 3
          . c = 4
          . a + b * c
        `),
        saída_esperada: bloco(`
          . 14
        `),
      }),
      teste({
        entrada: bloco(`
          . a = 5
          . b = a * 2
          . b + 3
        `),
        saída_esperada: bloco(`
          . 13
        `),
      }),
      teste({
        entrada: bloco(`
          . a = 2
          . b = (
          .   x = 3
          .   y = 4
          .   x + y
          . )
          . a * b
        `),
        saída_esperada: bloco(`
          . 14
        `),
      }),
      teste({
        entrada: bloco(`
          . x = 5
          . y = (
          .   a = 2
          .   b = 3
          .   a + b
          . )
          . x + y
        `),
        saída_esperada: bloco(`
          . 10
        `),
      }),
      teste({
        entrada: bloco(`
          . x = 2
          . y = 3
          . x + y
        `),
        saída_esperada: bloco(`
          . 5
        `),
      }),
      teste({
        entrada: bloco(`
          . a = 4
          . a + 5
        `),
        saída_esperada: bloco(`
          . 9
        `),
      }),
      teste({
        entrada: bloco(`
          . x = 7
          . x * 2
        `),
        saída_esperada: bloco(`
          . 14
        `),
      }),
      teste({
        entrada: bloco(`
          . str = "abcdef"
          . str
        `),
        saída_esperada: bloco(`
          . abcdef
        `),
      }),
      teste({
        entrada: bloco(`
          . a = "abcd"
          . #a
        `),
        saída_esperada: bloco(`
          . 4
        `),
      }),
      teste({
        entrada: bloco(`
          . nome = "Alice"
          . sobrenome = "Silva"
          . \`\${nome} \${sobrenome}\`
        `),
        saída_esperada: bloco(`
          . Alice Silva
        `),
      }),
      teste({
        entrada: bloco(`
          . str = "abcdef"
          . str 5
        `),
        saída_esperada: bloco(`
          . f
        `),
      }),
      teste({
        entrada: bloco(`
          . lista = [ 2 ; 3 ]
          . lista 0
        `),
        saída_esperada: bloco(`
          . 2
        `),
      }),
      teste({
        entrada: bloco(`
          . lista = [
          .   4 ;
          .   5 ;
          .   6 ;
          .   7 ;
          . ]
          . \`\${lista 0} \${lista 1} \${lista 2} \${lista 3}\`
        `),
        saída_esperada: bloco(`
          . 4 5 6 7
        `),
      }),
      teste({
        entrada: bloco(`
          . lista = [ 2 ; 3 ]
          . lista 1
        `),
        saída_esperada: bloco(`
          . 3
        `),
      }),
      teste({
        entrada: bloco(`
          . lista = [ 2 ; 3 ]
          . #lista
        `),
        saída_esperada: bloco(`
          . 2
        `),
      }),
      teste({
        entrada: bloco(`
          . lista = [[ 1 ; 2 ] ; [ 3 ; 4 ]]
          . lista 0 1
        `),
        saída_esperada: bloco(`
          . 2
        `),
      }),
      teste({
        entrada: bloco(`
          . lista = [ 1 ; 2 ; 3 ]
          . lista 2
        `),
        saída_esperada: bloco(`
          . 3
        `),
      }),
      teste({
        entrada: bloco(`
          . lista = [ 10 ; 20 ; 30 ]
          . lista 1 + 1
        `),
        saída_esperada: bloco(`
          . 21
        `),
      }),
      teste({
        entrada: bloco(`
          . lista_1 = [ 10 ; 20 ; 30 ]
          . lista_2 = [ lista_1 2 ; 40 ]
          . lista_2 0
        `),
        saída_esperada: bloco(`
          . 30
        `),
      }),
      teste({
        entrada: bloco(`
          . lista_1 = [ 10 ; 20 ; 30 ]
          . lista_2 = [ ...lista_1 ; 40 ]
          . #lista_2
        `),
        saída_esperada: bloco(`
          . 4
        `),
      }),
      teste({
        entrada: bloco(`
          . lista_1 = [ 10 ; 20 ; 30 ]
          . lista_2 = [ ...lista_1 ; 40 ]
          . \`\${lista_2 0} \${lista_2 1} \${lista_2 2} \${lista_2 3}\`
        `),
        saída_esperada: bloco(`
          . 10 20 30 40
        `),
      }),
      teste({
        entrada: bloco(`
          . lista_1 = [ 10 ; 20 ]
          . lista_2 = [ 30 ; 40 ]
          . lista_3 = [ ...lista_1 ; ...lista_2 ]
          . \`\${lista_3 0} \${lista_3 1} \${lista_3 2} \${lista_3 3}\`
        `),
        saída_esperada: bloco(`
          . 10 20 30 40
        `),
      }),
      teste({
        entrada: bloco(`
          . lista_1 = [ 10 ; 20 ]
          . lista_2 = [ ...lista_1 ; 30 ]
          . lista_3 = [ ...lista_2 ; 40 ]
          . \`\${lista_3 0} \${lista_3 1} \${lista_3 2} \${lista_3 3}\`
        `),
        saída_esperada: bloco(`
          . 10 20 30 40
        `),
      }),
      teste({
        entrada: bloco(`
          . lista_1 = [ 20 ; 30 ]
          . lista_2 = [ 50 ; 60 ]
          . lista_3 = [ 10 ; ...lista_1 ; 40 ; ...lista_2 ; 70 ]
          . \`\${lista_3 0} \${lista_3 1} \${lista_3 2} \${lista_3 3} \${lista_3 4} \${lista_3 5} \${lista_3 6}\`
        `),
        saída_esperada: bloco(`
          . 10 20 30 40 50 60 70
        `),
      }),
    ]
  }
])

process.stdout.write(resultado.saída + "\n")
process.exit(resultado.código)
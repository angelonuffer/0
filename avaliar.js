import número from './número.js'

({
  entrada,
}) => {
  for (let i = 0; i < entrada.length; i++) {
    número({
      caractere: entrada[i],
    })
  }
}
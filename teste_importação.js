import avaliar from "./avaliar.js"

suite("importação", () => {
  test("#0 é uma função que importa uma função a partir do caminho do arquivo", async () => {
    chai.expect(await avaliar(`
      retorna_5 = #0("./retorna_5.0")
      #1 = retorna_5()
    `)).to.be.eql(5)
  })
})
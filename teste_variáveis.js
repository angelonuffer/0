import avaliar from "./avaliar.js"

suite("variáveis", () => {
  test("= atribui valores a variáveis", async () => {
    chai.expect(await avaliar(`
      a = 5
      b = 8
      #1 = a + b
    `)).to.be.eql(13)
  })
})
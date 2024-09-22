import _0 from "./0.js"

suite("variáveis", () => {
  test("= atribui valores a variáveis", async () => {
    chai.expect(await _0(`
      a = 5
      b = 8
      #1 = a + b
    `)).to.be.eql(13)
  })
})
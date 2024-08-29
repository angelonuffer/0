import função from "./função.js"

suite("variáveis", () => {
  test("= atribui valores a variáveis", async () => {
    chai.expect(await função(`
      a = 5
      b = 8
      #1 = a + b
    `)).to.be.eql(13)
  })
})
import função from "./função.js"

suite("função", () => {
  test("interpreta o código e retorna o valor de #1", async () => {
    chai.expect(await função("#1 = 42")).to.be.eql(42)
    chai.expect(await função("#1 = 4")).to.be.eql(4)
  })
})
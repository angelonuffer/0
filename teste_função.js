import avaliar from "./avaliar.js"

suite("avaliar", () => {
  test("interpreta o código e retorna o valor de #1", async () => {
    chai.expect(await avaliar("#1 = 42")).to.be.eql(42)
    chai.expect(await avaliar("#1 = 4")).to.be.eql(4)
  })
})
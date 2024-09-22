import _0 from "./0.js"

suite("0", () => {
  test("interpreta o código e retorna o valor de #1", async () => {
    chai.expect(await _0("#1 = 42")).to.be.eql(42)
    chai.expect(await _0("#1 = 4")).to.be.eql(4)
  })
})
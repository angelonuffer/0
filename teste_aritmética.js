import _0 from "./0.js"

suite("aritmética", () => {
  test("+ soma dois números", async () => {
    chai.expect(await _0("#1 = 42 + 5")).to.be.eql(47)
    chai.expect(await _0("#1 = 4 + 8")).to.be.eql(12)
  })
  test("- subtrai dois números", async () => {
    chai.expect(await _0("#1 = 42 - 5")).to.be.eql(37)
    chai.expect(await _0("#1 = 4 - 8")).to.be.eql(-4)
  })
})
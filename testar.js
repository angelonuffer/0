(async () => {
  const número = await import("./número.js")
  const resultado = número.testar()
  if (! resultado) {
    console.log(número.testar.toString())
    process.exit(1)
  }
})()
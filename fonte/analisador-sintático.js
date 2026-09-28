import { fim, esquerda, tipo } from "./dialeto.js"

export const analisador_sintático = esquerda(
  tipo("número"),
  fim
)
import avaliar from "./fontes/avaliar.js";

export async function interpretar({ entrada, arquivo = "", escopo = {} }) {
  return await avaliar({ entrada, arquivo, escopo });
}

export default { interpretar };

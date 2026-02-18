import fs from 'fs';
import { _0 } from '../código/analisador_sintático/index.js';
import { avaliar, INTERNAL_CONTEXT } from '../código/analisador_semântico/index.js';

/**
 * Função auxiliar de comparação profunda para ser usada nos testes da documentação.
 */
const deepEqual = (a, b) => {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a === 'object' && a !== null && b !== null) {
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i])) return false;
      }
      return true;
    } else {
      const keysA = Object.keys(a).filter(k => k !== '__parent__');
      const keysB = Object.keys(b).filter(k => k !== '__parent__');
      if (keysA.length !== keysB.length) return false;
      for (const key of keysA) {
        if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
      }
      return true;
    }
  }
  return false;
};

const iguais = (escopo, args) => {
  if (Array.isArray(args) && args.length === 2) {
    return deepEqual(args[0], args[1]) ? 1 :
      "Esperava que:\n"
    + `  ${JSON.stringify(args[0])}\n`
    + "Fosse igual a:\n"
    + `  ${JSON.stringify(args[1])}\n`
  }
  return 0;
};

async function executar() {
  if (!fs.existsSync('EXEMPLOS.md')) {
    console.error('Arquivo EXEMPLOS.md não encontrado.');
    process.exit(1);
  }

  const conteudo = fs.readFileSync('EXEMPLOS.md', 'utf-8');
  // Captura blocos de código marcados com ```0
  // Usa ^ para garantir que o bloco comece no início da linha
  const regex = /^```0\n([\s\S]*?)^```/gm;
  let match;
  let falhou = false;
  let total = 0;
  let passaram = 0;

  console.log('Executando testes da documentação (EXEMPLOS.md)...\n');

  while ((match = regex.exec(conteudo)) !== null) {
    total++;
    const codigo = match[1].trim();
    if (!codigo) continue;

    try {
      const parsed = _0(codigo);

      // Se parsed.sucesso for true mas tiver resto, pode ser erro de sintaxe parcial
      if (!parsed.sucesso || (parsed.resto && parsed.resto.trim() !== '')) {
        console.error(`✗ Bloco ${total} falhou: Erro de sintaxe`);
        console.error(codigo);
        if (parsed.erro) {
           console.error(`  Esperado: ${parsed.erro.esperado.join(', ')}`);
        }
        falhou = true;
        continue;
      }

      const ast = parsed.valor;
      const escopo = {
        iguais,
        __parent__: null,
        __módulo__: 'EXEMPLOS.md',
        [INTERNAL_CONTEXT]: {
          valores_módulos: {},
          resolve_endereço: (base, rel) => rel,
          avaliar_módulo_lazy: async () => { throw new Error('Importações não suportadas em EXEMPLOS.md'); },
          carregar_conteúdo: async () => { throw new Error('Carregamento de conteúdo não suportado em EXEMPLOS.md'); }
        }
      };

      // Primeira passagem: declarar nomes
      if (ast.declarações) {
        for (const decl of ast.declarações) {
          escopo[decl.nome] = undefined;
        }
        // Segunda passagem: avaliar valores das declarações
        for (const decl of ast.declarações) {
          escopo[decl.nome] = await avaliar(decl.valor, escopo);
        }
      }

      // Avaliar a expressão principal do bloco
      const resultado = ast.expressão ? await avaliar(ast.expressão, escopo) : 1;

      if (typeof resultado === 'string') {
        console.log(`✗ Bloco ${total} falhou.`);
        console.error(codigo);
        console.log(resultado);
        falhou = true;
      } else if (typeof resultado === 'number') {
        if (resultado !== 0) {
          console.log(`✓ Bloco ${total}`);
          passaram++;
        } else {
          console.error(`✗ Bloco ${total} falhou: Retornou 0 (falso)`);
          console.error(codigo);
          falhou = true;
        }
      } else {
        // Para outros tipos, como listas ou objetos, se retornados como resultado final,
        // consideramos sucesso se não forem nulos (mas a regra diz número != 0).
        // A regra é estrita: deve retornar número != 0.
        console.error(`✗ Bloco ${total} falhou: Retornou tipo inesperado: ${typeof resultado}`);
        console.error(codigo);
        falhou = true;
      }
    } catch (erro) {
      console.error(`✗ Bloco ${total} falhou com erro semântico: ${erro.message}`);
      console.error(codigo);
      falhou = true;
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Total: ${total} blocos testados`);
  console.log(`✓ Passaram: ${passaram}`);
  console.log(`✗ Falharam: ${total - passaram}`);
  console.log(`${'='.repeat(50)}\n`);

  if (falhou) {
    process.exit(1);
  }
}

executar().catch(err => {
  console.error('Erro fatal ao executar testes da documentação:');
  console.error(err);
  process.exit(1);
});

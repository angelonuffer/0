#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, basename, relative } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Função para remover códigos ANSI
function removerCodigosANSI(texto) {
  // eslint-disable-next-line no-control-regex
  return texto.replace(/\x1b\[[0-9;]*m/g, '');
}

// Função para normalizar saídas (remove detalhes específicos de stack traces)
function normalizarSaida(saida, caminhoBase) {
  // Remove códigos ANSI de cores
  saida = removerCodigosANSI(saida);
  
  // Remove stack traces completos, mas mantém a primeira linha do erro
  const linhas = saida.split('\n');
  const resultado = [];
  
  for (let i = 0; i < linhas.length; i++) {
    let linha = linhas[i];
    
    // Normaliza caminhos absolutos para relativos
    if (caminhoBase) {
      linha = linha.replace(caminhoBase + '/', '');
      linha = linha.replace(caminhoBase, '');
    }
    
    // Para erros ENOENT, mantém apenas a primeira linha
    if (linha.includes('Error: ENOENT:')) {
      resultado.push(linha);
      break;
    }
    
    // Para outros erros, mantém até encontrar stack traces detalhados do Node.js
    if (linha.trim().startsWith('at ') && !linha.includes('__')) {
      break;
    }
    
    resultado.push(linha);
  }
  
  return resultado.join('\n').trim();
}

// Função para comparar saídas
function compararSaidas(obtida, esperada, caminhoBase) {
  const obtidaNorm = normalizarSaida(obtida, caminhoBase);
  const esperadaNorm = normalizarSaida(esperada, null);
  
  return obtidaNorm === esperadaNorm;
}

// Função principal de teste
function executarTestes() {
  const dirTestes = join(__dirname, 'erros');

  // Coleta recursivamente arquivos que terminam com .0 dentro de dirTestes
  function coletarArquivosRecursivo(dir) {
    const resultados = [];
    const entradas = readdirSync(dir, { withFileTypes: true });
    for (const ent of entradas) {
      const caminho = join(dir, ent.name);
      if (ent.isDirectory()) {
        resultados.push(...coletarArquivosRecursivo(caminho));
      } else if (ent.isFile() && ent.name.endsWith('.0')) {
        resultados.push(caminho);
      }
    }
    return resultados;
  }

  const arquivosTeste = coletarArquivosRecursivo(dirTestes).sort();
  
  let passaram = 0;
  let falharam = 0;
  const resultados = [];
  const caminhoBase = join(dirTestes, '../..');
  
  console.log('Executando testes de erros...\n');
  
  for (const arquivo of arquivosTeste) {
    const nomeBase = basename(arquivo, '.0');
    const caminhoTeste = arquivo;
    const caminhoEsperado = join(dirname(arquivo), `${nomeBase}.esperado.txt`);
    const caminhoRelativo = relative(dirTestes, caminhoTeste);
    
    try {
      // Verifica se existe arquivo esperado
      let saidaEsperada;
      try {
        saidaEsperada = readFileSync(caminhoEsperado, 'utf-8').trim();
      } catch (e) {
        console.log(`⚠️  ${caminhoRelativo}: Arquivo esperado não encontrado`);
        continue;
      }
      
      // Executa o teste
      let saidaObtida;
      try {
        execSync(`node código/0_node.js ${caminhoTeste} node`, {
          cwd: caminhoBase,
          encoding: 'utf-8',
          stdio: 'pipe'
        });
        // Se não lançou erro, algo está errado
        saidaObtida = '';
      } catch (error) {
        // Erro esperado
        saidaObtida = (error.stdout + error.stderr).trim();
      }
      
      // Compara saídas
      if (compararSaidas(saidaObtida, saidaEsperada, caminhoBase)) {
        console.log(`✓ ${caminhoRelativo}`);
        passaram++;
      } else {
        console.log(`✗ ${caminhoRelativo}`);
        console.log(`  Esperado:`);
        console.log(`    ${normalizarSaida(saidaEsperada, null).split('\n').join('\n    ')}`);
        console.log(`  Obtido:`);
        console.log(`    ${normalizarSaida(saidaObtida, caminhoBase).split('\n').join('\n    ')}`);
        falharam++;
      }
    } catch (error) {
      console.log(`✗ ${caminhoRelativo}: Erro ao executar teste`);
      console.log(`  ${error.message}`);
      falharam++;
    }
  }
  
  // Resumo
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Total: ${passaram + falharam} testes`);
  console.log(`✓ Passaram: ${passaram}`);
  console.log(`✗ Falharam: ${falharam}`);
  console.log(`${'='.repeat(50)}`);
  
  // Se todos os testes de erro passaram, executa os testes principais
  if (falharam === 0) {
    console.log('\nTodos os testes de erros passaram. Executando os testes principais...');
    try {
      execSync('node código/0_node.js testes/0 | node', {
        cwd: caminhoBase,
        stdio: 'inherit',
        shell: true
      });
      process.exit(0);
    } catch (e) {
      // Se os testes principais falharem, propaga o código de saída
      process.exit(typeof e.status === 'number' ? e.status : 1);
    }
  }

  // Código de saída quando houver falhas nos testes de erro
  process.exit(1);
}

// Executar testes
executarTestes();

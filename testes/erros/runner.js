#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

// Função para coletar arquivos de teste de um diretório
function coletarArquivosTeste(diretorio) {
  const arquivos = [];
  const itens = readdirSync(diretorio, { withFileTypes: true });
  
  for (const item of itens) {
    if (item.isDirectory()) {
      // Recursivamente busca em subdiretórios
      const subDiretorio = join(diretorio, item.name);
      const subArquivos = coletarArquivosTeste(subDiretorio);
      arquivos.push(...subArquivos);
    } else if (item.name.endsWith('.0')) {
      arquivos.push(join(diretorio, item.name));
    }
  }
  
  return arquivos;
}

// Função principal de teste
function executarTestes() {
  const arquivosTeste = coletarArquivosTeste(__dirname).sort();
  
  let passaram = 0;
  let falharam = 0;
  const resultados = [];
  const caminhoBase = join(__dirname, '../..');
  
  console.log('Executando testes de erros...\n');
  
  for (const caminhoTeste of arquivosTeste) {
    const arquivo = caminhoTeste.replace(__dirname + '/', '');
    const nomeBase = caminhoTeste.replace('.0', '');
    const caminhoEsperado = `${nomeBase}.esperado.txt`;
    
    try {
      // Verifica se existe arquivo esperado
      let saidaEsperada;
      try {
        saidaEsperada = readFileSync(caminhoEsperado, 'utf-8').trim();
      } catch (e) {
        console.log(`⚠️  ${arquivo}: Arquivo esperado não encontrado`);
        continue;
      }
      
      // Executa o teste
      let saidaObtida;
      try {
        execSync(`node código/0_node.js ${caminhoTeste} node`, {
          cwd: join(__dirname, '../..'),
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
        console.log(`✓ ${arquivo}`);
        passaram++;
      } else {
        console.log(`✗ ${arquivo}`);
        console.log(`  Esperado:`);
        console.log(`    ${normalizarSaida(saidaEsperada, null).split('\n').join('\n    ')}`);
        console.log(`  Obtido:`);
        console.log(`    ${normalizarSaida(saidaObtida, caminhoBase).split('\n').join('\n    ')}`);
        falharam++;
      }
    } catch (error) {
      console.log(`✗ ${arquivo}: Erro ao executar teste`);
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
  
  // Código de saída
  process.exit(falharam > 0 ? 1 : 0);
}

// Executar testes
executarTestes();

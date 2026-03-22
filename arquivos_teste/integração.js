import { execSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const repo = process.argv[2];
const caminhoRelativo = process.argv[3];

if (!repo || !caminhoRelativo) {
  console.log('Uso: node testes/integração.js <repositório> <caminho>');
  console.log('Exemplo: node testes/integração.js angelonuffer/antlr.0 tests/0');
  process.exit(1);
}

// Criar diretório temporário de forma segura
const tempDirPrefix = path.join(os.tmpdir(), '0-integ-');
const tempDir = fs.mkdtempSync(tempDirPrefix);

try {
  // 1. Clonar o repositório
  const repoUrl = repo.includes('/') && !repo.startsWith('http')
    ? `https://github.com/${repo}.git`
    : repo;

  console.log(`Clonando ${repoUrl} em ${tempDir}...`);
  // Usar aspas para os argumentos do shell para lidar com caminhos com espaços
  execSync(`git clone "${repoUrl}" "${tempDir}"`, { stdio: 'inherit' });

  // 2. Rodar os testes
  const caminhoAbsolutoTeste = path.join(tempDir, caminhoRelativo);

  // Como os testes do "0" geralmente geram código JS para ser executado via pipe.
  // O comando npx . executa o interpretador do repositório atual.
  const comando = `npx . "${caminhoAbsolutoTeste}" | node`;
  console.log(`Executando: ${comando}`);

  execSync(comando, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true
  });

} catch (erro) {
  console.error('\nErro durante a execução do teste de integração:');
  console.error(erro.message);
  process.exit(1);
} finally {
  // Limpar diretório temporário
  if (fs.existsSync(tempDir)) {
    console.log(`Limpando ${tempDir}...`);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

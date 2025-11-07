import { _0 } from './código/analisador_sintático/index.js';
import fs from 'fs';

const files = [
  { file: 'testes/erros/sintaxe_chave.0', expected_col: 18 },
  { file: 'testes/erros/sintaxe_colchete.0', expected_col: 11 },
  { file: 'testes/erros/sintaxe_parêntese.0', expected_col: 16 },
  { file: 'testes/erros/sintaxe_string_não_fechada.0', expected_col: 19 }
];

files.forEach(({ file, expected_col }) => {
  const content = fs.readFileSync(file, 'utf-8');
  const result = _0(content);
  
  const menor_resto = result.menor_resto || result.resto;
  const menor_pos = content.length - menor_resto.length;
  
  // Find the newline in menor_resto (if any)
  const newline_in_menor = menor_resto.indexOf('\n');
  
  console.log('File:', file);
  console.log('  menor_resto:', JSON.stringify(menor_resto));
  console.log('  menor_resto starts at:', menor_pos);
  console.log('  newline position in menor_resto:', newline_in_menor);
  
  if (newline_in_menor !== -1) {
    const error_pos = menor_pos + newline_in_menor;
    const lines_before = content.substring(0, error_pos).split('\n');
    const calculated_col = lines_before[lines_before.length - 1].length + 1;
    console.log('  Error position (before newline):', error_pos);
    console.log('  Calculated column:', calculated_col);
    console.log('  Expected column:', expected_col);
    console.log('  Match:', calculated_col === expected_col ? 'YES' : 'NO');
  }
  console.log('');
});

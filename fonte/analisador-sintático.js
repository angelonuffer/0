import * as fs from 'fs';

const entrada = fs.readFileSync(0, 'utf-8').trim();

if (entrada) {
  const tokens = JSON.parse(entrada);

  if (tokens.length > 0 && tokens[0].texto !== undefined) {
    console.log(JSON.stringify({ texto: tokens[0].texto }, null, 2));
  } else {
    console.log(JSON.stringify({}, null, 2));
  }
}

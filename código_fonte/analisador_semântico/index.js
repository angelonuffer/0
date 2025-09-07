// Semantic analyzer - Evaluation and runtime logic
// Contains all evaluation functions separated from syntax analysis

export const criarEscopo = (parent = null) => ({ __parent__: parent });

export const buscarVariável = (escopo, nome) => {
  let atualEscopo = escopo;
  while (atualEscopo) {
    if (atualEscopo.hasOwnProperty(nome)) {
      return atualEscopo[nome];
    }
    atualEscopo = atualEscopo.__parent__;
  }
  return undefined;
};

export const definirVariável = (escopo, nome, valor) => {
  escopo[nome] = valor;
};

// Arithmetic operations
export const avaliarSoma = (v1, v2) => v1 + v2;

export const avaliarSubtração = (v1, v2) => v1 - v2;

export const avaliarMultiplicação = (v1, v2) => {
  // If one operand is a list and the other is a string, perform join
  if (Array.isArray(v1) && typeof v2 === "string") {
    // Special case: when joining with empty string, convert numbers to characters
    if (v2 === "") {
      return v1.map(item => typeof item === "number" ? String.fromCharCode(item) : item).join(v2);
    }
    return v1.join(v2);
  }
  if (typeof v1 === "string" && Array.isArray(v2)) {
    // Special case: when joining with empty string, convert numbers to characters
    if (v1 === "") {
      return v2.map(item => typeof item === "number" ? String.fromCharCode(item) : item).join(v1);
    }
    return v2.join(v1);
  }
  // Check for list objects (with length property and numeric indices)
  if (typeof v1 === "object" && v1 !== null && typeof v1.length === "number" && typeof v2 === "string") {
    const arr = [];
    for (let i = 0; i < v1.length; i++) {
      arr.push(v1[i]);
    }
    // Special case: when joining with empty string, convert numbers to characters
    if (v2 === "") {
      return arr.map(item => typeof item === "number" ? String.fromCharCode(item) : item).join(v2);
    }
    return arr.join(v2);
  }
  if (typeof v1 === "string" && typeof v2 === "object" && v2 !== null && typeof v2.length === "number") {
    const arr = [];
    for (let i = 0; i < v2.length; i++) {
      arr.push(v2[i]);
    }
    // Special case: when joining with empty string, convert numbers to characters
    if (v1 === "") {
      return arr.map(item => typeof item === "number" ? String.fromCharCode(item) : item).join(v1);
    }
    return arr.join(v1);
  }
  // Otherwise, perform numeric multiplication
  return v1 * v2;
};

export const avaliarDivisão = (v1, v2) => {
  // If both operands are strings, perform string split
  if (typeof v1 === "string" && typeof v2 === "string") {
    return v1.split(v2);
  }
  // Otherwise, perform numeric division
  return v1 / v2;
};

// Comparison operations
export const avaliarMaiorQue = (v1, v2) => v1 > v2 ? 1 : 0;

export const avaliarMenorQue = (v1, v2) => v1 < v2 ? 1 : 0;

export const avaliarMaiorOuIgual = (v1, v2) => v1 >= v2 ? 1 : 0;

export const avaliarMenorOuIgual = (v1, v2) => v1 <= v2 ? 1 : 0;

export const avaliarIgual = (v1, v2) => v1 === v2 ? 1 : 0;

export const avaliarDiferente = (v1, v2) => v1 !== v2 ? 1 : 0;

// Logical operations
export const avaliarE = (v1, v2) => v1 !== 0 ? v2 : 0;

export const avaliarOu = (v1, v2) => v1 !== 0 ? v1 : v2;

// Variable operations
export const avaliarVariável = (nomeVariável) => (escopo) => {
  return buscarVariável(escopo, nomeVariável);
};

// Negation operation  
export const avaliarNegação = (valorFn) => (escopo) => {
  return valorFn(escopo) === 0 ? 1 : 0;
};

// Conditional operation (ternary operator)
export const avaliarCondicional = (condiçãoFn, valorVerdadeiroFn, valorFalsoFn) => (escopo) => {
  return condiçãoFn(escopo) !== 0 ? valorVerdadeiroFn(escopo) : valorFalsoFn(escopo);
};

// List operations
export const avaliarTamanho = () => (escopo, valor) => valor.length;

export const avaliarChaves = () => (escopo, objeto) => {
  const keys = Object.keys(objeto);
  
  // For real arrays, return all indices as strings
  if (Array.isArray(objeto)) {
    return keys;
  }
  
  // For list objects (objects with a length property), filter out numeric indices and length
  if (typeof objeto.length === 'number') {
    return keys.filter(key => key !== 'length' && !/^\d+$/.test(key));
  }
  
  // For regular objects, return all keys
  return keys;
};

// Slice and indexing operations
export const avaliarFatia = (iFn, opcionalFaixa) => (escopo, valor) => {
  const i = iFn(escopo);
  const faixa = opcionalFaixa ? opcionalFaixa[0] : undefined;
  const j_fn_opcional = opcionalFaixa ? opcionalFaixa[1] : undefined;
  const j = j_fn_opcional ? j_fn_opcional(escopo) : undefined;

  if (typeof valor === "string") {
    if (faixa !== undefined || j !== undefined) {
      return valor.slice(i, j);
    } else {
      return valor.charCodeAt(i);
    }
  } else if (Array.isArray(valor)) {
    if (faixa !== undefined || j !== undefined) {
      return valor.slice(i, j);
    } else {
      return valor[i];
    }
  } else if (typeof valor === 'object' && valor !== null) {
    if (typeof i !== 'string' && typeof i !== 'number') {
      throw new Error(`Runtime Error: Object key must be a string or number, got type ${typeof i} for key '${i}'.`);
    }
    if (faixa !== undefined || j !== undefined) {
      // Check if this is a list object (has length property and numeric indices)
      if (typeof valor.length === 'number') {
        // Convert list object to array for slicing
        const arr = [];
        for (let idx = 0; idx < valor.length; idx++) {
          arr[idx] = valor[idx];
        }
        return arr.slice(i, j);
      } else {
        throw new Error(`Runtime Error: Slicing syntax not supported for object property access using key '${i}'.`);
      }
    }
    return valor[i];
  } else {
    if (valor === null || valor === undefined) {
      throw new Error(`Runtime Error: Cannot apply indexing/slicing to '${valor}'.`);
    }
    throw new Error(`Runtime Error: Cannot apply indexing/slicing to type '${typeof valor}' (value: ${String(valor).slice(0, 20)}).`);
  }
};

// Property access operation
export const avaliarAtributo = (atributoNome) => (escopo, objeto) => objeto[atributoNome];

// Parentheses operation (simple wrapper)
export const avaliarParênteses = (valorFn) => (escopo) => {
  return valorFn(escopo);
};
import Fraction from 'src/model/Fraction.js';
import Matrix from 'src/model/Matrix.js';
import {
  convertProxyToMatrix
} from 'src/model/Utilities.js';

/** Array contenente l'elenco delle funzioni, con nome esteso e abbreviato.
 * Contiene anche informazioni sull'applicazione della funzione (su matrice o scalare)
 */
const functions = [{
    name: 'Determinante',
    funcName: 'det',
    targets: ['matrix']
  }, {
    name: 'Rango',
    funcName: 'rank',
    targets: ['matrix']
  }, {
    name: 'Trasposta',
    funcName: 'tr',
    targets: ['matrix']
  }, {
    name: 'Inversa',
    funcName: 'inv',
    targets: ['matrix']
  }
  /*, {
    name: 'Seno',
    funcName: 'sin',
    targets: ['scalar']
  }*/
];

/**
 * Permette di ricavare la matrice corrispondente al nome
 * 
 * @param {String} matrixName Il nome della matrice
 * @param {String} self Il riferimento all'elemento Vue (per accedere allo store)
 * @returns La matrice corrispondente a matrixName
 */
const getMatrixFromName = function (matrixName, self) {
  let temp = self.$store.getters.matrixes.filter((mat) => mat.name == matrixName);
  if (temp.length == 0) throw "Non esiste una matrice con il nome inserito";
  return new Matrix(temp[0].rows, temp[0].cols, convertProxyToMatrix(temp[0].matrix));
}

/**
 * Controlla se la stringa inserita coincide con una matrice salvata nello store
 * 
 * @param {String} matrixName Il nome della matrice
 * @param {String} self Il riferimento all'elemento Vue (per accedere allo store)
 * @returns true se la stringa inserita rappresenta una matrice nello store, false altrimenti
 */
const isMatrix = function (matrixName, self) {
  return (
    self.$store.getters.matrixes.filter(mat => mat.name == matrixName)
    .length > 0
  );
}

/**
 * Controlla se il token rappresenta una funzione
 * 
 * @param {String} token Stringa da controllare
 * @returns true se il token è una funzione valida, false altrimenti
 */
const isFunction = function (token) {
  for (let func of functions) {
    if (token == func.funcName)
      return true;
  }
  return false;
}

/**
 * Controlla se la funzione 'funcName' è o meno applicabile alle matrici
 * 
 * @param {String} funcName Il nome della funzione da controllare
 * @returns true se funcName è calcolabile su una matrice, false altrimenti
 */
const isMatrixFunction = function (funcName) {
  for (let f of functions) {
    if (f.funcName == funcName) {
      if (f.targets.includes('matrix'))
        return true;
      return false;
    }
  }
  return false;
}

/**
 * Controlla se la funzione 'funcName' è o meno applicabile agli scalari
 * 
 * @param {String} funcName Il nome della funzione da controllare
 * @returns true se funcName è calcolabile su uno scalare, false altrimenti
 */
const isScalarFunction = function (funcName) {
  for (let f of functions) {
    if (f.funcName == funcName) {
      if (f.targets.includes('scalar'))
        return true;
      return false;
    }
  }
  return false;
}

/**
 * Controlla se il token è un operatore valido
 * 
 * @param {String} token La stringa da controllare
 * @returns true se il token è un operatore, false altrimenti
 */
const isOperator = function (token) {
  switch (token) {
    case '+':
    case '-':
    case '*':
    case '/':
    case '^':
      return true;
    default:
      return false;
  }
}

/**
 * Controlla se il primo operatore ha una priorità maggiore del secondo
 * 
 * @param {String} op1 Il primo operatore
 * @param {String} op2 Il secondo operatore
 * @returns true se il primo operatore ha priorità maggiore del secondo, false altrimenti
 */
const isFirstHigherPriority = function (op1, op2) {
  switch (op2) {
    case '+':
    case '-':
      return op1 != '+' && op1 != '-';
    case '*':
    case '/':
      return op1 == '^';
    case '^':
      return false;
  }
}

/**
 * Controlla se i due operatori inseriti hanno la stessa priorità in un'espressione (l'ordine in cui vanno eseguiti)
 * 
 * @param {String} op1 Il primo operatore
 * @param {String} op2 Il secondo operatore
 * @returns true se i due operatori hanno la stessa priorità, false altrimenti
 */
const isSamePriority = function (op1, op2) {
  switch (op2) {
    case '+':
    case '-':
      return op1 == '+' || op1 == '-';
    case '*':
    case '/':
      return op1 == '*' || op1 == '/';
    case '^':
      return op1 == '^';
  }
}

/**
 * Controlla se l'operatore inserito è associativo a sinistra (va eseguito da sinistra a destra)
 * 
 * @param {String} op L'operatore da controllare
 * @returns true se l'operatore è associativo a sinistra, false altrimenti
 */
const isLeftAssociative = function (op) {
  return op != '^';
}

/**
 * Converte un'espressione in forma canonica (come siamo abituati a vederla) in una in notazione polacca inversa
 * 
 * @param {Array} arr L'array delle operazioni facenti parte dell'espressione canonica
 * @param {Object} self Riferimento all'oggetto Vue (serve per accedere allo store dove ci sono le matrici)
 * @returns Un array contenente l'espressione in notazione polacca inversa
 */
const toRPN = function (arr, self) {
  let outputStack = [];
  let operatorStack = [];
  for (let token of arr) {
    let lastOperatorStack = operatorStack[operatorStack.length - 1];
    if (token instanceof Fraction) {
      outputStack.push(token);
    } else if (token == "Ans") {
      let temp = self.$store.getters.Ans;
      outputStack.push(new Fraction(temp.num, temp.den));
    } else if (isMatrix(token, self)) {
      outputStack.push(getMatrixFromName(token, self));
    } else if (token == "MatAns") {
      let temp = self.$store.getters.MatAns;
      outputStack.push(new Matrix(temp.rows, temp.cols, convertProxyToMatrix(temp.matrix)));
    } else if (isFunction(token)) {
      operatorStack.push(token);
    } else if (isOperator(token)) {
      while (operatorStack.length && isOperator(lastOperatorStack) &&
        lastOperatorStack != '(' && (isFirstHigherPriority(lastOperatorStack, token) ||
          (isSamePriority(token, lastOperatorStack) && isLeftAssociative(token)))) {
        outputStack.push(operatorStack.pop());
        lastOperatorStack = operatorStack[operatorStack.length - 1];
      }
      operatorStack.push(token);
    } else if (token == '(') {
      operatorStack.push(token);
    } else if (token == ')') {
      while (operatorStack.length && operatorStack[operatorStack.length - 1] != '(') {
        if (operatorStack.length <= 0) throw "Errore di parentesi, idiota";
        outputStack.push(operatorStack.pop());
      }
      if (operatorStack[operatorStack.length - 1] != '(') throw "Errore di parentesi, idiota";
      operatorStack.pop();
      if (isFunction(operatorStack[operatorStack.length - 1])) {
        outputStack.push(operatorStack.pop());
      }
    }
  }

  for (let i = operatorStack.length - 1; i >= 0; i--) {
    let token = operatorStack[i];
    if (token == '(') throw "Errore di parentesi, idiota";
    outputStack.push(operatorStack.pop());
  }

  return outputStack;
}

/**
 * Calcola il risultato dell'rpn inserito per parametro
 * 
 * @param {Array} rpn Le operazioni da fare in notazione polacca inversa
 * @returns Una frazione o una matrice che rappresenta il risultato dell'espressione
 */
const resolveRPN = function (rpn) {
  let stack = [];
  for (let elem of rpn) {
    if (isOperator(elem)) {
      let n1 = stack.pop(),
        n2 = stack.pop();
      if (!(n1 instanceof Matrix) && !(n2 instanceof Matrix)) {
        stack.push(
          resolveBasicOperation(n1, n2, elem)
        );
      } else {
        // Almeno uno tra n1 e n2 è una matrice
        stack.push(
          resolveMatrixOperation(n1, n2, elem)
        );
      }
    } else if (isFunction(elem)) {
      let n = stack.pop();
      if (n instanceof Matrix && !isMatrixFunction(elem))
        throw `Impossibile calcolare la funzione '${elem}' su una matrice`;
      if (!(n instanceof Matrix) && !isScalarFunction(elem))
        throw `Impossibile calcolare la funzione '${elem}' su uno scalare`;
      // Sintassi un po' particolare, ma poppa la cima dello stack e ci esegue la funzione col nome indicato in elem
      stack.push(n[elem]());
    } else
      stack.push(elem);
  }
  return stack.pop();
}

/**
 * Risolve un'equazione canonica (come siamo abituati a vederla)
 * 
 * @param {Array} expression L'espressione con tutti gli elementi separati come array
 * @param {Object} self Riferimento all'oggetto Vue
 * @returns Una frazione o una matrice risultante dell'espressione
 */
const solve = function (expression, self) {
  return resolveRPN(toRPN(makeBasicExpressionReadable(expression, self), self));
}

/**
 * Rende leggibile all'rpn l'espressione
 * 
 * @param {Array} expression L'espressione con tutti gli elementi separati come array
 * @param {Object} self Riferimento all'oggetto Vue
 * @returns Una nuova espressione leggibile dall'rpn
 */
const makeBasicExpressionReadable = function (expression, self) {
  let newExpression = [];
  let lastOperation = null,
    prevOperation = null;
  for (let i = 0; i < expression.length; i++) {
    let token = expression[i];
    if (lastOperation && lastOperation == "-" && (prevOperation == null || prevOperation == "(")) {
      newExpression.pop();
      if (token instanceof Fraction) {
        newExpression.push(token.opposite());
      } else if (isMatrix(token, self)) {
        newExpression.push(new Fraction(-1));
        newExpression.push("*");
        newExpression.push(token);
      }
    } else {
      newExpression.push(token);
    }
    prevOperation = lastOperation;
    lastOperation = token;
  }
  console.log(newExpression)
  return newExpression;
}

/**
 * Risolve operazioni base tra frazioni
 * 
 * @param {Fraction} n1 Il primo operando
 * @param {Fraction} n2 Il secondo operando
 * @param {String} op L'operatore
 * @returns Il risultato dell'operazione
 */
const resolveBasicOperation = function (n1, n2, op) {
  switch (op) {
    case '*':
      return n1.mult(n2);
    case '/':
      return n2.div(n1);
    case '+':
      return n1.add(n2);
    case '-':
      return n2.sub(n1);
    case '^':
      return n2.pow(n1);
    default:
      throw "Operatore non valido";
  }
}

/**
 * Risolve operazioni base tra matrici. Almeno uno tra n1 e n2 deve essere un oggetto di tipo Matrix
 * 
 * @param {Fraction|Matrix} n1 Il primo operando
 * @param {Fraction|Matrix} n2 Il secondo operando
 * @param {String} op L'operatore
 * @returns Il risultato dell'operazione (la matrice risultante)
 */
const resolveMatrixOperation = function (n1, n2, op) {
  switch (op) {
    case '*':
      if (n1 instanceof Matrix)
        return n1.mult(n2);
      return n2.mult(n1);
    case '/':
      throw "Impossibile effettuare la divisione tra matrici";
    case '+':
    case '-':
      if (!(n1 instanceof Matrix) || !(n2 instanceof Matrix))
        throw "Impossibile sommare o sottrarre una matrice con uno scalare";
    case '+':
      return n1.add(n2);
    case '-':
      return n2.sub(n1);
    case '^':
      if (n2 instanceof Matrix)
        return n2.pow(n1);
      throw "Impossibile elevare uno scalare ad una matrice";
    default:
      throw "Operatore non valido";
  }
}

export {
  isFunction,
  isOperator,
  isMatrix,
  functions,
  solve,
  getMatrixFromName
};

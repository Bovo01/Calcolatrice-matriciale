const isFunction = function (token) {
  switch (token) {
    // Elenco delle funzioni
    case 'det':
    case 'rango':
    case 'tr':
    case 'inv':
      return true;
    default:
      return false;
  }
}

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

const isLeftAssociative = function (op) {
  return op != '^';
}

export function toRPN(arr) {
  let outputStack = [];
  let operatorStack = [];
  for (let token of arr) {
    let lastOperatorStack = operatorStack[operatorStack.length - 1];
    if (!isNaN(token)) {
      // Se è un numero
      outputStack.push(parseInt(token));
    } else if (isFunction(token)) {
      // Se è una funzione
      operatorStack.push(token);
    } else if (isOperator(token)) {
      while (operatorStack.length &&
        isOperator(lastOperatorStack) &&
        lastOperatorStack != '(' &&
        (isFirstHigherPriority(lastOperatorStack, token) ||
          (isSamePriority(token, lastOperatorStack) && isLeftAssociative(token)))) {
        outputStack.push(operatorStack.pop());
        lastOperatorStack = operatorStack[operatorStack.length - 1];
      }
      operatorStack.push(token);
    } else if (token == '(') {
      outputStack.push(token);
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

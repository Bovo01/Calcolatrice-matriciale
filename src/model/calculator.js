import Fraction from 'src/model/Fraction.js';

const functions = [{
  name: 'Determinante',
  funcName: 'det'
}, {
  name: 'Rango',
  funcName: 'rango'
}, {
  name: 'Trasposta',
  funcName: 'tr'
}, {
  name: 'Inversa',
  funcName: 'inv'
}];

const isFunction = function (token) {
  for (let func of functions) {
    if (token == func.funcName)
      return true;
  }
  return false;
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

const toRPN = function (arr) {
  let outputStack = [];
  let operatorStack = [];
  for (let token of arr) {
    let lastOperatorStack = operatorStack[operatorStack.length - 1];
    if (token instanceof Fraction) {
      // Se è una frazione
      outputStack.push(token);
    } else if (isFunction(token)) {
      // Se è una funzione
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

const resolveRPN = function (rpn) {
  let stack = [];
  for (let elem of rpn) {
    if (isOperator(elem)) {
      stack.push(
        resolveBasicOperation(stack.pop(), stack.pop(), elem)
      );
    } else if (isFunction(elem)) {} else
      stack.push(elem);
  }
  return stack.pop();
}

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

export {
  isFunction,
  isOperator,
  functions,
  toRPN,
  resolveRPN,
};

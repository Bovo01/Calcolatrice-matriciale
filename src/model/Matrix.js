import Fraction from "./Fraction";

export default class Matrix {
  constructor(rows, cols, matrix = null) {
    if (rows <= 0 || cols <= 0) throw "La dimensione della matrice deve essere positiva e non nulla";
    if (!rows || !cols) throw "Devi inserire la dimensione della matrice";
    if (matrix) {
      if (matrix.length !== rows) throw "La dimensione della matrice non corrisponde alle righe e alle colonne inserite";
      for (let i = 0; i < matrix.length; i++) {
        if (matrix[i].length !== cols) throw "La dimensione della matrice non corrisponde alle righe e alle colonne inserite";
        for (let j = 0; j < cols; j++) {
          if (!(matrix[i][j] instanceof Fraction)) {
            if (isNaN(matrix[i][j]) || matrix[i][j] !== parseInt(matrix[i][j])) throw "La matrice deve contenere oggetti di tipo Fraction o numeri interi";
            matrix[i][j] = new Fraction(parseInt(matrix[i][j]));
          }
        }
      }
      this.matrix = matrix;
    } else {
      this.matrix = [];
      for (let i = 0; i < rows; i++) {
        this.matrix[i] = [];
        for (let j = 0; j < cols; j++)
          this.matrix[i][j] = new Fraction(0);
      }
    }
    this.rows = rows;
    this.cols = cols;
  }

  /**
   * Funzione logicamente privata che permette di creare una nuova matrice in base alle righe inserite (le colonne non sono necessarie)
   * 
   * @param {Number} [rows=this.rows] Il numero di righe che deve avere la nuova matrice
   * @returns La matrice (array di array, non oggetto di classe Matrix) inizializzata con gli array vuoti all'interno
   */
  _createMatrix(rows = this.rows) {
    let temp = [];
    for (let i = 0; i < rows; i++)
      temp[i] = [];
    return temp;
  }

  /**
   * Funzione logicamente privata che permette di copiare la matrice dell'oggetto corrente
   * 
   * @returns Una copia della variabile 'this.matrix'
   */
  _copyMatrix() {
    let newMat = this._createMatrix();
    for (let i = 0; i < this.rows; i++) {
      newMat[i] = [...this.matrix[i]];
    }
    return newMat;
  }

  /**
   * Funzione logicamente privata che permette di scambiare la posizione di due righe nella matrice interna alla classe Matrix
   * 
   * @param {Number} r1 Indice della prima riga
   * @param {Number} r2 Indice della seconda riga
   */
  _invertiRighe(r1, r2) {
    let temp = this.matrix[r1];
    this.matrix[r1] = this.matrix[r2];
    this.matrix[r2] = temp;
  }

  /**
   * Funzione logicamente privata che permette di moltiplicare la matrice corrente per un'altra matrice
   * 
   * @param {Matrix} mat La matrice da moltiplicare a quella corrente
   * @returns Un nuovo oggetto di classe Matrix che contiene il prodotto tra le due matrici
   */
  _multPerMatrice(mat) {
    if (this.cols !== mat.rows) throw "Per il prodotto matriciale le colonne della prima matrice devono essere uguali alle righe della seconda";
    let matProdotto = this._createMatrix();
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < mat.cols; j++) {
        let sum = new Fraction(0);
        for (let k = 0; k < this.cols; k++) {
          sum = sum.add(this.matrix[i][k].mult(mat.matrix[k][j]));
        }
        matProdotto[i][j] = sum;
      }
    }
    return new Matrix(this.rows, mat.cols, matProdotto);
  }

  /**
   * Funzione logicamente privata che permette di moltiplicare la matrice corrente per uno scalare
   * 
   * @param {Number} s Lo scalare da moltiplicare alla matrice corrente
   * @returns Un nuovo oggetto di classe Matrix che contiene il prodotto tra lo scalare e la matrice corrente
   */
  _multPerScalare(s) {
    if (!(s instanceof Fraction))
      if (isNaN(s) || s !== parseInt(s)) throw "Lo scalare deve essere un oggetto di tipo Fraction o un numero intero";
    let tempM = this._createMatrix();
    for (let i = 0; i < this.rows; i++)
      for (let j = 0; j < this.cols; j++)
        tempM[i][j] = this.matrix[i][j].mult(s);
    return new Matrix(this.rows, this.cols, tempM);
  }

  /**
   * Funzione che elimina la riga e la colonna cui appartiene il pivot passato dalle coordinate 'i' e 'j'.
   * La matrice 'mat' non viene modificata
   * 
   * @param {Array} mat La matrice in cui eliminare una riga e una colonna
   * @param {Number} i Coordinata di riga del pivot
   * @param {Number} j Coordinata di colonna del pivot
   * @returns Una nuova matrice (array di array) con una riga e una colonna in meno di quella iniziale
   */
  _eliminaRigaColonna(mat, i, j) {
    let newMat = this._createMatrix(this.rows - 1);
    let i1 = 0
    for (let k = 0; k < this.rows; k++) {
      if (k === i) continue;
      let j1 = 0;
      for (let c = 0; c < this.cols; c++) {
        if (c === j) continue;
        newMat[i1][j1] = mat[k][c];
        j1++;
      }
      i1++;
    }
    return newMat;
  }

  /**
   * Funzione che permette di sommare la matrice corrente a quella passata per parametro
   * 
   * @param {Matrix} m La matrice da sommare a quella corrente
   * @returns Un nuovo oggetto di classe Matrix contenente la somma tra le due matrici
   */
  add(m) {
    if (this.rows !== m.rows || this.cols !== m.cols) throw "Le dimensioni delle matrici devono essere uguali";
    let tempM = this.matrix;
    for (let i = 0; i < this.rows; i++)
      for (let j = 0; j < this.cols; j++)
        tempM[i][j] = tempM[i][j].add(m.matrix[i][j]);
    return new Matrix(this.rows, this.cols, tempM);
  }

  /**
   * Funzione che permette di sottrarre la matrice corrente a quella passata per parametro
   * 
   * @param {Matrix} m La matrice da sottrarre a quella corrente
   * @returns Un nuovo oggetto di classe Matrix contenente la differenza tra le due matrici
   */
  sub(m) {
    return this.add(m._multPerScalare(-1));
  }
  
  /**
   * Funzione che permette di moltiplicare la matrice corrente alla matrice o allo scalare passati per parametro
   * 
   * @param {Matrix|Number|Fraction} x La matrice (o lo scalare) da moltiplicare a quella corrente
   * @returns Un nuovo oggetto di classe Matrix contenente il prodotto tra le due matrici (o tra matrice e scalare)
   */
   mult(x) {
    if (x instanceof Matrix)
      return this._multPerMatrice(x);
    else
      return this._multPerScalare(x);
  }

  /**
   * Funzione che calcola la trasposta della matrice corrente
   * 
   * @returns Un nuovo oggetto di classe Matrix contenente la trasposta della matrice corrente
   */
  transposition() {
    let tempMatrix = this._createMatrix(this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        tempMatrix[j][i] = this.matrix[i][j];
      }
    }
    return new Matrix(this.cols, this.rows, tempMatrix);
  }

  /**
   * Funzione che calcola la forma a scala basandosi sulla matrice corrente
   * 
   * @returns Un nuovo oggetto di classe Matrix contenente la matrice a scala della matrice corrente
   */
  riduzioneScala() {
    let newMat = new Matrix(this.rows, this.cols, this._copyMatrix());
    // Indica la riga del pivot
    let c = 0;
    for (let j = 0; j < this.cols && c < this.rows; j++) {
      // Se c'è uno 0 come pivot sposto la riga con una successiva che non abbia 0
      if (newMat.matrix[c][j].equals(0)) {
        let done = false;
        for (let i = c; i < this.rows; i++) {
          if (!newMat.matrix[i][j].equals(0)) {
            newMat._invertiRighe(i, j);
            done = true;
            break;
          }
        }
        if (!done) {
          continue;
        }
      }
      // Faccio i calcoli su una combinazione lineare
      for (let i = c + 1; i < this.rows; i++) {
        if (!newMat.matrix[i][j].equals(0)) {
          let divider = newMat.matrix[i][j].div(newMat.matrix[c][j]).opposite();
          for (let j2 = j; j2 < this.rows; j2++) {
            newMat.matrix[i][j2] = newMat.matrix[c][j2].mult(divider).add(newMat.matrix[i][j2]);
          }
        }
      }

      c++;
    }

    return newMat;
  }

  /**
   * Funzione che calcola il rango della matrice corrente
   * 
   * @returns Un numero intero che rappresenta il rango della matrice corrente
   */
  rango() {
    let matrScala = this.riduzioneScala();
    let rango = 0;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (!matrScala.matrix[i][j].equals(0)) {
          rango++;
          break;
        }
      }
    }
    return rango;
  }

  /**
   * Funzione che calcola il determinante della matrice corrente utilizzando il metodo di Laplace implementato in modo ricorsivo
   * 
   * @returns Un oggetto di tipo Fraction contenente il determinante della matrice corrente
   */
  det() {
    if (this.rows !== this.cols) throw "Impossibile calcolare il determinante in una matrice non quadrata";
    // Caso base
    if (this.rows === 1) return this.matrix[0][0];
    // Ricorsione
    let sum = new Fraction(0);
    for (let i = 0; i < this.rows; i++) {
      sum = sum.add(
        this.matrix[i][0]
        .mult(Math.pow(-1, i))
        .mult(new Matrix(this.rows - 1, this.cols - 1, this._eliminaRigaColonna(this.matrix, i, 0)).det())
      );
    }
    return sum;
  }

  /**
   * Funzione che calcola la matrice inversa a quella corrente
   * 
   * @returns Un nuovo oggetto di classe Matrix contenente la matrice inversa a quella corrente
   */
  inversa() {
    if (this.rows !== this.cols) throw "Impossibile trovare la matrice inversa di una matrice non quadrata"
    let det = this.det();
    if (det.equals(0)) throw "Impossibile calcolare la matrice inversa quando il determinante è uguale a zero";
    let newMat = this._createMatrix();
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        newMat[i][j] =
          new Matrix(this.rows - 1, this.cols - 1, this._eliminaRigaColonna(this.matrix, i, j)).det()
          .mult(Math.pow(-1, i + j));
      }
    }
    return new Matrix(this.rows, this.cols, newMat).transposition().mult(det.reciprocal());
  }

  /**
   * Funzione che permette di comparare la matrice corrente con un'altra matrice
   * 
   * @param {Matrix} f La matrice a cui comparare quella corrente
   * @returns true se le due matrici sono uguali (tutti gli elementi sono uguali), false altrimenti
   */
  equals(m) {
    if (this.rows !== m.rows || this.cols !== m.cols) return false;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (!newMat.matrix[i][j].equals(m.matrix[i][j])) return false;
      }
    }
    return true;
  }

  toString() {
    let s = "";
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        s += `${this.matrix[i][j]}\t`;
      }
      s += '\n';
    }
    return s;
  }
}

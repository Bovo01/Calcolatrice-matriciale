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

  _createMatrix(rows) {
    let temp = [];
    for (let i = 0; i < rows; i++)
      temp[i] = [];
    return temp;
  }

  _copyMatrix() {
    let newMat = this._createMatrix();
    for (let i = 0; i < this.rows; i++) {
      newMat[i] = [...this.matrix[i]];
    }
    return newMat;
  }

  _invertiRighe(r1, r2) {
    let temp = this.matrix[r1];
    this.matrix[r1] = this.matrix[r2];
    this.matrix[r2] = temp;
  }

  _multPerMatrice(mat) {
    if (this.cols !== mat.rows) throw "Per il prodotto matriciale le colonne della prima matrice devono essere uguali alle righe della seconda";
    let matProdotto = this._createMatrix(this.rows, mat.cols);
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

  _multPerScalare(s) {
    if (!(s instanceof Fraction))
      if (isNaN(s) || s !== parseInt(s)) throw "Lo scalare deve essere un oggetto di tipo Fraction o un numero intero";
    let tempM = this._createMatrix(this.rows);
    for (let i = 0; i < this.rows; i++)
      for (let j = 0; j < this.cols; j++)
        tempM[i][j] = this.matrix[i][j].mult(s);
    return new Matrix(this.rows, this.cols, tempM);
  }

  add(m) {
    if (this.rows !== m.rows || this.cols !== m.cols) throw "Le dimensioni delle matrici devono essere uguali";
    let tempM = this.matrix;
    for (let i = 0; i < this.rows; i++)
      for (let j = 0; j < this.cols; j++)
        tempM[i][j] = tempM[i][j].add(m.matrix[i][j]);
    return new Matrix(this.rows, this.cols, tempM);
  }

  sub(m) {
    return this.add(m._multPerScalare(-1));
  }

  transposition() {
    let tempMatrix = this._createMatrix(this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        tempMatrix[j][i] = this.matrix[i][j];
      }
    }
    return new Matrix(this.cols, this.rows, tempMatrix);
  }

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

  mult(x) {
    if (x instanceof Matrix)
      return this._multPerMatrice(x);
    else
      return this._multPerScalare(x);
  }

  equals(m) {
    if (this.rows !== m.rows || this.cols !== m.cols) return false;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (!newMat.matrix[i][j].equals(m.matrix[i][j])) return false;
      }
    }
    return true;
  }
}

import Fraction from "./Fraction";

export default class Matrix {
  constructor(rows, cols, matrix = null) {
    if (rows <= 0 || cols <= 0) throw "La dimensione della matrice deve essere positiva e non nulla";
    if (!rows || !cols) throw "Devi inserire la dimensione della matrice";
    if (matrix) {
      if (matrix.length !== rows) throw "La dimensione della matrice non corrisponde alle righe e alle colonne inserite";
      for (let i = 0; i < matrix.length; i++) {
        if (matrix[i].length !== rows) throw "La dimensione della matrice non corrisponde alle righe e alle colonne inserite";
        if (!(matrix[i][j] instanceof Fraction)) throw "La matrice deve contenere oggetti di tipo Fraction";
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
  }

  add(m) {
    if (rows !== m.rows || cols !== m.cols) throw "Le dimensioni delle matrici devono essere uguali";
    let tempM = new Matrix(rows, cols, this.matrix);
    for (let i = 0; i < rows; i++)
      for (let j = 0; j < cols; j++)
        tempM.matrix[i][j] = tempM.matrix[i][j].add(m.matrix[i][j]);
    return tempM;
  }

  sub(m) {
    return this.add(m.multPerScalare(-1));
  }

  multPerScalare(s) {
    if (!(s instanceof Fraction))
      if (isNaN(s) || s !== parseInt(s)) throw "Lo scalare deve essere un oggetto di tipo Fraction o un numero intero";
    for (let i = 0; i < rows; i++)
      for (let j = 0; j < cols; j++)
        this.matrix[i][j] = this.matrix[i][j].mult(s);
    return tempM;
  }
}

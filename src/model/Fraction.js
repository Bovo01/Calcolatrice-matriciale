export default class Fraction {
  constructor(num, den = 1) {
    num = parseInt(num);
    den = parseInt(den);
    if (isNaN(num) || isNaN(den)) throw "Numeratore e denominatore devono essere numeri interi";
    if (den === 0) throw "Non è possibile dividere per 0";
    this.num = num;
    this.den = den;
    this._riduzioneMinimiTermini();
  }

  /**
   * Funzione logicamente privata che riduce ai minimi termini la frazione corrente
   */
  _riduzioneMinimiTermini() {
    if (this.num === 0) {
      this.den = 1;
      return;
    }
    if (this.den < 0) {
      this.num *= -1;
      this.den *= -1;
    }
    let mcd = this._MCD(this.num, this.den);
    this.num /= mcd;
    this.den /= mcd;
  }

  /**
   * Funzione logicamente privata che calcola il massimo comun divisore tra due numeri
   * 
   * @param {Number} a Il primo numero
   * @param {Number} b Il secondo numero
   * @returns L'MCD tra 'a' e 'b'
   */
  _MCD(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    let mcd = 1;
    let i = 2;
    while (i <= a) {
      if (a % i === 0 && b % i === 0) {
        mcd *= i;
        a /= i;
        b /= i;
      } else
        i++;
    }
    return mcd;
  }

  /**
   * Funzione logicamente privata che calcola il minimo comune multiplo tra due numeri
   * 
   * @param {Number} a Il primo numero
   * @param {Number} b Il secondo numero
   * @returns L'mcm tra 'a' e 'b'
   */
  _mcm(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    let mcd = this._MCD(a, b);
    return (a / mcd) * (b / mcd) * mcd;
  }

  /**
   * Funzione che permette di sommare la frazione corrente ad un'altra o ad un numero intero.
   * La frazione corrente non viene modificata
   * 
   * @param {Fraction|Number} f La frazione (o il numero intero) a cui sommare quella corrente
   * @returns La somma tra le due frazioni
   */
  add(f) {
    if (f instanceof Fraction) {
      let mcm = this._mcm(this.den, f.den);
      return new Fraction(this.num * (mcm / this.den) + f.num * (mcm / f.den), mcm);
    }
    if (isNaN(f) || f !== parseInt(f)) throw "L'elemento da sommare deve essere un numero intero o un oggetto di tipo Fraction";
    return new Fraction(this.num + parseInt(f) * this.den, this.den)
  }

  /**
   * Funzione che permette di sottrarre la frazione corrente ad un'altra o ad un numero intero.
   * La frazione corrente non viene modificata
   * 
   * @param {Fraction|Number} f La frazione (o il numero intero) a cui sottrarre quella corrente
   * @returns La differenza tra le due frazioni
   */
  sub(f) {
    if (f instanceof Fraction)
      return this.add(f.opposite());
    if (isNaN(f) || f !== parseInt(f)) throw "L'elemento da sottrarre deve essere un numero intero o un oggetto di tipo Fraction";
    return this.add(-parseInt(f));
  }

  /**
   * Funzione che permette di moltiplicare la frazione corrente ad un'altra o ad un numero intero.
   * La frazione corrente non viene modificata
   * 
   * @param {Fraction|Number} f La frazione (o il numero intero) a cui moltiplicare quella corrente
   * @returns Il prodotto tra le due frazioni
   */
  mult(f) {
    if (f instanceof Fraction)
      return new Fraction(this.num * f.num, this.den * f.den);
    if (isNaN(f) || f !== parseInt(f)) throw "L'elemento da moltiplicare deve essere un numero intero o un oggetto di tipo Fraction";
    return new Fraction(this.num * parseInt(f), this.den);
  }

  /**
   * Funzione che permette di dividere la frazione corrente ad un'altra o ad un numero intero.
   * La frazione corrente non viene modificata
   * 
   * @param {Fraction|Number} f La frazione (o il numero intero) a cui dividere quella corrente
   * @returns Il rapporto tra le due frazioni
   */
  div(f) {
    if (f instanceof Fraction)
      return this.mult(f.reciprocal());
    if (isNaN(f) || parseInt(f) !== f) throw "Il valore inserito deve essere un oggetto di tipo Fraction o un numero intero";
    return new Fraction(this.num * parseInt(f), this.den);
  }

  /**
   * Funzione che permette di calcolare il reciproco della frazione corrente.
   * La frazione corrente non viene modificata
   * 
   * @returns Il reciproco della frazione corrente
   */
  reciprocal() {
    return new Fraction(this.den, this.num);
  }

  /**
   * Funzione che permette di elevare ad una potenza intera la frazione corrente.
   * La frazione corrente non viene modificata
   * 
   * @param {Number} e L'esponente sotto forma di numero intero (anche negativo)
   * @returns La frazione corrente elevata all'esponente 'e'
   */
  pow(e) {
    if (e instanceof Fraction)
      if (e.den == 1)
        return new Fraction(Math.pow(this.num, e.num), Math.pow(this.den, e.num));
      else throw "L'esponente deve essere un numero intero";
    if (isNaN(e) || e !== parseInt(e)) throw "L'esponente deve essere un numero intero";
    if (e < 0)
      return new Fraction(Math.pow(this.den, -e), Math.pow(this.num, -e));
    return new Fraction(Math.pow(this.num, e), Math.pow(this.den, e));
  }

  /**
   * Funzione che permette di calcolare l'opposto della frazione corrente.
   * La frazione corrente non viene modificata
   * 
   * @returns L'opposto della frazione corrente
   */
  opposite() {
    return new Fraction(-this.num, this.den);
  }

  /**
   * Funzione che permette di comparare la frazione corrente con un'altra frazione o con un numero intero
   * 
   * @param {Fraction|Number} f La frazione (o il numero intero) a cui comparare quella corrente
   * @returns true se denominatore e denominatore coincidono, false altrimenti
   */
  equals(f) {
    if (f instanceof Fraction)
      return this.num === f.num && this.den === f.den;
    if (isNaN(f) || f !== parseInt(f)) throw "Il numero con cui si può paragonare la frazione deve essere un oggetto di tipo Fraction o un numero intero";
    if (this.den !== 1) return false;
    return this.num === f;
  }

  toString() {
    return this.num + (this.den == 1 ? "" : `/${this.den}`);
  }
}

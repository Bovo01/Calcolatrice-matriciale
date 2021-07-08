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

  _mcm(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    let mcd = this._MCD(a, b);
    return (a / mcd) * (b / mcd) * mcd;
  }

  add(f) {
    if (f instanceof Fraction) {
      let mcm = this._mcm(this.den, f.den);
      return new Fraction(this.num * (mcm / this.den) + f.num * (mcm / f.den), mcm);
    }
    if (isNaN(f) || f !== parseInt(f)) throw "L'elemento da sommare deve essere un numero intero o un oggetto di tipo Fraction";
    return new Fraction(this.num + parseInt(f) * this.den, this.den)
  }

  sub(f) {
    if (f instanceof Fraction)
      return this.add(f.opposite());
    if (isNaN(f) || f !== parseInt(f)) throw "L'elemento da sottrarre deve essere un numero intero o un oggetto di tipo Fraction";
    return this.add(-parseInt(f));
  }

  mult(f) {
    if (f instanceof Fraction)
      return new Fraction(this.num * f.num, this.den * f.den);
    if (isNaN(f) || f !== parseInt(f)) throw "L'elemento da moltiplicare deve essere un numero intero o un oggetto di tipo Fraction";
    return new Fraction(this.num * parseInt(f), this.den);
  }

  div(f) {
    if (f instanceof Fraction)
      return this.mult(f.reciprocal());
    if (isNaN(f) || parseInt(f) !== f) throw "Il valore inserito deve essere un oggetto di tipo Fraction o un numero intero";
    return new Fraction(this.num * parseInt(f), this.den);
  }

  reciprocal() {
    return new Fraction(this.den, this.num);
  }

  pow(e) {
    if (isNaN(e) || e !== parseInt(e)) throw "L'esponente deve essere un numero intero";
    if (e < 0)
      return new Fraction(Math.pow(this.den, -e), Math.pow(this.num, -e));
    return new Fraction(Math.pow(this.num, e), Math.pow(this.den, e));
  }

  opposite() {
    return new Fraction(-this.num, this.den);
  }

  equals(f) {
    if (f instanceof Fraction)
      return this.num === f.num && this.den === f.den;
    if (isNaN(f) || f !== parseInt(f)) throw "Il numero con cui si può paragonare la frazione deve essere un oggetto di tipo Fraction o un numero intero";
    if (this.den !== 1) return false;
    return this.num === f;
  }

  toString() {
    return `${this.num}/${this.den}`;
  }
}

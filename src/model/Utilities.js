import Fraction from './Fraction.js';

const errorDialog = function (self, message) {
  self.$q.notify({
    message,
    position: "top",
    type: "negative",
  });
}

const successDialog = function (self, message) {
  self.$q.notify({
    message,
    position: "top",
    type: "positive",
  });
}

const convertProxyToMatrix = function (proxy) {
  let newMat = [];
  for (let i = 0; i < proxy.length; i++) {
    newMat[i] = [];
    for (let j = 0; j < proxy[i].length; j++) {
      newMat[i][j] = new Fraction(
        proxy[i][j].num,
        proxy[i][j].den
      );
    }
  }
  return newMat;
}


export {
  errorDialog,
  successDialog,
  convertProxyToMatrix
};

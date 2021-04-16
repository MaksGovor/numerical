'use strict';

const { coffs, alpha, k } = require('./task.json');

const getCoffsOfderivative = (coffs, alpha, k, order) => {
  const copyCoffs = coffs.slice();
  const last = coffs.length - 1;
  copyCoffs[0] *= 1 + alpha;
  copyCoffs[last] *= k;
  
  for (let k = 0; k < order; k++) {
    for (let i = last; i >= 0; i--) {
      copyCoffs[last - i] *= i - k;
    }
  }
  
  return copyCoffs.map((x) => x === 0 ? 0: x);
}

const getPolynom = (coffs, alpha, k, orderDerivative) => {
  const last = coffs.length - 1;
  const coffsVariant = getCoffsOfderivative(coffs, alpha, k, orderDerivative);

  return (x) => {
    let res = 0;

    for (let i = 0; i <= last; i++) {
      const pow = last - i - orderDerivative;
      const powX = pow >= 0 ? pow : 0;
      res += coffsVariant[i] * Math.pow(x, powX);
    }

    return res;
  }
};

const polynom = getPolynom(coffs, alpha, k, 0);
const polynomD1 = getPolynom(coffs, alpha, k, 1);
const polynomD2 = getPolynom(coffs, alpha, k, 2);

module.exports = { 
  polynom,
  polynomD1,
  polynomD2
};
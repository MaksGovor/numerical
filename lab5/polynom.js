'use strict';

const { coffs} = require('./task.json');

const getCoffsOfderivative = (coffs, order) => {
  const copyCoffs = coffs.slice();
  const last = coffs.length - 1;
  
  for (let k = 0; k < order; k++) {
    for (let i = last; i >= 0; i--) {
      copyCoffs[last - i] *= i - k;
    }
  }
  
  return copyCoffs.map((x) => x === 0 ? 0: x);
}

const getPolynom = (coffs, orderDerivative) => {
  const last = coffs.length - 1;
  const coffsVariant = getCoffsOfderivative(coffs, orderDerivative);

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

const polynom = getPolynom(coffs, 0);
const d1 = getPolynom(coffs, 1);
const d2 = getPolynom(coffs, 2);

module.exports = Object.assign(polynom, { d1, d2 });

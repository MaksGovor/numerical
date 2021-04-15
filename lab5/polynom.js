'use strict';

const { coffs, alpha, k } = require('./task.json');

const getPolynom = (coffs, alpha, k) => {
  const copyCoffs = coffs.slice();
  const last = coffs.length - 1;
  copyCoffs[0] *= 1 + alpha;
  copyCoffs[last] *= k

  return (x) => {
    let res = 0;

    for (let i = 0; i <= last; i++) {
      res += copyCoffs[i] * Math.pow(x, last - i);
    }

    return res;
  }
};

const polynom = getPolynom(coffs, alpha, k);

module.exports = polynom;
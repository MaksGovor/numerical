'use strict';

const fns = {};

fns.mod = Math.abs;

fns.roundPlus = (accuracy, num) => {
  if (isNaN(num) || isNaN(accuracy)) return false;
  const p = Math.pow(10, accuracy);
  const mantisa = Math.round(num * p);
  return mantisa / p;
};

fns.significantRound = (accuracy, num) => {
  const strNum = num.toString().split('.')[1];
  if (!strNum) return num;
  let acc = 0;
  for (const s of strNum) {
    if (s !== '0') break;
    acc++;
  }
  return fns.roundPlus(accuracy + acc, num);
};

fns.roundMins = (vec, eps = 1e-10) => {
  const rounded = vec.slice();
  for (let i = 0; i < vec.length; i++) {
    if (fns.mod(vec[i]) < eps) rounded[i] = Math.round(vec[i]);
  }
  return rounded;
};

fns.partial = (fn, ...args) => (...rest) => fn(...args, ...rest);

module.exports = fns;

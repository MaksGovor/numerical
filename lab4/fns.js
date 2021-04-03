'use strict';

const fns = {};

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

fns.partial = (fn, ...args) => (...rest) => fn(...args, ...rest);

module.exports = fns;

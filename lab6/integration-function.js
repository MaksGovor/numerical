'use strict';

const func = require('./function');
const { 
  interval, quadraticCoeffs, 
  iterGauss, iterSimpson,
  iterTrapezium } = require('./task.json');

const ACCURATE_VALUE = 1.72230814;

const trapeziumMethod = (func, count, interval) => {
  const [ leftP, rightP ] = interval;
  const step = (rightP - leftP) / count; // h
  let sum = (func(leftP) + func(rightP)) / 2;

  for (let i = leftP + step; i < rightP; i += step) sum += func(i);
  return sum * step;
};

const simpsonMethod = (func, countA, interval) => {
  const count = Math.ceil(countA / 2);
  const [ leftP, rightP ] = interval;
  const step = (rightP - leftP) / (2 * count); // h
  const yValues = [];
  for (let i = leftP + step; i < rightP; i += step) yValues.push(func(i));
  
  let sum = 0;
  for (let i = 0; i < yValues.length / 2; i++) {
    sum += 2 * yValues[2 * i] + (yValues[2 * i + 1] || 0);
  }

  sum = sum * 2 + func(leftP) + func(rightP);

  return sum * step / 3;
}

const gaussMethod = (func, count, interval) => {
  const [ leftP, rightP ] = interval;
  const funcM = !(leftP === -1 && rightP === 1) ?
    (t) => (rightP - leftP) * func(((rightP + leftP) + (rightP - leftP) * t) / 2) / 2 : 
    func;
  
  if (!quadraticCoeffs[count]) return 'No coffs';
  const { x, A } = quadraticCoeffs[count];

  let sum = 0;
  for (let i = 0; i < x.length; i++) {
    if (x[i] !== 0) sum += funcM (-x[i]) * A[i];
    sum += funcM (x[i]) * A[i];
  }

  return sum;
}

const res1 = trapeziumMethod(func, iterTrapezium, interval);
const res2 = simpsonMethod(func, iterSimpson, interval);
const res3 = gaussMethod(func, iterGauss, interval);

const table = {
  'Trapezium method': {
    interval, 
    iterations: iterTrapezium,
    result: res1,
    eps: Math.abs(res1 - ACCURATE_VALUE)
  },
  'Simpson method': {
    interval, 
    iterations: iterSimpson, 
    result: res2,
    eps: Math.abs(res2 - ACCURATE_VALUE)
  },
  'Gauss method': {
    interval, 
    iterations: iterGauss,
    result: res3,
    eps: Math.abs(res3 - ACCURATE_VALUE)
  }
};

console.table(table);
'use strict';

const func = require('./function');

const trapeziumMethod = (func, count, interval) => {
  const [ leftP, rightP ] = interval;
  const step = (rightP - leftP) / count; // h
  let sum = (func(leftP) + func(rightP)) / 2;

  for (let i = leftP + step; i < rightP; i += step) sum += func(i);
  return sum * step;
};

const simpsonMethod = (func, count, interval) => {
  const [ leftP, rightP ] = interval;
  const step = (rightP - leftP) / (2 * count); // h
  const yValues = [];
  for (let i = leftP + step; i < rightP; i += step) yValues.push(func(i));
  
  let sum = 0;
  for (let i = 0; i < yValues.length / 2; i++) {
    sum += 2 * yValues[2 * i] + yValues[2 * i + 1];
  }

  sum = sum * 2 + func(leftP) + func(rightP);

  return sum * step / 3;
}


const res1 = trapeziumMethod(func, 100, [-0.7, 1.2]);
const res2 = simpsonMethod(func, 100, [-0.7, 1.2]);
console.log(res1);
console.log(res2);